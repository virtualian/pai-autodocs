---
title: Memory File Format
description: "JSONL event schemas, directory structure, field definitions, and how memory is read and written."
diataxis_type: reference
---

<!-- Source: PAI/MEMORYSYSTEM.md -->

# Memory File Format

PAI's memory system stores data in two primary formats: JSONL (JSON Lines) for event streams and structured markdown for human-readable records. This page documents the schemas, field definitions, and directory layout.

## Directory structure

```
~/.claude/MEMORY/
+-- WORK/                    # Work tracking (PRD.md per task)
|   +-- {timestamp}_{slug}/
|       +-- PRD.md
+-- LEARNING/                # Categorised learnings
|   +-- SYSTEM/              # Infrastructure learnings
|   |   +-- YYYY-MM/
|   +-- ALGORITHM/           # Task execution learnings
|   |   +-- YYYY-MM/
|   +-- FAILURES/            # Full context dumps (ratings 1-3)
|   |   +-- YYYY-MM/
|   +-- SYNTHESIS/           # Aggregated pattern analysis
|   |   +-- YYYY-MM/
|   +-- REFLECTIONS/         # Algorithm performance reflections
|   |   +-- algorithm-reflections.jsonl
|   +-- SIGNALS/             # User satisfaction ratings
|       +-- ratings.jsonl
+-- RESEARCH/                # Agent output archives
|   +-- YYYY-MM/
+-- SECURITY/                # Security audit events
|   +-- security-events.jsonl
+-- STATE/                   # Runtime state (ephemeral)
|   +-- events.jsonl
|   +-- algorithms/
|   +-- work.json
|   +-- current-work.json
+-- PAISYSTEMUPDATES/        # Architecture change history
```

## JSONL files

JSONL (JSON Lines) is PAI's format for append-only event streams. Each line is a valid JSON object. Files are never rewritten — new events are appended.

### ratings.jsonl

**Location:** `LEARNING/SIGNALS/ratings.jsonl`
**Written by:** `RatingCapture.hook.ts`
**Purpose:** Records every user satisfaction rating

Schema:

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | string (ISO-8601) | When the rating was captured |
| `session_id` | string | Claude Code session identifier |
| `rating` | number (1-10) | User's explicit rating |
| `context` | string | What the user said alongside the rating |
| `task_description` | string | Brief description of the task being rated |
| `category` | string | `"algorithm"` or `"system"` — what domain the rating applies to |

Example:

```json
{"timestamp":"2026-03-07T14:30:00-08:00","session_id":"abc123","rating":8,"context":"great job on the refactor","task_description":"Refactor auth module","category":"algorithm"}
```

### events.jsonl

**Location:** `STATE/events.jsonl`
**Written by:** All hooks via `event-emitter.ts`
**Purpose:** Unified event log for observability — append-only, typed events from every hook

Schema:

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | string (ISO-8601) | When the event occurred |
| `session_id` | string | Claude Code session identifier |
| `source` | string | Hook or tool that emitted the event |
| `type` | string | Dot-separated topic hierarchy |
| Additional fields | varies | Type-specific data |

The `type` field uses a hierarchical naming convention:

| Type pattern | Source | Example |
|-------------|--------|---------|
| `algorithm.phase` | Algorithm execution | Phase transitions |
| `work.created` | PRDSync hook | New work directory created |
| `rating.captured` | RatingCapture hook | User gave a rating |
| `voice.sent` | Notification system | Voice notification delivered |
| `security.blocked` | SecurityValidator | Dangerous operation blocked |

Example:

```json
{"timestamp":"2026-03-07T14:30:00-08:00","session_id":"abc123","source":"PRDSync.hook.ts","type":"work.created","slug":"20260307-143000_refactor-auth"}
```

### algorithm-reflections.jsonl

**Location:** `LEARNING/REFLECTIONS/algorithm-reflections.jsonl`
**Written by:** Algorithm LEARN phase
**Purpose:** Structured reflections on Algorithm execution quality

Schema:

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | string (ISO-8601) | When the reflection was written |
| `effort_level` | string | Algorithm effort tier used |
| `task_description` | string | From the TASK line |
| `criteria_count` | number | Total ISC criteria |
| `criteria_passed` | number | Criteria that passed verification |
| `criteria_failed` | number | Criteria that failed verification |
| `prd_id` | string | Slug from PRD frontmatter |
| `implied_sentiment` | number (1-10) | Estimated user satisfaction |
| `reflection_q1` | string | "What should I have done differently?" |
| `reflection_q2` | string | "What would a smarter algorithm have done?" |
| `reflection_q3` | string | "What capabilities should I have used?" |
| `within_budget` | boolean | Whether work completed within time budget |

### security-events.jsonl

**Location:** `SECURITY/security-events.jsonl`
**Written by:** `SecurityValidator.hook.ts`
**Purpose:** Audit trail for security decisions

Records blocks, confirmations, and alerts when the security validator intercepts potentially dangerous operations.

## Markdown files

### PRD.md

**Location:** `WORK/{timestamp}_{slug}/PRD.md`
**Written by:** The Algorithm (AI writes directly)
**Purpose:** Single source of truth for each work unit

Structure:

```yaml
---
task: Eight word task description
slug: 20260307-143000_kebab-task-description
effort: standard|extended|advanced|deep|comprehensive
phase: observe|think|plan|build|execute|verify|learn|complete
progress: 3/8
mode: interactive
started: 2026-03-07T14:30:00-08:00
updated: 2026-03-07T14:35:00-08:00
---

## Context
Problem space, what was requested, why it matters.

### Risks
Identified during THINK phase.

### Plan
Technical approach (Advanced+ effort).

## Criteria
- [x] ISC-1: Completed criterion
- [ ] ISC-2: Pending criterion

## Decisions
Non-obvious technical decisions logged during execution.

## Verification
Evidence that criteria were met.
```

### Learning files

**Location:** `LEARNING/SYSTEM/YYYY-MM/` and `LEARNING/ALGORITHM/YYYY-MM/`
**Written by:** Hooks and harvesting tools
**Format:** Markdown files with descriptive names

These are human-readable records of specific learnings. Each file describes what went wrong (or right), the root cause, and what to do differently.

### Failure context dumps

**Location:** `LEARNING/FAILURES/YYYY-MM/{timestamp}_{description}/`
**Written by:** `RatingCapture.hook.ts` via `FailureCapture.ts`
**Trigger:** Ratings of 1-3

Each failure directory contains:

| File | Format | Content |
|------|--------|---------|
| `CONTEXT.md` | Markdown | Human-readable analysis with metadata and root cause |
| `transcript.jsonl` | JSONL | Full raw conversation up to the failure point |
| `sentiment.json` | JSON | Sentiment analysis output |
| `tool-calls.json` | JSON | Extracted tool invocations with inputs and outputs |

## How memory is written

Memory is populated through three mechanisms:

| Mechanism | What it writes | When |
|-----------|---------------|------|
| **Hooks** | Event-driven captures (ratings, security events, work tracking) | Automatically on hook triggers |
| **The Algorithm** | PRD.md files (criteria, decisions, verification) | During Algorithm execution |
| **Harvesting tools** | Extracted learnings, pattern synthesis | Periodically or on-demand |

Key hooks and their targets:

| Hook | Trigger | Writes to |
|------|---------|-----------|
| `RatingCapture.hook.ts` | User submits a rating | `LEARNING/SIGNALS/ratings.jsonl`, `LEARNING/FAILURES/` |
| `PRDSync.hook.ts` | PRD.md is written or edited | `STATE/work.json` |
| `WorkCompletionLearning.hook.ts` | Session ends | `LEARNING/` |
| `SecurityValidator.hook.ts` | Tool validation | `SECURITY/security-events.jsonl` |

## How memory is read

| Consumer | Reads from | Purpose |
|----------|-----------|---------|
| `SessionHarvester.ts` | Claude Code `projects/` transcripts | Extract learnings from sessions |
| `LearningPatternSynthesis.ts` | `LEARNING/SIGNALS/ratings.jsonl` | Aggregate ratings into pattern reports |
| `ActivityParser.ts` | Claude Code `projects/` | Analyse recent file changes |
| Algorithm (AI) | `WORK/` PRDs, `LEARNING/` | Context recovery, learning from past |

## What to read next

- **[Manage Memory](/developer/manage-memory/)** — How-to guide for reading, writing, and structuring memory data
- **[The Extension Model](/developer/extension-model/)** — How the memory system fits into PAI's architecture
- **[Hook Types](/developer/hook-types/)** — Reference for hooks that write to memory
