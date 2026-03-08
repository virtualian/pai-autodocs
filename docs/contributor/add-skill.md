---
title: "Add a Skill to Core"
description: "Promote a personal skill to the system skill set, including the canonicalisation checklist."
diataxis_type: how-to
---

<!-- Source: PAI skill structure conventions, SYSTEM/USER boundary rules -->

# Add a Skill to Core

This guide covers how to promote a personal skill from your USER directory into the core PAI skill set, available to all users.

## When to promote a skill

Promote a skill when all three conditions are met:

1. **Stable** — you have used the skill for at least a few weeks without needing structural changes
2. **Generally useful** — the skill solves a problem that other PAI users would encounter, not just your personal workflow
3. **No personal data** — the skill contains zero hardcoded paths, API keys, usernames, or personal preferences

If any condition is not met, keep the skill in your `USER/SKILLS/` directory. Personal skills work perfectly there — promotion to core is not a quality judgment, it is a scope judgment.

## The canonicalization checklist

Follow every step. Skipping one will result in PR rejection.

### 1. Rename from _ALLCAPS to TitleCase

Personal skills use the `_ALLCAPS` convention. Core skills use `TitleCase`.

```
_BLOGGING  →  Blogging
_QUICKNOTE →  QuickNote
_CODEREV   →  CodeReview
```

Rename the directory and update all internal references.

### 2. Remove all personal data

Search every file in the skill for:

- Hardcoded file paths (`/Users/yourname/...`)
- API keys or tokens
- Personal email addresses or usernames
- References to personal projects or systems
- Any content that only makes sense in your specific setup

Replace these with generic placeholders or move them to the Customization section (step 3).

### 3. Add a Customization section

Core skills must support user-specific configuration through the customization system. Add a section to SKILL.md:

```markdown
## Customization

User-specific settings are loaded from `USER/SKILLCUSTOMIZATIONS/SkillName/`.
See the customization guide for details on overriding defaults.
```

This tells PAI to check for user overrides at runtime, keeping the core skill generic while allowing personalization.

### 4. Ensure SKILL.md has proper frontmatter

The SKILL.md file must include structured frontmatter:

```markdown
---
name: SkillName
description: >
  USE WHEN the user asks to [specific trigger]. This skill handles
  [domain] by [method].
---
```

The `USE WHEN` phrase in the description is critical — it tells PAI's skill activation system when to engage this skill. Be specific and cover the common trigger patterns.

### 5. Add at least 2-3 examples

Include realistic usage examples in the SKILL.md body:

```markdown
## Examples

### [Descriptive scenario name]
"[Exact user request that triggers this skill]"

### [Another scenario]
"[Different request demonstrating another use case]"

### [Edge case or advanced usage]
"[Request showing the skill's range]"
```

Each example should demonstrate a distinct use case. Avoid trivial variations of the same request.

### 6. Create .help.md for every tool

Every TypeScript tool in the `Tools/` directory must have a matching `.help.md` file:

```
Tools/
├── SearchNotes.ts
├── SearchNotes.help.md    # Required
├── CreateNote.ts
└── CreateNote.help.md     # Required
```

The help file should describe what the tool does, its arguments, and example invocations. This is what users see when they ask for help with the tool.

### 7. Verify naming conventions

Check every file in the skill directory:

| Item | Convention | Correct | Wrong |
|------|-----------|---------|-------|
| Skill directory | TitleCase | `QuickNote/` | `quickNote/`, `QUICKNOTE/` |
| SKILL.md | All caps with extension | `SKILL.md` | `skill.md`, `Skill.md` |
| Tool files | TitleCase | `SearchNotes.ts` | `searchNotes.ts`, `search_notes.ts` |
| Help files | Match tool name | `SearchNotes.help.md` | `searchnotes.help.md` |
| Workflow files | TitleCase | `DailyReview.md` | `daily-review.md` |

### 8. Test with a fresh install

The most important validation: does the skill work without your USER customizations?

1. Temporarily rename or remove your `USER/SKILLCUSTOMIZATIONS/SkillName/` directory
2. Restart your PAI session
3. Trigger the skill with each of your documented examples
4. Verify the skill activates correctly and produces useful output
5. Restore your customizations when done

If the skill fails or produces poor results without your customizations, it still has personal dependencies that need to be extracted.

## Directory structure verification

Before submitting, confirm your skill matches this structure exactly:

```
skills/SkillName/
├── SKILL.md              # Required — skill definition with frontmatter
├── Tools/                # Required (even if empty)
│   ├── ToolName.ts       # TitleCase, one per operation
│   └── ToolName.help.md  # Matches tool name exactly
└── Workflows/            # Optional
    └── WorkflowName.md   # TitleCase
```

## Submit as a pull request

Follow the contribution workflow from the [Your First Contribution](/contributor/first-contribution/) tutorial:

1. Create a branch: `git checkout -b feat/add-skillname-to-core`
2. Add the skill directory to `skills/`
3. Commit with a conventional message: `feat: add SkillName to core skill set`
4. Push and open a PR

## What reviewers check

Maintainers will verify:

| Check | What they look for |
|-------|--------------------|
| Personal data | No hardcoded paths, keys, usernames, or personal references |
| Naming | TitleCase directory, correct file naming throughout |
| Trigger quality | USE WHEN description is specific enough to activate correctly, broad enough to catch variants |
| Example coverage | At least 2-3 examples covering distinct use cases |
| Help files | Every tool has a matching .help.md |
| Fresh install | Skill works without USER customizations |
| Scope | Skill covers one domain (UNIX philosophy), does not overlap with existing core skills |

## What to read next

- **[Your First Skill](/developer/first-skill/)** — Build a personal skill before promoting one to core
- **[Directory Conventions](/contributor/directory-conventions/)** — Full reference for PAI's naming and structure rules
- **[Skill File Format](/developer/skill-file-format/)** — Detailed specification of the SKILL.md format
