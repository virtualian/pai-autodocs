---
title: The Extension Model
description: How PAI's three extension points — skills, hooks, and agents — compose into custom capabilities.
---

## Three ways to extend PAI

PAI is designed to be extended, not forked. Every capability you add follows the same pattern: you write a small, focused piece that plugs into PAI's existing architecture. There are three extension points, each serving a different purpose.

## Skills — what PAI can do

A **skill** is a self-contained capability with its own knowledge, workflows, and tools. When you ask PAI for help with security testing, research, or art generation, a skill activates. Skills are the highest-level extension point.

Each skill lives in its own directory with:
- A `SKILL.md` that defines the skill's identity, triggers, and domain knowledge
- **Workflows** — step-by-step procedures the skill follows
- **Tools** — CLI scripts the skill can invoke for deterministic operations

Skills activate automatically based on what you ask. You do not need to memorise names or use special commands. PAI reads the context and routes to the right skill.

**Example:** When you say "research the latest trends in AI agents", PAI activates the Research skill, which spawns multiple researcher agents across different AI models and synthesises their findings.

## Hooks — when PAI should act

A **hook** is an event-driven script that runs automatically during PAI sessions. Hooks fire on specific events — when you submit a prompt, when a tool is called, when a response is generated.

Hooks enable automation that would otherwise require manual intervention:
- Automatically classify every prompt's required depth
- Run security scans before committing code
- Send notifications when long-running tasks complete
- Capture learnings after every session

Hooks are registered in `settings.json` and execute as shell commands, receiving event data on stdin. They can modify behaviour, inject context, or trigger side effects.

## Agents — who does the work

An **agent** is a specialised worker that PAI can delegate tasks to. PAI has three agent systems:

| System | Purpose | Example |
|--------|---------|---------|
| **Task subagents** | Built-in specialists for common work | Engineer, Architect, Researcher |
| **Named agents** | Identity-rich agents with voice and personality | Custom agents with specific expertise |
| **Agent teams** | Coordinated multi-agent swarms | 4-16 agents working in parallel |

Agents enable parallelisation — instead of doing everything sequentially, PAI can spawn multiple agents that work simultaneously on different parts of a problem.

## How they compose

The real power emerges from composition. A typical complex task might:

1. A **hook** fires on your prompt and classifies its depth
2. The **Algorithm** activates and creates Ideal State Criteria
3. A **skill** provides domain expertise for the specific problem
4. Multiple **agents** work in parallel to build, test, and verify

You do not need to orchestrate this yourself. PAI's Algorithm handles composition automatically. But understanding these three extension points helps you build the right kind of extension for your needs.

## Next steps

- **[Your First Skill](/developer/first-skill/)** — Build a complete skill from scratch
- **[Your First Hook](/developer/first-hook/)** — Create an event-driven hook
- **[Set Up Agents](/developer/set-up-agents/)** — Configure agent delegation
