---
title: Context Routing Reference
description: "How PAI resolves which context files to load, the routing table format, and load behaviour."
diataxis_type: reference
---

<!-- Source: PAI/CONTEXT_ROUTING.md, settings.json loadAtStartup -->

# Context Routing Reference

Context routing is how PAI decides which files to read when it needs information about a specific topic. Instead of loading everything at session start, PAI loads context on-demand from a routing table.

## The routing table

The routing table lives at `~/.claude/PAI/CONTEXT_ROUTING.md`. It maps topics to file paths. When PAI encounters a topic during a conversation, it reads the routing table and loads the relevant file.

### PAI System topics

| Topic | Path |
|-------|------|
| PAI system overview | `PAI/README.md` |
| System architecture | `PAI/PAISYSTEMARCHITECTURE.md` |
| Memory system | `PAI/MEMORYSYSTEM.md` |
| Skill system | `PAI/SKILLSYSTEM.md` |
| Hook system | `PAI/THEHOOKSYSTEM.md` |
| Agent system | `PAI/PAIAGENTSYSTEM.md` |
| Delegation system | `PAI/THEDELEGATIONSYSTEM.md` |
| Notification system | `PAI/THENOTIFICATIONSYSTEM.md` |
| CLI architecture | `PAI/CLIFIRSTARCHITECTURE.md` |
| Tools reference | `PAI/TOOLS.md` |
| Actions and pipelines | `PAI/ACTIONS.md`, `PAI/PIPELINES.md` |
| Flows | `PAI/FLOWS.md` |
| Behavioural rules | `PAI/AISTEERINGRULES.md` |
| PRD format spec | `PAI/PRDFORMAT.md` |

### Personal context topics

| Topic | Path |
|-------|------|
| All USER context index | `PAI/USER/README.md` |
| Projects | `PAI/USER/PROJECTS/README.md` |
| Business context | `PAI/USER/BUSINESS/README.md` |
| Telos (life goals) | `PAI/USER/TELOS/README.md` |

All paths are relative to `~/.claude/`.

## How routing works

### Step 1: Topic recognition

When you ask about something, PAI identifies the topic. For example, "How does the hook system work?" maps to the topic "Hook system".

### Step 2: Table lookup

PAI reads `CONTEXT_ROUTING.md` and finds the path for that topic: `PAI/THEHOOKSYSTEM.md`.

### Step 3: File loading

PAI reads the file at that path. The file's content becomes available in the conversation context.

### Step 4: On-demand, not cached

Each load is a fresh read. If the file has been updated since the last time it was loaded (e.g., by a hook or manual edit), the latest version is used.

## Load-at-startup vs on-demand

Not all context waits for a topic match. Some files are loaded at every session start via `settings.json`:

```json
{
  "loadAtStartup": [
    "PAI/AISTEERINGRULES.md",
    "PAI/CONTEXT_ROUTING.md"
  ]
}
```

Files in `loadAtStartup` are always available. Files in the routing table are loaded only when their topic is relevant.

### When to use each

| Approach | When | Examples |
|----------|------|---------|
| Load at startup | Files needed in every session regardless of topic | Steering rules, the routing table itself, CLAUDE.md |
| On-demand routing | Files needed only when their topic comes up | Architecture docs, system specs, personal context |

Load-at-startup files consume context window space in every session. Keep this list small — only files that are universally needed.

## Adding a new route

To add a new topic to the routing table:

1. Create your context file (e.g., `~/.claude/PAI/MYNEWSYSTEM.md`)
2. Edit `~/.claude/PAI/CONTEXT_ROUTING.md`
3. Add a row to the appropriate table:

```markdown
| My new system | `PAI/MYNEWSYSTEM.md` |
```

The change takes effect in the next session. No restart or registration step is needed.

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| PAI doesn't load context for my topic | Topic not in routing table | Add the topic and path to CONTEXT_ROUTING.md |
| File loads but content seems outdated | File was edited after session start | Content was loaded earlier; the in-memory version is stale for this session |
| Context window feels crowded | Too many files in loadAtStartup | Move infrequently-needed files to on-demand routing |
| File path in routing table doesn't work | Incorrect relative path | Paths are relative to `~/.claude/` — verify the file exists |

## What to read next

- **[Configuration Reference](/power-user/configuration/)** — All settings files and their valid values, including loadAtStartup
- **[CLAUDE.md Anatomy](/power-user/claude-md-anatomy/)** — How CLAUDE.md integrates with context routing as the primary loaded file
- **[SYSTEM vs USER Boundary](/power-user/system-user-boundary/)** — Which context files are SYSTEM-managed and which are yours
