---
title: The SYSTEM/USER Model
description: How PAI's two-tier architecture enables customization without breaking updates.
diataxis_type: explanation
---

<!-- Source: ~/.claude/skills/PAI/SYSTEM/SYSTEM_USER_EXTENDABILITY.md -->
<!-- Source: ~/.claude/skills/PAI/SYSTEM/PAISYSTEMARCHITECTURE.md -->

PAI splits all configuration into two tiers: SYSTEM (infrastructure defaults) and USER (personal overrides). This separation is one of the most important architectural decisions in PAI. It means your customizations survive upgrades, your personal data stays private, and you can extend the system without modifying its core.

## The two tiers

**SYSTEM tier** provides working defaults that ship with every PAI installation. These define how skills work, how hooks fire, how memory is organized, and how the AI behaves out of the box. SYSTEM files are maintained by the PAI project and updated through releases.

**USER tier** contains your personal customizations. Your identity, your preferences, your goals, your security patterns. USER files exist only on your machine and are never overwritten by PAI updates.

```
~/.claude/skills/PAI/
├── SYSTEM/                    # Infrastructure defaults (read-only)
│   ├── PAISYSTEMARCHITECTURE.md
│   ├── MEMORYSYSTEM.md
│   ├── AISTEERINGRULES.md
│   ├── RESPONSEFORMAT.md
│   ├── PAISECURITYSYSTEM/
│   │   └── patterns.example.yaml
│   └── ...
│
└── USER/                      # Your customizations (yours to modify)
    ├── DAIDENTITY.md
    ├── AISTEERINGRULES.md
    ├── RESPONSEFORMAT.md
    ├── PAISECURITYSYSTEM/
    │   └── patterns.yaml
    ├── TELOS/
    └── ...
```

## The cascading lookup

When PAI needs a configuration value, it follows a three-step lookup:

```
1. Check USER tier first
   └── Found? Use it. Done.

2. Fall back to SYSTEM tier
   └── Found? Use it. Done.

3. Use hardcoded defaults
   └── Built-in behavior.
```

This pattern means PAI always works out of the box (SYSTEM provides defaults), but your preferences always win when you define them (USER overrides SYSTEM).

## Where this applies

The SYSTEM/USER model governs five areas of PAI:

| Component | SYSTEM location | USER location |
|-----------|----------------|---------------|
| Security patterns | `SYSTEM/PAISECURITYSYSTEM/patterns.example.yaml` | `USER/PAISECURITYSYSTEM/patterns.yaml` |
| AI steering rules | `SYSTEM/AISTEERINGRULES.md` | `USER/AISTEERINGRULES.md` |
| Response format | `SYSTEM/RESPONSEFORMAT.md` | `USER/RESPONSEFORMAT.md` |
| Identity | `settings.json` defaults | `settings.json` user values + `USER/DAIDENTITY.md` |
| Skills | `TitleCase` skill directories | `_ALLCAPS` skill directories |

## Design principles

Four principles govern how the two tiers interact.

### SYSTEM provides working defaults

A fresh PAI installation works immediately. You do not need to configure anything in the USER tier to get started. SYSTEM files define sensible defaults for security patterns, response formatting, steering rules, and behavior.

### USER overrides completely (replacement, not merge)

When a USER file exists, it **replaces** the corresponding SYSTEM file entirely. PAI does not attempt to merge the two. If you create `USER/PAISECURITYSYSTEM/patterns.yaml`, the SYSTEM patterns are ignored completely.

:::caution
Because USER files replace SYSTEM files rather than merging with them, copy any SYSTEM patterns you want to keep before creating your USER override. If you create a USER patterns file with only your custom rules, the SYSTEM defaults will no longer apply.
:::

The one exception is AI steering rules. Both `SYSTEM/AISTEERINGRULES.md` and `USER/AISTEERINGRULES.md` are loaded, with USER rules taking precedence when they conflict.

### USER stays private

USER files exist only on your machine. They are excluded from the public PAI repository, excluded from PAI pack exports, and never committed to version control. The underscore prefix on personal skills (`_ALLCAPS`) makes the separation visible at the filesystem level.

### SYSTEM updates do not break USER

When PAI releases an update, only SYSTEM files change. Your USER directory is never touched. This means you can upgrade PAI without losing your identity, preferences, security patterns, or any other customization.

## Implementation pattern

The cascading lookup is implemented with a simple file resolution pattern. Here is the canonical TypeScript approach:

```typescript
import { existsSync } from 'fs';
import { join } from 'path';

const PAI_DIR = process.env.PAI_DIR || `${process.env.HOME}/.claude`;
const SKILL_DIR = join(PAI_DIR, 'skills', 'PAI');

function getConfigPath(filename: string): string {
  const userPath = join(SKILL_DIR, 'USER', filename);
  const systemPath = join(SKILL_DIR, 'SYSTEM', filename);

  if (existsSync(userPath)) return userPath;
  if (existsSync(systemPath)) return systemPath;

  throw new Error(`Config not found: ${filename}`);
}
```

This pattern appears throughout PAI's tooling. The caller does not need to know which tier provided the file. It asks for a config, and the resolver returns the correct one.

For nested paths (like security patterns), the same principle applies:

```typescript
function getSecurityPatterns(): string {
  return getConfigPath('PAISECURITYSYSTEM/patterns.yaml');
}
// Returns USER/PAISECURITYSYSTEM/patterns.yaml if it exists,
// otherwise SYSTEM/PAISECURITYSYSTEM/patterns.example.yaml
```

## Skill naming conventions

The SYSTEM/USER model extends to skills through a naming convention:

| Convention | Tier | Shareable | Contains personal data |
|------------|------|-----------|----------------------|
| **TitleCase** (`Research`, `Browser`) | SYSTEM | Yes, via PAI Packs | No |
| **_ALLCAPS** (`_BLOGGING`, `_METRICS`) | USER | Never | Yes |

TitleCase skills are system skills. They ship with PAI or are distributed through PAI Packs. They contain no personal data and can be shared freely.

Underscore-prefixed ALL CAPS skills are personal skills. They exist only on your machine, may contain personal data, and are automatically excluded from exports and commits.

```bash
~/.claude/skills/
├── Research/           # SYSTEM — shared, generic
├── Browser/            # SYSTEM — shared, generic
├── _JOURNALING/        # USER — personal, private
└── _METRICS/           # USER — personal, private
```

## Common questions

### Can I extend a SYSTEM file instead of replacing it?

For most configuration, no. The USER file replaces the SYSTEM file entirely. The exception is AI steering rules, where both files load and USER rules take precedence on conflicts.

If you want to keep SYSTEM behavior while adding your own, copy the SYSTEM file to the USER location and add your changes to the copy.

### How do I know which tier is active?

Check whether a USER file exists for the component you are interested in:

```bash
# Is USER overriding security patterns?
ls ~/.claude/skills/PAI/USER/PAISECURITYSYSTEM/patterns.yaml

# Is USER overriding steering rules?
ls ~/.claude/skills/PAI/USER/AISTEERINGRULES.md

# Is USER overriding response format?
ls ~/.claude/skills/PAI/USER/RESPONSEFORMAT.md
```

If the USER file exists, that tier is active. If not, SYSTEM is active.

### Can I do a partial override?

Not directly. Because USER replaces SYSTEM (not merges), a partial override requires copying the SYSTEM file to USER and editing the copy. This is intentional. Merge behavior introduces ambiguity about what the final configuration looks like. Replacement is predictable: you see exactly what is configured because it is all in one file.

### What if a SYSTEM update adds something I need?

After upgrading PAI, check the changelog for changes to SYSTEM files that you have overridden. If a SYSTEM update adds a new security pattern and you have a USER patterns file, you will need to manually add the new pattern to your USER file.

This is the trade-off of replacement over merge: you get predictability at the cost of manual maintenance when SYSTEM evolves.

## What to read next

- [Customize Your AI](/power-user/customize-your-ai/) -- Hands-on tutorial for creating USER overrides
- [Configuration Reference](/power-user/configuration/) -- Complete list of all configuration files
- [Architecture](/contributor/architecture/) -- How the SYSTEM/USER model fits into the broader architecture
