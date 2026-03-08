---
title: Build Your First Skill
description: Create a custom PAI skill from scratch with a workflow, and learn how skills get discovered and routed.
diataxis_type: tutorial
---

<!-- Source: ~/.claude/skills/PAI/SYSTEM/SKILLSYSTEM.md (Skill System specification) -->
<!-- Source: github.com/danielmiessler/Personal_AI_Infrastructure README (Skill System primitive) -->

In this tutorial, you will build a complete PAI skill from scratch. You will create the required directory structure, write a `SKILL.md` with proper frontmatter, add a workflow, and test that PAI discovers and routes to your skill automatically. By the end, you will understand the full anatomy of a skill and how the pieces connect.

## What you will learn

- The required directory structure for a PAI skill
- How to write a `SKILL.md` with YAML frontmatter and workflow routing
- The TitleCase naming convention and why it matters
- How to create a workflow file
- How PAI discovers and activates skills
- The distinction between skills, workflows, and tools

## Prerequisites

Before starting this tutorial, you need:

- **PAI installed and working** -- you should be able to run `pai` and see the Algorithm header
- **Completed the [getting started tutorial](/user/first-session/)** -- you understand the Algorithm phases
- **A text editor** for creating files (or you can ask PAI to create them for you)
- **Basic familiarity with Markdown** syntax

---

## What you will build

You will create a **QuickNote** skill -- a simple skill that captures quick notes and saves them to a file. This is intentionally minimal so you can focus on the skill structure rather than complex logic.

When finished, you will be able to say "take a quick note" in a PAI session and have it automatically route to your skill.

---

## Step 1: Understand the skill directory structure

Every PAI skill follows a mandatory structure. Here is the skeleton:

```
SkillName/
├── SKILL.md              # Main skill file (always uppercase)
├── Tools/                # CLI tools directory (always present, even if empty)
└── Workflows/            # Workflow files
    └── WorkflowName.md   # Individual workflow
```

Three things to note:

1. **`SKILL.md`** is always uppercase. This is a convention -- it is the main entry point for every skill.
2. **`Tools/`** must always exist, even if you have no tools yet. This is a structural requirement.
3. **`Workflows/`** contains execution procedures -- step-by-step instructions for doing work.

Skills live in `~/.claude/skills/`. Let's create the directory structure now.

---

## Step 2: Create the skill directory

Open your terminal and create the QuickNote skill directories:

```bash
mkdir -p ~/.claude/skills/QuickNote/Workflows
mkdir -p ~/.claude/skills/QuickNote/Tools
```

Verify the structure:

```bash
ls -la ~/.claude/skills/QuickNote/
```

Expected output:

```
total 0
drwxr-xr-x  4 user  staff  128 Feb 16 10:00 .
drwxr-xr-x  N user  staff  NNN Feb 16 10:00 ..
drwxr-xr-x  2 user  staff   64 Feb 16 10:00 Tools
drwxr-xr-x  2 user  staff   64 Feb 16 10:00 Workflows
```

### Why TitleCase?

Notice that the directory is `QuickNote`, not `quick-note`, `quicknote`, `QUICK_NOTE`, or `quick_note`. PAI uses **TitleCase (PascalCase)** for all naming:

| Component | Wrong | Correct |
|-----------|-------|---------|
| Skill directory | `quick-note`, `QUICK_NOTE` | `QuickNote` |
| Workflow files | `capture-note.md`, `CAPTURE.md` | `CaptureNote.md` |
| Tool files | `save-note.ts` | `SaveNote.ts` |
| YAML name field | `name: quick-note` | `name: QuickNote` |

The only exception is `SKILL.md` itself, which is always uppercase by convention.

---

## Step 3: Write the SKILL.md file

The `SKILL.md` file has two parts: **YAML frontmatter** and a **Markdown body**. Create the file at `~/.claude/skills/QuickNote/SKILL.md` with the following content:

```markdown
---
name: QuickNote
description: Capture and organize quick notes. USE WHEN user wants to take a note, jot something down, capture a thought, save a reminder, OR record a quick idea.
---

# QuickNote

Capture quick notes and save them to an organized file.

## Customization

**Before executing, check for user customizations at:**
`~/.claude/skills/PAI/USER/SKILLCUSTOMIZATIONS/QuickNote/`

If this directory exists, load and apply:
- `PREFERENCES.md` - User preferences and configuration

These define user-specific preferences. If the directory does not exist, proceed with skill defaults.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **Capture** | "take a note", "jot this down", "save a thought" | `Workflows/Capture.md` |

## Examples

**Example 1: Quick thought capture**
```
User: "Take a quick note: remember to review the API rate limits before launch"
-> Invokes Capture workflow
-> Saves note with timestamp to ~/Notes/quick-notes.md
-> Confirms note was saved
```

**Example 2: Reminder note**
```
User: "Jot down that the design review is moved to Thursday"
-> Invokes Capture workflow
-> Appends timestamped note to file
-> Confirms with note content
```

## Defaults

- **Notes file:** `~/Notes/quick-notes.md`
- **Format:** Timestamped Markdown list items
- **Behavior:** Append only (never overwrite existing notes)
```

### Breaking down the frontmatter

The YAML frontmatter is the most critical part. Let's examine each element:

```yaml
---
name: QuickNote
description: Capture and organize quick notes. USE WHEN user wants to take a note, jot something down, capture a thought, save a reminder, OR record a quick idea.
---
```

**`name`** -- Must use TitleCase. Must match the directory name.

**`description`** -- This is a single line (not multi-line with `|`). It has a strict structure:

1. **What it does**: "Capture and organize quick notes."
2. **`USE WHEN` keyword**: This is mandatory. Claude Code parses this to determine when to activate the skill.
3. **Intent triggers**: Natural language descriptions of when this skill should activate, connected with `OR`.

The `USE WHEN` clause uses **intent matching, not string matching**. You do not need to list exact phrases in quotes. Instead, describe the intent: "user wants to take a note" covers "take a note", "I need to note something", "let me write that down", and many other phrasings.

:::caution
The description has a hard limit of 1024 characters (Anthropic constraint). Keep it concise.
:::

### Breaking down the Markdown body

The body contains several key sections:

1. **Brief description** -- One or two lines explaining the skill
2. **Customization block** -- Standard block for user overrides (explained in Step 7)
3. **Workflow Routing** -- Table mapping triggers to workflow files
4. **Examples** -- 2-3 concrete usage patterns (required for every skill)
5. **Defaults** -- Default configuration values

The **Workflow Routing table** has three columns:

| Column | Purpose |
|--------|---------|
| Workflow | TitleCase name matching the file name |
| Trigger | Human-readable description of when to use this workflow |
| File | Path to the workflow file relative to the skill directory |

The **Examples section** is not optional decoration. Research shows that examples improve tool selection accuracy significantly. They show Claude the full input-to-behavior-to-output pattern, not just trigger keywords.

---

## Step 4: Create the Capture workflow

Workflows are step-by-step execution procedures. They tell PAI exactly what to do when the workflow is triggered. Create the file at `~/.claude/skills/QuickNote/Workflows/Capture.md`:

```markdown
# Capture Workflow

Capture a quick note and append it to the notes file.

## Steps

1. **Extract the note content** from the user's message
   - Strip any meta-language ("take a note", "jot down that")
   - Keep the actual content to save

2. **Ensure the notes directory exists**
   ```bash
   mkdir -p ~/Notes
   ```

3. **Append the note** with a timestamp to `~/Notes/quick-notes.md`
   ```
   Format:
   - [YYYY-MM-DD HH:MM] Note content here
   ```

4. **Confirm to the user** what was saved
   - Show the note content
   - Show the file path
   - Show the timestamp

## Output Format

```
Saved note to ~/Notes/quick-notes.md:
- [2026-02-16 14:30] Your note content here
```
```

### Workflows vs reference documentation

This is a critical distinction in PAI:

| Type | Purpose | Lives in | Named like |
|------|---------|----------|------------|
| **Workflows** | Step-by-step execution procedures (things you "run") | `Workflows/` | TitleCase verbs: `Capture.md`, `Create.md`, `SyncRepo.md` |
| **Reference docs** | Information to read (guides, specs, context) | Skill root | TitleCase descriptive: `ApiReference.md`, `Examples.md` |

Workflows are actions. Reference docs are context. Never put reference documentation inside the `Workflows/` directory.

---

## Step 5: Test the skill

Start a new PAI session to pick up the new skill:

```bash
pai
```

When PAI starts, it scans the YAML frontmatter of every `SKILL.md` in `~/.claude/skills/`. Your QuickNote skill's `USE WHEN` clause is now part of the routing table.

Try invoking it:

```
Take a quick note: check the deployment logs for the memory leak issue
```

### What you should observe

1. **The Algorithm runs** -- you see the full OBSERVE through LEARN phases
2. **In the THINK phase**, the Skill Check should show:

   ```
   🔍 SKILL CHECK (validate hook hints against ISC):
   │ Hook suggested:   QuickNote
   │ ISC requires:     note capture and file persistence
   │ Final skills:     QuickNote:Capture
   ```

3. **In BUILD/EXECUTE**, PAI follows your workflow steps:
   - Creates `~/Notes/` if it does not exist
   - Appends the timestamped note to `~/Notes/quick-notes.md`

4. **In VERIFY**, the ISC criteria are checked against actual results

After execution, verify the note was saved:

```bash
cat ~/Notes/quick-notes.md
```

Expected output:

```markdown
- [2026-02-16 14:30] check the deployment logs for the memory leak issue
```

---

## Step 6: Understand how skill discovery works

Now that your skill is working, let's understand the full discovery and routing pipeline:

### Session startup

When PAI starts (`pai` command), it reads the YAML frontmatter from every `SKILL.md` file under `~/.claude/skills/`. Only the frontmatter loads at startup -- the full Markdown body is not read until the skill is actually invoked. This keeps startup fast.

```
Session Start
    │
    ▼
Scan ~/.claude/skills/*/SKILL.md
    │
    ▼
Read YAML frontmatter only (name + description)
    │
    ▼
Build routing table from USE WHEN clauses
    │
    ▼
Ready for user input
```

### Skill activation (two passes)

When you type a prompt, skill activation uses a two-pass system:

**Pass 1: Hook hints (before Algorithm starts)**

Claude Code matches your raw prompt against skill descriptions and `USE WHEN` triggers to suggest which skills might be relevant. These are draft suggestions -- starting points, not final decisions.

**Pass 2: THINK validation (after OBSERVE completes)**

In the THINK phase, with the full context of reverse-engineering and ISC criteria, PAI validates the hook's suggestions. It can:

- **Confirm** a hook suggestion that matches the ISC
- **Add** skills the hook missed but the ISC requires
- **Remove** skills the hook suggested that do not serve the ISC

Pass 2 is authoritative. It overrides Pass 1 based on ISC evidence.

### Skill invocation

Once a skill is selected, PAI:

1. Reads the full `SKILL.md` body (not just frontmatter)
2. Uses the Workflow Routing table to find the right workflow file
3. Reads and follows the workflow file step-by-step

```
User prompt: "jot down to review the API docs"
    │
    ▼
Pass 1 (Hook): suggests QuickNote
    │
    ▼
OBSERVE: reverse-engineer intent, create ISC
    │
    ▼
Pass 2 (THINK): validates QuickNote against ISC → confirmed
    │
    ▼
Load QuickNote/SKILL.md body
    │
    ▼
Route to Workflows/Capture.md via routing table
    │
    ▼
Follow Capture.md step-by-step
```

---

## Step 7: Understand skill customization

The Customization section in your SKILL.md points to a user overrides directory. This separates skill logic from personal preferences.

PAI has two categories of skills:

| Type | Naming | Contains | Shareable? |
|------|--------|----------|------------|
| **System skills** | TitleCase: `QuickNote`, `Research` | No personal data | Yes (via PAI Packs) |
| **Personal skills** | Underscore + ALL CAPS: `_BLOGGING`, `_METRICS` | Personal config, API keys | Never |

Your QuickNote skill is a system skill. To customize it without modifying the skill itself, create a customization directory with an `EXTEND.yaml` manifest and a `PREFERENCES.md`:

```bash
mkdir -p ~/.claude/skills/PAI/USER/SKILLCUSTOMIZATIONS/QuickNote
```

```yaml
# EXTEND.yaml
---
skill: QuickNote
extends:
  - PREFERENCES.md
merge_strategy: override
enabled: true
description: "Custom notes directory and format"
```

```markdown
# PREFERENCES.md
- **Notes file:** `~/Documents/MyNotes/daily-capture.md`
- **Format:** Include category tags
```

The skill checks for this directory before executing. If it exists, preferences load and override defaults. If not, defaults apply. This keeps the skill clean and shareable.

---

## Step 8: Add a second workflow

Most skills have multiple workflows. Let's add a **Review** workflow that displays recent notes. Create `~/.claude/skills/QuickNote/Workflows/Review.md`:

```markdown
# Review Workflow

Display recent notes from the quick notes file.

## Steps

1. **Check that the notes file exists** -- if not, inform the user no notes exist yet

2. **Read the notes file** and display the contents

3. **Count the total notes** and show a summary (total count, date range)

## Output Format

```
Quick Notes (N total, DATE_FIRST to DATE_LAST):

- [2026-02-16 14:30] First note here
- [2026-02-16 15:45] Second note here
```
```

Now update your `SKILL.md` to include the new workflow in the routing table:

Add a `## Workflow Routing` section:

| Workflow | Trigger | File |
|----------|---------|------|
| **Capture** | "take a note", "jot this down", "save a thought" | `Workflows/Capture.md` |
| **Review** | "show my notes", "review notes", "what did I note" | `Workflows/Review.md` |

And add a third example:

```markdown
**Example 3: Review notes**
```
User: "Show me my recent notes"
-> Invokes Review workflow
-> Reads ~/Notes/quick-notes.md
-> Displays all notes with count and date range
```
```

Test it by starting a new `pai` session and saying "Show me my quick notes." PAI should route to the Review workflow and display the note you captured in Step 5.

---

## Skill vs workflow vs tool

Now that you have built a skill, here is how the three concepts relate:

| Concept | What it is | Example |
|---------|-----------|---------|
| **Skill** | Capability domain with routing logic -- defines *when* to activate | `QuickNote/SKILL.md` |
| **Workflow** | Step-by-step execution procedure -- defines *how* to do the work | `Workflows/Capture.md` |
| **Tool** | TypeScript CLI script -- automates programmatic operations | `Tools/NoteManager.ts` |

The flow is: **Skill routes to Workflow. Workflow calls Tool (if needed).** A skill might have one workflow or twenty. Tools are optional -- many workflows operate through Claude Code's built-in capabilities without needing a custom CLI tool.

---

## What you have learned

In this tutorial, you:

- **Created a complete PAI skill** with the required directory structure
- **Wrote a SKILL.md** with proper YAML frontmatter including `USE WHEN` triggers
- **Followed the TitleCase naming convention** for directories, files, and YAML fields
- **Created two workflows** (Capture and Review) with step-by-step procedures
- **Tested skill discovery** by starting a session and invoking your skill
- **Understood the two-pass activation system** (hook hints, then THINK validation)
- **Learned the customization pattern** for separating skill logic from personal preferences
- **Distinguished skills, workflows, and tools** and how they compose

## Next steps

Here are some directions to explore from here:

- **Add a CLI tool** -- create `Tools/NoteManager.ts` that handles note operations programmatically, then call it from your workflows
- **Add context files** -- for larger skills, place reference documentation like `ApiReference.md` or `Examples.md` directly in the skill root (never in subdirectories)
- **Use dynamic loading** -- for skills with extensive documentation, keep `SKILL.md` minimal (30-50 lines) and load context files on demand via `SkillSearch`
- **Create a personal skill** -- make a `_QUICKNOTE` variant with personal configuration baked in (underscore + ALL CAPS naming)
- **Explore existing skills** -- look at `~/.claude/skills/` to see how the built-in skills are structured, paying attention to their routing tables and examples
- **Read the Skill System reference** -- the full specification covers advanced topics like Science Protocol compliance, intent matching patterns, and canonicalization
