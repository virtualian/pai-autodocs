---
title: Architecture
description: How PAI's components fit together — the primitives, data flow, extensibility model, and design philosophy.
diataxis_type: explanation
---

<!-- Source: ~/.claude/skills/PAI/SYSTEM/PAISYSTEMARCHITECTURE.md -->
<!-- Source: github.com/danielmiessler/Personal_AI_Infrastructure README -->
<!-- Source: ~/.claude/skills/PAI/SKILL.md (Algorithm section) -->

PAI is not a monolithic application. It is a set of interconnected primitives — each doing one thing well — that compose into a personal AI system. This page explains how those primitives relate to each other, how data flows through the system, and why the architecture is designed the way it is.

## High-level overview

At the highest level, PAI has four layers:

```
+--------------------------------------------------+
|                   The Algorithm                   |  <-- The outer loop that governs everything
+--------------------------------------------------+
|  Skills  |  Agents  |  Hooks  |  Memory  | TELOS |  <-- Core primitives
+--------------------------------------------------+
|              Claude Code Runtime                  |  <-- Execution engine
+--------------------------------------------------+
|         CLI Tools / TypeScript / Bash             |  <-- Deterministic infrastructure
+--------------------------------------------------+
```

**The Algorithm** sits at the top. It is the universal problem-solving loop (Observe, Think, Plan, Build, Execute, Verify, Learn) that governs how every task is processed. Everything else exists to serve it.

**The core primitives** — Skills, Agents, Hooks, Memory, and TELOS — are the building blocks. They provide capabilities, personality, event handling, persistence, and goal context respectively.

**Claude Code** is the runtime engine. PAI is built natively on Claude Code and uses its hook system, context management, and agentic capabilities.

**Deterministic infrastructure** is the bottom layer. CLI tools written in TypeScript and Bash handle the work that should never be left to probabilistic AI — parsing, transforming, formatting, file operations.

## Core primitives

### The Algorithm

The Algorithm is the gravitational center of PAI. It is a universal cycle for moving from current state to ideal state through verifiable iteration. Every response, every task, every interaction passes through the Algorithm. The only variable is depth — how many criteria, how many phases are expanded, how deep the verification goes.

The Algorithm is covered in full detail in [The Algorithm](/contributor/the-algorithm/).

### Skills

Skills are the organizational unit for all domain expertise. A skill is a self-contained directory that packages everything needed for a specific domain — context, workflows, and CLI tools.

**Canonical skill structure:**

```
skills/Skillname/
├── SKILL.md              # Main skill file (REQUIRED)
├── Tools/                # CLI tools for automation
│   ├── ToolName.ts       # TypeScript CLI tool
│   └── ToolName.help.md  # Tool documentation
└── Workflows/            # Operational procedures (optional)
    └── WorkflowName.md   # TitleCase naming
```

The `SKILL.md` file is the entry point. It contains a frontmatter description with `USE WHEN` triggers that Claude Code parses for automatic skill matching. When you ask PAI something, it matches your request against skill descriptions and activates the right one.

**Key properties of skills:**

- **Self-activating:** They trigger automatically based on what you ask for. You do not need to explicitly invoke them.
- **Self-contained:** All context, workflows, and assets are packaged together.
- **Composable:** Skills can call other skills and spawn agents.
- **Evolvable:** Easy to add, modify, or deprecate.

Skills follow a naming convention: `TitleCase` names are system skills (shareable), while `_ALLCAPS` names are personal skills (never share).

### Agents

PAI uses a hybrid agent model with two types:

**Named agents** have persistent identities with backstories and fixed voice mappings. These are specialized personas — an Engineer, an Architect, a Security Pentester, a Designer — each with calibrated personality traits like humor level, precision, and directness. Personality is not decoration in PAI; it is functional. Different work benefits from different approaches.

**Dynamic agents** are task-specific compositions created on the fly via ComposeAgent. These are assembled from traits as needed and do not persist between sessions.

Agents compose using named patterns:

| Pattern | Shape | When to use |
|---------|-------|-------------|
| **Pipeline** | A then B then C | Sequential domain handoff (Explore, then Architect, then Engineer) |
| **TDD Loop** | A and B iterate | Build-verify cycle until criteria pass |
| **Fan-out** | A, B, and C in parallel | Multiple perspectives needed on the same problem |
| **Fan-in** | Results from A, B, C merge into D | Synthesizing parallel research |
| **Gate** | A then check then B or retry | Quality gate before progression |
| **Escalation** | Upgrade model tier on failure | When complexity exceeds current capability |
| **Specialist** | Single agent, deep focus | One domain requiring deep expertise |

### Hooks

Hooks respond to lifecycle events in the Claude Code session. They are the nervous system of PAI — detecting events and triggering responses at specific moments.

**Hook lifecycle:**

```
Session Start  -->  Load context, initialize state
     |
Tool Use       -->  Logging, validation, security checks
     |
Session Stop   -->  Capture session summary, persist memory
```

Hooks are configured in `settings.json` and can fire at multiple event types. PAI uses hooks for:

- **Context loading:** Loading the right skills and memory at session start
- **Security validation:** Checking commands before execution, blocking dangerous operations
- **Signal capture:** Detecting sentiment, ratings, and behavioural patterns from user messages
- **Voice notifications:** Speaking task completions and summaries aloud
- **Session persistence:** Capturing summaries and learnings at session end

There are 7 event types in the hook system, and PAI ships with 21 production hooks.

### Memory

Memory is what makes PAI's intelligence compound over time. Without memory, every session starts from zero. PAI's memory system captures and organizes everything worth knowing.

**Memory directory structure:**

```
MEMORY/
├── WORK/               # Primary work tracking (PRD.md per task)
├── LEARNING/           # Learnings organized by domain
│   ├── SYSTEM/         # System-level learnings
│   └── ALGORITHM/      # Algorithm-specific learnings
├── SIGNALS/            # Ratings and feedback (ratings.jsonl)
├── RESEARCH/           # Agent output captures
├── RELATIONSHIP/       # Relationship context and observations
├── STATE/              # Runtime state (work.json, events.jsonl, session-names.json)
└── PAISYSTEMUPDATES/   # System change documentation
```

Claude Code's native `projects/` directory is the source of truth for project context. The `MEMORY/` directory organises derived state — work tracking, learnings, signals, and runtime state. The `LEARNING/` directory is particularly important: it stores evidence organised by domain, allowing the system to improve its own processes based on accumulated experience.

Memory files follow a naming convention: `YYYY-MM-DD-HHMMSS_[TYPE]_[description].md`.

### TELOS

TELOS is PAI's deep goal understanding system. It consists of 10 files that capture who you are:

| File | Purpose |
|------|---------|
| `MISSION.md` | Your core mission and purpose |
| `GOALS.md` | What you are working toward |
| `PROJECTS.md` | Active projects and their status |
| `BELIEFS.md` | Core beliefs and values |
| `MODELS.md` | Mental models you use |
| `STRATEGIES.md` | Approaches and strategies |
| `NARRATIVES.md` | Stories that guide your thinking |
| `LEARNED.md` | Key learnings and insights |
| `CHALLENGES.md` | Current challenges and obstacles |
| `IDEAS.md` | Ideas being explored |

Your AI knows what you are working toward because it is all documented. TELOS context informs every interaction — it is the reason PAI can be goal-oriented rather than just task-oriented.

## How data flows through the system

Here is the typical flow for a user request:

```
1. User sends a message
       |
2. HOOKS fire (UserPromptSubmit)
   - Capture ratings and sentiment (RatingCapture)
   - Update terminal tab title (UpdateTabTitle)
   - Auto-name session (SessionAutoName)
       |
3. THE ALGORITHM begins (if task warrants it)
   - OBSERVE: Reverse-engineer intent, classify effort tier, create ISC criteria
   - THINK: Pressure-test criteria, identify risks
   - PLAN: Finalise approach (Advanced+ effort: written plan in PRD)
   - BUILD/EXECUTE: Invoke capabilities, tick off ISC criteria in PRD
   - VERIFY: Check each ISC criterion with evidence
   - LEARN: Capture reflections to algorithm-reflections.jsonl
       |
4. HOOKS fire (Stop)
   - Cache response for next rating capture (LastResponseCache)
   - Reset terminal tab state (ResponseTabReset)
   - Voice notification (VoiceCompletion)
   - Cross-reference integrity check (DocIntegrity)
   - Algorithm progress in tab (AlgorithmTab)
       |
5. Response delivered to user
       |
6. On session end, HOOKS fire (SessionEnd)
   - Capture work and learning to MEMORY/ (WorkCompletionLearning)
   - Mark PRD complete, clear state (SessionCleanup)
   - Capture relationship context (RelationshipMemory)
   - Update system counts (UpdateCounts)
   - Run integrity checks (IntegrityCheck)
```

The critical insight is that hooks and the Algorithm work together. Hooks handle the lifecycle plumbing — loading context, capturing signals, persisting state. The Algorithm handles the intellectual work — understanding intent, selecting capabilities, verifying output.

## The SYSTEM/USER extensibility model

PAI uses a two-tier design that separates infrastructure from customization. This is one of the most important architectural decisions in the system.

```
~/.claude/
├── skills/
│   └── PAI/
│       ├── SYSTEM/           # PAI infrastructure (read-only for users)
│       │   ├── PAISYSTEMARCHITECTURE.md
│       │   ├── MEMORYSYSTEM.md
│       │   ├── SKILLSYSTEM.md
│       │   ├── THEHOOKSYSTEM.md
│       │   ├── PAIAGENTSYSTEM.md
│       │   └── ...
│       │
│       └── USER/             # Your customizations (yours to modify)
│           ├── ARCHITECTURE.md
│           ├── AISTEERINGRULES.md
│           ├── TELOS/
│           ├── PROJECTS/
│           └── ...
```

**SYSTEM files** define the generic architecture patterns — how skills work, how hooks fire, how memory is organized. These are the foundational patterns that apply to all PAI implementations. They are maintained by the PAI project and updated through releases.

**USER files** contain your personal customizations — your identity, your preferences, your goals, your projects, your contacts. When PAI upgrades, your USER files are untouched.

This separation provides several benefits:

- **Upgrade safety:** PAI releases can update SYSTEM files without touching your personal data.
- **Portable identity:** Your USER directory is your AI identity. It can move between installations.
- **Clear boundaries:** You always know what is yours (USER) and what is infrastructure (SYSTEM).
- **Layered configuration:** SYSTEM defines defaults; USER extends or overrides them. For example, both SYSTEM and USER have `AISTEERINGRULES.md` files. SYSTEM loads first, then USER extends. Conflicts resolve in USER's favor.

### Security boundaries

The two-tier model also provides security separation:

```
PRIVATE: ~/.claude/                    PUBLIC: ${PROJECTS_DIR}/PAI/
├── Personal data                      ├── Sanitized examples
├── API keys (.env)                    ├── Generic templates
├── Session history                    └── Community sharing
└── NEVER MAKE PUBLIC                  └── ALWAYS SANITIZE
```

Within the private directory, certain subdirectories have additional protection:

| Directory | Contains | Protection |
|-----------|----------|------------|
| `skills/PAI/USER/` | Personal data, finances, health, contacts | RESTRICTED |
| `skills/PAI/WORK/` | Customer data, consulting, client deliverables | RESTRICTED |

Content from USER/ and WORK/ must never appear outside of them or in the public PAI repository.

## CLI-first philosophy

PAI follows a strict design hierarchy for how features should be implemented:

```
Goal --> Code --> CLI --> Prompts --> Agents
```

Each layer builds on the previous. The philosophy is:

1. **Clarify the goal** — Understand what you are trying to accomplish.
2. **Write deterministic code** — If you can solve it with a TypeScript function or a Bash script, do that. Code is cheaper, faster, and more reliable than prompts.
3. **Wrap as a CLI tool** — Every operation should be accessible from the command line. CLI provides discoverability (`--help`), scriptability, testability, and transparency.
4. **Add AI prompting** — Use prompts to orchestrate the code, not to replicate what code can do.
5. **Deploy as agents** — Agents compose the lower layers into higher-level capabilities.

This hierarchy ensures that the deterministic parts of the system are handled deterministically. AI is probabilistic; your infrastructure should not be. You want the same input to produce the same output, every time.

Every skill's `Tools/` directory contains CLI tools written in TypeScript. These tools handle the work that should be deterministic — file operations, data transformation, API calls — while AI handles the work that requires judgment — understanding intent, making decisions, producing creative output.

## The 16 founding principles

The architecture is governed by 16 principles that guide every design decision. These are documented in `SYSTEM/PAISYSTEMARCHITECTURE.md` and shape the entire system:

| # | Principle | Architectural impact |
|---|-----------|---------------------|
| 1 | **User Centricity** | TELOS system, goal-oriented task execution |
| 2 | **The Foundational Algorithm** | Algorithm as the universal outer loop |
| 3 | **Clear Thinking First** | Reverse-engineering in OBSERVE phase |
| 4 | **Scaffolding > Model** | Architecture-first design, model-agnostic patterns |
| 5 | **As Deterministic as Possible** | Code before prompts, CLI tools, templates |
| 6 | **Code Before Prompts** | TypeScript CLI tools in every skill |
| 7 | **Spec / Test / Evals First** | ISC criteria before implementation |
| 8 | **UNIX Philosophy** | One skill per domain, composable tools, text interfaces |
| 9 | **ENG / SRE Principles** | Version control, monitoring, graceful degradation |
| 10 | **CLI as Interface** | Every operation accessible via command line |
| 11 | **Goal, Code, CLI, Prompts, Agents** | The development pipeline hierarchy |
| 12 | **Skill Management** | Self-activating, self-contained skill modules |
| 13 | **Memory System** | Automatic capture, three-tier architecture |
| 14 | **Agent Personalities** | Functional personality with voice identity |
| 15 | **Science as Meta-Loop** | Hypothesis, experiment, measure, iterate |
| 16 | **Permission to Fail** | Explicit permission to say "I don't know" |

## Notification and voice systems

PAI includes notification and voice systems that keep you informed without blocking your workflow.

**Notification channels:**

| Channel | Purpose |
|---------|---------|
| Voice (ElevenLabs TTS) | Primary spoken feedback — task completions, summaries |
| Push (ntfy) | Mobile notifications for away-from-desk alerts |
| Discord | Team and server alerts |
| Desktop | Native OS notifications |

Notifications follow three design principles: fire-and-forget (never block execution), fail gracefully (missing services do not cause errors), and duration-aware (escalate for long-running tasks).

The voice system uses ElevenLabs text-to-speech with prosody enhancement for natural-sounding speech. Each named agent has its own voice mapping, making it audible which agent is speaking.

## Self-management

PAI manages its own integrity, security, and documentation through a dedicated System skill. This includes:

- **Integrity audits:** 16 parallel agents verify broken references across the installation
- **Secret scanning:** TruffleHog credential detection before commits
- **Privacy validation:** Ensures restricted content stays within its boundaries
- **Cross-repo validation:** Verifies private/public repository separation
- **Documentation updates:** Records system changes to memory

The system can update its own documentation, modify skill files, create new tools, and deploy changes to itself. This self-management capability is what enables PAI to be a continuously upgrading system rather than a static tool.

## What to read next

- [The Algorithm](/contributor/the-algorithm/) — Deep dive into the universal problem-solving loop
- [What is PAI?](/user/what-is-pai/) — The philosophy and motivation behind PAI
