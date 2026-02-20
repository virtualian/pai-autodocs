---
title: Upgrade PAI
description: How to safely upgrade between PAI versions while preserving your customizations.
sidebar:
  order: 1
---

PAI's SYSTEM/USER separation means upgrades are safe by design. SYSTEM files update; USER files stay untouched. Your identity, preferences, security patterns, and memory are never overwritten by an upgrade.

## Check your current version

You can identify your current PAI version in two ways:

**From the session banner** -- When you start a PAI session, the banner displays the version number along with skill and hook counts.

**From the SKILL.md header** -- The main PAI skill file includes the version:

```bash
head -5 ~/.claude/skills/PAI/SKILL.md
```

Look for the version line in the YAML frontmatter or the header section.

## Standard upgrade process

### Step 1: Back up your USER directory

Before any upgrade, back up your customizations:

```bash
cp -r ~/.claude/skills/PAI/USER ~/.claude/skills/PAI/USER.backup
```

This captures your identity, steering rules, security patterns, response format, TELOS files, and any other personal configuration.

:::tip
Also back up your `settings.json` if you have made manual edits beyond what the installer configured:

```bash
cp ~/.claude/settings.json ~/.claude/settings.json.backup
```
:::

### Step 2: Pull latest from the PAI repository

Update your local copy of the PAI repository:

```bash
cd ~/projects/PAI    # or wherever you cloned the repository
git pull origin main
```

Review the changes before proceeding:

```bash
git log --oneline -10
```

### Step 3: Copy updated SYSTEM files

Run the PAI installer or manually copy SYSTEM files to your installation:

```bash
# If using the installer
./install.sh

# Or manually copy SYSTEM files
cp -r ./skills/PAI/SYSTEM/ ~/.claude/skills/PAI/SYSTEM/
cp -r ./hooks/ ~/.claude/hooks/
```

The installer will update SYSTEM files, hooks, and tools without touching your USER directory.

### Step 4: Verify your USER customizations

Check that your USER files are still in place:

```bash
ls ~/.claude/skills/PAI/USER/
```

Confirm the files you expect are there: `DAIDENTITY.md`, `AISTEERINGRULES.md`, `TELOS/`, and any other customizations.

### Step 5: Check the changelog for breaking changes

Read the changelog for any migration notes:

```bash
cat ~/projects/PAI/CHANGELOG.md | head -50
```

Look for:

- **Breaking changes** that require USER file updates
- **New SYSTEM patterns** you may want to add to your USER security file
- **Deprecated features** that affect your customizations
- **New hooks** that may need to be registered in `settings.json`

---

## What gets updated

These files and directories change during a PAI upgrade:

| Updated | Location | Contains |
|---------|----------|----------|
| SYSTEM docs | `skills/PAI/SYSTEM/` | Architecture, memory system, skill system docs |
| Hooks | `hooks/` | Event-driven scripts |
| Tools | `skills/*/Tools/` | CLI tools within skills |
| Skill definitions | `skills/*/SKILL.md` | Updated triggers, routing, examples |
| Shared libraries | `hooks/lib/` | Common utilities used by hooks |

## What stays untouched

These files and directories are never modified by an upgrade:

| Preserved | Location | Contains |
|-----------|----------|----------|
| USER directory | `skills/PAI/USER/` | Identity, steering rules, TELOS, projects |
| settings.json user values | `settings.json` | Your daidentity, principal, custom env vars |
| Memory | `MEMORY/` | Work history, learnings, signals, failures |
| Personal skills | `skills/_*` | Any underscore-prefixed skill directories |
| API keys | `~/.config/PAI/.env` | ElevenLabs, YouTube, and other API keys |

## Post-upgrade verification

After upgrading, verify that PAI is working correctly:

1. **Start a session:**
   ```bash
   pai
   ```

2. **Check the banner** -- Verify the version number has updated and the skill/hook counts look correct.

3. **Verify skills load** -- Ask PAI a question that triggers a skill. Confirm the skill activates and responds as expected.

4. **Test voice notifications** -- If you use voice, verify that notifications still work with your configured voice ID.

5. **Check identity** -- Confirm PAI greets you by name and uses your configured AI identity.

6. **Run a quick task** -- Execute a simple task end-to-end to verify hooks, tools, and memory capture are functioning.

## Handling breaking changes

Occasionally, a PAI release introduces breaking changes that require action on your part. The changelog flags these with a `BREAKING` label.

Common breaking changes and how to handle them:

**New required fields in settings.json** -- The changelog will specify what to add. Open `settings.json` and add the required fields.

**Hook interface changes** -- If a hook's input format changes, custom hooks you have written may need updating. Compare your hooks against the updated examples in `hooks/`.

**SYSTEM file reorganization** -- If SYSTEM files are renamed or restructured, any hard-coded paths in your USER files may need updating.

**New security patterns** -- If new SYSTEM security patterns are added and you have a USER patterns file, the new patterns will not apply automatically. Review the SYSTEM patterns and manually add any you want:

```bash
# Compare your patterns against the new SYSTEM defaults
diff ~/.claude/skills/PAI/USER/PAISECURITYSYSTEM/patterns.yaml \
     ~/.claude/skills/PAI/SYSTEM/PAISECURITYSYSTEM/patterns.example.yaml
```

## Rollback

If something breaks after an upgrade, restore from your backup:

```bash
# Restore USER files
rm -rf ~/.claude/skills/PAI/USER
cp -r ~/.claude/skills/PAI/USER.backup ~/.claude/skills/PAI/USER

# Restore settings.json if needed
cp ~/.claude/settings.json.backup ~/.claude/settings.json
```

To roll back the SYSTEM files as well, check out the previous version from the PAI repository:

```bash
cd ~/projects/PAI
git log --oneline -5           # Find the previous version commit
git checkout <commit-hash>     # Check out the previous version
cp -r ./skills/PAI/SYSTEM/ ~/.claude/skills/PAI/SYSTEM/
cp -r ./hooks/ ~/.claude/hooks/
```

:::caution
After a rollback, start a fresh PAI session to ensure all hooks and skills reload from the restored files.
:::

## What to read next

- [The SYSTEM/USER Model](/contributor/system-user-model/) -- Why the two-tier architecture makes upgrades safe
- [Configuration Reference](/power-user/configuration/) -- All configuration files and their locations
