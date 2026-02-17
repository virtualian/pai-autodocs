# PAI Artifact Taxonomy: Where Things Belong

> Generated 2026-02-17 — Clarifying where different artifact types live in the PAI system

---

## The Problem

`docs/` in a documentation project is name-overloaded. When the project IS documentation (`src/content/docs/` = Astro content), a top-level `docs/` for planning artifacts creates ambiguity: is it site content or project meta-data?

More broadly: PAI produces several artifact types during work sessions. Where does each belong?

---

## PAI's Memory Architecture (Existing)

| Location | Scope | Purpose | Lifetime |
|----------|-------|---------|----------|
| `MEMORY/WORK/` | Session | Active work tracking, PRDs, items | Per-session, persists for context recovery |
| `MEMORY/RESEARCH/` | Session | Agent output captures (researchers, architects) | Durable, referenced later |
| `MEMORY/LEARNING/` | Global | Derived insights, patterns, preferences | Permanent, shapes all future sessions |
| `MEMORY/STATE/` | Global | Runtime caches, current work pointers | Ephemeral, rebuildable |
| Project `.prd/` | Project | PRDs, design decisions, planning docs | Project-scoped, survives sessions |

---

## Artifact Type Classification

### 1. Design Decisions (e.g., "hosting-architecture-report.md")

**What:** Architectural choices that constrain future implementation.

**Where:** **Project `.prd/`** — same genus as PRDs. They're project-scoped decisions that any future session (or contributor) needs to understand. They inform PRDs and are referenced by them.

**Not:** `MEMORY/WORK/` (too transient), `MEMORY/LEARNING/` (not a learned pattern), `docs/` (not content).

### 2. Project Planning Artifacts (e.g., "DOCUMENTATION-PLAN.md", ".diataxis.md")

**What:** Living documents that guide how the project is built.

**Where:** **Project `.prd/`** — they're architectural context. The documentation plan IS a PRD in everything but name — it has phases, checklists, and content briefs.

**Not:** `docs/` (overloaded, confused with content), project root (clutters).

### 3. Session Work Products (e.g., PRDs created during a session)

**What:** ISC criteria, verification artifacts, work items tracked during active sessions.

**Where:** **`MEMORY/WORK/{session}/`** for session tracking + **Project `.prd/`** for the PRD file itself. Dual-tracking per PAI's PRD Integration rules.

### 4. Research Outputs (e.g., agent research findings)

**What:** Markdown outputs from spawned research agents.

**Where:** **`MEMORY/RESEARCH/`** — captured by the AgentOutputCapture hook. If project-relevant, reference from the PRD.

### 5. Learned Preferences (e.g., "Ian prefers Typora for reports")

**What:** Behavioral patterns derived from experience.

**Where:** **`MEMORY/LEARNING/`** — written by hooks (RatingCapture, WorkCompletionLearning). Permanent, shapes future sessions.

### 6. Quick Reports / Analyses (e.g., this document)

**What:** Synthesized analysis meant for human reading.

**Where:** **Project `.prd/`** if project-scoped. **`MEMORY/RESEARCH/`** if cross-project. Always opened in the user's preferred viewer (Typora) rather than dumped to terminal.

---

## Decision Flow

```
Is it about THIS project specifically?
├── YES → Does it need to survive across sessions?
│   ├── YES → Project .prd/
│   └── NO → MEMORY/WORK/{session}/ (dies naturally)
└── NO → Is it a learned pattern about the user?
    ├── YES → MEMORY/LEARNING/
    └── NO → Is it research output from an agent?
        ├── YES → MEMORY/RESEARCH/
        └── NO → MEMORY/STATE/ (ephemeral) or just respond inline
```

---

## What Daniel/PAI Would Say

The PRD system already solves this. PRDs are the canonical home for "everything about building this project that isn't the project itself." Design decisions, planning documents, architecture reports — they're all PRD-adjacent. The `.prd/` directory is the project-scoped equivalent of `MEMORY/WORK/` but durable.

The key insight from PAI's architecture: **memories are learned patterns, not documents.** A hosting report isn't a memory — it's a decision artifact. It belongs with the project, not in global memory. The memory system captures the *insight* from producing it ("Ian prefers Vercel for static sites"), not the report itself.
