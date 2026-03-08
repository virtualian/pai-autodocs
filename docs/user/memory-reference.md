---
title: Memory Reference
description: Technical reference for PAI's memory system — file structure, storage locations, and what gets captured.
diataxis_type: reference
---

PAI's memory system persists context across sessions. This reference covers where memory lives, what gets stored, and how it is organised.

## Directory structure

```
~/.claude/MEMORY/
├── WORK/               # Active work tracking (PRDs per task)
├── LEARNING/           # Learnings organised by domain
│   ├── SYSTEM/         # System-level learnings
│   └── ALGORITHM/      # Algorithm-specific learnings
├── SIGNALS/            # Ratings and feedback (ratings.jsonl)
├── RESEARCH/           # Agent output captures
├── RELATIONSHIP/       # Relationship context and observations
├── STATE/              # Runtime state (work.json, events.jsonl, session-names.json)
└── PAISYSTEMUPDATES/   # System change documentation
```

## Key directories

### WORK/

**Purpose:** Active work context.

**Contains:** Current tasks, in-progress projects, recent session summaries. This is what PAI loads to understand what you were working on recently.

---

### LEARNING/

**Purpose:** Accumulated learnings organised by domain.

**Contains:**
- `SYSTEM/` — Learnings about how PAI itself should behave
- `ALGORITHM/` — Learnings about Algorithm performance and improvement
- `SIGNALS/` — Ratings and feedback data (`ratings.jsonl`)

**How it grows:** The LEARN phase of the Algorithm writes here after every session. Low ratings trigger deeper analysis that produces more detailed learning entries.

---

### RESEARCH/

**Purpose:** Captured research output.

**Contains:** Results from research agents, investigation findings, and multi-source analyses. Preserved for reference across sessions.

---

### SECURITY/

**Purpose:** Security event logging.

**Contains:** Blocked commands, secret scan results, security assessment findings. Separated for audit and review.

---

### STATE/

**Purpose:** Runtime state tracking.

**Contains:** `current-work.json`, progress tracking, session state. Used by PAI to resume context at session start.

## What gets captured automatically

| Event | When | Where stored |
|-------|------|-------------|
| Session summary | Session end | WORK/ |
| Learnings | After VERIFY phase | LEARNING/ |
| Ratings (1-10) | When you rate a response | LEARNING/SIGNALS/ |
| Research results | After research tasks | RESEARCH/ |
| Security events | On blocked/flagged actions | SECURITY/ |
| Decisions | When significant choices are made | WORK/ or LEARNING/ |

## What you can control

| Action | How |
|--------|-----|
| Add to memory | "Remember this: ..." |
| Correct memory | "That's wrong — the correct information is ..." |
| Remove from memory | "Forget [specific thing]" or "Remove [topic] from memory" |
| Review memory | "What do you remember about [topic]?" |
| Export memory | Direct file access at `~/.claude/MEMORY/` |

## File conventions

| Convention | Detail |
|-----------|--------|
| **Format** | Markdown (`.md`) for documents, JSONL for event logs |
| **Location** | `~/.claude/MEMORY/` |
| **Privacy** | Private — never shared or committed to public repos |
| **Naming** | `YYYY-MM-DD-HHMMSS_[TYPE]_[description].md` |
| **Retention** | Persistent across sessions until manually removed |
| **Loading** | Recent WORK/ and STATE/ load every session. LEARNING/ loads on demand. |

## Relationship to Telos

Memory and [Telos](/user/telos/) serve different purposes:

| | Memory | Telos |
|---|--------|-------|
| **Contains** | What happened (events, decisions, learnings) | Who you are (goals, values, projects) |
| **Updates** | Automatically from sessions | Manually or by request |
| **Scope** | Temporal — recent activity matters most | Persistent — your identity and direction |
| **Location** | `~/.claude/MEMORY/` | `~/.claude/skills/PAI/USER/TELOS/` |

Both load at session start. Together they give PAI both your identity context (Telos) and your activity context (Memory).

## What to read next

- [Manage Your Memory](/user/manage-memory/) -- how to review and organise memory
- [Your AI Remembers](/user/memory/) -- conceptual overview
- [Telos Reference](/user/telos-reference/) -- the other half of PAI's context system
