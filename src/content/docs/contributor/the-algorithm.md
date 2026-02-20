---
title: The Algorithm
description: The universal problem-solving loop at the center of PAI — its phases, ISC criteria, response depth, and philosophy.
sidebar:
  order: 12
---

<!-- Source: ~/.claude/skills/PAI/SKILL.md (Algorithm section) -->
<!-- Source: ~/.claude/skills/PAI/SYSTEM/PAISYSTEMARCHITECTURE.md -->
<!-- Source: github.com/danielmiessler/Personal_AI_Infrastructure README -->

The Algorithm is the gravitational center of PAI. Everything else — Skills, Memory, Hooks, Agents, TELOS — exists to serve it. It is a universal cycle for moving from current state to ideal state through verifiable iteration. This page explains why it exists, how it works, and what makes it effective.

## Why the Algorithm exists

The Algorithm exists because of a chain of requirements that each depend on the previous one:

1. **Hill-climbing requires testable criteria.** If you want to iteratively improve toward an ideal outcome, you need a way to measure whether each step moved you closer or further away.
2. **Testable criteria require ISC.** Ideal State Criteria (ISC) are specific, binary-testable conditions that define what "done" looks like. Without them, verification is guesswork.
3. **ISC requires reverse-engineering intent.** You cannot define ideal state criteria without first understanding what the user actually wants — not just what they said, but what they implied and what they do not want.
4. **Verification requires evidence.** Claiming success without proof is not verification. Each criterion must be checked against concrete evidence.
5. **Learning requires capturing misses.** If you do not record what went wrong and what went right, you cannot improve next time.
6. **Nothing escapes the Algorithm.** Depth varies — some tasks need full expansion, some need minimal acknowledgment — but the Algorithm always runs.

This chain leads to a structured process that runs on every response. There is no "skip the Algorithm" path. There is no casual override. The goal of every interaction is a 9-10 rating — what PAI calls "Euphoric Surprise."

## The seven phases

The Algorithm operates as a seven-phase cycle. Each phase has a specific purpose and produces specific outputs.

### Phase 1: OBSERVE (1/7)

**Purpose:** Understand what the user actually needs.

This is where reverse-engineering happens. OBSERVE does not take the user's words at face value. It examines three dimensions:

- **What they asked** — The literal request
- **What they implied** — The unstated needs behind the request
- **What they do NOT want** — Constraints and anti-patterns to avoid

After reverse-engineering, OBSERVE creates ISC (Ideal State Criteria) — the testable conditions that define success. ISC creation happens here, before any work begins, because you need to know what "done" looks like before you start building.

### Phase 2: THINK (2/7)

**Purpose:** Select the right tools and approach for the job.

THINK is where capability selection happens. It evaluates what the task needs and assembles the right combination of skills, agents, and thinking tools.

THINK performs three assessments:

**Thinking tools assessment.** PAI includes meta-cognitive tools — Council (multi-agent debate), RedTeam (adversarial analysis), FirstPrinciples (deconstruct and reconstruct), Science (hypothesis testing), BeCreative (divergent thinking), and Prompting (meta-prompting). For every full-depth request, each tool is evaluated. The system uses a justify-exclusion principle: you must state why you are NOT using a tool, rather than why you are. The burden of proof is on exclusion, which prevents the system from defaulting to familiar patterns and skipping useful analysis.

**Skill validation.** The FormatReminder hook provides draft skill suggestions based on the raw prompt (Pass 1), but THINK validates these against the reverse-engineered request and ISC criteria (Pass 2). Skills can be added, removed, or confirmed based on what OBSERVE uncovered. Pass 2 is authoritative — it overrides Pass 1 based on ISC evidence.

**Capability selection.** The final selection specifies which agent types to use (Engineer, Architect, Researcher, QA, Designer, Security), which composition pattern to follow (Pipeline, TDD Loop, Fan-out, Fan-in, Gate, Escalation, Specialist), and the execution sequence. Every selection is tied to specific ISC criteria with a stated rationale.

### Phase 3: PLAN (3/7)

**Purpose:** Finalize the approach before building.

PLAN takes the outputs from OBSERVE (ISC criteria) and THINK (capabilities and approach) and produces a concrete execution plan. This is where the approach is locked in — what will be built, in what order, using which tools.

### Phase 4: BUILD (4/7)

**Purpose:** Create the artifacts.

BUILD produces the tangible outputs — code, documents, configurations, whatever the task requires. This is where agents do their work, following the plan from Phase 3.

### Phase 5: EXECUTE (5/7)

**Purpose:** Run the work.

EXECUTE puts the built artifacts into action. For code, this means running it. For documents, this means deploying them. For system changes, this means applying them.

When multiple tasks are independent (no data dependencies between them), EXECUTE launches them as concurrent agents in a single step. Serial execution of independent tasks is explicitly identified as a failure mode. The rule from the Algorithm specification: "If tasks don't depend on each other, they run at the same time. Period."

### Phase 6: VERIFY (6/7)

**Purpose:** Check every ISC criterion with evidence.

VERIFY is described as "the culmination" of the Algorithm. This is where each ISC criterion created in OBSERVE is checked against concrete evidence. Not "I think it worked" — actual verification with proof.

ISC criteria are tracked through PAI's task management tools. Each criterion is updated with evidence showing whether it passed or failed. This tracking is the mechanism that enables hill-climbing: you can see exactly which criteria are met and which still need work.

### Phase 7: LEARN (7/7)

**Purpose:** Capture what to improve next time.

LEARN records what went well, what went wrong, and what should be done differently. These learnings flow into the Memory system, where they persist across sessions and inform future interactions.

This is the phase that closes the loop. Without LEARN, PAI would be a static process. With it, the system improves over time. Failures get analyzed, success patterns get reinforced, and the Algorithm itself evolves based on accumulated evidence.

## ISC: Ideal State Criteria

ISC criteria are the verification mechanism that makes the Algorithm work. They are the testable conditions that define what success looks like for a given task.

### Requirements

Every ISC criterion must meet four requirements:

| Requirement | Good example | Bad example |
|-------------|-------------|-------------|
| **8 words exactly** | "No credentials exposed in git commit history" | "Make sure nothing secret is in the git history" |
| **State, not action** | "Tests pass with zero failures" | "Run the tests" |
| **Binary testable** | Can be answered YES/NO in 2 seconds | Requires judgment or interpretation |
| **Granular** | One concern per criterion | Multiple concerns bundled together |

The 8-word constraint is deliberate. It forces precision. You cannot be vague in 8 words. You cannot hide ambiguity. Each criterion must capture exactly one testable condition.

### How ISC drives the Algorithm

ISC criteria serve multiple purposes in the Algorithm:

1. **In OBSERVE:** They are created based on reverse-engineered intent. This is where you define what "done" means.
2. **In THINK:** They drive capability selection. The question is "what skills and agents do I need to satisfy these specific criteria?"
3. **In PLAN:** They structure the execution plan. Each plan step maps to one or more ISC criteria.
4. **In VERIFY:** They are the checklist. Each criterion is checked with evidence and marked passed or failed.
5. **In LEARN:** Failed criteria become learning opportunities. What went wrong? What should change?

ISC is what makes PAI a hill-climbing system rather than a one-shot tool. You define the ideal state, verify against it, and iterate until you reach it.

## Response depth levels

Not every interaction needs the full seven-phase expansion. PAI uses three depth levels to match effort to the situation.

### FULL depth

**When:** Any non-trivial work — problem-solving, implementation, design, analysis, thinking.

**Format:** All 7 phases with ISC criteria, capability selection, execution, and verification.

FULL is the default. Most interactions run at FULL depth. Short prompts can demand FULL depth — a brief question about architecture is still non-trivial work. The word "just" does not reduce depth.

### ITERATION depth

**When:** Continuing or adjusting existing work in progress.

**Format:** Condensed — what changed plus verification.

```
ITERATION on: [existing task context]

CHANGE: [What is different]
VERIFY: [Evidence it worked]
```

ITERATION is for back-and-forth refinement. You have already run a FULL cycle, and now you are making adjustments. The ISC criteria from the original FULL cycle still apply; ITERATION checks the changed criteria.

### MINIMAL depth

**When:** Pure social interaction with zero task content — greetings, ratings (1-10 scores), acknowledgments.

**Format:** Header, summary, and voice output only.

MINIMAL is rare. It applies only when there is genuinely zero task content. A greeting is MINIMAL. A question that sounds casual but has real substance is not.

### How depth is classified

Depth classification is handled by the FormatReminder hook, which runs AI inference on the incoming message. The hook does not use keyword matching or message length heuristics — it uses a language model to assess the actual effort required.

The hook's classification is authoritative. The Algorithm does not override it with its own judgment. This prevents the common failure mode of treating short or casual-sounding prompts as low-effort when they actually require deep analysis.

## Two-pass capability selection

Capability selection uses two passes with different inputs:

### Pass 1: Hook hints

Before the Algorithm starts, the FormatReminder hook runs on the raw prompt and suggests capabilities (agent types), skills (specific skill and workflow pairs), and thinking tools. These are draft suggestions based only on the raw prompt — the hook fires before any reverse-engineering or ISC creation.

### Pass 2: THINK validation

After OBSERVE completes, the THINK phase has full context — the reverse-engineered intent AND the ISC criteria. It validates the hook's suggestions, adding skills the hook missed, removing skills that do not serve ISC, and making the final capability selection.

**Why two passes?** The hook gives a head start. But OBSERVE changes the picture. Reverse-engineering might reveal the request is actually about architecture (needing an Architect agent), or has multiple valid approaches (needing Council debate), or rests on questionable assumptions (needing FirstPrinciples analysis). Pass 2 catches what Pass 1 cannot see.

## The justify-exclusion principle

PAI's thinking tools — Council, RedTeam, FirstPrinciples, Science, BeCreative, Prompting — follow an opt-OUT model, not opt-IN. For every FULL depth request, each thinking tool must be evaluated, and exclusion must be justified.

This design inverts the default behavior of most AI systems, which tend to reach for familiar patterns (typically just "implement it") and skip metacognitive analysis. By requiring a stated reason for exclusion, the system ensures that valuable analysis does not get skipped out of habit.

**Valid exclusion reasons:**

- "Single clear approach" — Only one reasonable way to do this
- "No claims to stress-test" — Straightforward implementation, not a proposal
- "Clear requirements" — No ambiguity requiring creative exploration
- "Not iterative" — One-shot task, not experimental

**Invalid exclusion reasons** (the system explicitly flags these):

- "Too simple" — Simple tasks can have hidden assumptions (FirstPrinciples may help)
- "Already know the answer" — Confidence without verification is a failure mode (RedTeam may help)
- "Would take too long" — Latency is not a valid reason to skip quality

## Parallel execution

When the BUILD/EXECUTE phases contain multiple independent tasks — tasks with no data dependencies between them — they must run concurrently. The Algorithm specification is explicit: serial execution of independent tasks is a failure mode.

The dependency analysis classifies each task:

| Classification | Definition | Action |
|----------------|-----------|--------|
| **Independent** | No input from other tasks needed | Launch in parallel |
| **Dependent** | Requires output from another task | Wait for dependency |

When three or more independent workstreams exist, the Fan-out pattern is used automatically. Examples of parallel work: editing multiple independent files, researching different topics, running audits on independent systems. Examples of serial work: read then edit then verify (each step depends on the previous), sequential git operations, data pipelines.

## The philosophy: nothing escapes the Algorithm

The most important thing to understand about the Algorithm is its universality. It is not an optional framework that you can choose to skip for simple tasks. It runs on every response. The depth varies — FULL, ITERATION, or MINIMAL — but the Algorithm itself always executes.

This universality serves a purpose. The Algorithm is how PAI maintains quality. Without it, responses degrade to the default behavior of the underlying language model — competent, but not structured, not verified, not learning. The Algorithm adds the structure that turns competent responses into verified, improving ones.

The Algorithm also enables self-improvement. Because every interaction follows the same structure, the system can analyze its own performance across interactions. Which phases produce the most value? Which ISC criteria tend to fail? Which capability selections lead to the best outcomes? The structured format makes these questions answerable.

From the Algorithm specification:

> A system that cannot improve itself will stagnate. The Algorithm is the core; everything else feeds it.

## Execution tiers (future direction)

The current implementation runs the Algorithm as a single pass (Tier 1). The system defines a conceptual framework for future recursive execution:

| Tier | Name | Description |
|------|------|-------------|
| 0 | Minimal | Greetings, ratings — no ISC needed |
| 1 | Standard | Single Algorithm pass with 1-8 ISC criteria |
| 2 | Decomposed | Subtasks spawn their own Algorithm cycles with independent ISC |
| 3 | Orchestrated | Sub-algorithms with dependency graphs and parallel execution |

Escalation signals from Tier 1 to Tier 2 include: a single ISC criterion requiring three or more distinct steps, multiple criteria requiring different domain expertise, or independently verifiable workstreams discovered during planning.

<!-- Note: Tiers 2 and 3 are documented as conceptual in v0.2.25. Standard (Tier 1) is the current implementation. -->

## Version history

The Algorithm has evolved through several versions. Key milestones:

| Version | Date | Key changes |
|---------|------|-------------|
| v0.2.22 | 2026-01-28 | "Nothing Escapes" reframe, AI-powered depth detection, capability selection block, composition patterns |
| v0.2.23 | 2026-01-28 | Two-pass capability selection, thinking tools assessment with justify-exclusion, skill check in THINK |
| v0.2.24 | 2026-01-29 | Mandatory AskUserQuestion for all questions directed at the user |
| v0.2.25 | 2026-01-30 | Parallel-by-default execution, fan-out as default for independent workstreams |

The Algorithm is versioned and tracked like software because it is treated as software. Each change is documented with rationale, and the system learns from its own evolution.

## What to read next

- [Architecture](/contributor/architecture/) — How the Algorithm fits into the broader PAI system
- [What is PAI?](/user/what-is-pai/) — The philosophy and motivation behind PAI
