---
title: Skill Lifecycle
description: How skills are discovered, activated, composed, and retired in PAI.
diataxis_type: explanation
---

<!-- Source: PAI skill system internals, SKILL.md scanning, Algorithm THINK phase -->

# Skill Lifecycle

A skill moves through six phases during a PAI session: discovery, activation, loading, execution, composition, and retirement. Understanding this lifecycle explains why skills are structured the way they are and how PAI decides which skills to use.

```
Session Start → Scan SKILL.md files → Build routing table
    ↓
User prompt → Pass 1 (hook hint) → Pass 2 (THINK validation)
    ↓
Load full SKILL.md → Route to workflow → Execute steps
    ↓
Session End → No cleanup needed
```

## 1. Discovery

At session start, Claude Code scans every `~/.claude/skills/*/SKILL.md` file and reads the YAML frontmatter only — the `name` and `description` fields, including `USE WHEN` trigger phrases. The full body of each SKILL.md is **not** read at this stage.

This scan builds the **routing table**: a lightweight index of every available skill and the conditions under which it should activate. Keeping discovery to frontmatter-only means startup stays fast regardless of how many skills exist or how large their workflow documentation is.

Key points:

- Only top-level directories under `~/.claude/skills/` are scanned.
- Each directory must contain a `SKILL.md` file to be recognized.
- The `USE WHEN` triggers in the description are the primary matching mechanism.
- No registration step is needed — presence in the directory is sufficient.

## 2. Activation (two-pass)

Activation determines which skills from the routing table should handle the current prompt. This happens in two passes:

**Pass 1 — Initial skill matching.** Claude Code matches the user prompt against skill descriptions and `USE WHEN` triggers to produce a draft list of suggested skills. This is a hint, not a decision.

**Pass 2 — THINK phase validation.** During the Algorithm's THINK phase, the draft suggestions are validated against ISC (Ideal State Criteria). Pass 2 is authoritative. It can:

- Confirm a suggestion from Pass 1
- Add skills that Pass 1 missed
- Remove skills that Pass 1 incorrectly suggested

The two-pass design provides both speed (Pass 1 runs early) and accuracy (Pass 2 has full context from the Algorithm's analysis).

## 3. Loading

Once a skill is selected, PAI reads the full `SKILL.md` body. This includes:

- The **Workflow Routing table**, which maps task types to specific workflow files within the skill directory.
- Any instructions, constraints, or domain context embedded in the skill body.
- The **customization directory** at `USER/SKILLCUSTOMIZATIONS/SkillName/`, which contains user-specific overrides and preferences for that skill.

Loading is deferred to this point intentionally. Reading full skill bodies for every installed skill at startup would waste time and context window on skills that may never activate.

## 4. Execution

With the skill loaded and a workflow selected, PAI follows the workflow steps sequentially. During execution:

- Each step in the workflow is processed in order.
- Workflows can call CLI tools from the skill's `Tools/` directory for deterministic operations (file I/O, data transformation, API calls).
- Skills can spawn subagents for parallel work.
- Skills can invoke other skills when cross-domain capabilities are needed.

The workflow acts as a script that PAI follows, but the AI retains judgment about how to implement each step given the specific context.

## 5. Composition

Skills rarely work in complete isolation. PAI supports three composition patterns:

| Pattern | Role | Example |
|---------|------|---------|
| Hook + Skill | Hook provides lifecycle plumbing (when to run), skill provides domain expertise (what to do) | LoadContext hook injects skill context at session start |
| Skill + Agent | Skill defines the work, agent provides parallel execution | A research skill spawns agents to investigate multiple sources simultaneously |
| Skill + Skill | One skill invokes another for cross-domain capability | A writing skill invokes a review skill for quality checks |

Composition emerges from the architecture rather than requiring explicit wiring. Hooks observe session events, skills declare their triggers, and agents execute within skill-defined boundaries.

## 6. Retirement

Retiring a skill requires one action: delete the skill directory from `~/.claude/skills/`.

There is no deregistration step, no configuration to update, no dependencies to unwind. Because discovery works by scanning the directory at session start, a missing directory simply means the skill won't appear in the routing table on the next session.

This design makes skills fully portable — copy a directory in to install, delete it to remove.

## What to read next

- **[Your First Skill](/developer/first-skill/)** — Build a working skill from scratch to see the lifecycle in practice.
- **[Skill File Format](/developer/skill-file-format/)** — Reference for SKILL.md structure, frontmatter fields, and workflow routing tables.
- **[The Extension Model](/developer/extension-model/)** — How skills, hooks, and tools fit together as PAI's extension architecture.
