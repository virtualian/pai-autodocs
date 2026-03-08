---
title: Update System Files
description: "Safely modify SYSTEM files while preserving USER customisations."
diataxis_type: how-to
---

<!-- Source: PAI SYSTEM/USER model, versioning rules, contributor workflow -->

# Update System Files

SYSTEM files are PAI's infrastructure — the files that ship with the project and define its behaviour. Updating them requires care because users have customisations in the USER layer that must survive every change.

## The golden rule

**USER files are NEVER modified by any release.** This is constitutional. Every step in this guide respects this boundary.

## Before you start

Understand which layer you're modifying:

| Layer | Path pattern | Who owns it | Can you modify? |
|-------|-------------|-------------|----------------|
| SYSTEM | `~/.claude/skills/PAI/SYSTEM/` | PAI project | Yes, with versioning rules |
| USER | `~/.claude/skills/PAI/USER/` | The user | Never |

If your change requires the user to update their USER files, it is a **breaking change** and requires a MAJOR version bump.

## Step 1: Identify the file to change

SYSTEM files include:

- `SYSTEM/AISTEERINGRULES.md` — default behavioural rules
- `SYSTEM/ARCHITECTURE.md` — system architecture reference
- `SYSTEM/` skill files — core skill configurations
- `PAI/*.md` — system documentation and specifications

Read the file first. Understand its current structure, what depends on it, and whether USER files reference it.

## Step 2: Check for USER dependencies

Search for references to the file you're changing:

```bash
# Check if USER files reference this SYSTEM file
grep -r "SYSTEM/filename" ~/.claude/skills/PAI/USER/
```

If USER files depend on the SYSTEM file's structure (field names, section headings, etc.), changing that structure is a breaking change.

## Step 3: Classify the change

| Change type | Version impact | User action needed |
|-------------|---------------|-------------------|
| Fix a typo or clarify wording | PATCH | None |
| Add a new optional field or section | MINOR | None |
| Add a new SYSTEM file | MINOR | None |
| Rename a field or section | MAJOR | User updates references |
| Change the expected format | MAJOR | User updates their files |
| Remove a file | MAJOR | User removes references |

## Step 4: Make the change

For PATCH and MINOR changes:

1. Edit the SYSTEM file directly
2. Ensure existing structure is preserved — new content is additive
3. Test that the change doesn't alter behaviour for users who haven't customised

For MAJOR changes:

1. Write a migration guide before making the change
2. Document the before/after with concrete examples
3. Include the migration guide in the changelog

## Step 5: Test compatibility

Verify that a default PAI installation (no USER customisations) works correctly:

```bash
# Temporarily rename USER directory to test with defaults only
mv ~/.claude/skills/PAI/USER ~/.claude/skills/PAI/USER.backup
# Run a test session
# Restore USER directory
mv ~/.claude/skills/PAI/USER.backup ~/.claude/skills/PAI/USER
```

Then verify that an installation with USER customisations also works:

1. Start a new session with USER files in place
2. Trigger the functionality affected by your change
3. Confirm USER overrides still take effect

## Step 6: Update the changelog

Add an entry to the changelog describing your change. Use the standard format:

| PATCH | MINOR | MAJOR |
|-------|-------|-------|
| "Fixed wording in steering rule X" | "Added new steering rule: Y" | "Renamed SYSTEM/X.md to SYSTEM/Y.md — see migration guide" |

## Common mistakes

| Mistake | Why it's wrong | What to do instead |
|---------|---------------|-------------------|
| Editing a USER file "to fix it" | Violates the constitutional boundary | Add a SYSTEM default that the USER file can override |
| Renaming a SYSTEM file without a migration guide | Users' references break silently | Write the migration guide first |
| Adding required fields to a format | Existing USER files missing the field will break | Make new fields optional with defaults |
| Removing a SYSTEM file that skills reference | Skills that depend on it fail | Deprecate first, remove in next MAJOR |

## What to read next

- **[Versioning and Compatibility](/contributor/versioning/)** — The semver rules that govern what counts as breaking
- **[The SYSTEM/USER Model](/contributor/system-user-model/)** — Deep dive into why the boundary exists and how it works
- **[Your First Contribution](/contributor/first-contribution/)** — The general contribution workflow that wraps around this process
