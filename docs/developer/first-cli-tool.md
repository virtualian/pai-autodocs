---
title: Build Your First CLI Tool
description: Create a TypeScript CLI tool that a PAI skill can invoke for deterministic operations.
diataxis_type: tutorial
---

<!-- Source: PAI Tools/ directory conventions, Bun runtime, skill-tool integration -->

# Build Your First CLI Tool

Skills handle reasoning and orchestration. Tools handle deterministic operations — counting, transforming, fetching, validating. This tutorial walks you through building a CLI tool that a skill can call.

## What you will learn

- Where tools live and how they're structured
- How to write a TypeScript CLI tool with proper input/output conventions
- How to create the companion help file
- How to reference a tool from a workflow
- Tool design principles that keep skills reliable

## Prerequisites

- PAI installed and working
- [Bun](https://bun.sh) runtime installed
- Completed the [Your First Skill](/developer/first-skill/) tutorial (you'll add a tool to the QuickNote skill)

## Step 1: Understand the tool directory

Tools live inside the skill that uses them, in a `Tools/` subdirectory:

```
~/.claude/skills/QuickNote/
├── SKILL.md
├── Workflows/
│   └── CreateNote.md
└── Tools/
    ├── WordCount.ts
    └── WordCount.help.md
```

Conventions:

| Rule | Example |
|------|---------|
| TitleCase file names | `WordCount.ts`, not `word-count.ts` |
| Every tool has a `.help.md` companion | `WordCount.ts` + `WordCount.help.md` |
| Tools are executable | `chmod +x` after creation |
| Tools output JSON to stdout | `{"words": 42, "lines": 5}` |
| Errors go to stderr | `console.error(...)` |

## Step 2: Create the tool file

Create `~/.claude/skills/QuickNote/Tools/WordCount.ts`:

```typescript
#!/usr/bin/env bun

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: WordCount.ts <file-path>');
  process.exit(1);
}

const filePath = args[0];
try {
  const content = await Bun.file(filePath).text();
  const words = content.split(/\s+/).filter(w => w.length > 0).length;
  const lines = content.split('\n').length;
  console.log(JSON.stringify({ file: filePath, words, lines }));
} catch (error) {
  console.error(`Error reading file: ${error}`);
  process.exit(1);
}
```

The structure is intentionally simple: parse arguments, do one thing, output JSON. This pattern stays consistent across all PAI tools.

## Step 3: Make it executable

```bash
chmod +x ~/.claude/skills/QuickNote/Tools/WordCount.ts
```

Without this step, the skill won't be able to invoke the tool. This is the most common mistake when creating tools.

## Step 4: Create the companion help file

Create `~/.claude/skills/QuickNote/Tools/WordCount.help.md`:

```markdown
# WordCount

Count words and lines in a file.

## Usage

\`\`\`bash
bun Tools/WordCount.ts <file-path>
\`\`\`

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| file-path | Yes | Path to the file to count |

## Output

JSON object with `file`, `words`, and `lines` fields.

## Examples

\`\`\`bash
bun Tools/WordCount.ts ~/Notes/quick-notes.md
# {"file":"~/Notes/quick-notes.md","words":42,"lines":5}
\`\`\`
```

The help file serves two purposes: PAI reads it to understand how to call the tool, and developers read it as documentation. Keep it concise and example-driven.

## Step 5: Test from the command line

Run the tool directly to verify it works before involving any skill machinery:

```bash
# Create a test file
echo "This is a simple test file with some words." > /tmp/test-wordcount.md

# Run the tool
bun ~/.claude/skills/QuickNote/Tools/WordCount.ts /tmp/test-wordcount.md
```

Expected output:

```json
{"file":"/tmp/test-wordcount.md","words":9,"lines":1}
```

Also verify error handling:

```bash
# No arguments — should print usage and exit 1
bun ~/.claude/skills/QuickNote/Tools/WordCount.ts

# Missing file — should print error and exit 1
bun ~/.claude/skills/QuickNote/Tools/WordCount.ts /nonexistent/file.md
```

## Step 6: Reference from a workflow

In your skill's workflow file, add a step that calls the tool. For example, in `~/.claude/skills/QuickNote/Workflows/CreateNote.md`:

```markdown
## Step 3: Report statistics

Run the WordCount tool on the created note to report file statistics:

\`\`\`bash
bun ~/.claude/skills/QuickNote/Tools/WordCount.ts <note-file-path>
\`\`\`

Include the word and line counts in the summary returned to the user.
```

PAI reads the workflow, sees the tool invocation, and executes it during that step. The JSON output is parsed and incorporated into the skill's response.

## Step 7: Tool design principles

Follow these principles when building tools:

| Principle | Why |
|-----------|-----|
| JSON output to stdout | Structured data is parseable; free text is ambiguous |
| Exit code 0 for success, 1 for error | PAI checks exit codes to determine if a step succeeded |
| Always include usage output | When called with no args or `--help`, print usage to stderr |
| Deterministic operations only | Tools should produce the same output for the same input — no AI inference inside tools |
| One job per tool | `WordCount` counts words. It does not also format or summarize. |
| Errors to stderr | Keep stdout clean for structured output; error messages go to stderr |

## What you have learned

- Tools live in `Skills/SkillName/Tools/` and follow TitleCase naming
- Every tool needs a `.help.md` companion file
- Tools must be made executable with `chmod +x`
- Tools output JSON to stdout and errors to stderr
- Exit codes signal success (0) or failure (1)
- Workflows reference tools with `bun Tools/ToolName.ts <args>`
- Tools handle deterministic work; skills handle reasoning

## What to read next

- **[Your First Skill](/developer/first-skill/)** — Build the skill that this tool extends if you haven't already.
- **[Write Hooks](/developer/write-hooks/)** — Learn to write hooks that respond to session lifecycle events.
- **[Skill File Format](/developer/skill-file-format/)** — Reference for SKILL.md structure, including how workflows route to tools.
