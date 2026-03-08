---
title: Steering Rules Reference
description: "Complete catalog of AI behavioural rules — syntax, precedence, and conflict resolution."
diataxis_type: reference
---

<!-- Source: PAI SYSTEM/USER AISTEERINGRULES.md, internal rule engine behaviour -->

# Steering Rules Reference

Steering rules are behavioural directives that control how the AI operates. Each rule defines what **should** happen and what **should not**. They are the primary mechanism for shaping AI behaviour without changing code.

## File Locations

| Layer | Path | Purpose |
|-------|------|---------|
| SYSTEM | `~/.claude/skills/PAI/SYSTEM/AISTEERINGRULES.md` | Default rules shipped with PAI |
| USER | `~/.claude/skills/PAI/USER/AISTEERINGRULES.md` | Your personal overrides and additions |

Both files are loaded every session. You never edit the SYSTEM file — your changes go in USER.

## Load Order and Precedence

1. **SYSTEM** rules load first. These are PAI's built-in defaults.
2. **USER** rules load second. These are your additions and overrides.
3. Both are active simultaneously — they are **additive**. A USER rule does not remove a SYSTEM rule unless it directly conflicts.
4. On direct conflict, **USER wins**.

## Rule Syntax

Every rule follows the **Statement / Bad / Correct** format:

```markdown
## Rule Title

Statement
: Description of the behaviour rule.

Bad
: Example of what should NOT happen.

Correct
: Example of what SHOULD happen.
```

The `Statement` defines the rule. `Bad` shows a concrete violation. `Correct` shows compliant behaviour. All three parts are required for a well-formed rule.

## Example Rules

These are representative rules from the SYSTEM defaults:

### Surgical fixes only — never add or remove components as a fix

Statement
: When debugging, fix the broken thing. Do not add new components, wrappers, or workarounds.

Bad
: A button does not fire its click handler. You add a second event listener as a "backup".

Correct
: A button does not fire its click handler. You find the existing listener is bound to the wrong element and rebind it.

### Never assert without verification

Statement
: Do not claim something works, exists, or is correct without checking.

Bad
: "The file has been updated successfully" — without reading the file back.

Correct
: Read the file after writing, confirm the change is present, then report.

### First principles over bolt-ons

Statement
: Solve the root cause. Do not layer fixes on top of a broken foundation.

Bad
: CSS layout is broken. You add `!important` and magic numbers to force it into place.

Correct
: CSS layout is broken. You identify the flex/grid misconfiguration and fix the layout model.

### Read before modifying

Statement
: Always read a file's current contents before editing it.

Bad
: You rewrite a function from memory, accidentally dropping a parameter that was added last week.

Correct
: You read the file, see the current signature, then make your targeted edit.

### One change when debugging

Statement
: When diagnosing a bug, change one thing at a time and verify after each change.

Bad
: Three config values look suspicious. You change all three, and the bug goes away — but you do not know which change fixed it.

Correct
: You change the first value, test, observe no fix. Change the second, test, bug resolved. Revert the first change.

## Rule Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| Execution | How to do work | "Surgical fixes only", "One change when debugging" |
| Safety | What to avoid | "Never assert without verification", "Read before modifying" |
| Communication | How to interact | "State what you did, not what you will do", "No hedging language" |
| Verification | How to confirm | "Always read back after writing", "Test after every change" |

## Conflict Resolution

When a SYSTEM rule and a USER rule directly contradict each other, **USER wins**.

| SYSTEM says | USER says | Result |
|-------------|-----------|--------|
| Never auto-commit | Always auto-commit | Auto-commit is enabled |
| Use verbose output | Use terse output | Terse output is used |
| Ask before deleting files | Delete without asking | Files are deleted without confirmation |

Rules that do not conflict both remain active. If SYSTEM has 12 rules and USER has 3, and 1 of the USER rules conflicts with a SYSTEM rule, the session runs with 14 active rules (11 SYSTEM + 3 USER).

## Writing Effective Rules

**Be specific.** Vague rules are ignored or misapplied.

| Bad rule | Good rule |
|----------|-----------|
| "Be careful" | "Always verify visual changes with a screenshot before reporting done" |
| "Write good code" | "Every new function must have a JSDoc comment with param types" |
| "Don't break things" | "Run the test suite after every file edit; stop and report if any test fails" |

**Include negative examples.** The `Bad` section is what prevents misinterpretation. Without it, the AI may technically comply while violating the spirit of the rule.

**Test by triggering the scenario.** After adding a rule, deliberately create the situation it governs. If the rule says "never modify package.json without asking", try a task that would require a dependency change and confirm the AI asks first.

## What to read next

- **[Customise Your AI](/power-user/customize-your-ai/)** — Tutorial walkthrough of basic PAI customisation
- **[Configuration Reference](/power-user/configuration/)** — All settings files, their locations, and valid values
- **[SYSTEM vs USER Boundary](/power-user/system-user-boundary/)** — How the two layers interact and what belongs where
