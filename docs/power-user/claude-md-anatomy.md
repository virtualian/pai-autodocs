---
title: CLAUDE.md Anatomy
description: "Field-by-field breakdown of CLAUDE.md structure, load order, and override semantics."
diataxis_type: reference
---

<!-- Source: CLAUDE.md structure, Claude Code documentation -->

# CLAUDE.md Anatomy

`CLAUDE.md` is the primary configuration file that Claude Code reads at session start. It defines the AI's identity, modes, rules, and context routing. This page breaks down its structure field by field.

## File location

```
~/.claude/CLAUDE.md
```

This is the global CLAUDE.md — it applies to all projects. Project-specific CLAUDE.md files can exist in individual project directories and are loaded alongside the global one.

## Load order

CLAUDE.md files are loaded in a specific order. Later files can override earlier ones:

1. **Global CLAUDE.md** (`~/.claude/CLAUDE.md`) — loaded first, applies everywhere
2. **Project CLAUDE.md** (`/path/to/project/CLAUDE.md`) — loaded second, project-specific overrides
3. **Nested CLAUDE.md** (`/path/to/project/subdir/CLAUDE.md`) — loaded third, directory-specific overrides

Each level can add, modify, or override instructions from the previous level. The most specific file wins on conflict.

## Structure

### Header and identity

```markdown
# PAI 4.0.1 -- Personal AI Infrastructure
```

The header establishes the system name and version. This is informational — it tells the AI what system it's operating within.

### Context imports

```markdown
@~/.claude/marr/MARR-USER-CLAUDE.md
```

The `@` syntax imports another file inline. The imported file's contents are treated as if they were part of CLAUDE.md. This keeps the main file focused while pulling in modular configuration.

### Modes

CLAUDE.md defines the AI's operating modes. Each mode specifies a different output format and workflow:

| Mode | When used | Output format |
|------|-----------|--------------|
| **NATIVE** | Simple, quick tasks | Compact structured format |
| **ALGORITHM** | Complex, multi-step work | Full Algorithm phases (OBSERVE through LEARN) |
| **MINIMAL** | Acknowledgments, ratings | Minimal structured format |

The mode section includes the decision logic for selecting a mode: greetings go to MINIMAL, quick tasks go to NATIVE, everything else goes to ALGORITHM.

### Algorithm reference

```markdown
## ALGORITHM MODE
**MANDATORY FIRST ACTION:** Use the Read tool to load
`PAI/Algorithm/v3.7.0.md`, then follow that file's instructions exactly.
```

ALGORITHM mode doesn't define the Algorithm inline. Instead, it points to the Algorithm file, which is loaded on-demand only when ALGORITHM mode is selected. This keeps CLAUDE.md's context footprint small for sessions that don't need the full Algorithm.

### Critical rules

Rules that apply across all modes, with zero exceptions:

- **Mandatory output format** — every response uses exactly one mode format
- **Response format before questions** — complete the format output before asking questions
- **Context routing** — load topic-specific context from `CONTEXT_ROUTING.md` rather than guessing

### Context routing section

```markdown
### Context Routing

When you need context about any of these topics, read
`~/.claude/PAI/CONTEXT_ROUTING.md` for the file path:
```

This section tells the AI to consult the routing table rather than relying on memory for PAI internals, user context, or project details.

## Override semantics

When the same instruction appears in multiple CLAUDE.md files, the most specific file wins:

| Global says | Project says | Result |
|------------|-------------|--------|
| Use ALGORITHM for complex tasks | Use NATIVE for all tasks | Project uses NATIVE |
| Voice notifications enabled | (silent) | Voice remains enabled (additive) |
| Follow PAI steering rules | Additional project-specific rules | Both apply (additive) |

**Additive vs override:** Instructions that don't conflict are additive — both apply. Instructions that directly contradict each other follow the specificity rule: project overrides global, subdirectory overrides project.

## Relationship to other configuration

CLAUDE.md is one of several configuration surfaces in PAI:

| File | Purpose | Relationship to CLAUDE.md |
|------|---------|--------------------------|
| `settings.json` | Technical settings (loadAtStartup, permissions) | Loaded independently by Claude Code |
| `AISTEERINGRULES.md` | Behavioural rules | Referenced from CLAUDE.md, loaded at startup |
| `CONTEXT_ROUTING.md` | Topic-to-file mapping | Referenced from CLAUDE.md, loaded at startup |
| Skill `SKILL.md` files | Skill definitions | Discovered independently by Claude Code |

CLAUDE.md is the orchestrator — it defines the AI's identity and operating modes, then delegates to specialised files for specific concerns.

## What to read next

- **[Context Routing Reference](/power-user/context-routing/)** — How the routing table referenced in CLAUDE.md works
- **[Steering Rules Reference](/power-user/steering-rules/)** — The behavioural rules loaded alongside CLAUDE.md
- **[Configuration Reference](/power-user/configuration/)** — All settings files and their relationships
