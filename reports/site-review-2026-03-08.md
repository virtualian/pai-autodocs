# PAI Autodocs Site Review

**Date:** 2026-03-08
**Reviewers:** 4 parallel agents (Information Architect, Diataxis Auditor, Content Editor, Technical Accuracy Reviewer)
**Scope:** All 73 pages across 4 audience sections
**Method:** Each agent independently reviewed the site from a different lens, reading 20-45+ pages each

---

## Executive Summary

The site has strong foundations: clean audience segmentation, consistent voice, good sidebar structure, and near-universal "What to read next" footers. However, the review uncovered **three critical accuracy problems** that should be fixed immediately, **several content honesty issues** that undermine trust, and **systematic cross-linking gaps** that weaken Diataxis navigation.

**The single highest-leverage improvement:** Rewrite `docs/developer/algorithm.md`. It describes Algorithm v0.2.25 with invented tools (TaskCreate/TaskList/TaskUpdate) and wrong version attribution. The actual system runs Algorithm v3.7.0 with completely different mechanics. Every developer who reads this page gets a fundamentally wrong understanding of PAI's core.

---

## Critical Issues (fix immediately)

These are factual errors that will mislead readers.

### 1. Algorithm reference page describes the wrong version

**File:** `docs/developer/algorithm.md`
**Problem:** The entire page documents Algorithm v0.2.25 from `danielmiessler/TheAlgorithm`. The actual system runs Algorithm v3.7.0 at `~/.claude/PAI/Algorithm/v3.7.0.md`.
**What's wrong specifically:**
- Version listed as v0.2.25 (actual: v3.7.0)
- Source attributed to external GitHub repo (actual: internal PAI file)
- Describes 3 "Response Depth Levels" (FULL/ITERATION/MINIMAL) -- actual system uses 5 effort tiers (Standard/Extended/Advanced/Deep/Comprehensive) with time budgets
- References TaskCreate/TaskList/TaskUpdate tools for ISC management -- these tools don't exist. ISC is managed via PRD.md checkboxes written directly with Write/Edit
- Shows robot emoji as "one rule" first token -- actual system uses mode headers
**Flagged by:** Technical Accuracy Reviewer (critical), corroborated by Information Architect and Content Editor (noted duplication issues)
**Fix:** Full rewrite to reflect v3.7.0 mechanics

### 2. Hook types page has invented hook names

**File:** `docs/developer/hook-types.md`
**Problem:** Multiple hook names don't exist in the actual hook system:
- "StopOrchestrator" -- actual: 5 separate Stop hooks (LastResponseCache, ResponseTabReset, VoiceCompletion, DocIntegrity, AlgorithmTab)
- "ExplicitRatingCapture" and "ImplicitSentimentCapture" -- actual: single unified RatingCapture.hook.ts
- "CheckVersion" on SessionStart -- doesn't exist (actual: KittyEnvPersist, LoadContext)
- "SessionSummary" on SessionEnd -- doesn't exist (actual: WorkCompletionLearning, SessionCleanup, RelationshipMemory, UpdateCounts, IntegrityCheck)
- PostToolUse shown as "not currently configured" -- actual: QuestionAnswered.hook.ts, PRDSync.hook.ts
**Flagged by:** Technical Accuracy Reviewer (moderate-critical)
**Fix:** Rewrite with actual hook inventory from THEHOOKSYSTEM.md

### 3. Memory architecture still references deleted RAW/ directory

**File:** `docs/contributor/architecture.md`
**Problem:** Shows RAW/ as the first directory in the memory structure and describes it as "source of truth where everything flows first." RAW/ was eliminated in Memory System v7.0 (2026-01-12). Claude Code's native `projects/` directory is the actual source of truth.
**Flagged by:** Technical Accuracy Reviewer (moderate)
**Fix:** Update directory structure and data flow to match v7.0 projects-native architecture

---

## High-Priority Issues

### 4. Aspirational features described as current reality

**Files:** `docs/user/memory.md`, `docs/user/self-improvement.md`
**Problem:** Both pages have info boxes at the top acknowledging features are "largely aspirational," but the body text uses present tense throughout, directly contradicting the caveats.
**Example from memory.md:** Info box says "memory works best when you actively manage it." Body says "persistent memory requires zero effort from you. There are no manual notes to maintain."
**Flagged by:** Content Editor (top recommendation), corroborated by Diataxis Auditor
**Fix:** Restructure into "What works today" (present tense) and "Where it's heading" (future tense) sections. Remove the info-box-as-disclaimer approach.

### 5. Skill count inconsistency across the site

**Files:** Multiple pages disagree on how many skills PAI ships with:
- `docs/user/what-is-pai.md`: "27+ specialised skills"
- `docs/user/skills-catalog.md`: "27 built-in skills"
- `docs/user/working-with-skills.md`: "38+ built-in skills"
- `docs/power-user/configure-skills.md`: "38 system skills"
- `docs/user/install-pai.md`: "38 skills"
**Flagged by:** Information Architect and Content Editor (both independently)
**Fix:** Pick the correct number. Use it everywhere. Consider using "dozens of built-in skills" in narrative pages and the exact count only in the Skills Catalog reference.

### 6. first-session.md is not a tutorial

**File:** `docs/user/first-session.md`
**Problem:** Classified as `diataxis_type: tutorial` but doesn't walk readers through doing anything. It describes what PAI does internally -- that's an explanation. This is the second page on the recommended new-user path, and it asks readers to read about doing rather than actually do.
**Also:** Contains a near-duplicate passage (lines ~93 and ~113 repeat "Each phase builds on the last...").
**Flagged by:** Diataxis Auditor (top recommendation), Content Editor (worst pages list)
**Fix:** Either reclassify as explanation, or rewrite with concrete reproducible steps: "Type this exact prompt. You should see this output."

### 7. Systematic cross-quadrant linking gaps

**Problem:** Most explanation pages link to other explanations and tutorials but fail to link to corresponding reference and how-to pages. Most references don't link back to their how-tos.
**Specific gaps identified:**
- `user/fabric.md` doesn't link to `user/first-fabric-pattern.md`
- `user/memory.md` doesn't link to `user/manage-memory.md`
- `user/privacy.md` has no how-to or tutorial links
- `developer/first-cli-tool.md` doesn't link to `developer/tools-reference.md`
- `user/manage-memory.md` doesn't link back to `user/memory.md`
- `user/manage-goals.md` doesn't link back to `user/telos.md`
**Flagged by:** Diataxis Auditor (systematic finding)
**Fix:** Audit every "What to read next" section. Each should include at least one link to a different Diataxis quadrant.

---

## Medium-Priority Issues

### 8. Content duplication across sections

**Algorithm:** Explained in 4 places (user/the-algorithm.md, user/first-session.md, developer/algorithm.md, contributor/the-algorithm.md). Developer reference and contributor explanation share ~60% identical material.
**SYSTEM/USER model:** Explained in 3 places (power-user/how-customization-works.md, power-user/system-user-boundary.md, contributor/system-user-model.md). The two power-user pages overlap heavily.
**Flagged by:** Information Architect and Content Editor (both independently)
**Fix:** Deduplicate. Make contributor Algorithm page focus on *why* (design philosophy), developer page focus on *what* (specification). Consider merging the two power-user pages or clearly differentiating them.

### 9. Contributor sidebar ordering breaks the pattern

**File:** `sidebars.js`
**Problem:** Every section uses Explanation -> Tutorials -> How-to -> Reference. Contributors use Explanation -> Tutorials -> Reference -> How-to. Inconsistent.
**Flagged by:** Information Architect
**Fix:** Swap Reference and How-to blocks in the Contributors section of sidebars.js. 30-second change.

### 10. configure-skills.md mixes how-to and reference material

**File:** `docs/power-user/configure-skills.md` (422 lines)
**Problem:** Starts as a how-to (listing, invoking, customizing skills) but from line ~93 onward becomes a reference for SKILL.md format, YAML frontmatter, workflow routing -- duplicating content from `developer/skill-file-format.md`.
**Flagged by:** Diataxis Auditor (top recommendation)
**Fix:** Cut reference material from line ~93 onward. Link to existing developer references instead.

### 11. Additional technical inaccuracies

| Issue | File | Fix |
|-------|------|-----|
| Skill file format shows forbidden `Context/` subdirectory | `docs/developer/skill-file-format.md` line 186 | Remove Context/ from directory tree |
| "FormatReminder hook" doesn't exist | `docs/developer/skill-lifecycle.md` line 40 | Remove or describe actual activation mechanism |
| ISC expanded as "Intent-Skill-Confidence" | `docs/developer/skill-lifecycle.md` line 42 | Correct to "Ideal State Criteria" |
| "AgentFactory" should be "ComposeAgent" | `docs/contributor/architecture.md` line 79 | Rename |
| Principle 1 renamed from source | `docs/contributor/principles.md` line 37 | Update to match source title |
| PRD term used without definition | `docs/developer/algorithm.md` | Define "PRD (Product Requirements Document)" at first use |

**Flagged by:** Technical Accuracy Reviewer

### 12. Thin pages that don't justify their existence

- `docs/user/fabric.md` -- 59 lines, entirely abstract, never shows a Fabric pattern's actual output
- `docs/power-user/how-customization-works.md` -- 44 lines, introduces three layers in one sentence each
**Flagged by:** Content Editor (worst pages list)
**Fix:** Expand fabric.md with a concrete input/output example. Expand or merge how-customization-works.md.

### 13. Spelling convention inconsistency

The site mixes British ("customise", "behaviour") and American ("customize", "customization") spellings. Sidebar labels use British; some filenames and titles use American.
**Examples:** `customize-your-ai.md` (American filename) vs `customise-behaviour.md` (British filename)
**Flagged by:** Information Architect and Content Editor (both independently)
**Fix:** Standardise on one convention. British appears dominant in the sidebar, so standardise on British.

---

## Low-Priority / Future Considerations

### 14. Undocumented features in PAI source files

The Technical Accuracy Reviewer identified features present in source files but not covered in docs:
- ISC Count Gate (mandatory ISC floors per effort tier)
- ISC Decomposition Methodology (Splitting Test with 4 sub-tests)
- Capability selection with invocation obligation
- Context compaction at phase transitions
- Unified Event System (full event type taxonomy)
- Arbol cloud execution architecture
- EXTEND.yaml manifest and skill customization system

These are candidates for future documentation pages, particularly once the critical accuracy issues are resolved.

### 15. PAI Packs referenced but never documented

Referenced in `docs/power-user/configure-skills.md` and `docs/contributor/system-user-model.md` but no page explains what they are, how to create them, or how to install them.

### 16. Consider a landing page routing by audience

Currently the sidebar shows all 5 sections simultaneously. A homepage decision tree ("I want to USE PAI" / "I want to CUSTOMISE PAI" / etc.) would reduce cognitive load for first-time visitors.

---

## Strongest Pages (worth studying as models)

The Content Editor identified these as the site's best work:

1. **`docs/user/install-pai.md`** -- Gold standard tutorial. Concrete steps, platform-specific notes, verification commands, troubleshooting section.
2. **`docs/developer/first-skill.md`** -- Every line earns its place. Explains *why* alongside *what*. Full discovery pipeline diagram.
3. **`docs/power-user/system-user-boundary.md`** -- Opens with the reader's question ("which files can I change?"), visual directory tree, practical collision table.
4. **`docs/user/telos-reference.md`** -- Pure reference, no filler. Consistent structure. Realistic examples.
5. **`docs/contributor/principles.md`** -- Each principle gets statement, impact, example, and violation example. Concrete despite abstract subject matter.

---

## Summary: Prioritised Action Plan

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| P0 | Rewrite algorithm.md to v3.7.0 | Full rewrite | Fixes fundamentally wrong developer reference |
| P0 | Rewrite hook-types.md with actual hooks | Full rewrite | Fixes invented hook names |
| P0 | Remove RAW/ from architecture.md | Targeted edit | Fixes outdated memory architecture |
| P1 | Fix aspirational-as-current in memory.md, self-improvement.md | Restructure 2 pages | Restores content trust |
| P1 | Standardise skill count across all pages | Multi-file edit | Fixes visible inconsistency |
| P1 | Rewrite or reclassify first-session.md | Rewrite or 1-line change | Fixes broken onboarding path |
| P1 | Add cross-quadrant links to all explanation/reference pages | ~30 files, 1-2 links each | Completes Diataxis navigation |
| P2 | Deduplicate Algorithm and SYSTEM/USER content | Content reorganisation | Reduces maintenance burden |
| P2 | Fix contributor sidebar ordering | 1 swap in sidebars.js | 30-second consistency fix |
| P2 | Split configure-skills.md reference material | Restructure 1 page | Fixes type mixing |
| P2 | Fix remaining technical inaccuracies (6 items) | Targeted edits | Accuracy corrections |
| P2 | Expand thin pages (fabric.md, how-customization-works.md) | Content additions | Improves weakest pages |
| P2 | Standardise British/American spelling | Site-wide search-replace | Consistency polish |
| P3 | Document undocumented features | New pages | Completes coverage |
| P3 | Add PAI Packs documentation | New page | Fills referenced gap |
| P3 | Consider audience-routing landing page | UX redesign | Improves first-visit experience |

---

## Cross-Agent Pattern Analysis

Three patterns emerged independently across multiple agents:

1. **The accuracy gap is deeper than the content gap.** While the site has good coverage (73 pages, all 4 Diataxis quadrants), several core pages describe systems that no longer exist (Algorithm v0.2.x, RAW/ directory, invented hooks). New pages were added (Tier 1-3 expansion) while older pages drifted from their sources. **Lesson: accuracy audits should accompany expansion efforts.**

2. **Duplication creates drift risk.** The Algorithm is documented in 4 places, the SYSTEM/USER model in 3. Each copy drifts independently. The Algorithm reference (developer) drifted to a completely wrong version while the contributor explanation stayed closer to reality. **Lesson: single-source critical concepts with cross-links, not copies.**

3. **The site's voice is its strongest asset.** All 4 agents noted the consistent, direct, no-filler writing style. Even the weakest pages (fabric.md, how-customization-works.md) maintain the voice -- they're thin, not badly written. The best pages (install-pai.md, first-skill.md) demonstrate what the voice sounds like at its peak: concrete, specific, respectful of the reader's time.
