---
title: "The 16 Founding Principles"
description: "The constitutional principles that govern every PAI design decision, with rationale and examples."
diataxis_type: reference
---

<!-- Source: PAI System Architecture, PAISYSTEMARCHITECTURE.md -->

# The 16 Founding Principles

Every design decision in PAI traces back to one or more of these 16 principles. They are constitutional — they do not change between releases and they override ad-hoc preferences.

## Summary

| # | Principle | Core idea |
|---|-----------|-----------|
| 1 | User Centricity | Everything exists to serve the user's goals |
| 2 | The Foundational Algorithm | Universal outer loop for every task |
| 3 | Clear Thinking First | Understand before executing |
| 4 | Scaffolding > Model | Architecture-first, model-agnostic |
| 5 | As Deterministic as Possible | What can be deterministic should be |
| 6 | Code Before Prompts | Deterministic ops never left to AI |
| 7 | Spec / Test / Evals First | Define "done" before starting |
| 8 | UNIX Philosophy | Small, focused, composable |
| 9 | ENG / SRE Principles | Production-grade infrastructure |
| 10 | CLI as Interface | Every operation via command line |
| 11 | Goal, Code, CLI, Prompts, Agents | Development pipeline hierarchy |
| 12 | Skill Management | Self-activating, self-contained modules |
| 13 | Memory System | Intelligence compounds over time |
| 14 | Agent Personalities | Personality serves function |
| 15 | Science as Meta-Loop | Improve through measurement |
| 16 | Permission to Fail | Honesty about limitations |

---

## Principle 1: User Centricity

**Statement:** The TELOS system drives goal-oriented task execution. Everything in PAI exists to serve the user's goals — not the system's convenience, not the model's preferences.

**Architectural impact:** PAI maintains a persistent TELOS file capturing the user's long-term goals, current priorities, and preferences. Every skill activation checks relevance against these goals. The system adapts to the user, not the other way around.

**Example:** When a user asks PAI to draft an email, PAI checks TELOS to understand the user's communication style preferences, current projects, and relationship context — producing output aligned with the user's actual goals, not generic "helpful assistant" output.

**Violation example:** A system that optimizes for engagement metrics (longer conversations, more tool calls) rather than getting the user's task done efficiently.

---

## Principle 2: The Foundational Algorithm

**Statement:** The Algorithm is the universal outer loop. Every task passes through Observe-Think-Plan-Build-Execute-Verify-Learn, regardless of complexity.

**Architectural impact:** The Algorithm is versioned independently (e.g., v3.7.0) and loaded as a discrete file. It provides a consistent processing pipeline that prevents ad-hoc reasoning and ensures every task gets proper analysis before action.

**Example:** Even a simple "rename this file" request passes through OBSERVE (what file, what name), THINK (any conflicts?), PLAN (the rename command), BUILD (not needed), EXECUTE (run it), VERIFY (confirm the rename), LEARN (nothing to capture).

**Violation example:** Jumping straight to execution without observing context — renaming a file without checking whether other files reference it.

---

## Principle 3: Clear Thinking First

**Statement:** Reverse-engineer intent in the OBSERVE phase before acting. Understand the problem fully before executing any solution.

**Architectural impact:** The OBSERVE phase of the Algorithm is mandatory and cannot be skipped. It forces decomposition of ambiguous requests into concrete, actionable understanding before any planning begins.

**Example:** When a user says "fix the tests," OBSERVE identifies which tests are failing, what the failures look like, and what changed recently — rather than immediately running a test suite and guessing at fixes.

**Violation example:** A user says "make it faster" and the system immediately starts caching everything, without first measuring what is actually slow.

---

## Principle 4: Scaffolding > Model

**Statement:** Architecture-first design with model-agnostic patterns. The system should work regardless of which AI model powers it.

**Architectural impact:** PAI's value lives in its file structure, skill definitions, memory system, and tooling — not in prompt engineering for a specific model. Switching from one model to another should require no structural changes.

**Example:** Skills are defined as markdown files with structured frontmatter and TypeScript CLI tools. These work identically whether the underlying model is Claude, GPT, or a local model.

**Violation example:** A skill that relies on a specific model's unique function-calling format, breaking when the model is swapped.

---

## Principle 5: As Deterministic as Possible

**Statement:** What can be deterministic should be deterministic. Code before prompts, templates before generation, CLI tools before AI reasoning.

**Architectural impact:** Every skill includes TypeScript CLI tools for operations that have predictable inputs and outputs. File operations, API calls, data formatting — these are code, not prompts. AI handles only the parts that genuinely require reasoning.

**Example:** A skill that manages bookmarks uses a CLI tool to read/write the bookmarks file (deterministic) and AI only for categorizing or summarizing the bookmarked content (requires reasoning).

**Violation example:** Asking the AI to "write the current date to a file" via a prompt, when a CLI tool can do it with zero ambiguity.

---

## Principle 6: Code Before Prompts

**Statement:** TypeScript CLI tools in every skill. Deterministic operations should never be left to probabilistic AI.

**Architectural impact:** Every skill's `Tools/` directory contains TypeScript files that handle concrete operations. These tools are compiled, testable, and predictable. The AI orchestrates tool calls but does not replicate what the tools do.

**Example:** A `SearchNotes` tool is a TypeScript CLI that greps the notes directory, returning structured results. The AI interprets the results but never performs the search itself.

**Violation example:** Prompting the AI to "look through all files in the notes directory and find ones mentioning project X" instead of calling a search tool.

---

## Principle 7: Spec / Test / Evals First

**Statement:** Define ISC (Intent, Success Criteria) before implementation. Know what "done" looks like before starting work.

**Architectural impact:** The Algorithm's PLAN phase requires explicit success criteria before BUILD begins. Skills include evaluation criteria in their definitions. Changes are validated against these criteria in the VERIFY phase.

**Example:** Before building a new email-drafting feature, the spec defines: "Given a topic and recipients, produce a draft that matches the user's voice, is under 200 words, and includes all action items from the conversation."

**Violation example:** Building a feature, then retroactively deciding what it should have done — leading to scope creep and untested edge cases.

---

## Principle 8: UNIX Philosophy

**Statement:** One skill per domain, composable tools, text interfaces. Small, focused components that compose into complex behavior.

**Architectural impact:** Each skill owns exactly one domain. Skills communicate through text — markdown files, CLI output, structured data. Complex workflows compose multiple skills rather than building monolithic ones.

**Example:** A "write and publish a blog post" workflow composes the Writing skill (draft), the Review skill (edit), and the Publishing skill (deploy) — three focused skills, not one giant BlogPost skill.

**Violation example:** A single skill that handles email, calendar, contacts, and task management because "they're all productivity tools."

---

## Principle 9: ENG / SRE Principles

**Statement:** Version control, monitoring, graceful degradation. Treat AI infrastructure like production engineering.

**Architectural impact:** PAI uses semantic versioning, changelogs, and migration guides. The memory system has backup and recovery. Skills degrade gracefully when tools fail — falling back to prompt-only operation rather than crashing.

**Example:** When a CLI tool fails (network timeout, missing dependency), the skill logs the failure, reports it to the user, and offers a degraded alternative rather than silently producing wrong output.

**Violation example:** A skill that crashes the entire session when a single API call returns an error.

---

## Principle 10: CLI as Interface

**Statement:** Every operation accessible via command line. CLI provides discoverability, scriptability, and testability.

**Architectural impact:** Every tool in PAI is a CLI command that can be run independently of the AI. This means tools can be tested in isolation, scripted into pipelines, and discovered via `--help` flags.

**Example:** `pai memory search "project alpha"` works from a terminal with no AI involvement — useful for debugging, scripting, and integration with other tools.

**Violation example:** A tool that only works when called by the AI agent, with no standalone CLI interface.

---

## Principle 11: Goal, Code, CLI, Prompts, Agents

**Statement:** The development pipeline hierarchy. Each layer builds on the previous, and you move to the next layer only when the current one is insufficient.

**Architectural impact:** When building a capability, start with the goal (what are we achieving?), then write code (deterministic logic), then wrap it in a CLI (interface), then write prompts (AI guidance), and only then create an agent workflow. Skipping layers creates fragile systems.

**Example:** Building a "summarize meeting notes" feature: Goal (extract action items), Code (parse markdown, extract bullet points), CLI (`meetingtool extract`), Prompts (guide summarization style), Agent (orchestrate the full workflow).

**Violation example:** Jumping straight to writing an agent prompt without first building the deterministic tooling it needs.

---

## Principle 12: Skill Management

**Statement:** Self-activating, self-contained skill modules. Skills are the organizational unit for domain expertise.

**Architectural impact:** Each skill contains everything it needs: the SKILL.md definition with activation triggers, Tools/ for CLI commands, Workflows/ for multi-step processes, and customization hooks. Skills activate based on pattern matching against user requests — no manual routing needed.

**Example:** The `QuickNote` skill activates when a user says "note that..." or "remember this..." — the trigger patterns are defined in SKILL.md's USE WHEN section, and the skill contains its own storage tool.

**Violation example:** A skill that requires manual activation ("use the QuickNote skill to...") because its trigger patterns are missing or too narrow.

---

## Principle 13: Memory System

**Statement:** Automatic capture with three-tier architecture. Intelligence compounds over time through persistent memory.

**Architectural impact:** PAI's memory is split into three tiers: session (current conversation), working (active projects and context), and long-term (persistent knowledge). Memory capture happens automatically during the LEARN phase of the Algorithm, so the system gets better without manual curation.

**Example:** After helping debug a deployment issue, PAI automatically records the root cause and fix in long-term memory. Next time a similar issue arises, it retrieves the prior solution immediately.

**Violation example:** A system that starts every conversation from zero, re-discovering the user's preferences, project context, and past decisions every time.

---

## Principle 14: Agent Personalities

**Statement:** Functional personality with voice identity. Personality is not decoration — different work benefits from different cognitive approaches.

**Architectural impact:** PAI supports named agent personalities (e.g., Viki for voice interaction) with distinct communication styles. These are not cosmetic — a concise, direct personality is better for status updates, while a thorough, exploratory personality is better for research tasks.

**Example:** A voice-mode personality uses short, spoken-language responses optimized for audio delivery, while a written-mode personality uses structured markdown with headers and code blocks.

**Violation example:** Using the same verbose, emoji-laden personality for both a quick "what time is my next meeting?" query and a deep architectural review.

---

## Principle 15: Science as Meta-Loop

**Statement:** Hypothesis, experiment, measure, iterate. The system improves itself through scientific methodology.

**Architectural impact:** PAI tracks what works and what does not. Skill activations, tool success rates, and user satisfaction signals feed back into system improvement. Changes are treated as experiments with measurable outcomes, not permanent decisions.

**Example:** After adding a new trigger pattern to a skill, PAI tracks whether the skill activates correctly for the next 20 matching requests. If accuracy drops below threshold, the pattern is flagged for revision.

**Violation example:** Adding features based on intuition alone, with no measurement of whether they actually improve outcomes.

---

## Principle 16: Permission to Fail

**Statement:** Explicit permission to say "I don't know." Honesty about limitations prevents cascading errors.

**Architectural impact:** Skills and tools are designed to report uncertainty and failure clearly. The Algorithm's VERIFY phase catches failures before they propagate. The system prefers "I cannot do this reliably" over a confident but wrong answer.

**Example:** When asked to summarize a document in a language the system has not been tested on, it responds with "I can attempt this but my accuracy in this language is unverified" rather than producing a potentially wrong summary silently.

**Violation example:** A system that always produces an answer, even when it is fabricating information, because it was never given permission to say "I don't know."

## What to read next

- **[System Architecture](/contributor/architecture/)** — See how these principles manifest in PAI's concrete architecture
- **[The PAI Algorithm](/contributor/the-algorithm/)** — Deep dive into Principle 2's universal processing loop
- **[CLI-First Design](/contributor/cli-first/)** — Explore Principles 5, 6, and 10 in practice
