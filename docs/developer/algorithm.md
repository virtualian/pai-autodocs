---
title: Algorithm Reference
description: "The complete Algorithm v3.7.0 specification — effort levels, phases, ISC criteria, PRD format, and capability selection."
diataxis_type: reference
---

<!-- Source: ~/.claude/PAI/Algorithm/v3.7.0.md -->

# Algorithm Reference

| Field | Value |
|-------|-------|
| **Version** | v3.7.0 |
| **Source** | `~/.claude/PAI/Algorithm/v3.7.0.md` |

---

## Core Principle

Transition from **Current State** to **Ideal State** using verifiable criteria (ISC). Goal: **Euphoric Surprise** — 9-10 ratings.

The Algorithm runs on every response. The only variable is effort level — how many ISC criteria, how much time, how many capabilities. There is no skip path.

---

## Modes

Mode selection happens in `CLAUDE.md` before the Algorithm loads. Three modes exist:

| Mode | When | What happens |
|------|------|-------------|
| **NATIVE** | Simple, quick tasks (<2 minutes) | Compact structured format, no Algorithm phases |
| **ALGORITHM** | Multi-step, complex, or difficult work | Full 7-phase Algorithm loaded from `v3.7.0.md` |
| **MINIMAL** | Greetings, ratings, acknowledgments | Minimal structured format |

ALGORITHM mode is the only mode that invokes the full phase structure described on this page. NATIVE and MINIMAL are defined in `CLAUDE.md` and do not load the Algorithm file.

---

## Effort Levels

Every Algorithm run is classified into one of five effort tiers. The tier determines time budget, ISC count range, and minimum capabilities to invoke.

| Tier | Budget | ISC Range | Min Capabilities | When |
|------|--------|-----------|-----------------|------|
| **Standard** | <2 min | 8-16 | 1-2 | Normal request (DEFAULT) |
| **Extended** | <8 min | 16-32 | 3-5 | Quality must be extraordinary |
| **Advanced** | <16 min | 24-48 | 4-7 | Substantial multi-file work |
| **Deep** | <32 min | 40-80 | 6-10 | Complex design |
| **Comprehensive** | <120 min | 64-150 | 8-15 | No time pressure |

**Min Capabilities** is the minimum number of distinct skills or agents that must be **actually invoked via tool call** during execution. Writing text that resembles a skill's output is not invocation. Listing a capability but never calling it via tool is a critical failure.

---

## PRD as System of Record

The AI writes all PRD content directly using Write/Edit tools. `PRD.md` in `MEMORY/WORK/{slug}/` is the single source of truth.

### What the AI writes directly

- YAML frontmatter: `task`, `slug`, `effort`, `phase`, `progress`, `mode`, `started`, `updated` (optional: `iteration`)
- All prose sections: Context, Criteria, Decisions, Verification
- Criteria checkboxes: `- [ ] ISC-1: criterion text` and `- [x] ISC-1: criterion text`
- Progress counter: `progress: 3/8`
- Phase transitions: `phase: execute`

### What hooks do (read-only)

A PostToolUse hook (`PRDSync.hook.ts`) fires on Write/Edit of PRD.md and syncs frontmatter + criteria to `work.json` for the dashboard. Hooks never write to PRD.md — they only read it.

### PRD stub creation

At Algorithm entry, a stub PRD is created immediately:

```
MEMORY/WORK/{YYYYMMDD-HHMMSS_kebab-task-description}/PRD.md
```

The stub contains frontmatter only (effort defaults to `standard`, refined later in OBSERVE).

---

## ISC Criteria

ISC (Ideal State Criteria) are the verifiable success criteria created during OBSERVE. They are written directly into the PRD as markdown checkboxes.

### Format requirements

| Requirement | Rule |
|-------------|------|
| **Length** | 8-12 words |
| **Voice** | State, not action ("Tests pass" not "Run tests") |
| **Testability** | Binary (YES/NO) |
| **Granularity** | One verifiable end-state per criterion |

### The Splitting Test

Apply to every criterion before finalising:

| Test | Rule | Example split |
|------|------|--------------|
| **"And" / "With" test** | If it contains "and", "with", "including" joining two verifiable things | "Header visible **and** footer visible" -> 2 criteria |
| **Independent failure test** | Can part A pass while part B fails? | If yes -> separate criteria |
| **Scope word test** | "All", "every", "complete", "full" -> enumerate | "All 4 tests pass" -> 4 criteria, one per test |
| **Domain boundary test** | Crosses UI/API/data/logic boundaries? | One criterion per boundary |

### Anti-criteria

Prefixed with `ISC-A`, these define what must NOT happen.

### ISC Count Gate

Cannot exit OBSERVE with fewer ISC than the effort tier floor:

| Tier | Floor |
|------|-------|
| Standard | 8 |
| Extended | 16 |
| Advanced | 24 |
| Deep | 40 |
| Comprehensive | 64 |

If below floor: decompose further using the Splitting Test. Do not proceed until the floor is met.

---

## 7-Phase Specification

### Phase 1: OBSERVE (1/7)

**Purpose:** Reverse-engineer user intent, classify effort level, create ISC criteria, select capabilities.

**Steps:**
1. **Reverse engineering** — Analyse the request: explicit wants, implied wants, explicit not-wanted, implied not-wanted, speed expectations.
2. **Effort level classification** — Select tier based on reverse engineering.
3. **ISC criteria generation** — Write criteria directly into PRD. Apply the Splitting Test to every criterion. Pass the ISC Count Gate.
4. **Capability selection** — Select skills and platform capabilities to invoke. Every selection creates a binding commitment to call it via tool in BUILD or EXECUTE.

**Output:**
```
🔎 REVERSE ENGINEERING:
 🔎 [explicit wants]
 🔎 [explicit not-wanted]
 🔎 [implied not-wanted]

💪🏼 EFFORT LEVEL: [tier] | [8 word reasoning]

[ISC criteria list from PRD]

🏹 CAPABILITIES SELECTED:
 🏹 [capability, phase, 8-word reason]
```

### Phase 2: THINK (2/7)

**Purpose:** Pressure-test and enhance the ISC.

**Steps:**
1. Identify riskiest assumptions (2-12)
2. Premortem: ways the current approach could fail (2-12)
3. Prerequisites check
4. ISC refinement: re-read every criterion through the Splitting Test lens, add criteria for uncovered failure modes
5. Write risks to PRD Context section

### Phase 3: PLAN (3/7)

**Purpose:** Finalise approach before building.

For Advanced+ effort, enter Plan Mode and add a Plan subsection to PRD Context.

### Phase 4: BUILD (4/7)

**Purpose:** Invoke selected capabilities via tool calls.

Every skill: call via `Skill` tool. Every agent: call via `Task` tool. Writing output that resembles a skill's output is not invocation — it is theatre.

### Phase 5: EXECUTE (5/7)

**Purpose:** Perform the work.

As each criterion is satisfied, immediately edit the PRD: change `- [ ]` to `- [x]`, update progress counter. Do not wait for VERIFY.

### Phase 6: VERIFY (6/7)

**Purpose:** Test every ISC criterion with evidence.

For each criterion: verify it is actually complete, mark it in the PRD, add evidence to the Verification section. Also check that every selected capability was actually invoked via tool call.

### Phase 7: LEARN (7/7)

**Purpose:** Capture what to improve next time.

Four reflection questions:
1. What should I have done differently?
2. What would a smarter algorithm have done?
3. What capabilities should I have used that I did not?
4. What would a better algorithm design look like for this task?

Write a structured JSONL reflection entry to `algorithm-reflections.jsonl`. Set PRD phase to `complete`.

---

## Capability Selection

Capabilities are selected from two sources: PAI skills (invoked via `Skill` tool) and platform capabilities (Claude Code built-in features).

### Platform capabilities

| Capability | When to select | How to invoke |
|------------|---------------|--------------|
| /simplify | After code changes | `Skill("simplify")` |
| /batch | 3+ files with similar changes | `Skill("batch", "instruction")` |
| Agent Teams | Complex multi-agent coordination | `TeamCreate` + `Agent` with team_name |
| Worktree Isolation | Parallel dev on same files | `Agent` with `isolation: "worktree"` |
| Background Agents | Non-blocking parallel work | `Agent` with `run_in_background: true` |

### Invocation obligation

Selecting a capability creates a binding commitment to call it via tool. Every selected capability must appear as a `Skill` or `Task` tool call in BUILD or EXECUTE. Selection without invocation is a critical failure.

---

## Voice Announcements

At Algorithm entry and every phase transition, a voice notification is sent:

```bash
curl -s -X POST http://localhost:8888/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Entering the PHASE_NAME phase.",
       "voice_id": "fTtv3eikoepIosk8dTZ5", "voice_enabled": true}'
```

Only the primary agent may execute voice curls. Background agents and subagents must never make voice calls.

---

## Context Compaction

At each phase boundary (Extended+ effort), if accumulated context exceeds ~60% of working context, self-summarise before proceeding.

**Preserve:** ISC status, key results, next actions.
**Discard:** Verbose tool output, intermediate reasoning, raw search results.

This prevents context rot — degraded output quality from bloated history — which is the primary cause of late-phase failures in long Algorithm runs.

---

## Context Recovery

If current phase or criteria status is unknown:

1. Read the most recent PRD from `MEMORY/WORK/` — it has all state
2. PRD frontmatter has phase, progress, effort, mode, task, slug
3. PRD body has criteria checkboxes, decisions, verification evidence
4. `~/.claude/MEMORY/STATE/work.json` has the registry of all sessions

---

## Critical Rules

- Every response uses exactly one mode format (ALGORITHM, NATIVE, or MINIMAL)
- Complete the response format before asking questions
- ISC Count Gate is mandatory — cannot exit OBSERVE below the floor
- Atomic criteria only — every criterion must pass the Splitting Test
- No phantom capabilities — selection without tool invocation is dishonest
- PRD is the AI's responsibility — no hook writes to it
- Time check at every phase — auto-compress if >150% of budget

---

## What to read next

- **[The Extension Model](/developer/extension-model/)** — How skills, hooks, and agents compose on top of the Algorithm
- **[Hook Types](/developer/hook-types/)** — Hook events that fire during Algorithm execution
- **[The Algorithm (Contributor)](/contributor/the-algorithm/)** — Design philosophy and rationale behind the Algorithm
