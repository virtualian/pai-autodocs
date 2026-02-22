---
title: Manage Memory
description: Work with PAI's memory system to track work, capture learnings, and review session history.
diataxis_type: how-to
---

<!-- Source: ~/.claude/skills/PAI/SYSTEM/MEMORYSYSTEM.md -->

This guide shows you how to inspect, manage, and use PAI's memory system. The memory system tracks your work, captures learnings from every session, and stores runtime state.

## Check what you are currently working on

PAI tracks active work automatically. To see the current work item:

```bash
cat ~/.claude/MEMORY/STATE/current-work.json
```

To list recent work directories:

```bash
ls -lt ~/.claude/MEMORY/WORK/ | head -10
```

Each work directory contains metadata, items, and verification artifacts from a session.

## Browse your work history

Work directories live in `~/.claude/MEMORY/WORK/`. Each directory represents a discrete unit of work:

```bash
# View a work directory's metadata
cat ~/.claude/MEMORY/WORK/<work_id>/META.yaml

# List items in a work directory
ls ~/.claude/MEMORY/WORK/<work_id>/items/
```

The `META.yaml` file contains status (active, completed), session ID, and lineage information. The `items/` directory holds individual work items with response summaries.

## View your ratings and satisfaction signals

PAI captures both explicit ratings (when you type a number 1-10) and implicit sentiment (detected from your messages):

```bash
# View recent ratings
tail -20 ~/.claude/MEMORY/LEARNING/SIGNALS/ratings.jsonl
```

Each line is a JSON object with the rating, source (explicit or implicit), timestamp, and optional comment.

## Review captured learnings

Learnings are categorized into two directories:

```bash
# SYSTEM learnings — tooling and infrastructure issues
ls ~/.claude/MEMORY/LEARNING/SYSTEM/

# ALGORITHM learnings — task execution issues
ls ~/.claude/MEMORY/LEARNING/ALGORITHM/
```

Each learning file is a Markdown document with context about what went wrong and what was learned. The categorization is automatic: issues with PAI infrastructure go to `SYSTEM/`, issues with how a task was approached go to `ALGORITHM/`.

## Inspect failure captures

When significant frustration is detected (ratings 1-3), PAI captures full context dumps:

```bash
# List recent failure captures
ls -lt ~/.claude/MEMORY/LEARNING/FAILURES/$(date +%Y-%m)/ 2>/dev/null

# View a specific failure's analysis
cat ~/.claude/MEMORY/LEARNING/FAILURES/2026-02/*/CONTEXT.md | head -50
```

Each failure directory contains:

| File | Content |
|------|---------|
| `CONTEXT.md` | Human-readable analysis with metadata |
| `transcript.jsonl` | Full raw conversation up to the failure |
| `sentiment.json` | Sentiment analysis output |
| `tool-calls.json` | Extracted tool calls with inputs and outputs |

## View session transcripts

Claude Code stores complete session transcripts natively:

```bash
# List recent sessions (newest first)
ls -lt ~/.claude/projects/-Users-$(whoami)--claude/*.jsonl | head -5
```

These are the raw source of truth — every message, tool call, and response. Claude Code manages 30-day retention automatically.

## Run the session harvester

The session harvester extracts learnings from recent transcripts:

```bash
# Harvest from the 10 most recent sessions
bun run ~/.claude/skills/PAI/Tools/SessionHarvester.ts --recent 10
```

This scans transcripts for corrections, errors, and insights, then writes them to the appropriate `LEARNING/` subdirectory.

## Generate pattern synthesis

Aggregate ratings and learnings into pattern reports:

```bash
# Generate weekly pattern analysis
bun run ~/.claude/skills/PAI/Tools/LearningPatternSynthesis.ts --week
```

Reports are written to `~/.claude/MEMORY/LEARNING/SYNTHESIS/` and highlight recurring issues, rating trends, and areas for improvement.

## Check multi-session project progress

For work that spans multiple sessions, PAI tracks progress:

```bash
ls ~/.claude/MEMORY/STATE/progress/
```

## Clean up old memory data

PAI manages most cleanup automatically, but you can manually remove old data:

```bash
# Remove work directories older than 30 days
find ~/.claude/MEMORY/WORK/ -maxdepth 1 -mtime +30 -type d

# Clear runtime state (rebuilds automatically)
rm ~/.claude/MEMORY/STATE/current-work.json
rm ~/.claude/MEMORY/STATE/trending-cache.json
```

:::caution
The `STATE/` directory contains ephemeral runtime data that rebuilds automatically. Deleting files there is safe. The `WORK/` and `LEARNING/` directories contain historical data that cannot be regenerated.
:::

## Memory directory quick reference

| Directory | Purpose | Populated By |
|-----------|---------|--------------|
| `WORK/` | Work tracking | AutoWorkCreation, ResponseCapture, SessionSummary hooks |
| `LEARNING/SYSTEM/` | Infrastructure learnings | ResponseCapture, rating hooks |
| `LEARNING/ALGORITHM/` | Task execution learnings | ResponseCapture, rating hooks |
| `LEARNING/FAILURES/` | Full context for low ratings | Sentiment/rating hooks via FailureCapture |
| `LEARNING/SYNTHESIS/` | Aggregated patterns | LearningPatternSynthesis tool |
| `LEARNING/SIGNALS/` | User satisfaction ratings | ExplicitRating, ImplicitSentiment hooks |
| `RESEARCH/` | Agent output captures | AgentOutputCapture hook |
| `SECURITY/` | Security audit events | SecurityValidator hook |
| `STATE/` | Runtime state | Various hooks and tools |

## What to read next

- **[Write Hooks](/developer/write-hooks/)** — Create hooks that capture and process memory events
- **[Memory and Learning](/contributor/memory-and-learning/)** — Deep dive into how the memory system works internally
- **[Set Up Agents](/developer/set-up-agents/)** — Configure agents that use memory for context
