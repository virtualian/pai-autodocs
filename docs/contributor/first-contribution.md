---
title: "Your First Contribution"
description: "Fork the PAI repository, make a concrete change, validate it, and submit your first pull request."
diataxis_type: tutorial
---

<!-- Source: PAI contribution workflow, GitHub PR process -->

# Your First Contribution

This tutorial walks you through the complete workflow for contributing to PAI: forking the repository, making a real change, testing it, and submitting a pull request.

## What you will learn

- The git workflow for contributing to PAI
- How to test changes locally before submitting
- The pull request process and what reviewers look for

## Prerequisites

- **Git** installed and configured with your GitHub identity
- A **GitHub account**
- **PAI installed locally** with a working session
- Familiarity with PAI's architecture — read the [System Architecture](/contributor/architecture/) page first

## Step 1: Fork and clone

Fork the `danielmiessler/Personal_AI_Infrastructure` repository on GitHub using the "Fork" button, then clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/Personal_AI_Infrastructure.git
cd Personal_AI_Infrastructure
```

Add the upstream remote so you can pull future changes:

```bash
git remote add upstream https://github.com/danielmiessler/Personal_AI_Infrastructure.git
```

## Step 2: Create a branch

Always work on a named branch, never directly on `main`. Use a descriptive name with a prefix:

```bash
git checkout -b fix/improve-quicknote-examples
```

Branch name prefixes:

| Prefix | Use when |
|--------|----------|
| `fix/` | Correcting something broken or incomplete |
| `feat/` | Adding new functionality |
| `docs/` | Documentation-only changes |
| `refactor/` | Restructuring without changing behavior |

## Step 3: Choose a contribution

Start with something small. Here are good first contributions:

| Type | Example | Difficulty |
|------|---------|------------|
| Fix a typo in SYSTEM docs | Correct spelling in PAISYSTEMARCHITECTURE.md | Easy |
| Add examples to a skill | Add new usage examples to an existing SKILL.md | Easy |
| Improve a workflow | Add error handling to a workflow step | Medium |
| Add a help.md | Create missing `.help.md` for a tool | Medium |

Pick one that matches your comfort level. Easy contributions are the best way to learn the process without risk.

## Step 4: Make the change

Here is a concrete example — adding a usage example to a skill's SKILL.md file. Suppose the `QuickNote` skill has only one example. You would edit `skills/QuickNote/SKILL.md` and add:

```markdown
## Examples

### Capture a meeting action item
"Note that Sarah will send the Q3 report by Friday."

### Log a quick idea
"Quick note: consider using webhooks instead of polling for the notification system."

### Record a decision
"Note: we decided to go with PostgreSQL over MongoDB for the user data store."
```

Each example should show a realistic user request and demonstrate a distinct use case for the skill.

## Step 5: Validate locally

Before committing, verify your change actually works:

1. Restart your PAI session to pick up the modified files
2. Trigger the changed skill with a request matching your new example
3. Confirm the skill activates and produces the expected output
4. Check that existing functionality still works — run a request that matched the old examples too

If you changed a tool's `.help.md`, verify the help text appears when the tool is invoked with `--help` or when PAI describes the tool.

## Step 6: Commit with a clear message

Use conventional commit format so the changelog can be generated automatically:

```bash
git add skills/QuickNote/SKILL.md
git commit -m "fix: add missing usage examples to QuickNote skill"
```

Conventional commit types:

| Type | Meaning |
|------|---------|
| `fix:` | A bug fix or correction |
| `feat:` | A new feature or capability |
| `docs:` | Documentation only |
| `refactor:` | Code restructuring, no behavior change |
| `chore:` | Maintenance, tooling, CI |

Keep the message under 72 characters. If you need more detail, add a blank line and a body paragraph.

## Step 7: Push and open a PR

Push your branch to your fork:

```bash
git push origin fix/improve-quicknote-examples
```

Then open a pull request on GitHub:

1. Navigate to your fork on GitHub
2. Click "Compare & pull request"
3. Set the base repository to `danielmiessler/Personal_AI_Infrastructure` and base branch to `main`
4. Write a clear PR title matching your commit message
5. In the description, explain **what** you changed and **why**
6. Submit the pull request

## Step 8: Respond to review

Maintainers will review your PR. Common feedback includes:

- Naming conventions — TitleCase for skills, conventional commits for messages
- Missing examples or help files
- Personal data that slipped in (paths, API keys, usernames)
- Scope creep — keep PRs focused on one change

If changes are requested, make them on the same branch and push again. The PR updates automatically.

## What you have learned

You now know how to fork the PAI repository, create a focused branch, make and test a change, write a clean commit message, and submit a pull request. This workflow applies to every contribution, from a one-line typo fix to a new skill.

## What to read next

- **[System Architecture](/contributor/architecture/)** — Understand the full PAI architecture before making larger contributions
- **[Directory Conventions](/contributor/directory-conventions/)** — Learn the naming and structure rules your contributions must follow
- **[Upgrade PAI](/contributor/upgrade-pai/)** — Keep your local fork in sync with upstream releases
