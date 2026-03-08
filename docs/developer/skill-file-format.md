---
title: Skill File Format
description: The SKILL.md file format — frontmatter schema, required fields, trigger syntax, and structure.
diataxis_type: reference
---

<!-- Source: docs/contributor/architecture.md (skill structure) -->
<!-- Source: docs/developer/extension-model.md (skill overview) -->

Every PAI skill is defined by a `SKILL.md` file. This is the entry point Claude Code reads to understand what a skill does and when to activate it. This page documents the complete file format.

## File location

```
~/.claude/skills/SkillName/SKILL.md
```

The `SKILL.md` must be in the root of the skill directory. Claude Code discovers skills by scanning for this file.

## Frontmatter schema

SKILL.md files use YAML frontmatter for skill metadata, followed by markdown content for the skill's domain knowledge:

```yaml
---
name: SkillName
description: Short description of the skill — what it does and core capabilities.
  USE WHEN keyword1, keyword2, keyword3, OR mentions topic1, topic2.
---
```

```markdown
# SkillName - Extended description

## Overview

Detailed description of what this skill does and its core capabilities.
```

## Required elements

Every SKILL.md must include:

| Element | Location | Purpose | Example |
|---------|----------|---------|---------|
| **name** | YAML frontmatter | Skill identifier | `name: Research` |
| **description** | YAML frontmatter | What the skill does + trigger keywords | `description: Comprehensive research... USE WHEN research, investigate` |
| **Overview section** | Markdown body | Detailed capabilities | Paragraph describing core functionality |

## The trigger block

The `USE WHEN` keywords in the `description` field are the most important part of `SKILL.md`. Claude Code uses them to match user requests to skills automatically. There are two equivalent formats:

### Format 1: Inline in YAML description

```yaml
---
name: Research
description: Comprehensive research and content extraction —
  quick/standard/extensive/deep modes with multi-agent parallel research.
  USE WHEN research, do research, quick research, extensive research,
  deep investigation, find information, investigate.
---
```

### Format 2: Invoke when block (in markdown body)

```markdown
**Invoke when:** user says 'research', 'investigate', 'find information',
'do research', 'quick research', OR mentions research topics, content extraction,
web scraping.
```

### Trigger syntax rules

| Rule | Example |
|------|---------|
| Keywords are comma-separated | `research, investigate, find information` |
| Use natural phrases, not just single words | `do research` not just `research` |
| Include negative triggers with NOTE | `NOTE: For simple doc edits, no skill needed` |
| OR separates trigger groups | `OR mentions topic1, topic2` |
| Single quotes for exact phrases | `'do research'`, `'quick research'` |

### Effective trigger writing

Good triggers are **specific enough** to avoid false activation and **broad enough** to catch legitimate requests:

```markdown
# Good — specific terms that clearly indicate this domain
USE WHEN research, do research, quick research, extensive research,
deep investigation, find information, investigate, extract alpha,
analyze content, retrieve content.

# Bad — too generic, will activate on unrelated requests
USE WHEN help, find, look, check, get
```

Include the common ways users phrase requests for your skill's domain. Think about synonyms, verb forms, and compound phrases.

## Optional elements

| Element | Purpose | When to include |
|---------|---------|-----------------|
| **Voice notification** | Curl command for spoken feedback | When the skill runs long-running workflows |
| **Workflows section** | Links to workflow files | When the skill has multi-step procedures |
| **Tools section** | Links to CLI tools | When the skill has TypeScript/Bash tools |
| **Scope rules** | What triggers and doesn't trigger the skill | When false activation is a risk |
| **References** | Links to related files | When the skill depends on external context |
| **Examples** | Usage examples | When invocation patterns aren't obvious |

## Complete example

Here's a minimal but complete SKILL.md:

````markdown
---
name: WeatherCheck
description: Check weather conditions for any location — current conditions,
  forecasts, and severe weather alerts.
  USE WHEN weather, forecast, temperature, 'what's the weather', 'will it rain',
  OR mentions checking conditions for travel or events.
---

# WeatherCheck - Check weather conditions for any location

## Overview

Checks current weather and forecasts using the OpenWeatherMap API.
Supports current conditions, 5-day forecasts, and severe weather alerts.

## Voice Notification

When executing a workflow, send a voice notification:
```bash
curl -s -X POST http://localhost:8888/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Checking weather conditions"}'
```

## Workflows

| Workflow | When | File |
|----------|------|------|
| CurrentWeather | Current conditions | `Workflows/CurrentWeather.md` |
| Forecast | Multi-day forecast | `Workflows/Forecast.md` |

## Scope Rules

### Triggers
- Weather queries for specific locations
- Travel weather planning
- Severe weather checks

### Does NOT trigger
- Climate change discussions (use Research skill)
- Historical weather data analysis (use Research skill)

## References
- `Tools/WeatherAPI.ts` — OpenWeatherMap API wrapper
- `Tools/WeatherAPI.help.md` — API tool documentation
````

## Skill naming and the SYSTEM/USER model

The skill directory name determines its tier:

| Naming | Tier | Shareable | Example |
|--------|------|-----------|---------|
| **TitleCase** | SYSTEM | Yes — via PAI Packs | `Research/`, `Browser/`, `Security/` |
| **_ALLCAPS** | USER | Never — personal, private | `_BLOGGING/`, `_METRICS/` |

System skills (TitleCase) contain no personal data and can be distributed. Personal skills (_ALLCAPS) exist only on your machine and are excluded from exports.

## Companion files

SKILL.md is the entry point, but skills typically include companion files:

```
skills/SkillName/
├── SKILL.md              # This file (required)
├── Tools/                # CLI tools
│   ├── ToolName.ts       # TypeScript tool (TitleCase)
│   └── ToolName.help.md  # Tool docs (matches tool name)
├── Workflows/            # Step-by-step procedures
│   └── WorkflowName.md   # Workflow file (TitleCase)
```

Tool files use TitleCase naming and always include a `.help.md` companion that documents arguments, examples, and expected output.

## What to read next

- **[Your First Skill](/developer/first-skill/)** — Build a skill from scratch using this format
- **[The Extension Model](/developer/extension-model/)** — How skills fit into PAI's architecture
- **[Directory Conventions](/contributor/directory-conventions/)** — Where skill files belong in the filesystem
