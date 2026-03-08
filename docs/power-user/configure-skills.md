---
title: Configure Skills
description: Control which skills are active and customise how they behave so PAI does exactly what you need.
diataxis_type: how-to
---

Skills are PAI's modular capability system. Each skill handles a specific domain -- research, security, art generation, content creation, and more. This guide covers how to discover, invoke, customize, and manage skills in your PAI installation.

## How skills work

Skills are stored as directories under `~/.claude/skills/`. Each skill has a `SKILL.md` file containing:

1. **YAML frontmatter** with a `name` and `description` (including a `USE WHEN` clause that tells Claude Code when to activate the skill)
2. **A markdown body** with workflow routing, examples, and documentation

At session startup, Claude Code reads the YAML frontmatter from every `SKILL.md` file to build its routing table. When your request matches a skill's `USE WHEN` clause, that skill activates and its full body loads into context.

## List available skills

To see all installed skills, list the skills directory:

```bash
ls ~/.claude/skills/
```

PAI ships with dozens of system skills. You will see directories like:

```
Agents/        Council/       FirstPrinciples/  PAI/         Research/
Art/           CreateCLI/     Fabric/           Parser/      Science/
Browser/       CreateSkill/   OSINT/            Prompting/   Telos/
...
```

To see what a specific skill does, read its SKILL.md frontmatter:

```bash
head -5 ~/.claude/skills/Research/SKILL.md
```

This shows the skill name and description, including the `USE WHEN` trigger clause.

### System skills vs. personal skills

PAI has two categories of skills:

| Type | Naming convention | Contains personal data | Shareable |
|------|-------------------|----------------------|-----------|
| **System skills** | TitleCase (`Research`, `Browser`) | No | Yes, via PAI Packs |
| **Personal skills** | Underscore + ALL CAPS (`_BLOGGING`, `_METRICS`) | Yes | Never |

List only your personal skills:

```bash
ls -1 ~/.claude/skills/ | grep "^_"
```

Personal skills are prefixed with an underscore so they sort first in directory listings and are automatically excluded from PAI pack exports.

## Invoke a skill

Skills activate in two ways:

### 1. Automatic activation (intent matching)

The most common way to invoke a skill is to simply describe what you want. PAI uses **intent matching**, not exact string matching. The `USE WHEN` clause in each skill's description defines the intent triggers.

For example, if the Research skill has:

```yaml
description: Deep research workflow. USE WHEN user wants to research, investigate, or analyze a topic.
```

Then any of these requests would activate it:

- "Research the latest trends in AI agents"
- "Investigate this company's background"
- "I need to analyze this market segment"

You do not need to name the skill explicitly. PAI routes based on what you are trying to accomplish.

### 2. Slash commands

Some skills register as Claude Code slash commands. You can invoke them directly:

```
/research latest AI agent frameworks
```

To see available slash commands in your session, type `/` and press Tab in Claude Code.

## Skill directory structure

Every skill follows a consistent structure:

```
SkillName/
├── SKILL.md              # Main skill file (routing, triggers, examples)
├── QuickStart.md         # Context/reference files (loaded on demand)
├── ApiReference.md       # Additional documentation
├── Workflows/            # Step-by-step execution procedures
│   ├── Create.md
│   └── Update.md
└── Tools/                # CLI tools for automation
    ├── Analyze.ts
    └── Analyze.help.md
```

Key conventions:

- **SKILL.md** is the entry point and always uppercase
- **Context files** (guides, references) live in the skill root directory, not in subdirectories
- **Workflows/** contains execution procedures only (actions that change state or produce output)
- **Tools/** contains CLI tools written in TypeScript with Bun
- All file names use **TitleCase** (`CreateReport.md`, not `create-report.md`)
- The folder structure is **flat** -- maximum 2 levels deep

### SKILL.md anatomy

A typical SKILL.md has this structure:

```yaml
---
name: Research
description: Deep research workflow. USE WHEN user wants to research, investigate, or analyze a topic OR deep dive into a subject.
---
```

```markdown
# Research

Deep research and investigation system.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **Investigate** | "research this", "deep dive" | `Workflows/Investigate.md` |
| **Summarize** | "summarize findings" | `Workflows/Summarize.md` |

## Examples

**Example 1: Topic research**
User: "Research the state of AI code generation tools"
-> Invokes Investigate workflow
-> Produces structured research report

**Example 2: Quick summary**
User: "Summarize what we found about competitor X"
-> Invokes Summarize workflow
-> Returns concise findings summary
```

The **Workflow Routing** table maps trigger phrases to workflow files. The **Examples** section shows Claude Code the expected input-to-output patterns (2-3 examples per skill).

## Customize a skill

System skills are designed to be personalized without modifying the skill itself. PAI uses a **customization overlay system** stored in a separate directory.

### Step 1: Create the customization directory

```bash
mkdir -p ~/.claude/skills/PAI/USER/SKILLCUSTOMIZATIONS/SkillName
```

Replace `SkillName` with the exact TitleCase name of the skill (for example, `Research`, `Art`, `Browser`).

### Step 2: Create the EXTEND.yaml manifest

Every customization directory requires an `EXTEND.yaml` file:

```yaml
# ~/.claude/skills/PAI/USER/SKILLCUSTOMIZATIONS/Research/EXTEND.yaml
---
skill: Research
extends:
  - PREFERENCES.md
merge_strategy: append
enabled: true
description: "Custom research preferences and sources"
```

The `merge_strategy` controls how your customizations combine with the skill defaults:

| Strategy | Behavior |
|----------|----------|
| `append` | Add your items to existing configuration (default) |
| `override` | Replace default behavior entirely |
| `deep_merge` | Recursive merge of nested objects |

### Step 3: Create your preferences file

```markdown
<!-- ~/.claude/skills/PAI/USER/SKILLCUSTOMIZATIONS/Research/PREFERENCES.md -->

# Research Preferences

## Preferred Sources
- Academic papers from arXiv and Google Scholar
- Industry reports from credible analysts
- Primary documentation over blog posts

## Output Format
- Always include source citations
- Structure findings as numbered key takeaways
- Flag confidence levels (high/medium/low) for each finding
```

### Step 4: Add additional configuration files (optional)

You can add more files beyond `PREFERENCES.md`. List them in the `extends` array in `EXTEND.yaml`:

```yaml
extends:
  - PREFERENCES.md
  - FavoriteSources.md
  - OutputTemplates.md
```

When the skill executes, it checks for customizations at `~/.claude/skills/PAI/USER/SKILLCUSTOMIZATIONS/{SkillName}/` and loads them before proceeding.

### Customization examples from PAI

PAI ships with several customization directories as examples:

```
~/.claude/skills/PAI/USER/SKILLCUSTOMIZATIONS/
├── Art/
│   ├── EXTEND.yaml
│   ├── PREFERENCES.md          # Aesthetic preferences
│   ├── CharacterSpecs.md       # Character design specifications
│   └── SceneConstruction.md    # Scene building guidelines
├── Agents/
│   ├── EXTEND.yaml
│   ├── PREFERENCES.md          # Named agent summary
│   └── VoiceConfig.json        # ElevenLabs voice mappings
└── FrontendDesign/
    ├── EXTEND.yaml
    └── PREFERENCES.md          # Design tokens, color palette
```

## Enable or disable skills

### Disable a skill customization

To temporarily disable your customizations for a skill without deleting them, set `enabled: false` in the `EXTEND.yaml`:

```yaml
enabled: false
```

The skill will revert to its default behavior. Set it back to `true` to re-enable.

### Remove a skill entirely

To prevent a skill from being discovered by Claude Code, move or rename its directory:

```bash
mv ~/.claude/skills/SkillName ~/.claude/skills/_disabled_SkillName
```

Since Claude Code reads `SKILL.md` files at session startup for routing, removing or renaming the directory effectively disables the skill. Restart your PAI session for the change to take effect.

<!-- Documentation gap: PAI does not have a formal enable/disable mechanism for entire skills (only for customizations via EXTEND.yaml). Moving/renaming the directory is the practical approach based on how skill discovery works. -->

## Skill configuration files reference

| File | Purpose | Required |
|------|---------|----------|
| `SKILL.md` | Main skill definition with YAML frontmatter and workflow routing | Yes |
| `EXTEND.yaml` | Customization manifest (in SKILLCUSTOMIZATIONS directory) | Only for customizations |
| `PREFERENCES.md` | User preferences for the skill | Only for customizations |
| `Workflows/*.md` | Step-by-step execution procedures | Per skill needs |
| `Tools/*.ts` | CLI tools (TypeScript, run with Bun) | Per skill needs |
| `Tools/*.help.md` | Documentation for CLI tools | One per tool |

### YAML frontmatter rules

The `SKILL.md` frontmatter has specific requirements:

- **`name`** must use TitleCase (`Research`, not `research` or `RESEARCH`)
- **`description`** must be a single line (not multi-line with `|`)
- **`USE WHEN`** keyword is mandatory in the description (Claude Code parses this for activation)
- Maximum 1024 characters for the description (Anthropic hard limit)
- No separate `triggers:` or `workflows:` arrays in the YAML

### Optional YAML fields

Skills that implement systematic investigation can declare Science Protocol compliance:

```yaml
---
name: Research
description: Deep research workflow. USE WHEN research, investigate, analyze.
implements: Science
science_cycle_time: meso
---
```

The `science_cycle_time` options are:

| Level | Cycle time | Use case |
|-------|------------|----------|
| `micro` | Seconds to minutes | Most skills (implicit) |
| `meso` | Hours to days | Evals, Research, Development |
| `macro` | Weeks to months | Major architecture work |

## Workflow routing and triggers

Workflow routing connects user intent to specific workflow files. The routing table in `SKILL.md` determines which workflow runs:

```markdown
## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **Create** | "write a post", "new article" | `Workflows/Create.md` |
| **Publish** | "publish", "deploy" | `Workflows/Publish.md` |
```

When the skill activates, Claude Code matches your request against the trigger descriptions and loads the corresponding workflow file.

### Workflows call tools

Workflows can call CLI tools stored in the `Tools/` directory. Workflows map user intent to tool flags using intent-to-flag mapping tables:

```markdown
## Model Selection

| User says | Flag | Use case |
|-----------|------|----------|
| "fast", "quick" | `--model haiku` | Speed priority |
| "best quality" | `--model opus` | Quality priority |
| (default) | `--model sonnet` | Balanced |
```

This pattern lets the same tool serve different needs based on what you asked for.

### Dynamic loading

For skills with extensive documentation, PAI uses a dynamic loading pattern. The `SKILL.md` stays minimal (30-50 lines of routing and quick reference), and additional context files in the skill root are loaded on demand:

```bash
# Context files load only when workflows reference them
SkillSearch('art aesthetic')    # Loads Aesthetic.md from skill root
SkillSearch('art examples')     # Loads Examples.md from skill root
```

This reduces token usage by approximately 70% per invocation when the full documentation is not needed.

## Create a new skill

PAI includes a `CreateSkill` skill for scaffolding new skills. You can invoke it with:

```
Create a new skill called MySkillName that handles [description of what it does]
```

The `CreateSkill` skill generates the required directory structure, SKILL.md with proper YAML frontmatter, and starter workflow files.

Alternatively, create a skill manually:

1. Create the directory:
   ```bash
   mkdir -p ~/.claude/skills/MySkill/{Workflows,Tools}
   ```

2. Create `SKILL.md` with the required structure:
   ```yaml
   ---
   name: MySkill
   description: Does the thing. USE WHEN user wants to do the thing OR needs the thing done.
   ---
   ```

3. Add workflow routing and examples in the markdown body

4. Add workflow files in `Workflows/` and CLI tools in `Tools/` as needed

Restart your PAI session for the new skill to be discovered.

## Verify your configuration

After making changes to skills or customizations, verify everything is wired up correctly:

1. **Check that the skill directory exists and has SKILL.md:**
   ```bash
   ls ~/.claude/skills/MySkill/SKILL.md
   ```

2. **Check that the YAML frontmatter has a USE WHEN clause:**
   ```bash
   head -5 ~/.claude/skills/MySkill/SKILL.md
   ```

3. **Check that customizations are in the right place:**
   ```bash
   ls ~/.claude/skills/PAI/USER/SKILLCUSTOMIZATIONS/MySkill/
   ```

4. **Start a new PAI session** to pick up changes:
   ```bash
   pai
   ```

5. **Test the skill** by making a request that matches its trigger:
   ```
   [Your request matching the USE WHEN clause]
   ```

You will know it worked when the skill announces its activation with a voice notification (if configured) and text output such as:

```
Running the **WorkflowName** workflow in the **MySkill** skill to accomplish the task...
```

## Next steps

- [Working With Skills](/user/working-with-skills/) -- practical guide to using skills day-to-day
- [Skills Catalog](/user/skills-catalog/) -- browse every built-in skill
- [Configuration Reference](/power-user/configuration/) -- all config files and their locations
- [Your First Skill](/developer/first-skill/) -- build your own skill from scratch
