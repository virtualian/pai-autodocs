---
task: Create Tier 1 shared infrastructure documentation pages
slug: 20260307-171711_tier1-shared-infrastructure-docs
effort: extended
phase: complete
progress: 28/28
mode: interactive
started: 2026-03-07T17:17:11Z
updated: 2026-03-07T17:20:00Z
---

## Context

Creating the 5 Tier 1 "shared infrastructure" pages from the documentation expansion plan (Plans/documentation-expansion.md). These are reference and explanation pages that all subsequent tutorials and how-tos will link to. The plan was produced by a 5-member council debate.

The 5 pages:
1. Directory Conventions (Reference, Contributor)
2. Skill File Format (Reference, Developer)
3. SYSTEM vs USER Boundary (Explanation, Power-User)
4. Troubleshooting (Reference, User)
5. Privacy and Your Data (Explanation, User)

Content must be sourced from actual PAI system files, match existing doc site voice (direct, concrete, no fluff), and follow existing frontmatter/footer conventions.

### Risks
- Page 3 (SYSTEM/USER Boundary) overlaps with existing contributor/system-user-model.md — must differentiate as power-user-focused (practical, "what's mine") vs contributor-focused (architectural, "how it works")
- Troubleshooting content requires knowledge of real user pain points — risk of generic/unhelpful entries
- Privacy page must be accurate about what actually goes to Claude API vs stays local

## Criteria

### Page 1: Directory Conventions (Contributor, Reference)
- [x] ISC-1: File exists at docs/contributor/directory-conventions.md
- [x] ISC-2: Frontmatter has title, description, diataxis_type: reference
- [x] ISC-3: Documents canonical file paths for SYSTEM and USER tiers
- [x] ISC-4: Documents naming rules (TitleCase for system, _ALLCAPS for personal)
- [x] ISC-5: Documents where new files of each type belong

### Page 2: Skill File Format (Developer, Reference)
- [x] ISC-6: File exists at docs/developer/skill-file-format.md
- [x] ISC-7: Frontmatter has title, description, diataxis_type: reference
- [x] ISC-8: Documents SKILL.md frontmatter schema with field descriptions
- [x] ISC-9: Documents required vs optional fields
- [x] ISC-10: Documents USE WHEN trigger syntax with examples

### Page 3: SYSTEM vs USER Boundary (Power-User, Explanation)
- [x] ISC-11: File exists at docs/power-user/system-user-boundary.md
- [x] ISC-12: Frontmatter has title, description, diataxis_type: explanation
- [x] ISC-13: Explains which files are yours vs infrastructure (practical focus)
- [x] ISC-14: Explains what happens when SYSTEM and USER files collide
- [x] ISC-15: Differentiated from contributor/system-user-model.md (no code, no architecture)

### Page 4: Troubleshooting (User, Reference)
- [x] ISC-16: File exists at docs/user/troubleshooting.md
- [x] ISC-17: Frontmatter has title, description, diataxis_type: reference
- [x] ISC-18: Covers at least 6 common problems with symptoms and fixes
- [x] ISC-19: Organized by symptom (what the user sees) not by component

### Page 5: Privacy and Your Data (User, Explanation)
- [x] ISC-20: File exists at docs/user/privacy.md
- [x] ISC-21: Frontmatter has title, description, diataxis_type: explanation
- [x] ISC-22: Explains what PAI stores locally and where
- [x] ISC-23: Explains what goes to Claude's API vs what stays local

### Infrastructure
- [x] ISC-24: sidebars.js updated with all 5 new pages in correct Diataxis categories
- [x] ISC-25: contributor/overview.md links to directory-conventions
- [x] ISC-26: developer/overview.md links to skill-file-format
- [x] ISC-27: power-user/overview.md links to system-user-boundary
- [x] ISC-28: user/overview.md links to troubleshooting and privacy

## Decisions

- Page 3 uses practical "what's mine" framing with no code examples — the contributor page has the TypeScript getConfigPath() implementation
- Troubleshooting organized by 8 symptom headings, each with cause/fix tables
- Privacy page explicitly acknowledges Claude API as cloud service, links to Anthropic policies rather than restating them
- Directory conventions page includes "Where new files belong" table as its primary reference value

## Verification
