---
title: "Versioning and Compatibility"
description: "Semantic versioning rules for PAI, what constitutes a breaking change, and upgrade boundary rules."
diataxis_type: reference
---

<!-- Source: PAI release process, SYSTEM/USER boundary guarantees -->

# Versioning and Compatibility

PAI follows semantic versioning. This page defines what each version component means, what counts as a breaking change, and the guarantees PAI makes about upgrades.

## Semantic versioning

PAI uses the `MAJOR.MINOR.PATCH` format. Each component has a precise meaning:

| Component | When to increment | Example |
|-----------|-------------------|---------|
| MAJOR | Breaking changes to SYSTEM files, hook interfaces, or core architecture | 3.0 → 4.0 |
| MINOR | New skills, new hooks, new features that do not break existing setups | 4.0 → 4.1 |
| PATCH | Bug fixes, documentation improvements, minor corrections | 4.0.0 → 4.0.1 |

The version number tells you exactly what to expect from an upgrade. A PATCH upgrade is always safe. A MINOR upgrade adds capabilities. A MAJOR upgrade may require migration.

## What constitutes a breaking change

The distinction between breaking and non-breaking changes is the most important versioning concept in PAI.

| Breaking (requires MAJOR bump) | Not breaking (MINOR or PATCH) |
|-------------------------------|-------------------------------|
| Renaming a SYSTEM file | Adding a new SYSTEM file |
| Changing hook input format | Adding optional fields to hook input |
| Removing a skill from core | Adding a new skill to core |
| Changing `settings.json` required fields | Adding optional `settings.json` fields |
| Changing SKILL.md frontmatter schema | Adding optional frontmatter fields |
| Altering the Algorithm's phase structure | Adding optional steps within a phase |
| Removing a CLI tool | Adding a new CLI tool |
| Changing a tool's required arguments | Adding optional arguments to a tool |

The rule of thumb: if an existing PAI installation would break, error, or behave differently after the change without any user action, it is a breaking change.

## The SYSTEM/USER boundary guarantee

This is the most important compatibility rule in PAI. It is constitutional and has zero exceptions:

**USER files are NEVER modified by any release.**

This means:

- No release will overwrite, rename, move, or delete files in the `USER/` directory
- No release will change the expected format of USER files without a MAJOR version bump and a migration guide
- User customizations, personal skills, memory files, and TELOS data survive every upgrade intact
- The SYSTEM directory is PAI's territory; the USER directory is the user's territory

This guarantee is what makes PAI upgradeable without fear of losing personal configuration. It is the foundation of trust between the system and its users.

## Algorithm versioning

The Algorithm has its own version number (e.g., v3.7.0), independent of the PAI version. This is because the Algorithm — the Observe-Think-Plan-Build-Execute-Verify-Learn cycle — evolves on its own schedule.

| PAI Version | Algorithm Version | Relationship |
|-------------|-------------------|--------------|
| PAI 4.0.0 | Algorithm v3.5.0 | Algorithm predates this PAI release |
| PAI 4.0.1 | Algorithm v3.7.0 | Algorithm updated within a PAI patch |
| PAI 4.1.0 | Algorithm v3.7.0 | PAI updated, Algorithm unchanged |

Algorithm version changes track modifications to:

- Phase definitions (OBSERVE, THINK, PLAN, BUILD, EXECUTE, VERIFY, LEARN)
- Phase ordering and dependencies
- Required outputs from each phase
- The meta-loop structure

A PAI PATCH release can include an Algorithm version bump if the Algorithm change is backward-compatible. A breaking Algorithm change requires a PAI MAJOR bump.

## Upgrade boundary rules

What you need to do depends on the version jump:

### PATCH upgrades (e.g., 4.0.0 → 4.0.1)

- No user action required
- Pull the update and continue working
- Check the changelog if you want to know what changed

### MINOR upgrades (e.g., 4.0 → 4.1)

- Check the changelog for new features
- Opt in to new capabilities at your own pace
- New skills appear automatically but do not interfere with existing workflows
- No existing behavior changes

### MAJOR upgrades (e.g., 3.x → 4.0)

- Read the changelog and migration guide before upgrading
- USER files are still never modified, but you may need to update them to work with the new SYSTEM structure
- The migration guide will list every required change with before/after examples
- Back up your USER directory before upgrading (even though it will not be touched, caution is appropriate)

## Changelog format

Every release includes a changelog entry with four sections:

| Section | Contents |
|---------|----------|
| **Changed** | Existing behavior that was modified |
| **Added** | New features, skills, tools, or capabilities |
| **Breaking** | Changes that require user action (MAJOR releases only) |
| **Migration** | Step-by-step instructions for adapting (MAJOR releases only) |

Changelogs are cumulative — the full history is available in a single file, with the most recent release at the top.

## What to read next

- **[Upgrade PAI](/contributor/upgrade-pai/)** — Step-by-step instructions for performing each type of upgrade
- **[System Architecture](/contributor/architecture/)** — Understand the SYSTEM/USER boundary that versioning protects
- **[SYSTEM/USER Model](/contributor/system-user-model/)** — Deep dive into the boundary guarantee and its implications
