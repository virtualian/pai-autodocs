---
title: "Customize Your AI"
description: Change your AI's name, personality, and behavior rules to match how you work.
sidebar:
  order: 1
---

Want to change your AI's name? Add a personal rule? Adjust how your AI communicates? Here's how.

---

## Change your AI's name and identity

Open `~/.claude/settings.json` in your editor. Find the `daidentity` and `principal` sections:

```json
{
  "daidentity": {
    "name": "Viki",
    "fullName": "Viki",
    "displayName": "Viki",
    "color": "#10B981",
    "voiceId": "s3TPKV1kjDlVtZbl4Ksh"
  },
  "principal": {
    "name": "Ian",
    "pronunciation": "EE-an",
    "timezone": "America/Los_Angeles"
  }
}
```

**`daidentity`** is your Digital Assistant:

- `name` / `fullName` / `displayName` -- what your AI calls itself in responses and notifications
- `color` -- hex color used in the session banner
- `voiceId` -- the ElevenLabs voice ID for spoken notifications

**`principal`** is you:

- `name` -- how your AI addresses you
- `pronunciation` -- phonetic guide so voice output says your name correctly
- `timezone` -- used for time-aware responses

Change any value, save the file, and restart Claude Code. Your changes take effect on the next session.

---

## Customize your AI's personality

Beyond the name, you can define your AI's personality in a dedicated file. Create or edit:

```
~/.claude/skills/PAI/USER/DAIDENTITY.md
```

This is where you describe how your AI should communicate. Write it in plain Markdown -- there is no required format. Here are examples of things you can define:

- **Communication style** -- "Be concise and direct. Skip pleasantries. Get to the point."
- **Tone** -- "Be constructively critical. Challenge ideas before agreeing."
- **Energy level** -- "Low enthusiasm. No exclamation marks. Calm and measured."

Your AI reads this file at the start of every session and adjusts its behavior accordingly.

---

## Add personal behavior rules

AI Steering Rules govern specific behaviors -- when to ask permission, which tools to prefer, how to handle common situations. You can add your own rules that reflect how you work.

Create the file:

```
~/.claude/skills/PAI/USER/AISTEERINGRULES.md
```

Each rule follows a Statement / Bad / Correct format:

```markdown
## Use Fast CLI Utilities Over Legacy Tools

Statement
: When using Bash for file operations, always prefer modern Rust-based
  utilities over legacy POSIX tools. Use `fd` not `find`, `rg` not `grep`.

Bad
: User asks to find TypeScript files. AI runs `find . -name "*.ts"`.
  Takes 15 seconds on a large codebase.

Correct
: User asks to find TypeScript files. AI runs `rg --type ts -l`.
  Completes in under 1 second.
```

This format removes ambiguity -- your AI sees exactly what you expect and what you want to avoid. When your personal rules conflict with the defaults, your rules win.

---

## Add a private skill

Private skills use the `_ALLCAPS` naming convention. The underscore prefix keeps them out of PAI's shared repository -- they exist only on your machine.

Create a skill directory and its entry file:

```
~/.claude/skills/_JOURNALING/SKILL.md
```

A minimal skill looks like this:

```markdown
---
name: _JOURNALING
description: Personal journaling skill for daily reflection.
triggers:
  - journal
  - daily reflection
---

# Journaling Skill

## Overview
Personal journaling system for daily reflection.

## Workflows
- DailyEntry: Create today's journal entry
- WeeklyReview: Summarize the past week
```

Your private skill loads alongside all other skills at session start. For a full walkthrough of building skills, see [Build Your First Skill](/developer/first-skill/).

---

## How this works

PAI uses a two-tier system: shared defaults and your personal overrides. Your files always take priority. This means PAI updates never overwrite your customizations -- the SYSTEM tier updates independently while your USER tier stays exactly as you left it.

---

## Verify your changes

Start a new session and confirm everything is active:

1. **Identity** -- Does your AI greet you by your configured name?
2. **Steering rules** -- Ask your AI to find files. Does it use the tool you specified?
3. **Private skills** -- Mention a trigger word from your skill. Does it activate?

If something is not working, check for typos in file paths and make sure you restarted Claude Code after editing `settings.json`.

---

## What to read next

- [Configure Skills](/power-user/configure-skills/) -- manage which skills are active
- [Configuration Reference](/power-user/configuration/) -- complete list of all config files
- [Build Your First Skill](/developer/first-skill/) -- full tutorial on creating skills from scratch
