# PAI Autodocs Documentation Expansion Plan

**Created:** 2026-03-07
**Source:** Council debate with 5 perspectives (Diataxis Expert, User Advocate, Power-User, Developer, Contributor)
**Branch:** 29-surface-working-strengths
**Issue:** #29

---

## Context

The User section was expanded from 11 to 24 pages. Power-Users (5 pages), Developers (12 pages), and Contributors (8 pages) have not been audited or expanded. A 5-member council debate identified 23 new pages needed across all roles, organised into 3 priority tiers.

## Key Insights from Council

1. **Reference docs are shared infrastructure** — the single highest-leverage investment. File format specs, directory conventions, and boundary docs unblock tutorials and how-tos across all roles.
2. **Producer-first sequencing** — enabling Developers and Power-Users first has multiplier effects, because they generate content back into the system.
3. **Composable tutorials beat monolithic narratives** — individual focused tutorials that link to reference pages are cheaper to maintain and more useful than sprawling "first week" guides.
4. **Debugging/troubleshooting is cross-cutting** — every role needs it, consider shared treatment.

## Current State

| Section | Pages | Explanation | Tutorial | How-to | Reference |
|---------|-------|:-:|:-:|:-:|:-:|
| Users | 24 | 6 | 5 | 9 | 4 |
| Power-Users | 5 | 1 | 1 | 1 | 1 |
| Developers | 12 | 1 | 2 | 3 | 4 |
| Contributors | 8 | 5 | 0 | 1 | 0 |
| **Total** | **49** | 13 | 8 | 14 | 9 |

## Target State

| Section | Pages | Explanation | Tutorial | How-to | Reference |
|---------|-------|:-:|:-:|:-:|:-:|
| Users | 26 | 8 | 5 | 9 | 4 |
| Power-Users | 12 | 2 | 1 | 3 | 6 |
| Developers | 19 | 3 | 4 | 5 | 7 |
| Contributors | 15 | 5 | 1 | 4 | 3 |
| **Total** | **72** | 18 | 11 | 21 | 20 |

---

## Tier 1: Shared Infrastructure (create first)

These pages unblock everything else. They are reference and explanation pages that multiple roles depend on.

| # | Page | Type | Section | File Path | Description |
|---|------|------|---------|-----------|-------------|
| 1 | Directory Conventions | Reference | Contributor | `docs/contributor/directory-conventions.md` | Canonical file paths, naming rules (TitleCase, ALLCAPS), where new files belong |
| 2 | Skill File Format | Reference | Developer | `docs/developer/skill-file-format.md` | SKILL.md frontmatter schema, required/optional fields, trigger syntax, structure |
| 3 | SYSTEM vs USER Boundary | Explanation | Power-User | `docs/power-user/system-user-boundary.md` | Which files are yours vs infrastructure, what happens when they collide |
| 4 | Troubleshooting | Reference | User | `docs/user/troubleshooting.md` | Common problems, error messages, and fixes users hit in their first month |
| 5 | Privacy and Your Data | Explanation | User | `docs/user/privacy.md` | What PAI stores, where it lives, what goes to Claude's API, what stays local |

**Why first:** Every subsequent tutorial and how-to will link to these. Writing tutorials without reference material produces docs that can't answer follow-up questions.

---

## Tier 2: Role-Specific Essentials (create next)

Each role gets its most-needed pages to fill critical Diataxis quadrant gaps.

| # | Page | Type | Section | File Path | Description |
|---|------|------|---------|-----------|-------------|
| 6 | Skill Lifecycle | Explanation | Developer | `docs/developer/skill-lifecycle.md` | How skills are discovered, activated, composed, and retired — the #1 developer conceptual gap |
| 7 | Your First Contribution | Tutorial | Contributor | `docs/contributor/first-contribution.md` | Fork, make one concrete change, validate, submit — opens the contributor funnel |
| 8 | Your First CLI Tool | Tutorial | Developer | `docs/developer/first-cli-tool.md` | Build a working TypeScript CLI tool end-to-end in 30 minutes |
| 9 | Steering Rules Reference | Reference | Power-User | `docs/power-user/steering-rules.md` | Complete catalog of AI behavioural rules: syntax, precedence, conflict resolution |
| 10 | Voice and Notification Config | How-to | Power-User | `docs/power-user/voice-notifications.md` | Change voice, adjust settings, set up notification endpoints, test setup |
| 11 | The 16 Principles | Reference | Contributor | `docs/contributor/principles.md` | Standalone enumeration of founding principles with rationale and violation examples |
| 12 | Testing PAI Components | How-to | Developer | `docs/developer/testing.md` | Write and run tests for skills, hooks, and agents — TDD workflow and conventions |
| 13 | Customising PAI Behaviour | How-to | Power-User | `docs/power-user/customise-behaviour.md` | Add steering rules, create custom modes, override defaults without breaking the system |
| 14 | Add a Skill to Core | How-to | Contributor | `docs/contributor/add-skill.md` | Promote a personal skill to the system skill set, including canonicalisation checklist |
| 15 | Versioning and Compatibility | Reference | Contributor | `docs/contributor/versioning.md` | Semver rules, what constitutes breaking changes, upgrade boundary rules |

**Why second:** These are the pages each role's representative identified as their single highest-priority gap. They fill the most painful Diataxis quadrant holes.

---

## Tier 3: Depth and Polish (create when time allows)

These add depth, improve debugging experience, and complete coverage for advanced users.

| # | Page | Type | Section | File Path | Description |
|---|------|------|---------|-----------|-------------|
| 16 | Debugging and Troubleshooting | How-to | Developer | `docs/developer/debugging.md` | Diagnose agent failures, skill loading issues, context routing misses |
| 17 | Agent Architecture | Explanation | Developer | `docs/developer/agent-architecture.md` | How agents spawn, share context, use ISC criteria, and coordinate |
| 18 | Context Routing Reference | Reference | Power-User | `docs/power-user/context-routing.md` | How PAI resolves which context files to load, routing table format |
| 19 | CLAUDE.md Anatomy | Reference | Power-User | `docs/power-user/claude-md-anatomy.md` | Field-by-field breakdown of CLAUDE.md structure, load order, override semantics |
| 20 | Update System Files | How-to | Contributor | `docs/contributor/update-system-files.md` | Safely modify SYSTEM files while preserving USER customisations |
| 21 | Write a Constitutional Principle | How-to | Contributor | `docs/contributor/write-principle.md` | How to propose, word, and integrate a new immutable principle |
| 22 | Workflow File Format | Reference | Developer | `docs/developer/workflow-file-format.md` | Workflow definition format, triggers, steps, conditions |
| 23 | Memory File Format | Reference | Developer | `docs/developer/memory-file-format.md` | JSONL event schema, field definitions, how memory is read and written |

---

## Execution Notes

### Shared pages
Pages 1, 2, and 3 are shared infrastructure — Power-Users, Developers, and Contributors should cross-link to them rather than duplicating content. Place each in its primary audience's section and link from other sections' overview pages.

### Sidebar updates required
Each tier of pages requires corresponding updates to:
- `sidebars.js` — add new pages to the correct Diataxis category
- Section overview pages (`overview.md`) — add links and descriptions

### Content sourcing
Many pages can be sourced from existing PAI system files:
- Skill file format: reverse-engineer from `~/.claude/skills/` examples
- Directory conventions: extract from `PAISYSTEMARCHITECTURE.md`
- The 16 principles: extract from architecture page (already listed in table form)
- Steering rules: extract from `AISTEERINGRULES.md`
- CLAUDE.md anatomy: extract from actual CLAUDE.md structure

### Quality bar
Each page should:
- Follow the existing voice/tone of the site (clear, direct, no fluff)
- Include concrete examples (not abstract descriptions)
- Cross-link to related pages in other Diataxis quadrants
- Include a "What to read next" footer with 2-3 links
