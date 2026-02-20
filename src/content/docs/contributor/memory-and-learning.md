---
title: Memory and Learning
description: How PAI captures, categorizes, and uses learnings from every session.
sidebar:
  order: 18
---

<!-- Source: ~/.claude/skills/PAI/SYSTEM/MEMORYSYSTEM.md -->

PAI's memory system is what makes its intelligence compound over time. Without memory, every session starts from zero. With it, PAI accumulates knowledge about what works, what fails, and how to improve. This page explains the architecture, data flow, and tooling behind that system.

## Architecture overview

Three components work together to create PAI's memory:

**Claude Code projects/** is the source of truth. Every conversation is stored as a JSONL transcript by Claude Code itself. PAI does not duplicate or replace this storage. It builds on top of it.

**Hooks capture domain-specific events** as they happen during a session. Signal hooks detect ratings and sentiment. Work hooks track task progress. Capture hooks extract learnings from responses.

**Harvesting tools extract learnings** after sessions end. These tools scan transcripts, identify patterns, and write structured learnings to the appropriate directories.

## Directory structure

All memory lives under `~/.claude/MEMORY/`:

```
MEMORY/
├── WORK/                      # Primary work tracking
│   └── <work_id>/
│       ├── META.yaml          # Status, session ID, lineage
│       └── items/             # Individual work items
│
├── LEARNING/                  # Learnings organized by domain
│   ├── SYSTEM/                # Infrastructure and tooling issues
│   ├── ALGORITHM/             # Task execution and approach issues
│   ├── FAILURES/              # Full context dumps for ratings 1-3
│   │   └── YYYY-MM/
│   │       └── <failure_id>/
│   ├── SYNTHESIS/             # Aggregated pattern reports
│   └── SIGNALS/               # Ratings and feedback
│       └── ratings.jsonl
│
├── RESEARCH/                  # Agent output captures
├── SECURITY/                  # Security audit events
├── STATE/                     # Ephemeral runtime data
│   ├── current-work.json
│   ├── progress/
│   └── trending-cache.json
│
└── PAISYSTEMUPDATES/          # System change documentation
```

Files follow a naming convention: `YYYY-MM-DD-HHMMSS_[TYPE]_[description].md`.

## Data flow

Here is how data moves through the memory system from a user request to stored learnings:

```
User sends a request
       |
       v
Claude Code creates transcript (projects/*.jsonl)
       |
       v
Hooks fire during session
  ├── UserPromptSubmit  -->  Capture ratings, detect sentiment
  ├── Stop              -->  Capture response summary, update work
  └── SessionEnd        -->  Generate session summary
       |
       v
Domain-specific captures
  ├── Explicit rating   -->  SIGNALS/ratings.jsonl
  ├── Implicit sentiment-->  SIGNALS/ratings.jsonl
  ├── Work progress     -->  WORK/<work_id>/
  ├── Low rating (1-3)  -->  FAILURES/YYYY-MM/<failure_id>/
  └── Learnings         -->  SYSTEM/ or ALGORITHM/
       |
       v
Harvesting (post-session)
  ├── SessionHarvester  -->  Extract learnings from transcripts
  └── LearningPatternSynthesis --> Aggregate into SYNTHESIS/
```

## WORK lifecycle

The WORK directory tracks active and completed tasks. A work item progresses through three stages:

1. **Created** -- The `UserPromptSubmit` hook detects a new task and creates a work directory with `META.yaml` (status: active, session ID, timestamp).

2. **Updated** -- The `Stop` hook captures response summaries and adds items to the work directory as the task progresses. The `META.yaml` status remains active.

3. **Completed** -- The `SessionEnd` hook marks the work as complete, updates the `META.yaml` status, and generates a final summary.

Work directories persist across sessions. If you return to an ongoing project, PAI can pick up where it left off by reading the work directory metadata.

## LEARNING categorization

Learnings are automatically categorized into two domains:

### SYSTEM learnings

Issues with PAI's infrastructure, tooling, and environment. Examples:

- A CLI tool failed due to a missing dependency
- A hook timed out because the API was slow
- A file path was wrong in the skill configuration
- A Bun version incompatibility caused an error

These go to `LEARNING/SYSTEM/` and inform infrastructure improvements.

### ALGORITHM learnings

Issues with how a task was approached or executed. Examples:

- The research skill used the wrong source type for the query
- The response format did not match what the user needed
- The task was decomposed incorrectly
- Verification criteria were too vague

These go to `LEARNING/ALGORITHM/` and inform improvements to how PAI thinks about and executes tasks.

The categorization uses AI inference during the capture hook. The hook passes the learning context to the Inference tool, which classifies it as SYSTEM or ALGORITHM based on whether the root cause was infrastructure or approach.

## FAILURES: full context dumps

When PAI detects significant dissatisfaction (explicit ratings of 1-3 or strong negative sentiment), it triggers a full context dump. These are the most valuable data points in the entire memory system.

Each failure capture creates a directory under `LEARNING/FAILURES/YYYY-MM/` containing:

| File | Content |
|------|---------|
| `CONTEXT.md` | Human-readable analysis with metadata, root cause, and recommendations |
| `transcript.jsonl` | Full raw conversation up to the failure point |
| `sentiment.json` | Sentiment analysis output from the detection hook |
| `tool-calls.json` | Extracted tool calls with inputs and outputs |

:::tip
Failure captures are PAI's most powerful learning mechanism. A single well-explained rating of 2 can prevent the same mistake in hundreds of future sessions. When something goes wrong, a low rating with an explanation is the single most valuable feedback you can give.
:::

## Signals: ratings.jsonl

The `LEARNING/SIGNALS/ratings.jsonl` file is an append-only log of every rating PAI receives. Each line is a JSON object with the rating value, source (`explicit` or `implicit`), session ID, timestamp, optional comment, and context about which skill was active.

Ratings come from two sources:

- **Explicit** -- The user typed a number 1-10 in the conversation
- **Implicit** -- Sentiment analysis detected satisfaction or frustration from the user's natural language

## Harvesting tools

Three tools extract and process learnings from raw session data:

### SessionHarvester

Scans recent session transcripts and extracts actionable learnings. Run manually or on a schedule:

```bash
bun run ~/.claude/skills/PAI/Tools/SessionHarvester.ts --recent 10
```

The harvester identifies corrections, errors, and insights in transcripts and writes structured learning files to `LEARNING/SYSTEM/` or `LEARNING/ALGORITHM/`.

### LearningPatternSynthesis

Aggregates individual learnings into pattern reports. Identifies recurring themes across sessions:

```bash
bun run ~/.claude/skills/PAI/Tools/LearningPatternSynthesis.ts --week
```

Reports are written to `LEARNING/SYNTHESIS/` and highlight trends like which skills consistently underperform or which types of tasks produce the highest satisfaction.

### FailureCapture

Triggered automatically by sentiment and rating hooks when a rating of 1-3 is detected. Not typically run manually. It assembles the full context dump (transcript, sentiment, tool calls, analysis) and writes it to `LEARNING/FAILURES/`.

## STATE: ephemeral runtime data

The `STATE/` directory holds runtime data that PAI needs during a session but can be rebuilt if deleted:

| File | Purpose |
|------|---------|
| `current-work.json` | Currently active work item |
| `progress/` | Multi-session project progress tracking |
| `trending-cache.json` | Cached trending analysis for quick access |

:::note
STATE files are ephemeral. Deleting them is safe -- PAI rebuilds them automatically. WORK and LEARNING files are historical and cannot be regenerated.
:::

## Hook integration

Each memory directory is populated by specific hooks. This table maps the relationship:

| Hook | Event | Writes to |
|------|-------|-----------|
| AutoWorkCreation | UserPromptSubmit | `WORK/` |
| ResponseCapture | Stop | `WORK/`, `LEARNING/SYSTEM/`, `LEARNING/ALGORITHM/` |
| ExplicitRating | UserPromptSubmit | `LEARNING/SIGNALS/ratings.jsonl` |
| ImplicitSentiment | UserPromptSubmit | `LEARNING/SIGNALS/ratings.jsonl` |
| FailureCapture | UserPromptSubmit | `LEARNING/FAILURES/` |
| SessionSummary | SessionEnd | `WORK/` |
| AgentOutputCapture | SubagentStop | `RESEARCH/` |
| SecurityValidator | PreToolUse | `SECURITY/` |

## What to read next

- [Manage Memory](/developer/manage-memory/) -- Hands-on guide for inspecting and managing memory data
- [Your AI Gets Better](/user/self-improvement/) -- Non-technical explanation of PAI's learning loop
- [Write Hooks](/developer/write-hooks/) -- Create custom hooks that feed the memory system
