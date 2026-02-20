---
title: Configuration Reference
description: Complete reference for all PAI configuration files, their locations, and their purposes.
sidebar:
  order: 3
---

<!-- Source: ~/.claude/settings.json -->
<!-- Source: ~/.claude/skills/PAI/SYSTEM/SYSTEM_USER_EXTENDABILITY.md -->

This page documents every configuration file in PAI, what it controls, and where to find it. Use this as a reference when customizing your installation.

## Quick reference

| File | Location | Controls |
|------|----------|----------|
| `settings.json` | `~/.claude/settings.json` | Hooks, identity, env vars, permissions |
| `.env` | `~/.config/PAI/.env` | API keys for external services |
| `SKILL.md` | Each skill directory | Skill definition, triggers, routing |
| `AISTEERINGRULES.md` | `USER/` or `SYSTEM/` | AI behavioral rules |
| `DAIDENTITY.md` | `USER/` | Extended identity and personality |
| `RESPONSEFORMAT.md` | `USER/` or `SYSTEM/` | Response formatting rules |
| `patterns.yaml` | `USER/PAISECURITYSYSTEM/` | Custom security patterns |

All paths below are relative to `~/.claude/` unless otherwise noted.

---

## settings.json

**Location:** `~/.claude/settings.json`

The central configuration file for PAI. Claude Code reads this file at startup to configure hooks, identity, environment variables, and permissions.

### Top-level structure

```json
{
  "permissions": { ... },
  "env": { ... },
  "hooks": { ... },
  "daidentity": { ... },
  "principal": { ... }
}
```

### daidentity section

Defines your Digital Assistant's identity. Used in voice notifications, session banners, and conversational context.

| Key | Type | Purpose |
|-----|------|---------|
| `name` | string | Short name used in conversation |
| `fullName` | string | Full display name |
| `displayName` | string | Name shown in UI elements and banners |
| `color` | string | Hex color for UI theming |
| `voiceId` | string | ElevenLabs voice ID for text-to-speech |

### principal section

Defines you, the human user.

| Key | Type | Purpose |
|-----|------|---------|
| `name` | string | Your name, used in greetings and conversation |
| `pronunciation` | string | Phonetic pronunciation for voice output |
| `timezone` | string | IANA timezone for timestamp formatting |

### env section

Environment variables injected into every hook and tool execution.

| Variable | Purpose |
|----------|---------|
| `PAI_DIR` | Root directory for all PAI files. Used by hooks and tools to resolve paths. |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | Maximum token count for Claude Code responses. |

:::note
The `PAI_DIR` variable is critical. Most hooks and tools reference it to locate configuration, memory, and skill files. If this is missing or incorrect, hooks will fail to find their dependencies.
:::

### hooks section

Defines event-driven scripts that run during Claude Code sessions. The structure is an object keyed by event name, where each event contains an array of matcher-hook pairs. Each hook entry has a `type` (`"command"`) and a `command` path. Optional `matcher` field filters `PreToolUse` and `PostToolUse` to specific tool names.

**Event types:** `SessionStart`, `UserPromptSubmit`, `Stop`, `SubagentStop`, `PreToolUse`, `PostToolUse`, `SessionEnd`

See [Write Hooks](/developer/write-hooks/) for the full hook configuration format with examples.

### permissions section

Controls which tools and operations Claude Code can use without asking for confirmation. The `allow` array uses a pattern format: `ToolName(command:pattern)`. The `deny` array blocks specific operations even if they match an allow pattern.

---

## .env file

**Location:** `~/.config/PAI/.env`

Stores API keys for external services. This file is loaded by hooks and tools that need to call third-party APIs.

```bash
ELEVENLABS_API_KEY=sk-...
REMOVEBG_API_KEY=...
YOUTUBE_API_KEY=...
```

| Key | Service | Used by |
|-----|---------|---------|
| `ELEVENLABS_API_KEY` | ElevenLabs TTS | Voice notification hooks |
| `REMOVEBG_API_KEY` | remove.bg | Art skill background removal |
| `YOUTUBE_API_KEY` | YouTube Data API | Research and content skills |

:::caution
The `.env` file contains secrets. It must never be committed to version control, shared publicly, or referenced from SYSTEM files. PAI's `.gitignore` excludes it by default.
:::

---

## SKILL.md files

**Location:** `~/.claude/skills/<SkillName>/SKILL.md`

Every skill has a `SKILL.md` that serves as its entry point. Claude Code reads the YAML frontmatter at startup to build its routing table.

```yaml
---
name: Research
description: Deep research workflow. USE WHEN user wants to research, investigate, or analyze a topic.
---
```

| Field | Required | Purpose |
|-------|----------|---------|
| `name` | Yes | TitleCase skill name |
| `description` | Yes | Must include a `USE WHEN` clause for routing |
| `implements` | No | Protocol compliance (e.g., `Science`) |
| `science_cycle_time` | No | Cycle time level (`micro`, `meso`, `macro`) |

The markdown body contains workflow routing tables, examples, and documentation. See [Configure Skills](/power-user/configure-skills/) for the full anatomy.

---

## USER configuration files

These files live under `~/.claude/skills/PAI/USER/` and customize PAI behavior.

### AISTEERINGRULES.md

Personal behavioral rules that govern how your AI operates. Unlike most USER files, steering rules are **additive** -- both SYSTEM and USER rules load, with USER rules taking precedence on conflicts. Each rule uses a Statement/Bad/Correct format for unambiguous intent.

### DAIDENTITY.md

Extended identity and personality configuration. While `settings.json` defines the basic identity (name, color, voice), this file defines deeper personality traits: interaction style, tone, vocabulary preferences, and relationship model (collaborator, assistant, mentor).

### PAISECURITYSYSTEM/patterns.yaml

Custom security patterns that define which commands are blocked or require confirmation. Two sections: `blocked` (rejected outright) and `confirmed` (require explicit user approval).

:::caution
When a USER patterns file exists, it **completely replaces** the SYSTEM defaults. Copy any SYSTEM patterns you want to keep before creating your USER file.
:::

### RESPONSEFORMAT.md

Overrides the default response formatting rules -- section headers, formatting conventions, verbosity levels, and presentation style. When this file exists, it replaces the SYSTEM response format entirely.

---

## File locations summary

| Category | File | Full path |
|----------|------|-----------|
| **Central config** | `settings.json` | `~/.claude/settings.json` |
| **API keys** | `.env` | `~/.config/PAI/.env` |
| **Skills** | `SKILL.md` | `~/.claude/skills/<Name>/SKILL.md` |
| **Steering rules** | `AISTEERINGRULES.md` | `~/.claude/skills/PAI/USER/AISTEERINGRULES.md` |
| **Identity** | `DAIDENTITY.md` | `~/.claude/skills/PAI/USER/DAIDENTITY.md` |
| **Security** | `patterns.yaml` | `~/.claude/skills/PAI/USER/PAISECURITYSYSTEM/patterns.yaml` |
| **Response format** | `RESPONSEFORMAT.md` | `~/.claude/skills/PAI/USER/RESPONSEFORMAT.md` |
| **Memory** | Various | `~/.claude/MEMORY/` |
| **Hooks** | `*.ts` | `~/.claude/hooks/` |

## What to read next

- [Customize Your AI](/power-user/customize-your-ai/) -- Hands-on tutorial for configuring identity and behavior
- [The SYSTEM/USER Model](/contributor/system-user-model/) -- How the two-tier override system works
- [Write Hooks](/developer/write-hooks/) -- Create custom hooks referenced in settings.json
