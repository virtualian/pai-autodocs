---
title: Debugging and Troubleshooting
description: "Diagnose agent failures, skill loading issues, and context routing misses in PAI."
diataxis_type: how-to
---

<!-- Source: PAI hook system, skill lifecycle, agent system, memory system -->

# Debugging and Troubleshooting

When something goes wrong in PAI, the problem usually falls into one of three categories: an agent failed, a skill didn't load, or context wasn't routed correctly. This guide walks through diagnosing each.

## Diagnosing agent failures

Agents can fail silently, stall without returning, or return incorrect results. Start by identifying which of PAI's three agent systems was involved.

### Step 1: Identify the agent system

| Symptom | Likely system | Check |
|---------|--------------|-------|
| Task tool returned an error | Task subagent | Check the error message for timeout or permission issues |
| Named agent (Serena, Marcus, etc.) gave wrong output | Named agent | Verify the agent was given correct context in the prompt |
| Custom agent didn't activate | Custom agent via ComposeAgent | Check that the Agents skill was invoked, not raw Task calls |

### Step 2: Check for stalled agents

If an agent hasn't returned after a reasonable time:

```bash
# Check if background tasks are still running
# In Claude Code, use TaskOutput to check status of background agents
```

Common causes of stalls:
- The agent's prompt was too vague, causing it to explore indefinitely
- The agent hit a permission boundary and is waiting for approval
- Network issues interrupted the API call

### Step 3: Check agent output quality

If the agent returned but the output is wrong:

1. **Review the prompt you sent.** Vague prompts produce vague results. Include specific file paths, criteria, and expected output format.
2. **Check the model selection.** Haiku is fast but less capable for complex reasoning. Use Sonnet for standard work, Opus for deep analysis.
3. **Verify isolation mode.** If you used `isolation: "worktree"`, the agent worked on a copy of the repo. Its changes may not be in your working directory.

### Step 4: Check the event log

```bash
# View recent agent-related events
tail -20 ~/.claude/MEMORY/STATE/events.jsonl | grep -i agent
```

## Diagnosing skill loading issues

When a skill doesn't activate, the problem is usually in discovery or activation.

### Step 1: Verify the skill exists

```bash
# List all installed skills
ls ~/.claude/skills/
```

The skill directory must contain a `SKILL.md` file. If the directory exists but has no `SKILL.md`, the skill won't be discovered.

### Step 2: Check the trigger keywords

Read the skill's frontmatter to see what triggers it:

```bash
head -10 ~/.claude/skills/SkillName/SKILL.md
```

Look at the `USE WHEN` keywords in the `description` field. If your request didn't match any of these keywords, the skill won't activate.

Common issues:
- **Too-specific triggers** — the skill only matches exact phrases like `"run security scan"` but you said `"check for vulnerabilities"`
- **Missing trigger** — the skill handles the task but doesn't list the relevant keyword
- **Conflicting skills** — two skills match the same trigger, and the wrong one wins

### Step 3: Check the two-pass activation

Skills activate through two passes:

1. **Pass 1 (initial matching)** — Claude Code matches your prompt against skill descriptions and triggers
2. **Pass 2 (Algorithm THINK phase)** — validates and adjusts the suggestions

If Pass 1 misses your skill, Pass 2 can still add it. But if Pass 2 also misses it, the skill won't load.

To verify: check whether the Algorithm's capability selection in the PRD included your skill. Look at the most recent PRD:

```bash
ls -t ~/.claude/MEMORY/WORK/ | head -1
cat ~/.claude/MEMORY/WORK/$(ls -t ~/.claude/MEMORY/WORK/ | head -1)/PRD.md
```

### Step 4: Check the skill's workflow routing

If the skill activated but didn't do what you expected, the issue may be in workflow routing. Read the skill's Workflows section to see which workflow was selected and whether it matches your intent.

## Diagnosing context routing misses

Context routing determines which files PAI loads for a given task. When the wrong context loads (or none loads), the AI works without the information it needs.

### Step 1: Check the routing table

The routing table lives at `~/.claude/PAI/CONTEXT_ROUTING.md`. Read it to see what topics map to what files:

```bash
cat ~/.claude/PAI/CONTEXT_ROUTING.md
```

If your topic isn't in the table, PAI won't know to load the relevant file.

### Step 2: Verify the file exists

The routing table points to file paths. If the file at that path doesn't exist, loading fails silently — PAI simply works without that context.

```bash
# Check if the file exists (relative to ~/.claude/)
ls ~/.claude/PAI/PAISYSTEMARCHITECTURE.md
```

### Step 3: Check load-at-startup vs on-demand

Some files load at session start (via `settings.json → loadAtStartup`). Others load on-demand when the topic is relevant.

If a file should always be available but isn't:

```bash
# Check what's configured to load at startup
cat ~/.claude/settings.json | grep -A 5 loadAtStartup
```

### Step 4: Check file size

Very large context files can be truncated or cause context window pressure. If a file is over 500 lines, consider whether it should be split or trimmed.

```bash
wc -l ~/.claude/PAI/*.md | sort -rn | head -10
```

## General debugging checklist

When none of the above categories fit, use this general approach:

1. **Read the error message.** PAI errors are usually descriptive.
2. **Check the event log.** `~/.claude/MEMORY/STATE/events.jsonl` records typed events from all hooks.
3. **Check recent learnings.** `~/.claude/MEMORY/LEARNING/SYSTEM/` may contain records of similar failures.
4. **Check hook execution.** If a hook crashed, Claude Code logs the error. Look for hook-related errors in recent session output.
5. **Simplify and isolate.** If a complex workflow fails, try the simplest version of the task first.

## What to read next

- **[Agent Types](/developer/agent-types/)** — Reference for all built-in agent types and their capabilities
- **[Skill Lifecycle](/developer/skill-lifecycle/)** — How skills are discovered and activated, explaining where loading can fail
- **[Hook Types](/developer/hook-types/)** — Every hook event and its payload, useful for understanding hook-related failures
