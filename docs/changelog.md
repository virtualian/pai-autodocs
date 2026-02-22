---
title: Changelog
description: Version history for the PAI Auto-Docs site.
---

All notable changes to the PAI Auto-Docs site are documented here. This changelog tracks the **documentation site** itself, not the PAI source project.

- **Site version** — semver for this documentation site (changes to content, layout, features)
- **PAI version** — which version of [PAI](https://github.com/danielmiessler/Personal_AI_Infrastructure) by Daniel Miessler the docs currently describe

---

## v1.0.0 — 2026-02-17

**PAI version:** v3.0 (Algorithm v1.5.0)

### Added

- Rebranded site from "PAI Documentation" to "PAI Auto-Docs"
- Global banner identifying PAI creator Daniel Miessler and AI-generated nature
- Custom footer with attribution: Daniel Miessler (PAI creator), Claude (generation), Diataxis (structure), @virtualian (maintenance)
- Homepage notice (Aside) explaining the unofficial, AI-generated, community-maintained nature of the docs
- README.md with project description and setup instructions
- OpenGraph meta tags for social sharing
- Version display in footer (PAI version + site version)
- This changelog page

### Changed

- `astro.config.mjs` — title, description, social link label, OG meta tags
- `package.json` — name to `pai-autodocs`, added description, bumped version to 1.0.0
- `index.mdx` — title, tagline, and hero description updated for Auto-Docs branding
- `.github/workflows/deploy.yml` — workflow name updated
- `docs/DOCUMENTATION-PLAN.md` — title updated

### Removed

- All references to old "PAI Documentation" branding
- All references to old "pai-diataxis-documentation" naming
