---
title: Agent Architecture
description: "How agents spawn, share context, use ISC criteria, and coordinate in PAI."
diataxis_type: explanation
---

<!-- Source: PAI/PAIAGENTSYSTEM.md, PAI/THEDELEGATIONSYSTEM.md -->

# Agent Architecture

PAI has three distinct agent systems, each serving a different purpose. Understanding which system to use and how they interact is essential for building multi-agent workflows.

## The three agent systems

This is the most important distinction in PAI's agent architecture. Confusing these systems causes routing failures and unexpected behaviour.

| System | What it is | When to use |
|--------|-----------|-------------|
| **Task tool subagent types** | Pre-built agents in Claude Code (Architect, Designer, Engineer, Explore, etc.) | Internal workflow use — deterministic roles for specific tasks |
| **Named agents** | Persistent identities with backstories and ElevenLabs voices (Serena, Marcus, Rook, etc.) | Recurring work, voice output, relationship continuity |
| **Custom agents** | Dynamic agents composed on-the-fly from traits via ComposeAgent | When the user says "custom agents" — unique combinations of expertise, personality, and approach |

### Task tool subagent types

These are the workhorses of PAI's internal workflows. Each type has a fixed role:

| Type | Purpose | Typical use |
|------|---------|-------------|
| `Architect` | System design, architectural decisions | Development skill workflows |
| `Designer` | UX/UI design | Design-focused workflows |
| `Engineer` | Code implementation | Building features, fixing bugs |
| `Explore` | Codebase exploration | Finding files, understanding structure |
| `Plan` | Implementation planning | Plan mode analysis |
| `QATester` | Quality assurance via browser | Browser testing workflows |
| `ClaudeResearcher` | Claude-based web research | Research skill workflows |
| `GeminiResearcher` | Gemini-based multi-perspective research | Research skill workflows |
| `GrokResearcher` | Grok-based contrarian research | Research skill workflows |

These agents do **not** have unique voices or personality composition. They are functional roles, not characters.

### Named agents

Named agents have rich backstories, personality traits, and mapped ElevenLabs voices. They provide relationship continuity across sessions — the same "person" helping you over time.

| Agent | Role | Use for |
|-------|------|---------|
| Serena Blackwood | Architect | Long-term architecture decisions |
| Marcus Webb | Engineer | Strategic technical leadership |
| Rook Blackburn | Pentester | Security testing with personality |
| Ava Sterling | Claude Researcher | Strategic research |
| Alex Rivera | Gemini Researcher | Comprehensive multi-perspective analysis |

Named agents are defined in individual `agents/*.md` files containing persona frontmatter and backstory.

### Custom agents

Custom agents are composed dynamically using the ComposeAgent tool. Each unique trait combination maps to a different voice, creating distinct agents on demand.

Traits fall into three categories:

| Category | Examples | What it controls |
|----------|----------|-----------------|
| **Expertise** | security, legal, finance, medical, technical | Domain knowledge |
| **Personality** | skeptical, enthusiastic, cautious, analytical | Behavioural style |
| **Approach** | thorough, rapid, systematic, exploratory | Work methodology |

Creating a custom agent:

```bash
bun run ~/.claude/skills/Agents/Tools/ComposeAgent.ts \
  --traits "research,skeptical,systematic"
```

This returns a prompt and voice_id. The prompt encodes the agent's personality; the voice_id maps to an ElevenLabs voice matching the trait combination.

## How agents spawn

All agents ultimately spawn through Claude Code's `Task` tool or `Agent` tool. The spawning flow differs by system:

```
Task tool subagent:
  Task({ subagent_type: "Engineer", prompt: "..." })
  → Claude Code spawns a subprocess with the Engineer role

Named agent:
  Task({ subagent_type: "general-purpose", prompt: "[persona context] + task" })
  → Persona context loaded from agents/*.md file

Custom agent:
  ComposeAgent → generates prompt + voice_id
  → Task({ subagent_type: "general-purpose", prompt: composed_prompt })
  → Each agent gets unique personality via the composed prompt
```

### Isolation modes

Agents can run in different isolation modes:

| Mode | What happens | When to use |
|------|-------------|-------------|
| Default | Agent shares the working directory | Most tasks |
| `worktree` | Agent gets a temporary git worktree — an isolated copy | Parallel development where agents edit the same files |
| Background | Agent runs asynchronously; you're notified when done | Non-blocking parallel research or exploration |

Worktree isolation is critical for parallel development. Without it, two agents editing the same file create race conditions.

## Context sharing

Agents do **not** share conversation context with each other or with the parent agent. Each agent starts with only:

1. The prompt you gave it (including any context you included inline)
2. Access to the filesystem (same repo, unless worktree-isolated)
3. The tools available to its agent type

This means you must include all relevant context in the agent's prompt. The agent cannot "see" what you discussed earlier in the conversation. This is by design — it prevents context pollution and keeps agents focused.

### The spotcheck pattern

After parallel agents complete, their outputs may be inconsistent. The spotcheck pattern addresses this:

```
Launch N agents in parallel → collect results
  → Launch 1 spotcheck agent to verify consistency across all outputs
```

The spotcheck agent receives all outputs and checks for contradictions, gaps, or quality issues. Use a fast model (Haiku) for spotchecks since they're verification, not creation.

## ISC criteria and agents

During Algorithm execution, the ISC (Ideal State Criteria) from the PRD guide how agents are deployed:

1. **OBSERVE phase** — Criteria are decomposed into atomic, verifiable items
2. **PLAN phase** — Criteria are mapped to agents: which agent handles which criteria
3. **EXECUTE phase** — Agents are spawned with their assigned criteria embedded in their prompts
4. **VERIFY phase** — Each criterion is checked against agent output; PRD checkboxes are updated

Agents don't read the PRD themselves. The parent agent extracts the relevant criteria and includes them in each agent's prompt. This keeps agents focused on their specific deliverables.

## Model selection

Different tasks warrant different models for agent work:

| Task type | Model | Trade-off |
|-----------|-------|-----------|
| Simple checks, formatting, grunt work | Haiku | 10-20x faster, lower cost |
| Standard analysis, implementation | Sonnet | Balanced speed and capability |
| Deep reasoning, architecture, complex design | Opus | Maximum intelligence, slower |

For parallel custom agents doing research, Sonnet is usually the right balance. For spotcheck agents, Haiku is sufficient.

## What to read next

- **[Agent Types](/developer/agent-types/)** — Complete reference for every built-in agent type
- **[Set Up Agents](/developer/set-up-agents/)** — How-to guide for configuring and orchestrating agents
- **[The Extension Model](/developer/extension-model/)** — How agents fit into PAI's broader architecture alongside skills and hooks
