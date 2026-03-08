---
title: Customise PAI Behaviour
description: "Add steering rules, adjust response format, and override defaults without breaking upgrades."
diataxis_type: how-to
---

<!-- Source: PAI SYSTEM/USER layer architecture, override semantics -->

# Customise PAI Behaviour

This page covers specific customisation tasks: adding rules, changing response format, and creating overrides that survive PAI upgrades. For a step-by-step introduction to customisation, see the tutorial [Customise Your AI](/power-user/customize-your-ai/).

## Add a Steering Rule

Create or edit `~/.claude/skills/PAI/USER/AISTEERINGRULES.md` and add your rule using the Statement / Bad / Correct format:

```markdown
## Always ask before installing dependencies

Statement
: Do not run npm install, pip install, or any package manager without asking first.

Bad
: The task requires a new library. You run `npm install lodash` without mentioning it.

Correct
: The task requires a new library. You say "This needs lodash — should I install it?" and wait for confirmation.
```

Steering rules are **additive**. Your USER rules load alongside the SYSTEM rules — you do not need to copy the SYSTEM file. Both sets are active in every session.

See the [Steering Rules Reference](/power-user/steering-rules/) for the full syntax specification and conflict resolution details.

## Change Response Format

Create `~/.claude/skills/PAI/USER/RESPONSEFORMAT.md` with your desired format.

**Warning:** Response format is a **full replacement**. If you create a USER version, the SYSTEM version is ignored entirely. It is not merged.

Safe approach:

1. Read the current SYSTEM format: `~/.claude/skills/PAI/SYSTEM/RESPONSEFORMAT.md`
2. Copy it to `~/.claude/skills/PAI/USER/RESPONSEFORMAT.md`
3. Make your changes to the USER copy
4. Test in a new session

The SYSTEM response format defines three modes — ALGORITHM, NATIVE, and MINIMAL — each with a specific output structure. Your USER override can adjust how these modes present output (e.g., shorter summaries, different section headers, additional sections) without changing which mode is selected.

## Override Security Patterns

Create `~/.claude/skills/PAI/USER/PAISECURITYSYSTEM/patterns.yaml` with your security patterns.

**Warning:** Security patterns are also a **full replacement**. The SYSTEM patterns are ignored when a USER file exists.

Safe approach:

1. Copy `~/.claude/skills/PAI/SYSTEM/PAISECURITYSYSTEM/patterns.example.yaml` to `~/.claude/skills/PAI/USER/PAISECURITYSYSTEM/patterns.yaml`
2. Modify the USER copy
3. Test by triggering a pattern match

## Common Tasks

| Want to... | Edit this file | Merge behaviour |
|------------|---------------|-----------------|
| Add a rule | `USER/AISTEERINGRULES.md` | **Additive** — both SYSTEM and USER rules load |
| Change format | `USER/RESPONSEFORMAT.md` | **Replacement** — USER replaces SYSTEM entirely |
| Add security pattern | `USER/PAISECURITYSYSTEM/patterns.yaml` | **Replacement** — USER replaces SYSTEM entirely |
| Change personality | `USER/DAIDENTITY.md` | **USER only** — no SYSTEM version exists |

The distinction between additive and replacement is critical. For additive files, you only write what you want to add or override. For replacement files, you must include everything you want active — anything left out of the USER version is gone.

## Safe Override Checklist

Follow this process for any override to avoid breaking your setup:

1. **Read the SYSTEM version first.** Understand what you are replacing or extending.
2. **Copy it to the USER location.** For replacement files, this is mandatory. For additive files, you can start from scratch.
3. **Make your changes.** Edit the USER copy only.
4. **Test in a new session.** Overrides take effect on session start; mid-session changes are not picked up.
5. **Check the changelog on upgrades.** When PAI updates, SYSTEM files may change. Review the changelog for SYSTEM changes you may want to merge into your USER overrides.

## Common Mistakes

**Creating a response format with only your changes.** Since response format is a full replacement, a USER file containing only "use bullet points" will wipe out the entire SYSTEM format — including mode headers, section structure, and everything else. Always start from a copy of the SYSTEM file.

**Editing SYSTEM files directly.** SYSTEM files are overwritten on PAI upgrades. Any changes you make there will be lost. Always use the USER layer.

**Forgetting to restart.** Changes to steering rules, response format, and security patterns are loaded at session start. If you edit a file mid-session, start a new session to see the effect.

## What to read next

- **[Steering Rules Reference](/power-user/steering-rules/)** — Full syntax, precedence, categories, and conflict resolution for rules
- **[SYSTEM vs USER Boundary](/power-user/system-user-boundary/)** — How the two layers interact and what belongs where
- **[Configuration Reference](/power-user/configuration/)** — All settings files, their locations, and valid values
