---
title: Telos Reference
description: Complete reference for all 10 Telos files — purpose, format, and contents.
diataxis_type: reference
---

Telos files live in `~/.claude/skills/PAI/USER/TELOS/`. Each file captures a different dimension of your context. All files are Markdown format.

## File reference

### MISSION.md

**Purpose:** Your core purpose and what drives you.

**Contains:** A concise statement (1-3 paragraphs) of your overarching mission. This is the "why" behind everything else.

**Example content:**
```markdown
Build a profitable developer tools company that makes complex infrastructure
accessible to small teams. Maintain sustainable pace — no burnout culture.
```

**Loaded:** Every session. Mission context informs all interactions.

---

### GOALS.md

**Purpose:** What you are actively working toward.

**Contains:** A prioritised list of current goals with context. Goals should be specific enough to know when achieved.

**Example content:**
```markdown
1. Launch public beta by April 15
2. Close seed round ($1.5M target) by end of Q2
3. Hire two senior engineers (backend + infrastructure)
4. Publish technical blog series (5 posts)
```

**Loaded:** Every session. Goals influence prioritisation and suggestions.

---

### PROJECTS.md

**Purpose:** Active projects and their current status.

**Contains:** Project names, descriptions, status, blockers, and next steps.

**Example content:**
```markdown
## Product Beta
Status: In progress — auth flow complete, onboarding 70% done
Blocker: Waiting on design review for onboarding screens
Next: Complete onboarding, begin invite flow

## Hiring Pipeline
Status: Two candidates in final rounds
Next: Technical interviews scheduled for next week
```

**Loaded:** Every session. Provides project context for task planning.

---

### BELIEFS.md

**Purpose:** Core values and principles you hold.

**Contains:** Beliefs that should influence how PAI approaches problems for you.

**Example content:**
```markdown
- Ship fast, iterate based on real feedback
- Simplicity over cleverness — the best code is code you don't write
- Direct communication, no corporate fluff
- Data over opinions, but intuition matters for timing
- Hire for trajectory, not credentials
```

**Loaded:** Every session. Shapes recommendation tone and approach.

---

### MODELS.md

**Purpose:** Mental models and frameworks you use for thinking.

**Contains:** Named frameworks with brief descriptions of how you apply them.

**Example content:**
```markdown
- First principles: decompose to fundamentals before solving
- Expected value: probabilistic thinking for decisions under uncertainty
- Jobs-to-be-done: understand what customers are actually hiring the product to do
- Second-order effects: always ask "and then what?"
```

**Loaded:** On demand. Applied when PAI performs analysis or decision support.

---

### STRATEGIES.md

**Purpose:** Approaches and patterns you prefer for solving problems.

**Contains:** Strategic preferences that guide how PAI tackles tasks.

**Example content:**
```markdown
- Start with the smallest possible scope, expand only with evidence
- Prototype before committing — build a throwaway version first
- When stuck, talk to customers before theorising
- Automate the third time, not the first
```

**Loaded:** On demand. Influences planning and implementation approaches.

---

### NARRATIVES.md

**Purpose:** Stories and themes that guide your thinking.

**Contains:** Personal narratives, career themes, and guiding stories.

**Example content:**
```markdown
The thread through my career is making powerful tools accessible.
Started with open-source contributions, then developer tools,
now building infrastructure that small teams can use without a
dedicated platform team.
```

**Loaded:** On demand. Provides thematic context for long-range planning.

---

### LEARNED.md

**Purpose:** Key lessons and insights you have accumulated.

**Contains:** Hard-won lessons from experience that should inform future decisions.

**Example content:**
```markdown
- Premature scaling killed our last product. Validate demand before investing in infrastructure.
- Remote hiring works but requires intentional culture-building from day one.
- Investors care about retention metrics more than growth metrics at seed stage.
```

**Loaded:** On demand. Prevents repeating past mistakes.

---

### CHALLENGES.md

**Purpose:** Current obstacles and blockers.

**Contains:** Things that are actively impeding your goals or projects.

**Example content:**
```markdown
- Cash runway is 8 months. Need to close the round or reach profitability.
- Technical debt in the API layer is slowing feature development.
- Struggling to find senior engineers willing to join a pre-seed startup.
```

**Loaded:** On demand. Ensures suggestions account for real constraints.

---

### IDEAS.md

**Purpose:** Things you are exploring but not yet committed to.

**Contains:** Opportunities, experiments, and concepts under consideration.

**Example content:**
```markdown
- Explore a freemium tier to drive adoption
- Consider a partnership with [company] for distribution
- Experiment with AI-assisted onboarding
- Look into SOC 2 certification timing
```

**Loaded:** On demand. Available when brainstorming or evaluating opportunities.

## File conventions

| Convention | Detail |
|-----------|--------|
| **Format** | Markdown (`.md`) |
| **Location** | `~/.claude/skills/PAI/USER/TELOS/` |
| **Privacy** | Private — never shared or committed to public repos |
| **Naming** | ALLCAPS filenames (e.g., `GOALS.md`, `MISSION.md`) |
| **Updates** | Via conversation ("update my goals") or direct file editing |
| **Loading** | Mission, Goals, Projects, Beliefs load every session. Others load on demand. |

## What to read next

- [Set Up Your Telos](/user/set-up-telos/) -- first-time setup walkthrough
- [Manage Your Goals](/user/manage-goals/) -- ongoing maintenance
- [Telos: Your Goals](/user/telos/) -- conceptual overview
