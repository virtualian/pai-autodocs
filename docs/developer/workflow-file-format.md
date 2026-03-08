---
title: Workflow File Format
description: "The workflow file format — structure, step definitions, routing tables, and conditions."
diataxis_type: reference
---

<!-- Source: PAI skill system, SKILL.md workflow routing, existing skill workflows -->

# Workflow File Format

Workflows are markdown files that define step-by-step procedures for a skill. When a skill activates, it selects a workflow from its routing table and follows the steps sequentially.

## File location

```
~/.claude/skills/SkillName/Workflows/WorkflowName.md
```

Workflow files live in the `Workflows/` directory within a skill. Each file is a separate workflow that handles a specific task type.

## Naming conventions

| Rule | Example |
|------|---------|
| TitleCase for system workflows | `QuickResearch.md`, `ExtensiveResearch.md` |
| Descriptive, task-oriented names | `CreateCustomAgent.md`, `CurrentWeather.md` |
| One workflow per file | Don't combine unrelated procedures |

## File structure

A workflow file has two parts: a header describing when to use it, and numbered steps defining the procedure.

```markdown
# WorkflowName

Brief description of what this workflow does and when it's selected.

## Steps

### 1. Step Name

Description of what to do in this step.
Include specific instructions, tool calls, or decision points.

### 2. Step Name

Next step in the sequence.

### 3. Step Name

Final step with output requirements.
```

## The routing table

Each `SKILL.md` contains a routing table that maps task types to workflow files. This is how PAI decides which workflow to run:

The table appears under a `## Workflows` heading in the SKILL.md:

| Workflow | When | File |
|----------|------|------|
| QuickResearch | Fast lookup, single query | `Workflows/QuickResearch.md` |
| ExtensiveResearch | Deep multi-source investigation | `Workflows/ExtensiveResearch.md` |
| DeepInvestigation | Maximum depth, no time pressure | `Workflows/DeepInvestigation.md` |

The `When` column describes the conditions under which this workflow is selected. PAI reads the user's request and matches it against these descriptions.

## Step format

Each step is a markdown heading (###) with a number and name, followed by instructions:

### Mandatory elements

| Element | Purpose | Example |
|---------|---------|---------|
| Step number | Ordering | `### 1. Validate Input` |
| Description | What to do | Prose explaining the action |

### Optional elements

| Element | Purpose | Example |
|---------|---------|---------|
| Tool calls | Deterministic operations | `bun run Tools/ToolName.ts --arg value` |
| Decision points | Conditional branching | "If the result contains errors, stop and report" |
| Output format | Expected output structure | Code block showing format |
| Agent spawning | Parallel work delegation | "Launch N agents, one per source" |
| Voice notification | Spoken feedback | Curl command to notification endpoint |

## Conditions and branching

Workflows support conditional logic through natural language instructions:

```markdown
### 3. Evaluate Results

If fewer than 3 sources were found:
- Broaden the search terms and repeat Step 2

If results are sufficient:
- Proceed to Step 4

If the user specified a time constraint:
- Skip Step 5 (deep analysis) and go directly to Step 6 (synthesis)
```

Conditions are not parsed programmatically — the AI interprets them in context. This makes workflows flexible but means conditions should be unambiguous.

## Complete example

Here's a minimal but complete workflow file:

```markdown
# QuickResearch

Fast single-query research for straightforward factual questions.
Selected when the user needs a quick answer, not deep investigation.

## Steps

### 1. Parse the Query

Extract the core question from the user's request.
Identify: topic, scope, and any constraints (time period, domain, etc.).

### 2. Search

Use WebSearch to find relevant sources.
Aim for 3-5 high-quality sources rather than exhaustive coverage.

### 3. Synthesize

Combine findings into a concise answer.
Include source attribution for key claims.

Output format:
- Direct answer (1-2 paragraphs)
- Key sources (bulleted list with URLs)
- Confidence level (high/medium/low based on source agreement)

### 4. Present

Deliver the answer to the user.
If confidence is low, note what additional research would help.
```

## Multi-agent workflows

Workflows can spawn parallel agents for concurrent work. The pattern:

```markdown
### 3. Parallel Investigation

Launch one research agent per source category:
- Agent 1: Academic sources (subagent_type: ClaudeResearcher)
- Agent 2: Industry sources (subagent_type: GeminiResearcher)
- Agent 3: Contrarian perspectives (subagent_type: GrokResearcher)

Each agent receives: the query, their assigned source category,
and the time budget (2 minutes).

### 4. Collect and Verify

Wait for all agents to return.
Launch a spotcheck agent to verify consistency across outputs.
Merge non-contradictory findings.
```

## Relationship to SKILL.md

The workflow is the "how" — the step-by-step procedure. The `SKILL.md` is the "what and when" — capability description and trigger keywords. The routing table in `SKILL.md` connects the two.

```
User prompt → SKILL.md triggers → Routing table → Workflow file → Steps
```

A skill can have any number of workflows. Simple skills may have one; complex skills like Research have several, each optimised for a different depth level.

## What to read next

- **[Skill File Format](/developer/skill-file-format/)** — The SKILL.md format that contains the routing table pointing to workflows
- **[Skill Lifecycle](/developer/skill-lifecycle/)** — How workflows are selected and executed during skill activation
- **[Your First Skill](/developer/first-skill/)** — Build a complete skill with workflows from scratch
