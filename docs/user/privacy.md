---
title: Privacy and Your Data
description: What PAI stores, where it lives, what goes to Claude's API, and what stays local.
diataxis_type: explanation
---

PAI is built to run on your machine and keep your data under your control. But because it's powered by Claude — a cloud AI — some data necessarily leaves your computer. This page explains exactly what stays local and what doesn't.

## What stays on your machine

Everything PAI stores lives under `~/.claude/` on your local filesystem. Nothing is synced to a remote server by PAI itself.

| Data | Location | Contains |
|------|----------|----------|
| Your identity | `skills/PAI/USER/DAIDENTITY.md` | Name, personality, communication preferences |
| Your goals | `skills/PAI/USER/TELOS/` | Mission, projects, beliefs, challenges |
| AI steering rules | `skills/PAI/USER/AISTEERINGRULES.md` | Behavioural rules you've defined |
| Memory | `MEMORY/` | Session history, learnings, ratings, work tracking |
| Skills | `skills/` | All skill definitions, workflows, and tools |
| Hooks | `hooks/` | Event-driven scripts |
| Configuration | `settings.json`, `CLAUDE.md` | All PAI and Claude Code settings |
| Project context | `projects/` | Per-project memories and instructions |

**All of this is just files on your disk.** You can read, edit, back up, move, or delete any of it. PAI has no remote database, no cloud storage, no account system.

## What goes to Claude's API

When you interact with PAI, your conversation is sent to Anthropic's Claude API for processing. This is how every Claude-powered tool works — the AI model runs on Anthropic's servers, not on your machine.

**What gets sent in each request:**

- Your current message
- Recent conversation history (within the context window)
- Loaded context files (CLAUDE.md, active skill definitions, relevant memory, Telos files)
- Tool call results (file contents you asked to read, command outputs, search results)

**What this means:** When PAI loads your Telos goals into context to personalise a response, those goals are sent to Claude's API as part of the request. When PAI reads a file you asked about, that file's contents are sent. The context window is the boundary — anything loaded into it goes to the API.

## What Anthropic does with your data

PAI uses Claude through Claude Code, which uses the Anthropic API. Anthropic's data policies govern what happens to your conversations:

- **Anthropic does not train on API data by default.** Conversations sent through the API are not used to train Claude models unless you explicitly opt in.
- **Anthropic retains API logs for safety purposes** for a limited period, as described in their usage policy.
- **You can review Anthropic's privacy practices** on their website at anthropic.com.

:::note
PAI does not add any additional data collection on top of what Claude Code and the Anthropic API already do. PAI is a local layer — it reads and writes files on your machine, and uses the API exactly as Claude Code does.
:::

## What PAI never does

- **Never syncs your data to a remote server** — all storage is local files
- **Never sends data to anyone other than Anthropic's API** — no telemetry, no analytics, no third-party services (unless you configure integrations like ElevenLabs voice or ntfy notifications)
- **Never commits personal data to version control** — USER files and `_ALLCAPS` skill directories are excluded from git
- **Never shares personal data across PAI installations** — your USER directory is yours alone

## Your integrations

If you've configured optional integrations, those services receive data too:

| Integration | What it receives | Purpose |
|-------------|-----------------|---------|
| ElevenLabs | Text of voice notifications | Text-to-speech for spoken feedback |
| ntfy | Notification text | Push notifications to your devices |
| Discord | Notification text | Team/server alerts |
| Bright Data | URLs you scrape | Web scraping proxy |
| Apify | Social media queries | Social media data extraction |

Each integration is opt-in. If you haven't configured it, no data flows to it.

## Sensitive data boundaries

PAI has built-in separation for sensitive data:

| Directory | Protection level |
|-----------|-----------------|
| `skills/PAI/USER/` | **RESTRICTED** — personal data, finances, health, contacts. Never leaves this directory. |
| `skills/PAI/WORK/` | **RESTRICTED** — client data, consulting deliverables. Never leaves this directory. |
| `~/.claude/` (general) | **PRIVATE** — never make public, never commit to public repos |

PAI's steering rules and security conventions are designed to keep content within these boundaries. Content from USER/ and WORK/ directories should never appear outside them or in public repositories.

## Practical implications

**If you're working with sensitive information:** It will be sent to Claude's API as part of your conversation. This is true of any AI tool that uses cloud models. If this is a concern, review Anthropic's data handling policies before proceeding.

**If you want to audit what's stored:** Everything is in `~/.claude/`. Browse it, read it, delete anything you want. There's no hidden state.

**If you want to move your data:** Copy your `~/.claude/` directory to a new machine. Your entire AI identity, memory, and configuration travel with it.

**If you want to delete everything:** Remove `~/.claude/`. PAI has no remote state to clean up.

## What to read next

- **[What is PAI?](/user/what-is-pai/)** — Understand what PAI is and how it works
- **[Your AI Remembers](/user/memory/)** — How the memory system works and what it stores
- **[SYSTEM vs USER: What's Yours](/power-user/system-user-boundary/)** — Understand which files you control
