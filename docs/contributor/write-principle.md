---
title: Write a Constitutional Principle
description: "How to propose, word, and integrate a new founding principle into PAI."
diataxis_type: how-to
---

<!-- Source: PAI/PAISYSTEMARCHITECTURE.md (the 16 founding principles) -->

# Write a Constitutional Principle

PAI's founding principles are constitutional — they govern every design decision and cannot be violated by any feature, skill, or update. Adding a new principle is the highest-impact change you can make to the system.

## When to propose a new principle

A new principle is warranted when:

- A recurring design conflict has no clear resolution under existing principles
- A new capability domain (e.g., multi-user, enterprise) needs foundational rules
- An existing principle is too broad and needs to be split into specific guarantees

A new principle is **not** warranted when:

- The issue can be handled by a steering rule (behavioural, not constitutional)
- An existing principle already covers it (check the 16 principles first)
- The change is preference rather than principle (these go in USER configuration)

## Step 1: Study the existing principles

Read all 16 founding principles in `PAI/PAISYSTEMARCHITECTURE.md`. Each principle has:

- A title that states the principle clearly
- A rationale explaining **why** it exists
- Concrete implications for how PAI behaves

Your new principle must not contradict any existing one. If it does, you're proposing a modification, not an addition — a much higher bar.

## Step 2: Write the principle

A well-formed principle has three properties:

### It is immutable

Once adopted, the principle cannot be weakened or removed by future changes. Write it as something the system **always** does or **never** does.

```markdown
# Good: states an invariant
USER files are NEVER modified by any release.

# Bad: leaves room for exceptions
USER files should generally not be modified by releases.
```

### It is testable

Someone should be able to look at any PAI change and determine whether it violates the principle. Vague principles are unenforceable.

```markdown
# Good: binary test — does it or doesn't it?
Every CLI tool exits with code 0 on success and non-zero on failure.

# Bad: subjective — who decides "reasonable"?
CLI tools should provide reasonable error messages.
```

### It has consequences

The principle must change real decisions. If removing it would change nothing about how PAI is built, it's not a principle — it's a platitude.

```markdown
# Good: this forces real design choices
The system must function fully offline. No feature may require
an internet connection for core functionality.

# Bad: this constrains nothing
The system should be well-designed and maintainable.
```

## Step 3: Write the rationale

Every principle needs a rationale that answers:

1. **What problem does this principle prevent?** (Concrete past or anticipated scenario)
2. **Why can't this be solved at a lower level?** (Why it needs constitutional weight)
3. **What trade-offs does it create?** (What becomes harder or impossible because of this principle)

The rationale is what future contributors will read when they need to understand **why** this constraint exists.

## Step 4: Check for conflicts

Test your principle against each existing principle:

- Does it contradict any existing principle? If so, one of them is wrong.
- Does it make any existing principle redundant? If so, consider merging.
- Does it create tension with any existing principle? Tension is acceptable if the resolution is clear.

## Step 5: Submit the proposal

1. Add your principle to `PAI/PAISYSTEMARCHITECTURE.md` in the founding principles section
2. Include the full structure: title, rationale, and implications
3. Note in your PR description that this is a constitutional change
4. Expect a higher review bar — principles outlive features

## Example structure

```markdown
### N. Principle Title

**Statement of the principle in one sentence.**

Rationale explaining why this principle exists. What problem it prevents.
What trade-off it accepts. Why it needs constitutional weight.

**What this means in practice:**
- Concrete implication 1
- Concrete implication 2
- Concrete implication 3

**Key takeaway:** One sentence summary of why this matters.
```

## What to read next

- **[The 16 Founding Principles](/contributor/principles/)** — The current constitutional principles you're adding to
- **[System Architecture](/contributor/architecture/)** — The architectural context that principles govern
- **[Versioning and Compatibility](/contributor/versioning/)** — How principle changes interact with versioning rules
