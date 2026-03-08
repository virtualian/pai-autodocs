---
title: "SYSTEM vs USER: What's Yours"
description: Which files belong to you, which belong to PAI infrastructure, and what happens when they overlap.
diataxis_type: explanation
---

<!-- Source: docs/contributor/system-user-model.md (architectural detail) -->
<!-- Source: docs/power-user/how-customization-works.md (two-tier overview) -->

When you start customising PAI, the first question is always: *which files can I change?* PAI splits everything into two tiers — SYSTEM and USER — and the boundary between them determines what you own, what you should leave alone, and what happens when your changes overlap with infrastructure.

## The short version

**SYSTEM files** are PAI's infrastructure. They ship with every installation and get updated when PAI releases new versions. Think of them as the operating system.

**USER files** are yours. Your identity, your preferences, your goals, your custom rules. PAI never touches them during upgrades. Think of them as your home directory.

```
~/.claude/skills/PAI/
├── SYSTEM/          ← PAI's infrastructure. Don't edit these.
│   ├── PAISYSTEMARCHITECTURE.md
│   ├── MEMORYSYSTEM.md
│   ├── AISTEERINGRULES.md
│   └── ...
│
└── USER/            ← Yours. Edit freely.
    ├── DAIDENTITY.md
    ├── AISTEERINGRULES.md
    ├── TELOS/
    └── ...
```

## How to tell which tier a file belongs to

| Signal | Tier |
|--------|------|
| Lives in `skills/PAI/SYSTEM/` | SYSTEM — do not edit |
| Lives in `skills/PAI/USER/` | USER — yours to modify |
| Skill directory uses `TitleCase` (e.g., `Research/`) | SYSTEM skill — shared, generic |
| Skill directory uses `_ALLCAPS` (e.g., `_BLOGGING/`) | USER skill — personal, private |
| File is in `MEMORY/` | Yours — PAI writes here but you own the data |
| File is `settings.json` | Mixed — contains both PAI defaults and your overrides |

## What happens when they collide

Several files exist in both tiers. When they do, PAI follows a simple rule: **USER wins**.

| File | SYSTEM version | USER version | Resolution |
|------|---------------|-------------|------------|
| AI steering rules | `SYSTEM/AISTEERINGRULES.md` | `USER/AISTEERINGRULES.md` | **Both load.** SYSTEM first, then USER. Conflicts resolve in your favour. |
| Response format | `SYSTEM/RESPONSEFORMAT.md` | `USER/RESPONSEFORMAT.md` | **USER replaces SYSTEM entirely.** |
| Security patterns | `SYSTEM/PAISECURITYSYSTEM/patterns.example.yaml` | `USER/PAISECURITYSYSTEM/patterns.yaml` | **USER replaces SYSTEM entirely.** |

:::caution
For most files, USER **replaces** SYSTEM — it does not merge. If you create a USER security patterns file with only your custom rules, you lose all the SYSTEM defaults. Copy the SYSTEM file first, then add your changes.

The exception is steering rules, where both files load and yours take precedence on conflicts.
:::

## What you should and shouldn't touch

### Safe to edit anytime

- `USER/DAIDENTITY.md` — your AI's name, personality, communication style
- `USER/AISTEERINGRULES.md` — behavioural rules ("always ask before deploying", "never refactor code I didn't ask about")
- `USER/RESPONSEFORMAT.md` — how your AI formats its responses
- `USER/TELOS/` — your goals, projects, beliefs, challenges
- `USER/PROJECTS/` — project-specific context
- `MEMORY/` — your AI's accumulated knowledge (you can review, correct, or delete entries)
- Any `_ALLCAPS` skill directory — these are personal skills you created

### Leave alone

- Everything in `SYSTEM/` — these are updated by PAI releases
- `TitleCase` skill directories (e.g., `Research/`, `Browser/`) — these are system skills
- `settings.json` hook definitions that reference SYSTEM paths — modifying these can break PAI's event system

### Ask first

- `settings.json` — it contains both infrastructure config and personal preferences. Changing the wrong setting can break hooks or context loading. Use the [Configuration Reference](/power-user/configuration/) to understand each field before editing.

## What happens during upgrades

When PAI releases a new version:

1. **SYSTEM files update** — new features, bug fixes, improved defaults
2. **USER files are untouched** — your identity, rules, and customisations stay exactly as they are
3. **New SYSTEM features may need USER action** — if a SYSTEM update adds a new security pattern and you have a USER override, you may need to manually add the new pattern to your file

This is the fundamental trade-off: you get predictable, safe upgrades at the cost of occasionally checking the changelog for SYSTEM changes that affect files you've overridden.

## The practical rule

If you're unsure whether you can edit something, check its path:

- **`USER/` or `_ALLCAPS` or `MEMORY/`** → yours, edit freely
- **`SYSTEM/` or `TitleCase` skill** → infrastructure, leave alone
- **`settings.json`** → check the [Configuration Reference](/power-user/configuration/) first

## What to read next

- **[How Customisation Works](/power-user/how-customization-works/)** — The conceptual overview of PAI's personalisation model
- **[Configuration Reference](/power-user/configuration/)** — Every config file and setting explained
- **[The SYSTEM/USER Model](/contributor/system-user-model/)** — The architectural deep-dive for contributors
