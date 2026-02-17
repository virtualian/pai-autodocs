---
title: CLI-First Architecture
description: Why PAI builds deterministic CLI tools first and wraps them with AI prompting.
sidebar:
  order: 16
---

<!-- Source: ~/.claude/skills/PAI/SYSTEM/PAISYSTEMARCHITECTURE.md -->

PAI follows a strict principle: build deterministic CLI tools first, then wrap them with AI. This page explains why that order matters, what problems it solves, and how to apply it in your own skills and workflows.

## The core principle

AI is probabilistic. Given the same input, it might produce different output each time. Infrastructure should not be probabilistic. File operations, data transformations, API calls, and format conversions should produce the same result every time.

The CLI-first principle separates these concerns:

```
Deterministic work  -->  CLI tools (TypeScript, Bash)
Judgment work       -->  AI prompting (Claude, inference)
```

CLI tools handle the what. AI handles the when and why. A CLI tool that removes image backgrounds always produces a transparent PNG. The AI decides when to call it and which image to process.

## The problem with prompt-driven architecture

Before CLI-first, the common pattern was to describe everything in prompts and let the AI figure out execution:

```
Old way (prompt-driven):
  "Take the user's image, remove the background,
   add a white background, resize to 800x600,
   and save as output.png"
```

This approach has several failure modes:

| Failure | Consequence |
|---------|-------------|
| Non-deterministic output | Same prompt produces different results on different runs |
| No testability | Cannot write automated tests for prompt-based behavior |
| No composability | Cannot pipe output from one prompt into another reliably |
| Hidden failures | The AI might silently skip a step or substitute its own approach |
| No discoverability | New users cannot run `--help` to understand capabilities |
| Model dependency | Behavior changes when the underlying model changes |

The prompt-driven approach treats AI as a general-purpose executor. It works for simple tasks but degrades as complexity increases.

## The CLI-first approach

CLI-first inverts the architecture. Each operation becomes a standalone tool with a well-defined interface:

```
New way (CLI-first):
  bun RemoveBg.ts --input photo.jpg --output transparent.png
  bun AddBg.ts --input transparent.png --output final.png --color "#FFFFFF"
  bun Resize.ts --input final.png --output result.png --width 800 --height 600
```

Each tool is:

- **Testable** -- Automated tests verify exact output for given input
- **Composable** -- Pipe tools together in any order
- **Discoverable** -- `--help` shows all options
- **Deterministic** -- Same input, same output, every time
- **Model-independent** -- Works identically regardless of which AI calls it

The AI layer sits on top. It decides which tools to call, in what order, with what arguments. But the tools themselves are pure functions.

## The three-step process

When building a new capability for PAI, follow this sequence:

### Step 1: Define requirements

What does this capability need to do? What are the inputs and outputs? What are the edge cases?

```
Requirement: Extract key quotes from a YouTube video
  Input: YouTube URL
  Output: List of timestamped quotes
  Edge cases: No captions available, very long video, non-English content
```

### Step 2: Build the CLI tool

Write a TypeScript (or Bash) tool that handles the deterministic parts:

```bash
# The tool handles: fetching transcript, parsing timestamps, formatting output
bun ExtractQuotes.ts --url "https://youtube.com/watch?v=ID" --format json
```

The tool does not decide what counts as a "key quote." That requires judgment. The tool extracts the raw transcript with timestamps and structures it for downstream processing.

### Step 3: Add the AI prompting layer

Wrap the tool with AI that provides the judgment:

```typescript
// 1. CLI tool gets the transcript (deterministic)
const transcript = await getTranscript(url);

// 2. AI identifies key quotes (judgment)
const result = await inference({
  systemPrompt: 'Identify the 5 most important quotes from this transcript.',
  userPrompt: transcript,
  level: 'standard',
  expectJson: true,
});

// 3. CLI tool formats the output (deterministic)
formatQuotes(result.parsed.quotes, outputPath);
```

The AI does only the work that requires judgment. Everything else is handled by deterministic code.

## CLI design best practices

### Command structure

Every tool should follow a consistent structure:

```bash
bun ToolName.ts --required-arg value [--optional-arg value] [--flag]
```

Use `--help` to document all options:

```bash
bun ToolName.ts --help
# Output:
# Usage: ToolName.ts [options]
#
# Options:
#   --input <path>    Input file path (required)
#   --output <path>   Output file path (default: stdout)
#   --format <type>   Output format: json, text, markdown (default: text)
#   --verbose         Show detailed processing info
#   --help            Show this help message
```

### Output formats

Support structured output for machine consumption and human-readable output for direct use:

| Format | Flag | When to use |
|--------|------|-------------|
| JSON | `--format json` | When output feeds into another tool or AI inference |
| Text | `--format text` | Default human-readable output |
| Markdown | `--format markdown` | When output will be saved to documentation |

:::tip
Default to JSON output when in doubt. JSON is parseable by both humans and machines. A downstream tool can always format JSON into any other representation.
:::

### Idempotency

Running the same tool with the same arguments should produce the same result. Avoid tools that depend on external state that changes between runs (current time, random values, network state) unless that state is the explicit purpose of the tool.

```typescript
// Good: deterministic output
bun FormatDate.ts --date "2026-02-16" --format "MMMM D, YYYY"
// Always returns: "February 16, 2026"

// Bad: non-deterministic without explicit input
bun FormatDate.ts --format "MMMM D, YYYY"
// Returns different values depending on when you run it
```

### Validation, errors, and progressive disclosure

Validate inputs before processing. Fail fast with clear messages. Use consistent exit codes: `0` for success, `1` for input validation errors, `2` for processing errors.

Simple use cases should require minimal arguments. Advanced options are available but not required:

```bash
# Simple: just the required arguments
bun RemoveBg.ts --input photo.jpg

# Advanced: full control
bun RemoveBg.ts --input photo.jpg --output result.png --size preview --type product --format png
```

## Configuration flags pattern

For tools that support multiple behaviors, use flags to control execution rather than relying on AI to describe the behavior in natural language:

```bash
# Flags control deterministic behavior
bun ProcessImage.ts --input photo.jpg \
  --remove-bg \
  --add-bg "#FFFFFF" \
  --resize 800x600 \
  --optimize \
  --output result.png
```

This pattern lets a workflow map user intent to specific flags:

```typescript
// Workflow maps intent to flags
const flags = [];
if (userWantsTransparent) flags.push('--remove-bg');
if (userSpecifiedColor) flags.push('--add-bg', userColor);
if (userSpecifiedSize) flags.push('--resize', userSize);

await run('ProcessImage.ts', ['--input', inputPath, ...flags, '--output', outputPath]);
```

The tool's behavior is entirely controlled by its flags. No ambiguity, no interpretation, no variance between runs.

## When to apply CLI-first

CLI-first is not appropriate for every situation. Apply it when:

| Situation | Apply CLI-first? | Reason |
|-----------|:-----------------:|--------|
| Repeated operations (run daily, weekly) | Yes | Consistency matters over many runs |
| Deterministic results needed | Yes | Same input must produce same output |
| Operations that compose into pipelines | Yes | Tools need reliable interfaces |
| Work that other tools will consume | Yes | Downstream tools need predictable input |
| One-off exploratory tasks | No | Overhead exceeds benefit |
| Pure judgment tasks (writing, analysis) | No | No deterministic component to extract |
| Simple file operations | No | Claude Code's built-in tools are sufficient |

:::note
The decision criterion is: **does this operation have a deterministic component?** If yes, extract that component into a CLI tool. If the entire operation is judgment-based, AI prompting alone is appropriate.
:::

## The key takeaway

Build tools that work perfectly without AI. Then add AI to make them easier to use.

A CLI tool should be fully functional from the command line with no AI involvement. You should be able to test it, script it, and compose it with other tools. The AI layer on top provides convenience -- understanding natural language, selecting the right tool, choosing the right arguments -- but the tool does not depend on AI for correctness.

This is the development hierarchy that governs all of PAI:

```
Goal  -->  Code  -->  CLI  -->  Prompts  -->  Agents
```

Each layer builds on the previous. Code is the foundation. CLI makes code accessible. Prompts make CLI intelligent. Agents compose everything into autonomous workflows. Skip a layer and the system becomes fragile.

## What to read next

- [Tools Reference](/developer/tools-reference/) -- Inventory of all CLI tools in PAI
- [Architecture](/contributor/architecture/) -- How CLI-first fits into the broader system
- [Build Your First Skill](/developer/first-skill/) -- Create a skill that uses the CLI-first pattern
