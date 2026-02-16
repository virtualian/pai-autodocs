# PAI Documentation Plan

> Updated 2026-02-16 — **Revision 2: Benefits-first rewrite**
> Previous version was too implementation-heavy. This revision prioritizes what PAI does for users over how it works internally.
> Config: `docs/.diataxis.md` (Astro Starlight, standalone_docs, GitHub Pages)

## Executive Summary

The PAI documentation site serves four distinct audiences: **Users** (capabilities and usage), **Power Users** (configuration), **Developers** (extension), and **Contributors** (open-source). Content is organized by audience, not by Diataxis type.

### The Core Problem (from feedback)

> "You're focusing too much on the details of PAI and how it works, and not on what you can actually use it for and how it benefits a user. For example, memory, self-learning capabilities of it, and how that works, etc."

**Diagnosis:** The Getting Started and Using PAI sections were written from the builder's perspective ("here's what I built") instead of the reader's perspective ("here's what this does for me"). Algorithm phase specs, ISC formatting rules, and SYSTEM/USER architecture theory were surfaced to users who just want to know what their AI can do.

**Fix:** Every user-facing page must answer "what does this do for me?" before (or instead of) "how does it work internally?" All implementation details are deferred to the Developing section, where they belong.

---

## Content Tier Rules

These rules are strict. A page belongs to ONE tier and must not contain content from a higher tier.

| Tier | Section | Allowed | Forbidden |
|------|---------|---------|-----------|
| **Users** | Getting Started, Using PAI | Benefits, capabilities, practical usage guidance (example prompts, interaction patterns, what to expect), scenarios, plain-language explanations, screenshots | File paths, code/config, internal architecture, hook names, system directories, TypeScript, ISC rules, Algorithm phase specs |
| **Power Users** | Customizing | Config file examples, JSON to edit, step-by-step "change this value" instructions | Architecture theory, TypeScript, internal mechanics, cascading lookup patterns |
| **Developers** | Developing | Full technical detail: code, architecture, specs, hook payloads, internal mechanics | Nothing forbidden |
| **Contributors** | Contributing | Project conventions, upgrade paths, design decisions | Nothing forbidden |

**The test:** If a sentence contains a file path like `~/.claude/skills/PAI/USER/`, it does NOT belong in a User-tier page. If it contains `TaskCreate` or `ISC criteria must be exactly 8 words`, it does NOT belong in Getting Started.

---

## Site Structure

```
src/content/docs/
├── index.mdx                          # Landing page — benefits-first hero
├── getting-started/                   # ALL audiences — entry point
│   ├── what-is-pai.md                 # REWRITE: What PAI does for you
│   ├── install-pai.md                 # KEEP: Step-by-step installation
│   └── first-session.md              # REWRITE: See PAI in action
├── using-pai/                         # USERS — the heart of the docs
│   ├── memory.md                      # NEW: Your AI remembers everything
│   ├── self-improvement.md            # NEW: Your AI gets better over time
│   ├── working-with-skills.md         # LIGHT EDIT: What your AI can do
│   ├── giving-feedback.md             # KEEP: How to rate and improve
│   └── skills-catalog.md             # KEEP: Full skill reference
├── customizing/                       # POWER USERS — configuration
│   ├── customize-your-ai.md           # REWRITE: Quick-start customization
│   ├── configure-skills.md            # LIGHT EDIT: Skill management
│   └── configuration.md              # NEW: All config files reference
├── developing/                        # DEVELOPERS — building on PAI
│   ├── first-skill.md                 # KEEP: Tutorial
│   ├── first-hook.md                  # KEEP: Tutorial
│   ├── write-hooks.md                 # KEEP: How-to
│   ├── manage-memory.md               # KEEP: How-to
│   ├── set-up-agents.md               # NEW: How-to
│   ├── algorithm.md                   # KEEP: Reference spec
│   ├── hook-types.md                  # NEW: Reference
│   ├── agent-types.md                 # NEW: Reference
│   ├── tools-reference.md             # NEW: Reference
│   ├── architecture.md                # KEEP: Explanation
│   ├── the-algorithm.md               # KEEP: Explanation
│   ├── cli-first.md                   # NEW: Explanation
│   ├── system-user-model.md           # NEW: Explanation
│   └── memory-and-learning.md         # NEW: Explanation
└── contributing/                      # CONTRIBUTORS
    └── upgrade-pai.md                 # NEW: How-to
```

**Total: 25 content pages + 1 index = 26 files**

---

## Page-by-Page Content Briefs

### Getting Started (3 pages)

#### What is PAI? — MAJOR REWRITE

**Current problems:**
- Leads with philosophy and architecture theory
- Contains a 16-principles table, "three levels of AI" taxonomy, and TELOS file path references
- Algorithm details that belong in Developing
- Reads like a system spec, not an introduction

**Revised content brief:**
1. **Open with what you get** — 4 headline benefits:
   - "Your AI remembers across sessions" (memory)
   - "Your AI learns from your feedback" (self-improvement)
   - "Your AI has specialized skills" (29 skills across domains)
   - "Your AI knows your goals" (TELOS context — described as a benefit, not as file paths)
2. **Brief philosophy** — "Magnify everyone, not just the 1%" — 2-3 paragraphs max
3. **How it's different from ChatGPT/Claude** — Focus on OUTCOMES not architecture. "ChatGPT forgets. PAI remembers." NOT "Level 1 vs Level 2 vs Level 3 taxonomy."
4. **Who it's for** — Keep the persona list (it's good and benefit-oriented)
5. **Built on Claude Code** — Keep but shorten. "PAI is the layer on top that makes Claude Code yours."
6. **CUT:** Three levels taxonomy, 16 principles table, "two key insights" section, Algorithm details, TELOS file paths, architecture document references

**What to read next → Using PAI (not Developing)**

#### Install PAI — KEEP AS-IS

Already procedural. Appropriate for all audiences. No changes needed.

#### First Session — MAJOR REWRITE

**Current problems:**
- Walks through every Algorithm phase (1/7 through 7/7) like a technical spec
- Explains ISC formatting rules (8 words, binary testable, one concern per criterion)
- Shows thinking tools assessment tables and capability selection blocks
- A tutorial about the Algorithm, not about using PAI

**Revised content brief:**
1. **Open with what to expect** — "Your first session feels different from ChatGPT. Here's what you'll notice."
2. **Starting PAI** — Keep the `pai` command, but frame it as "launch your AI" not "fire startup hooks"
3. **Give it a real task** — Use a scenario that shows PAI's strengths (e.g., "Help me plan a presentation on X" — something that benefits from structured thinking, not a dry comparison table)
4. **What you'll see** — Brief, high-level description of the output format:
   - "PAI thinks about what you actually need (not just what you typed)"
   - "It creates success criteria for itself"
   - "It checks its own work before delivering"
   - "It captures what it learned for next time"
   - Show a SIMPLIFIED example output — just the headers and key moments, not every phase in full detail
5. **The wow moments** — Highlight what's impressive:
   - "Notice how it figured out what you DIDN'T want?"
   - "See how it verified against its own criteria?"
   - "That learning note? It'll remember that preference next time."
6. **Response depth** — Brief mention: "Not every request gets the full treatment. Quick questions get quick answers."
7. **CUT:** ISC formatting rules, thinking tools assessment tables, capability selection block details, detailed phase-by-phase walkthrough, hook event descriptions
8. **MOVE TO:** developing/the-algorithm.md and developing/algorithm.md

**What to read next → "Your AI Remembers" and "Your AI Gets Better"**

---

### Using PAI (5 pages)

This is the heart of the documentation. These pages answer the user's core question: "What does this do for me?"

#### Your AI Remembers — NEW PAGE

**Content brief:**
This is the #1 differentiator from ChatGPT and the most requested topic in the feedback. Dedicate a full page to it.

1. **The problem PAI solves** — "Most AI forgets everything between sessions. PAI doesn't."
2. **What PAI remembers** — Described as user-visible behaviors, not system internals:
   - Your active projects and recent work
   - Your preferences (tone, format, detail level)
   - Past decisions and their outcomes
   - Your goals and what you're working toward
   - Conversations and context from previous sessions
3. **Concrete scenarios:**
   - "Monday you discuss a bug in the auth module. Wednesday you say 'that bug' and PAI knows which one."
   - "You mentioned preferring tables over bullet lists three weeks ago. PAI still formats that way."
   - "You set a goal to launch by March. PAI factors that deadline into every project discussion."
4. **How memory builds over time** — Day 1 vs Week 1 vs Month 1 vs Month 3 progression
5. **What you DON'T have to do** — "No manual notes. No re-explaining. No 'remember when I said...'"
6. **NO:** File paths, directory names, MEMORY/LEARNING/WORK folder structure, internal signal capture mechanics

#### Your AI Gets Better Over Time — NEW PAGE (replaces "How PAI Learns")

**Why replace instead of edit:** The current "How PAI Learns" is decent but its title is system-centric ("How PAI Learns") and some content leans toward internal mechanics. A fresh page with the user-benefit framing is cleaner than surgical edits.

**Content brief:**
1. **The headline** — "The AI you use on day 90 is measurably better than day 1 — because it learned from YOU."
2. **Two types of feedback** — Keep from current page (explicit ratings + implicit sentiment). Already well-written.
3. **What happens with your feedback** — Keep the rating table from current page. Already benefit-focused.
4. **Skills improve based on evidence** — Keep from current page. Show how specific skills get better.
5. **Practical examples** — Expand from current page. Add more relatable scenarios:
   - Email tone preferences
   - Code style preferences
   - Research depth preferences
   - Meeting note format preferences
6. **The learning loop diagram** — Keep from current page
7. **Absorb relevant content from "Giving Feedback"** — The current Giving Feedback page overlaps significantly. Consider whether to keep it as a separate page or merge the best parts here.

#### Working With Skills — MODERATE EDIT

**Current state:** Already benefit-focused, but leans toward describing what skills ARE rather than how to USE them. Needs to become the primary "here's what you can do and how to do it" page.

**Edits needed:**
- Reframe as a practical usage guide, not just a capabilities overview
- For each skill category, add concrete "try this" prompts — actual things to type
- Add a "Getting the most out of skills" section with interaction patterns:
  - How to trigger deep vs quick research
  - How to ask for multi-perspective analysis
  - How to chain skills for complex tasks (with example prompts, not architecture)
  - How to check what skills are available
- Add "what to expect" guidance — what the output looks like, how long it takes, when to follow up
- Strengthen the opening — make it actionable, not descriptive
- Ensure no internal jargon crept in

#### Giving Feedback — KEEP or MERGE

**Decision point:** The current "Giving Feedback" page overlaps with "Your AI Gets Better." Two options:
1. **Keep separate** — "Your AI Gets Better" covers the system; "Giving Feedback" is the practical how-to
2. **Merge into "Your AI Gets Better"** — Combine into one comprehensive page, reducing the section to 4 pages

**Recommendation:** Keep separate. "Your AI Gets Better" explains what happens. "Giving Feedback" is the actionable guide. They serve different Diataxis purposes (explanation vs how-to).

#### Skills Catalog — LIGHT EDIT

**Current state:** Reference page listing all 29+ skills. Already serves its purpose.

**Edits needed:**
- For each skill entry, ensure there's at least one example prompt showing how to activate it
- Add a "what it does for you" line (not just what it IS)
- Group by user need ("When you need to research...", "When you need to create visuals...") rather than by internal category names

---

### Customizing PAI (3 pages)

#### Customize Your AI — REWRITE

**Current problems:**
- Opens with SYSTEM/USER architecture theory (cascading lookup, resolution order)
- Shows security YAML configuration that most power users won't need
- Reads like a developer tutorial, not a power user quick-start

**Revised content brief:**
1. **Open with the action** — "Want to change your AI's name? Add a personal rule? Here's how."
2. **Change your AI's identity** — Show the JSON, explain the fields, done. No architecture theory.
3. **Change your name** — Same. Quick.
4. **Add a personal rule** — Show the format, give 2-3 examples, explain what rules do in plain language
5. **Add a private skill** — Brief intro, show the naming convention, link to Developing for full tutorial
6. **Brief "how this works" aside** — ONE paragraph: "PAI uses a two-tier system. Your personal files always override the defaults. This means updates never overwrite your customizations." That's all the architecture theory a power user needs.
7. **CUT:** Cascading lookup pattern details, security YAML config, SYSTEM/USER location tables
8. **MOVE TO:** developing/system-user-model.md

#### Configure Skills — LIGHT EDIT

Current version is acceptable. Light edits for consistency with new tone.

#### Configuration Reference — NEW (as previously planned)

Complete reference of all config files and their locations. This is the ONE place where file paths are acceptable in the Customizing section, because it's a reference page.

---

### Developing PAI (14 pages) — NO CHANGES TO PLAN

This section is where all technical detail belongs. The existing plan for these 14 pages is correct. These pages should absorb the content being CUT from user-facing pages:

- Algorithm phase details → algorithm.md, the-algorithm.md
- ISC formatting rules → algorithm.md
- SYSTEM/USER architecture → system-user-model.md
- Memory system internals → memory-and-learning.md
- Hook event descriptions → hook-types.md

### Contributing (1 page) — NO CHANGES TO PLAN

---

### Sidebar Configuration Update

The sidebar in `astro.config.mjs` needs updating to reflect the new pages:

```javascript
sidebar: [
  {
    label: 'Getting Started',
    items: [
      { label: 'What is PAI?', slug: 'getting-started/what-is-pai' },
      { label: 'Install PAI', slug: 'getting-started/install-pai' },
      { label: 'First Session', slug: 'getting-started/first-session' },
    ],
  },
  {
    label: 'Using PAI',
    items: [
      { label: 'Your AI Remembers', slug: 'using-pai/memory' },
      { label: 'Your AI Gets Better', slug: 'using-pai/self-improvement' },
      { label: 'Working With Skills', slug: 'using-pai/working-with-skills' },
      { label: 'Giving Feedback', slug: 'using-pai/giving-feedback' },
      { label: 'Skills Catalog', slug: 'using-pai/skills-catalog' },
    ],
  },
  {
    label: 'Customizing PAI',
    items: [
      { label: 'Customize Your AI', slug: 'customizing/customize-your-ai' },
      { label: 'Configure Skills', slug: 'customizing/configure-skills' },
      { label: 'Configuration Reference', slug: 'customizing/configuration' },
    ],
  },
  {
    label: 'Developing PAI',
    items: [
      // ... unchanged from current plan
    ],
  },
  {
    label: 'Contributing',
    items: [
      { label: 'Upgrade PAI', slug: 'contributing/upgrade-pai' },
    ],
  },
],
```

---

### Landing Page (index.mdx) Update

**Current:** Good structure. The hero tagline ("AI that learns, remembers, and improves") and card grid are already benefit-oriented.

**Edits needed:**
- Update "Using PAI" card description to mention memory and self-improvement explicitly
- Update link targets if slugs change
- Consider adding a "What makes PAI different?" section with 3-4 punchy bullet points below the card grid

---

## Implementation Phases

**Current scope: Users + Power Users only.** Developing and Contributing sections deferred to a later session.

### Phase 1: User-Facing Rewrites (Priority)

These are the pages that directly address the feedback. Do these first.

| Page | Section | Action |
|------|---------|--------|
| What is PAI? | Getting Started | MAJOR REWRITE |
| First Session | Getting Started | MAJOR REWRITE |
| Your AI Remembers (memory.md) | Using PAI | NEW PAGE |
| Your AI Gets Better (self-improvement.md) | Using PAI | NEW PAGE |
| Customize Your AI | Customizing | REWRITE |

### Phase 2: Edits, References & Sidebar

| Page | Section | Action |
|------|---------|--------|
| Working With Skills | Using PAI | MODERATE EDIT |
| Skills Catalog | Using PAI | LIGHT EDIT |
| Giving Feedback | Using PAI | KEEP (verify no changes needed) |
| Configure Skills | Customizing | LIGHT EDIT |
| Configuration Reference | Customizing | NEW PAGE |
| index.mdx | Landing | UPDATE |
| astro.config.mjs sidebar | Config | UPDATE |

### Phase 3: Cleanup (Users + Power Users scope)

| Task |
|------|
| Delete old how-pai-learns.md (replaced by self-improvement.md) |
| Link audit across User + Power User pages |
| Build verification |
| Ensure "What to read next" links don't point to unwritten Developing pages |

### Deferred (later session)

| Section | Pages |
|---------|-------|
| Developing PAI | 14 pages (7 new, 7 existing) |
| Contributing | 1 page (new) |

---

## Source Material Mapping

| Source | Feeds Into |
|--------|-----------|
| PAI README | What is PAI? (benefits only), Install PAI |
| PAISYSTEMARCHITECTURE.md | Architecture (Developing) |
| SKILL.md (Algorithm v0.2.25) | Algorithm Reference, The Algorithm (Developing) |
| SKILLSYSTEM.md | First Skill, Configure Skills, Working With Skills |
| THEHOOKSYSTEM.md | First Hook, Write Hooks, Hook Types |
| MEMORYSYSTEM.md | Your AI Remembers (user-facing), Memory & Learning (Developing) |
| PAIAGENTSYSTEM.md + THEDELEGATIONSYSTEM.md | Set Up Agents, Agent Types |
| SYSTEM_USER_EXTENDABILITY.md | Customize Your AI (quick-start), SYSTEM/USER Model (Developing) |
| CLIFIRSTARCHITECTURE.md | CLI-First |
| TOOLS.md | Tools Reference |
| AISTEERINGRULES.md | Customize Your AI |

---

## Implementation Status

- [x] Phase 0: Initial site scaffolding — complete
- [x] Phase 0: 4-audience model — complete
- [x] Phase 0: First draft of all pages — complete (but needs revision per this plan)
- [x] **Phase 1: User-facing rewrites** — COMPLETE (5 pages: what-is-pai, first-session, memory, self-improvement, customize-your-ai)
- [x] Phase 2: Edits, references & sidebar — COMPLETE (7 items: working-with-skills, skills-catalog, giving-feedback, configure-skills, configuration, index.mdx, astro.config.mjs)
- [ ] Phase 3: Cleanup — NOT STARTED
- [ ] Deferred: Developing + Contributing sections — LATER SESSION
