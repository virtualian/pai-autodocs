---
title: Troubleshooting
description: Common problems, error messages, and fixes for PAI users.
diataxis_type: reference
---

This page covers the most common issues PAI users encounter, organised by what you see (the symptom) rather than what's broken (the component). If your problem isn't listed here, check the [PAI GitHub Issues](https://github.com/danielmiessler/Personal_AI_Infrastructure/issues).

## PAI doesn't use the Algorithm

**Symptom:** Your AI responds with plain text instead of the structured Algorithm format (OBSERVE, THINK, PLAN, BUILD, EXECUTE, VERIFY, LEARN).

**Common causes:**

| Cause | Fix |
|-------|-----|
| Request was too simple | The Algorithm activates for multi-step tasks. Simple questions get NATIVE or MINIMAL mode. This is by design. |
| CLAUDE.md not loaded | Check that `~/.claude/CLAUDE.md` exists and references the Algorithm file. Run `cat ~/.claude/CLAUDE.md | head -20` to verify. |
| Context window full | Long sessions can push CLAUDE.md instructions out of context. Start a new session. |

## A skill doesn't activate

**Symptom:** You ask for something a skill should handle (e.g., "do research on X") but PAI doesn't use the expected skill.

**Common causes:**

| Cause | Fix |
|-------|-----|
| Skill not installed | Check `ls ~/.claude/skills/` for the skill directory. If missing, reinstall PAI or the specific skill. |
| SKILL.md missing or malformed | Every skill needs a `SKILL.md` with `USE WHEN` triggers. Check `cat ~/.claude/skills/SkillName/SKILL.md`. |
| Request didn't match triggers | Skills activate based on `USE WHEN` keywords in their SKILL.md. Rephrase your request to include relevant terms, or invoke the skill directly with `/skillname`. |
| Skill listing not in system prompt | Claude Code loads the skill listing at session start. If you added a skill mid-session, restart the session. |

## PAI doesn't remember something

**Symptom:** Your AI forgot a decision, preference, or piece of context from a previous session.

**Common causes:**

| Cause | Fix |
|-------|-----|
| Memory wasn't captured | PAI captures memory through hooks and explicit saves. If a session ended abruptly (crash, network loss), memory may not have persisted. |
| Memory is in a different file | Check `ls ~/.claude/MEMORY/` subdirectories. Memory is organised by type (RAW, LEARNING, WORK, STATE). |
| Context routing didn't load the right file | PAI loads context based on relevance. If the memory exists but wasn't loaded, mention the topic explicitly so routing picks it up. |
| CLAUDE.md auto-memory is project-scoped | Claude Code's built-in auto-memory saves to project-specific directories. Check `~/.claude/projects/` for the relevant project. |

## Voice notifications aren't working

**Symptom:** PAI completes tasks silently when you expect voice announcements.

**Common causes:**

| Cause | Fix |
|-------|-----|
| Notification server not running | The voice system requires a local server. Check `curl -s http://localhost:8888/health`. |
| ElevenLabs API key missing or expired | Voice uses ElevenLabs TTS. Check your `.env` file for the API key. |
| ElevenLabs plan limitation | Free-tier ElevenLabs accounts cannot use library voices via the API. Upgrade or use a custom voice. |
| Volume/system audio issue | Check your system audio settings — PAI plays audio through the default output device. |

## Hooks aren't firing

**Symptom:** Automated behaviour that should happen (e.g., format reminders, signal capture, session summaries) isn't happening.

**Common causes:**

| Cause | Fix |
|-------|-----|
| Hook not registered in settings.json | Hooks must be registered in `~/.claude/settings.json` under the correct event type. Check the file. |
| Hook script has a syntax error | Run the hook script manually: `echo '{}' | bash ~/.claude/hooks/HookName.sh` and check for errors. |
| Hook path is wrong | Verify the `command` path in `settings.json` matches the actual hook file location. |
| Claude Code hook system changed | Claude Code updates can change hook event names or payloads. Check Claude Code release notes. |

## Telos files aren't loading

**Symptom:** Your AI doesn't seem to know about your goals, projects, or values even though you've set them up.

**Common causes:**

| Cause | Fix |
|-------|-----|
| Files in wrong location | Telos files should be in `~/.claude/skills/PAI/USER/TELOS/`. Verify with `ls ~/.claude/skills/PAI/USER/TELOS/`. |
| Files are empty | An empty Telos file won't provide context. Check `wc -l ~/.claude/skills/PAI/USER/TELOS/*.md`. |
| Context routing not configured | Telos loading depends on context routing. Check that `CONTEXT_ROUTING.md` includes Telos paths. |

## Session feels slow or degraded

**Symptom:** Responses get worse, less structured, or less accurate later in a long session.

**What's happening:** Claude Code has a finite context window. As conversations grow, earlier instructions (including CLAUDE.md, skill definitions, and steering rules) get compressed or dropped. This is called context rot.

**Fix:** Start a new session. Long-running sessions (50+ exchanges) will naturally degrade. For complex multi-step work, the Algorithm's built-in context compaction helps, but a fresh session is the most reliable fix.

## "Permission denied" or file access errors

**Symptom:** PAI reports it cannot read or write files.

**Common causes:**

| Cause | Fix |
|-------|-----|
| File permissions | Check with `ls -la` on the affected file. PAI needs read/write access to `~/.claude/`. |
| File locked by another process | Another Claude Code session or editor may have a lock. Close other sessions. |
| Path doesn't exist | PAI expects certain directories to exist. Run `mkdir -p ~/.claude/MEMORY/{RAW,WORK,LEARNING,STATE}` to create missing directories. |

## What to read next

- **[Your First Session](/user/first-session/)** — Verify PAI is working correctly with a guided walkthrough
- **[Install PAI](/user/install-pai/)** — Reinstall or update if troubleshooting doesn't resolve your issue
- **[Configuration Reference](/power-user/configuration/)** — Deep dive into every setting if you need to debug config issues
