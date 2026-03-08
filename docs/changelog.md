---
title: Changelog
description: Version history for the Personal AI Infrastructure documentation site.
---

All notable changes to this documentation site are tracked here. This changelog covers the **site itself**, not the PAI source project.

- **Minor versions** (1.x.0) — code and UX changes to the site
- **Patch versions** (1.0.x) — automated content regeneration from PAI source updates
- **PAI version** — which version of [Personal AI Infrastructure](https://github.com/danielmiessler/Personal_AI_Infrastructure) by Daniel Miessler the docs currently describe

---

## v1.2.0 — 2026-03-08

**PAI version:** v4.0.3 (Algorithm v3.7.0)

### Added

- 23 new documentation pages filling Diataxis quadrant gaps across all four audience roles
- Tutorials: first-session, first-skill, first-cli-tool, first-contribution, first-hook
- How-to guides: configure-skills, customise-behaviour, steering-rules, voice-notifications, troubleshooting, privacy, manage-memory
- Reference: skill-file-format, workflow-file-format, skill-lifecycle, directory-conventions, versioning, testing
- Explanation: system-user-boundary, principles

### Fixed

- Replaced all invented hook names (FormatReminder, AgentFactory, FailureCapture, AgentOutputCapture, ExplicitRatingCapture, ImplicitSentimentCapture, StopOrchestrator, CheckVersion, SessionSummary) with actual production hooks from THEHOOKSYSTEM.md
- Corrected hook-types.md with all 21 production hooks across 7 event types
- Removed obsolete RAW/ directory references from memory system docs (v7.0 is projects-native)
- Fixed ISC acronym from "Intent-Skill-Confidence" to "Ideal State Criteria"
- Fixed tables trapped inside markdown code fences that rendered as raw text (6 instances across 4 files)
- Removed duplicate passage in first-session.md
- Standardised skill count references to "dozens of skills" instead of conflicting 27/38 counts

### Improved

- Restructured user/memory.md and user/self-improvement.md to separate working features from roadmap
- Rewrote contributor/architecture.md data flow section for Algorithm v3.7.0 accuracy
- Corrected sidebar ordering in Contributors section to match Diataxis pattern

## v1.1.0 — 2026-03-05

**PAI version:** v4.0.3 (Algorithm v3.7.0)

### Improved

- Expanded "PAI" acronym across all entry points for newcomer accessibility
- Reworked index page hero and subtitle to lead with "Personal AI Infrastructure"
- Updated site title, announcement bar, OG meta tags, and footer to use full project name
- Added "Why does this site exist?" section to About page with Diataxis explanation
- Sidebar labels now spell out key terms ("What is Personal AI Infrastructure?", "The PAI Algorithm")
- All four role overview pages introduce the full name before using the abbreviation

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
