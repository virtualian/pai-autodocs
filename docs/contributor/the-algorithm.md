---
title: The Algorithm
description: The universal problem-solving loop at the center of PAI — its design philosophy, key mechanisms, and why it works the way it does.
diataxis_type: explanation
---

<!-- Source: ~/.claude/PAI/Algorithm/v3.7.0.md -->
<!-- Source: ~/.claude/PAI/PAISYSTEMARCHITECTURE.md -->

For the complete Algorithm specification, see the [Algorithm Reference](/developer/algorithm/). This page explains the design decisions behind that specification.

# The Algorithm

The Algorithm is the gravitational center of PAI. Everything else — Skills, Memory, Hooks, Agents, TELOS — exists to serve it. It is a universal cycle for moving from current state to ideal state through verifiable iteration.

## Why the Algorithm exists

The Algorithm exists because of a chain of requirements that each depend on the previous one:

1. **Hill-climbing requires testable criteria.** If you want to iteratively improve toward an ideal outcome, you need a way to measure whether each step moved you closer or further away.
2. **Testable criteria require ISC.** Ideal State Criteria (ISC) are specific, binary-testable conditions that define what "done" looks like. Without them, verification is guesswork.
3. **ISC requires reverse-engineering intent.** You cannot define ideal state criteria without first understanding what the user actually wants — not just what they said, but what they implied and what they do not want.
4. **Verification requires evidence.** Claiming success without proof is not verification. Each criterion must be checked against concrete evidence.
5. **Learning requires capturing misses.** If you do not record what went wrong and what went right, you cannot improve next time.
6. **Nothing escapes the Algorithm.** Depth varies — some tasks need full expansion, some need minimal acknowledgment — but the Algorithm always runs.

This chain leads to a structured process that runs on every response. The goal of every interaction is a 9-10 rating — what PAI calls "Euphoric Surprise."

## The seven phases

The Algorithm operates as a seven-phase cycle: OBSERVE, THINK, PLAN, BUILD, EXECUTE, VERIFY, LEARN. Each phase has a specific purpose.

**OBSERVE** reverse-engineers the user's request across three dimensions: what they asked, what they implied, and what they do not want. It then creates ISC criteria — the testable conditions that define success — and selects which capabilities (skills, agents, thinking tools) to deploy.

**THINK** pressure-tests the ISC by identifying riskiest assumptions, running a premortem (ways the approach could fail), and refining criteria through the Splitting Test. This is where weak criteria get decomposed into atomic, verifiable items.

**PLAN** finalises the approach. For complex tasks (Advanced+ effort), this produces a written plan in the PRD.

**BUILD** prepares artifacts and invokes selected capabilities via tool calls.

**EXECUTE** performs the work. As each criterion is satisfied, the PRD is updated immediately — checkboxes are ticked and the progress counter advances in real time.

**VERIFY** checks every ISC criterion against concrete evidence. This is described as "the culmination" of the Algorithm. It also confirms that every selected capability was actually invoked via tool call.

**LEARN** captures reflections: what should have been done differently, what a smarter algorithm would have done, what capabilities were underused. These reflections are written to `algorithm-reflections.jsonl` and feed future Algorithm upgrades.

## Why five effort tiers

Early versions of the Algorithm used three depth levels (FULL, ITERATION, MINIMAL). The current v3.7.0 uses five effort tiers: Standard, Extended, Advanced, Deep, and Comprehensive. Each tier specifies a time budget, an ISC count range, and a minimum number of capabilities to invoke.

The five-tier system exists because three levels were too coarse. A quick bug fix and a sprawling multi-file refactor both fell into "FULL" despite requiring fundamentally different investment. The five tiers provide proportional effort:

| Tier | Budget | ISC Range | What it's for |
|------|--------|-----------|---------------|
| Standard | <2 min | 8-16 | Normal requests |
| Extended | <8 min | 16-32 | Extraordinary quality needed |
| Advanced | <16 min | 24-48 | Substantial multi-file work |
| Deep | <32 min | 40-80 | Complex design |
| Comprehensive | <120 min | 64-150 | No time pressure, maximum depth |

The ISC count ranges are not arbitrary. They emerged from analysis of production PRDs that showed low-ISC runs consistently received lower ratings. Fat criteria ("all tests pass") hide failures. Atomic criteria ("login test passes", "signup test passes", "reset test passes") make each pass/fail visible.

## Why PRD is the system of record

The Algorithm manages ISC criteria through markdown checkboxes in a PRD.md file, written directly by the AI using Write/Edit tools. This design choice has specific rationale.

**Why not a database or JSON file?** Markdown is human-readable, git-trackable, and editable with standard tools. A developer can read a PRD and immediately understand the task's state without parsing a data format.

**Why does the AI write it directly?** Early versions used hooks to manage work state, creating indirection where the AI would signal intent and a hook would update state. This caused synchronisation failures — the AI thought it had updated state when the hook hadn't fired. Making the AI the sole writer eliminates this class of bugs.

**Why checkboxes?** `- [ ]` and `- [x]` are the simplest possible state machine: pending or done. They render visually in any markdown viewer, they're greppable, and they require zero parsing logic.

## The ISC Count Gate

The ISC Count Gate is a mandatory check at the end of OBSERVE. The AI cannot proceed to THINK unless its ISC count meets the minimum for its effort tier (Standard: 8, Extended: 16, Advanced: 24, Deep: 40, Comprehensive: 64).

This gate exists because of empirical evidence: analysis of 50 production PRDs showed that Extended-tier runs never hit the 16-criterion minimum, and one Deep-tier run had only 11 criteria against a 40-80 target. The criteria were compound — each hiding multiple verifiable sub-requirements. The gate forces decomposition before work begins.

## The Splitting Test

The Splitting Test is applied to every ISC criterion before finalising. It has four sub-tests:

1. **"And" / "With" test** — If a criterion joins two verifiable things with "and" or "with", split it
2. **Independent failure test** — If part A can pass while part B fails, they are separate criteria
3. **Scope word test** — "All", "every", "complete" must be enumerated. "All tests pass" for 4 test files becomes 4 criteria
4. **Domain boundary test** — Criteria crossing UI/API/data/logic boundaries split into one per boundary

The Splitting Test is what makes ISC atomic. Without it, criteria naturally drift toward vague summaries ("page looks correct") that cannot be meaningfully verified.

## Capability invocation obligation

When the Algorithm selects a capability in OBSERVE, that selection creates a binding commitment to invoke it via tool call in BUILD or EXECUTE. Writing text that resembles what a capability would produce does not count as invocation.

This rule exists because early Algorithm runs would list capabilities in OBSERVE, then "implement" them by writing similar-looking output without actually calling the tool. The result looked correct but lacked the quality that comes from a specialised agent's actual execution. The invocation obligation closes this loophole.

## Context compaction

At Extended+ effort, the Algorithm must self-summarise at each phase boundary if accumulated context exceeds ~60% of working context. This preserves ISC status, key results, and next actions while discarding verbose tool output, intermediate reasoning, and raw search results.

Context compaction exists because of "context rot" — degraded output quality from bloated conversation history. Long Algorithm runs accumulate massive tool outputs, and late-phase work (VERIFY, LEARN) suffers when the model's attention is split across thousands of tokens of irrelevant intermediate results. Compaction keeps the working context focused on what matters.

## Self-improvement through LEARN

The LEARN phase closes the loop. After every Algorithm run, four reflection questions are answered and written to `algorithm-reflections.jsonl`:

1. What should I have done differently in executing the Algorithm?
2. What would a smarter algorithm have done instead?
3. What capabilities should I have used that I did not?
4. What would a better algorithm design look like for this task?

These reflections feed into periodic Algorithm upgrades. The MineReflections and AlgorithmUpgrade workflows aggregate patterns across many reflections, identify recurring failures, and propose changes to the Algorithm specification itself.

This is how the Algorithm evolves. It is not a static specification — it is a continuously improving system that learns from its own execution. The transition from v0.2.x (three depth levels, TaskCreate-based ISC) to v3.7.0 (five effort tiers, PRD-based ISC, Splitting Test, Count Gate) was driven by exactly this kind of evidence-based iteration.

## What to read next

- **[Algorithm Reference](/developer/algorithm/)** — The complete v3.7.0 specification with exact formats and rules
- **[System Architecture](/contributor/architecture/)** — How the Algorithm fits into the broader PAI system
- **[Memory and Learning](/contributor/memory-and-learning/)** — How reflections and learnings are stored and used
