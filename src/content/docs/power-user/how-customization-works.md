---
title: How Customisation Works
description: Why PAI is deeply customisable and how its two-tier architecture makes personalisation safe.
---

## Your AI, your rules

PAI is not a one-size-fits-all tool. It is designed from the ground up to be *yours* — shaped by your preferences, your communication style, and your work patterns. This page explains why that customisation is possible and how PAI keeps it safe across upgrades.

## The two-tier architecture

Every piece of PAI configuration exists in one of two tiers:

| Tier | What it contains | Who controls it |
|------|------------------|-----------------|
| **SYSTEM** | Infrastructure defaults, core behaviour, built-in skills | PAI maintainers (Daniel Miessler) |
| **USER** | Your identity, preferences, custom rules, personal data | You |

This separation is the foundation of everything. When PAI upgrades, SYSTEM files update but USER files are never touched. Your customisations survive every upgrade automatically.

## What you can customise

PAI exposes three layers of personalisation:

### Identity
Give your AI a name, a voice, a personality. Define how it addresses you, how formal or casual it is, and what communication style it uses. This is configured in `settings.json` and `USER/DAIDENTITY.md`.

### Behaviour rules
Add steering rules that change how your AI operates. Want it to always verify visual changes with screenshots? Always ask before deploying? Never refactor code you didn't ask it to touch? These rules live in `USER/AISTEERINGRULES.md` and apply to every session.

### Skills and capabilities
Control which skills are active, configure skill-specific settings, and add your own custom skills. You can enable, disable, or reconfigure any of PAI's 27+ built-in capabilities.

## Why this matters

Most AI tools give you a settings page with a few toggles. PAI gives you a complete personalisation layer that runs as deep as the system itself. The AI you use after three months of customisation is fundamentally different from a fresh install — not because the model changed, but because *you* shaped it.

## Next steps

- **[Customise Your AI](/power-user/customize-your-ai/)** — Walk through your first customisation
- **[Configure Skills](/power-user/configure-skills/)** — Control which capabilities are active
- **[Configuration Reference](/power-user/configuration/)** — Every config file and what it does
