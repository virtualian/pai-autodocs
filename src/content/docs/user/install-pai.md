---
title: Install PAI
description: Step-by-step guide to installing Personal AI Infrastructure on your system.
sidebar:
  order: 2
---

<!-- Source: https://github.com/danielmiessler/Personal_AI_Infrastructure README.md (Installation section) -->
<!-- Source: https://github.com/danielmiessler/Personal_AI_Infrastructure Releases/v3.0/.claude/PAI-Install/README.md -->
<!-- Source: https://github.com/danielmiessler/Personal_AI_Infrastructure PLATFORM.md -->

This guide walks you through installing PAI (Personal AI Infrastructure) from the official repository. By the end, you will have a working PAI installation with the `pai` command available in your terminal.

## Prerequisites

Before you begin, you need:

- **bash** and **curl** installed (present by default on macOS and most Linux distributions)
- An **internet connection** (the installer downloads tools and clones the repository)
- An **Anthropic API key** or active Claude subscription (for Claude Code)

The installer automatically handles the rest, including Git, Bun, and Claude Code. You do not need to install these manually.

### Optional prerequisites

- **ElevenLabs API key** -- required only if you want voice features (text-to-speech notifications from your Digital Assistant). You can skip this during installation and add it later.

## Step 1: Clone the repository

Clone the PAI repository and navigate to the v3.0 release directory:

```bash
git clone https://github.com/danielmiessler/Personal_AI_Infrastructure.git
cd Personal_AI_Infrastructure/Releases/v3.0
```

## Step 2: Copy the release and run the installer

Copy the release `.claude` directory to your home folder and launch the installer:

```bash
cp -r .claude ~/ && cd ~/.claude && bash PAI-Install/install.sh
```

The bootstrap script (`install.sh`) does three things:

1. Detects your operating system and architecture
2. Checks for (and installs if missing) **curl**, **Git**, and **Bun**
3. Launches the GUI installer wizard

### Installer modes

The installer supports three modes. The default is the GUI:

| Mode | How to launch | Description |
|------|---------------|-------------|
| **GUI** (default) | `bash PAI-Install/install.sh` | Electron-based graphical wizard with audio previews |
| **Web** | `bun PAI-Install/main.ts --mode web` | Web server on port 1337; open in any browser |
| **CLI** | `bun PAI-Install/main.ts --mode cli` | Terminal-only wizard with ANSI progress bars |

If the Electron GUI fails to launch, the installer falls back to CLI mode automatically.

## Step 3: Walk through the installer

The installer runs 8 steps in dependency order:

| Step | What it does |
|------|-------------|
| **1. System Detection** | Detects OS, architecture, shell, installed tools, timezone, and any existing PAI installation |
| **2. Prerequisites** | Installs missing tools: Git (via Xcode CLT or package manager), Bun (via official installer), Claude Code (via npm) |
| **3. API Keys** | Auto-completes; key collection happens during the Voice step |
| **4. Identity** | Prompts for your name, AI assistant name, timezone, and a personal catchphrase |
| **5. PAI Repository** | Clones the PAI repo to `~/.claude/` (or updates if already present) |
| **6. Configuration** | Generates `settings.json`, `.env`, directory structure, `pai` shell alias, and patches version files |
| **7. DA Voice** | Collects ElevenLabs API key, selects voice (Female/Male/Custom), installs and tests voice server |
| **8. Validation** | Verifies directory structure, settings file, API keys, voice server, and shell alias |

The **Identity** step is where you personalize PAI. You will be asked for:

- **Your name** -- the principal (human) name PAI addresses you by
- **AI assistant name** -- what to call your Digital Assistant (DA)
- **Timezone** -- used for time-aware behavior
- **Catchphrase** -- a personal phrase your DA uses

The **Voice** step is optional. If you skip the ElevenLabs API key, the installer continues without voice features and everything else works normally.

## Step 4: Verify the installation

After the installer completes, reload your shell and launch PAI:

```bash
source ~/.zshrc && pai
```

The `pai` alias is defined as `cd ~/.claude && claude`, which opens Claude Code with the full PAI context loaded.

You will know the installation worked when:

- The PAI banner appears showing system statistics (skills, hooks, workflows)
- Your DA greets you by name
- The status line at the bottom of the terminal shows learning signals and context usage

:::note
Banner counts may show 0 on first launch. They populate after your first Claude Code session ends.
:::

### Verify the directory structure

You can confirm the expected directory structure was created:

```bash
ls ~/.claude/
```

You should see at minimum:

```
settings.json
hooks/
skills/
MEMORY/
Plans/
Projects/
```

## Platform-specific notes

### macOS

macOS is the primary development platform for PAI. The installer:

- Uses **Homebrew** or **Xcode Command Line Tools** to install Git if missing
- Installs the voice server as a **LaunchAgent** (auto-starts on login)
- Clears macOS quarantine flags on the Electron installer to prevent "app is damaged" errors
- Uses `afplay` for audio playback

### Linux

Linux is fully supported (Ubuntu/Debian tested, other distributions via community). The installer:

- Uses `apt-get` or `yum` to install Git if missing
- Installs the voice server as a **systemd user service** (auto-starts on login)
- Auto-detects audio players in order: `mpg123`, `mpv`, `snap/mpv`
- Uses `notify-send` (libnotify) for desktop notifications

### Windows

Windows is **not supported** at this time. Community contributions for Windows support are welcome. If you are on Windows, use **WSL 2** (Windows Subsystem for Linux) with an Ubuntu distribution, then follow the Linux instructions.

<!-- Documentation gap: No official WSL 2 testing or guide exists in the PAI repository. The WSL path is a reasonable community recommendation but has not been formally validated by the project. -->

## Troubleshooting

### `bun: command not found`

The Bun installation may not have been added to your shell PATH. Install manually and restart your terminal:

```bash
curl -fsSL https://bun.sh/install | bash
```

Then restart your terminal or run `source ~/.zshrc`.

### Port 1337 in use (installer GUI)

If another process is using port 1337, set a different port before running the installer:

```bash
PAI_INSTALL_PORT=8080 bash PAI-Install/install.sh
```

### `pai` command not found

The shell alias was not loaded. Reload your shell configuration:

```bash
source ~/.zshrc
```

If the alias is still missing, add it manually:

```bash
echo 'alias pai="cd ~/.claude && claude"' >> ~/.zshrc
source ~/.zshrc
```

### ElevenLabs key invalid

Verify your key at [elevenlabs.io](https://elevenlabs.io). Ensure there are no trailing spaces and that the key starts with `xi-` or `sk_`. The key is stored in `~/.config/PAI/.env`.

### Voice server will not start

Check that port 8888 is free:

```bash
lsof -ti:8888
```

If a process is using the port, stop it and restart the voice server.

### Permission denied

Fix permissions on the PAI directory:

```bash
chmod -R 755 ~/.claude
```

### Interrupted installation

The installer saves state to disk. If the installation was interrupted, re-run `install.sh`. It detects the existing installation and offers to resume or start fresh.

### Electron window is blank

Use web mode as a fallback:

```bash
bun PAI-Install/main.ts --mode web
```

Then open `http://localhost:1337` in your browser.

## Next steps

With PAI installed, you are ready to:

- **Start using PAI**: Run `pai` to launch your Digital Assistant
- **Configure skills**: See [Configure Skills](/power-user/configure-skills/) to customize how PAI works for you
- **Set up your TELOS**: Define your goals, mission, and preferences in `~/.claude/skills/PAI/USER/`
- **Explore the skill library**: PAI ships with 38 skills covering research, development, content creation, security analysis, and more
