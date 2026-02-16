---
title: Agent Types Reference
description: Reference for PAI's three agent systems — Task subagents, Named agents, and Custom agents.
sidebar:
  order: 14
---

<!-- Source: ~/.claude/skills/PAI/SYSTEM/PAIAGENTSYSTEM.md -->
<!-- Source: ~/.claude/skills/Agents/SKILL.md -->

PAI has three distinct agent systems. Each serves a different purpose and is invoked through different mechanisms. This page is the complete reference for all three.

## 1. Task subagent types

Task subagents are the workhorses of PAI. They are spawned via the Claude Code Task tool during workflow execution. Each type has a specific role and model tier optimized for its work.

| Type | Purpose | Typical model | When used |
|------|---------|---------------|-----------|
| **Architect** | System design, architectural decisions, trade-off analysis | opus | Complex design work requiring deep reasoning |
| **Designer** | UX review, visual feedback, design system compliance | sonnet | UI/UX validation during micro-cycles |
| **Engineer** | Implementation, code writing, debugging, refactoring | sonnet | Standard development tasks |
| **Intern** | Research, information gathering, file exploration, grunt work | haiku | Parallel research, simple file operations |
| **Explore** | Codebase exploration, dependency mapping, understanding existing systems | haiku | Initial investigation before implementation |
| **Plan** | Strategic planning, decomposition, approach selection | sonnet | Pre-implementation planning phases |
| **QATester** | Functional testing, edge case verification, regression checks | sonnet | Post-implementation verification |
| **Pentester** | Security analysis, vulnerability scanning, threat modeling | opus | Security-sensitive work requiring deep analysis |
| **ClaudeResearcher** | Web research via Claude, documentation lookup | sonnet | Gathering external information |
| **GeminiResearcher** | Web research via Gemini for cross-model perspective | sonnet | When a second model perspective is valuable |
| **GrokResearcher** | Web research via Grok for real-time information | sonnet | When current/real-time data is needed |

**How they are invoked:**

Task subagents are launched by the main agent using the Task tool. The calling agent specifies the subagent type, model, and a full context block:

```
Task tool call:
  type: Engineer
  model: sonnet
  prompt: |
    WHY: We need to implement the user authentication module
    WHAT: Create login/logout endpoints with JWT tokens
    EXACTLY: Write src/auth/routes.ts with POST /login and POST /logout
    SUCCESS: Tests pass, endpoints return correct status codes
```

The subagent runs in its own context, completes its work, and returns output to the calling agent. Subagent completions fire the `SubagentStop` hook event.

---

## 2. Named agents

Named agents are persistent identities with backstories, calibrated personality traits, and fixed voice mappings. They exist across sessions and are recognized by name.

| Agent | Role | Voice | Personality |
|-------|------|-------|-------------|
| **Serena Blackwood** | Architect | UK Female | Precise, strategic, dry wit. Thinks in systems and trade-offs. |
| **Marcus Webb** | Engineer | Male | Direct, pragmatic, no-nonsense. Ships code that works. |
| **Rook Blackburn** | Pentester | UK Male | Skeptical, thorough, adversarial mindset. Assumes everything is broken. |
| **Dev Patel** | Intern | High-energy | Enthusiastic, fast, eager. Great for parallel grunt work. |
| **Ava Sterling** | Claude Researcher | US Female | Methodical, citation-focused. Deep web research via Claude. |
| **Alex Rivera** | Gemini Researcher | Multi-perspective | Analytical, cross-referencing. Research via Gemini for second opinions. |

**Personality is functional, not decorative.** Different work benefits from different cognitive approaches. An Architect needs to think in systems and trade-offs. A Pentester needs to assume adversarial intent. An Intern needs to move fast without overthinking. The personality traits shape how each agent approaches problems.

**Voice identity** connects each agent to a unique ElevenLabs voice. When multiple agents report back, you can hear which agent is speaking without reading the output. Voice mappings are stored in the PAI identity configuration.

**Invoking named agents:**

Named agents activate when you refer to them by name:

```
"Use Serena to review the architecture"
"Have Rook do a security audit"
"Ask Marcus to implement the API layer"
```

PAI routes the name to the corresponding agent configuration, which includes the agent's system prompt, personality traits, voice ID, and default model tier.

---

## 3. Custom agents

Custom agents are dynamically composed at runtime via the ComposeAgent system. Instead of selecting from a fixed roster, you describe the traits you need and PAI assembles an agent with the right combination.

**Trait categories:**

| Category | Examples | Effect |
|----------|----------|--------|
| **Expertise** | Frontend, Backend, Security, DevOps, Data, ML | Domain knowledge and vocabulary |
| **Personality** | Cautious, Bold, Methodical, Creative, Skeptical | Approach to problem-solving |
| **Approach** | TDD, Prototype-first, Research-heavy, Minimal, Thorough | Work methodology |

**How composition works:**

Each unique combination of traits maps to a distinct voice via a hash-based voice selection system. This means a "Cautious Backend TDD" agent always gets the same voice, creating consistency even for dynamically composed agents.

```
ComposeAgent:
  expertise: [Security, Backend]
  personality: Skeptical
  approach: Thorough
  -> Generates unique voice hash
  -> Creates system prompt from trait templates
  -> Returns agent ready for Task tool use
```

**When to use custom agents:**

Custom agents are for work that does not fit neatly into the named agent roster. If you need a "cautious DevOps engineer who favors minimal changes" and no named agent matches that profile, ComposeAgent builds one.

:::tip
For most work, named agents or task subagent types are sufficient. Custom agents shine when you need a specific combination of traits that the existing roster does not cover.
:::

---

## Routing rules

How PAI decides which agent system to use based on your request:

| Trigger phrase | Routes to | System |
|----------------|-----------|--------|
| "custom agents", "compose an agent" | Agents skill, then ComposeAgent | Custom agents |
| "agents", "launch agents", "use agents" | Generic task subagents (typically Intern) | Task subagents |
| "use Serena", "ask Marcus", "have Rook" | Named agent by identity | Named agents |
| Internal workflow delegation | Task subagent by type (Engineer, QATester, etc.) | Task subagents |

**Routing precedence:**

1. **Explicit name match** -- If a named agent is referenced, that agent is used directly.
2. **Custom agent keywords** -- Phrases like "custom agent" or "compose" route to ComposeAgent.
3. **Generic agent keywords** -- Phrases like "launch agents" or "use agents" route to generic task subagents.
4. **Internal workflow calls** -- The Algorithm's THINK phase selects task subagent types based on ISC criteria and capability needs.

---

## Model selection matrix

Every agent runs on a specific model tier. The tier determines the balance between speed, cost, and reasoning depth.

| Tier | Model | Speed | Intelligence | Cost | Best for |
|------|-------|-------|-------------|------|----------|
| **fast** | haiku | 10-20x faster | Good for simple tasks | Lowest | Research, file exploration, simple checks, grunt work |
| **standard** | sonnet | Balanced | Strong reasoning | Medium | Implementation, testing, standard development |
| **smart** | opus | Slowest | Maximum depth | Highest | Architecture, security analysis, complex debugging |

**Selection guidelines:**

Use **haiku** when the task is well-defined and does not require deep reasoning. File searches, simple transformations, parallel research tasks, and information gathering all run well on haiku. The speed advantage (10-20x faster) makes a meaningful difference when launching multiple parallel agents.

Use **sonnet** for the majority of development work. Code implementation, test writing, debugging, code review, and standard planning all benefit from sonnet's balance of reasoning and speed.

Use **opus** when the task requires deep architectural thinking, complex security analysis, or multi-step reasoning across large systems. Opus is significantly slower and more expensive, so reserve it for work where the reasoning depth justifies the cost.

:::caution
Do not default to opus for everything. The speed difference is substantial. A haiku intern can complete 10 research tasks in the time opus finishes one. Match the model to the cognitive demand of the task.
:::

---

## Agent composition patterns

Agents compose into higher-level patterns depending on the work:

| Pattern | Shape | Example |
|---------|-------|---------|
| **Pipeline** | A, then B, then C | Explore codebase, then Architect designs, then Engineer implements |
| **TDD Loop** | A and B iterate | Engineer writes code, QATester verifies, loop until green |
| **Fan-out** | A, B, C in parallel | Three Interns research different topics simultaneously |
| **Fan-in** | A, B, C merge into D | Parallel research results synthesized by Architect |
| **Gate** | A, then check, then B or retry | Engineer implements, QA tests, pass or retry |
| **Escalation** | Upgrade tier on failure | Haiku fails, retry with sonnet. Sonnet fails, retry with opus. |
| **Specialist** | Single agent, deep focus | Opus Architect designs an entire system |

The Algorithm's THINK phase selects the appropriate pattern based on ISC criteria and task dependencies.

---

## Agent output and voice routing

When an agent completes work, two things happen:

1. **Output capture** -- The `SubagentStop` hook fires and the AgentOutputCapture hook writes the agent's output to `MEMORY/RESEARCH/`.
2. **Voice notification** -- If the agent has a voice mapping (all named agents do; custom agents get one via hash), a voice notification speaks the completion summary.

Voice routing follows the agent identity. If Serena (Architect) completes a design review, the voice notification uses Serena's UK Female voice. If Dev (Intern) finishes a research task, it uses Dev's high-energy voice. This audible differentiation lets you track which agent is reporting without reading the terminal.

## What to read next

- [Set Up Agents](/developing/set-up-agents/) -- How to configure agent delegation and parallel execution
- [Architecture](/developing/architecture/) -- How agents fit into the broader PAI system
- [Tools Reference](/developing/tools-reference/) -- CLI tools that agents use, including Inference
