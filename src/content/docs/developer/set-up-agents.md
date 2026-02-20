---
title: Set Up Agents
description: Delegate complex tasks to specialised agents so PAI can work in parallel on your behalf.
sidebar:
  order: 5
---

<!-- Source: ~/.claude/skills/PAI/SYSTEM/PAIAGENTSYSTEM.md -->

This guide shows you how to delegate work to agents in PAI -- launching subagents, selecting the right model tier, running agents in parallel, and verifying their output.

## Launch a subagent with the Task tool

The Task tool is how PAI spawns subagents. Each subagent runs in its own context, does its work, and returns output to the calling agent.

To launch a subagent, provide four pieces of context:

```
Task tool call:
  WHY: The reason this work needs to happen
  WHAT: The deliverable or outcome expected
  EXACTLY: Specific files, functions, or artifacts to produce
  SUCCESS CRITERIA: How to verify the work is complete
```

**Example -- launching an Engineer subagent:**

```
Task:
  type: Engineer
  model: sonnet

  WHY: The authentication module needs JWT token refresh logic
  WHAT: Implement token refresh endpoint and middleware
  EXACTLY: Create src/auth/refresh.ts with POST /auth/refresh endpoint
           and src/middleware/auth.ts with token validation middleware
  SUCCESS CRITERIA: Existing auth tests pass, new refresh tests pass,
                    tokens refresh without user re-login
```

:::caution
Never launch a subagent with vague instructions. "Fix the auth" is not sufficient context. The subagent has no memory of your conversation -- it only sees what you put in the Task prompt. Include WHY, WHAT, EXACTLY, and SUCCESS CRITERIA every time.
:::

## Select the right model

Model selection is one of the highest-leverage decisions in agent delegation. The wrong tier wastes either time or money.

### When to use haiku (fast)

Haiku is 10-20x faster than sonnet. Use it for work that is well-defined and does not require deep reasoning:

- **File exploration** -- "List all TypeScript files that import the auth module"
- **Simple research** -- "Find the documentation for this API endpoint"
- **Grep and search** -- "Search the codebase for all uses of deprecated function X"
- **Data gathering** -- "Read these 5 config files and report their database settings"
- **Parallel grunt work** -- Any task you are launching 3+ agents to do simultaneously

```
Task:
  type: Intern
  model: haiku
  WHY: Need to understand which files import the legacy auth module
  WHAT: List of all files with import paths
  EXACTLY: Search src/ for imports from '@legacy/auth'
  SUCCESS CRITERIA: Complete list with file paths and line numbers
```

### When to use sonnet (standard)

Sonnet is the default for most development work. Use it when the task requires reasoning but not maximum depth:

- **Code implementation** -- Writing functions, classes, modules
- **Test writing** -- Creating test suites with edge cases
- **Code review** -- Reviewing PRs for correctness and style
- **Debugging** -- Tracing through logic to find bugs
- **Standard planning** -- Breaking a feature into implementation steps

```
Task:
  type: Engineer
  model: sonnet
  WHY: New user registration flow needs input validation
  WHAT: Validation layer for registration endpoint
  EXACTLY: Create src/validation/registration.ts with email, password,
           and username validators
  SUCCESS CRITERIA: All validation rules from the spec are implemented,
                    tests cover valid and invalid inputs
```

### When to use opus (smart)

Opus is significantly slower and more expensive. Reserve it for tasks where deep reasoning changes the outcome:

- **Architecture design** -- System-level decisions with long-term implications
- **Security analysis** -- Threat modeling, vulnerability assessment
- **Complex debugging** -- Multi-system issues spanning many files
- **Trade-off analysis** -- Evaluating approaches with competing constraints

```
Task:
  type: Architect
  model: opus
  WHY: Migrating from monolith to microservices needs careful boundary design
  WHAT: Service boundary recommendations with data flow analysis
  EXACTLY: Analyze src/ for domain boundaries, propose service split
           with API contracts between services
  SUCCESS CRITERIA: Each proposed service has clear ownership,
                    no circular dependencies, data consistency plan
```

## Run agents in parallel

When multiple tasks have no data dependencies between them, launch them simultaneously in a single message. Serial execution of independent tasks is a failure mode.

**Parallel launch example:**

```
Launch these three agents simultaneously:

Task 1:
  type: Intern, model: haiku
  Research: What authentication libraries does the ecosystem recommend?

Task 2:
  type: Intern, model: haiku
  Research: What are the current rate limiting patterns for this framework?

Task 3:
  type: Intern, model: haiku
  Research: What database migration tools integrate with our ORM?
```

All three agents run concurrently. When all complete, the calling agent synthesizes their findings.

**Dependency rule:** If Task B needs the output of Task A, they must run sequentially. If they do not need each other's output, they run in parallel. There is no middle ground.

:::tip
The Fan-out pattern (3+ parallel agents) combined with Fan-in (synthesize results) is the most common multi-agent workflow. Use haiku for fan-out research, then sonnet or opus for the synthesis.
:::

## Always spotcheck after parallel work

After parallel agents complete, always verify their output before using it. This is the spotcheck pattern:

1. **Launch** parallel agents
2. **Collect** their outputs
3. **Spotcheck** at least one output for accuracy
4. **Synthesize** if spotcheck passes

```
After all three research agents complete:

Spotcheck: Read the output from Task 1 (auth libraries).
Verify that the libraries mentioned actually exist and
the version numbers are current.

If spotcheck passes, synthesize all three into recommendations.
If spotcheck fails, re-run the failing agent with more specific instructions.
```

Spotchecking catches hallucinated package names, outdated version numbers, and fabricated API details. It takes seconds and prevents compounding errors.

## Custom agents vs generic agents

PAI routes agent requests differently based on your phrasing:

| You say | PAI does |
|---------|----------|
| "Use custom agents for this" | Routes to the Agents skill, which invokes ComposeAgent to build trait-based agents |
| "Launch agents to research X" | Spawns generic Intern subagents via the Task tool |
| "Ask Serena to review this" | Routes to the named agent Serena Blackwood (Architect) |
| "Have the engineer implement this" | Spawns an Engineer task subagent |

**When to use custom agents:** When you need a specific combination of expertise, personality, and approach that no named agent covers. Example: "I need a cautious DevOps specialist who favors minimal changes."

**When to use generic agents:** For standard development workflows. The task subagent types (Engineer, Architect, Intern, QATester) cover the vast majority of work.

## Intern vs Engineer

This distinction matters. Using the wrong type wastes either capability or money.

| Attribute | Intern | Engineer |
|-----------|--------|----------|
| **Purpose** | Research, gathering, exploration | Implementation, debugging, building |
| **Default model** | haiku | sonnet |
| **Speed** | Very fast | Moderate |
| **Reasoning depth** | Surface-level, good enough for simple tasks | Deep, handles complex logic |
| **Best at** | "Find all X", "List Y", "Read Z and report" | "Build X", "Fix Y", "Refactor Z" |
| **Cost** | Lowest | Medium |

**Rule of thumb:** If the task is "find information" or "gather data," use an Intern. If the task is "write code" or "make a decision," use an Engineer.

## Agent-specific voice routing

Named agents have fixed voice mappings. When a named agent completes work, the voice notification uses that agent's voice:

| Agent | Voice characteristic |
|-------|---------------------|
| Serena Blackwood | UK Female -- calm, precise |
| Marcus Webb | Male -- direct, efficient |
| Rook Blackburn | UK Male -- measured, skeptical |
| Dev Patel | High-energy -- fast, enthusiastic |
| Ava Sterling | US Female -- methodical, clear |
| Alex Rivera | Multi-perspective -- analytical |

Custom agents receive a voice based on a hash of their trait combination. The same trait combo always produces the same voice, providing consistency across sessions.

Task subagents (generic types like Intern, Engineer) use the default system voice unless they are wrapping a named agent identity.

## Common patterns

| Pattern | Phases | Description |
|---------|--------|-------------|
| **Research then implement** | Parallel haiku Interns, then sonnet Engineer, then sonnet QATester | Gather information first, implement second, verify third |
| **Architecture review** | Opus Architect, then opus Pentester, then sonnet Engineer | Design with deep reasoning, security review, then implement |
| **Parallel implementation** | Parallel sonnet Engineers, then spotcheck and integration test | Split independent work across agents, verify after merge |

## What to read next

- [Agent Types Reference](/developer/agent-types/) -- Complete reference for all agent types, named agents, and custom agents
- [Tools Reference](/developer/tools-reference/) -- CLI tools that agents use during execution
- [The Algorithm](/contributor/the-algorithm/) -- How the Algorithm governs agent selection and execution
