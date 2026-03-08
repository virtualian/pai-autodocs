---
title: Directory Conventions
description: Canonical file paths, naming rules, and where new files belong in a PAI installation.
diataxis_type: reference
---

<!-- Source: docs/contributor/architecture.md (skill structure, memory layout) -->
<!-- Source: docs/contributor/system-user-model.md (SYSTEM/USER paths, naming) -->

This page documents the canonical directory structure of a PAI installation — where files live, how they're named, and where new files of each type should be created.

## Top-level structure

Every PAI installation lives under `~/.claude/`:

```
~/.claude/
├── CLAUDE.md                 # Entry point — loaded into every session
├── settings.json             # Claude Code + PAI configuration
├── hooks/                    # Event-driven hook scripts
├── skills/                   # All skill directories
│   └── PAI/                  # PAI core skill
│       ├── SYSTEM/           # Infrastructure defaults (read-only)
│       ├── USER/             # Personal customisations (yours)
│       ├── Algorithm/        # Algorithm version files
│       └── SKILL.md          # PAI skill definition
├── MEMORY/                   # Persistent memory storage
├── PAI/                      # PAI runtime configuration
├── marr/                     # MARR agent reliability framework
└── projects/                 # Per-project Claude Code memories
```

## Naming conventions

PAI uses three naming conventions, each signalling a different tier:

| Convention | Example | Meaning |
|------------|---------|---------|
| **TitleCase** | `Research/`, `Browser/`, `Security/` | System skill — shared, generic, no personal data |
| **_ALLCAPS** | `_BLOGGING/`, `_METRICS/`, `_JOURNALING/` | Personal skill — private, never shared, may contain personal data |
| **ALLCAPS** (no underscore) | `SYSTEM/`, `USER/`, `MEMORY/` | Infrastructure directory — structural, not a skill |

**Files within directories** follow additional conventions:

| Convention | Example | Used for |
|------------|---------|----------|
| **ALLCAPS.md** | `PAISYSTEMARCHITECTURE.md`, `MEMORYSYSTEM.md` | System documentation files |
| **ALLCAPS.md** (in USER) | `DAIDENTITY.md`, `AISTEERINGRULES.md` | User configuration files |
| **TitleCase.md** | `Algorithm.md`, `Standard.md` | Workflow and reference files within skills |
| **TitleCase.ts** | `Inference.ts`, `NotifyServer.ts` | CLI tools in `Tools/` directories |
| **kebab-case.md** | `first-skill.md`, `hook-types.md` | Documentation site pages (this site) |
| **Timestamped** | `2026-03-07-143022_SESSION_summary.md` | Memory files (`YYYY-MM-DD-HHMMSS_TYPE_description`) |

## Skill directory structure

Every skill follows the same canonical structure:

```
skills/SkillName/
├── SKILL.md              # Skill definition (REQUIRED)
├── Tools/                # CLI tools for deterministic operations
│   ├── ToolName.ts       # TypeScript CLI tool
│   └── ToolName.help.md  # Tool documentation
├── Workflows/            # Operational procedures (optional)
│   └── WorkflowName.md   # Step-by-step workflow
└── Context/              # Additional context files (optional)
    └── ContextFile.md    # Domain knowledge
```

**Required:** Only `SKILL.md` is required. Everything else is optional.

**Tools/** contains TypeScript CLI tools that handle deterministic work — file operations, data transformation, API calls. Every tool uses TitleCase naming and includes a `.help.md` companion file.

**Workflows/** contains step-by-step procedures the skill follows. Named in TitleCase.

## Memory directory structure

```
MEMORY/
├── WORK/                 # Active work tracking (PRDs, session state)
├── LEARNING/             # Learnings organised by domain
│   ├── SYSTEM/           # System-level learnings
│   └── ALGORITHM/        # Algorithm-specific learnings
├── SIGNALS/              # Ratings and feedback (ratings.jsonl)
├── RESEARCH/             # Research output captures
├── RELATIONSHIP/         # Relationship context and observations
├── STATE/                # Runtime state (work.json, events.jsonl, session-names.json)
└── PAISYSTEMUPDATES/     # System change documentation
```

Claude Code's native `projects/` directory is the source of truth for project context. The `MEMORY/` directory organises derived state — work tracking, learnings, signals, and runtime state.

**Memory file naming:** `YYYY-MM-DD-HHMMSS_TYPE_description.md` (e.g., `2026-03-07-143022_SESSION_algorithm-upgrade.md`)

## SYSTEM/USER structure

The PAI core skill uses a two-tier layout:

```
skills/PAI/
├── SYSTEM/                       # Infrastructure (read-only for users)
│   ├── PAISYSTEMARCHITECTURE.md  # Core architecture spec
│   ├── MEMORYSYSTEM.md           # Memory system spec
│   ├── SKILLSYSTEM.md            # Skill system spec
│   ├── THEHOOKSYSTEM.md          # Hook system spec
│   ├── PAIAGENTSYSTEM.md         # Agent system spec
│   ├── AISTEERINGRULES.md        # Default steering rules
│   ├── RESPONSEFORMAT.md         # Default response format
│   └── PAISECURITYSYSTEM/        # Security patterns
│       └── patterns.example.yaml
│
└── USER/                         # Personal customisations (yours)
    ├── DAIDENTITY.md             # AI identity and personality
    ├── AISTEERINGRULES.md        # Your steering rules
    ├── RESPONSEFORMAT.md         # Your response format
    ├── ARCHITECTURE.md           # Your architecture overrides
    ├── TELOS/                    # Your goals and context
    │   ├── MISSION.md
    │   ├── GOALS.md
    │   ├── PROJECTS.md
    │   └── ...                   # (10 files total)
    ├── PROJECTS/                 # Project-specific context
    └── PAISECURITYSYSTEM/        # Your security patterns
        └── patterns.yaml
```

## Where new files belong

| Creating... | Put it in | Naming |
|-------------|-----------|--------|
| A new system skill | `~/.claude/skills/SkillName/` | TitleCase directory |
| A new personal skill | `~/.claude/skills/_SKILLNAME/` | _ALLCAPS directory |
| A new CLI tool | `skills/SkillName/Tools/ToolName.ts` | TitleCase, with `.help.md` |
| A new workflow | `skills/SkillName/Workflows/WorkflowName.md` | TitleCase |
| A new hook | `~/.claude/hooks/HookName.sh` or `.ts` | TitleCase, register in settings.json |
| A steering rule | `skills/PAI/USER/AISTEERINGRULES.md` | Add to existing file |
| Memory/learnings | `MEMORY/LEARNING/` subdirectory | Timestamped format |
| Work tracking | `MEMORY/WORK/slug/PRD.md` | Slug: `YYYYMMDD-HHMMSS_kebab-description` |
| A new doc page | `docs/section/page-name.md` | kebab-case, add to sidebars.js |

## What to read next

- **[System Architecture](/contributor/architecture/)** — How all these components fit together
- **[The SYSTEM/USER Model](/contributor/system-user-model/)** — The two-tier design philosophy in detail
- **[Upgrade PAI](/contributor/upgrade-pai/)** — How upgrades interact with this directory structure
