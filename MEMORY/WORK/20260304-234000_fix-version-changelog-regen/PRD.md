---
task: Fix site version bump and changelog update on regen
slug: 20260304-234000_fix-version-changelog-regen
effort: standard
phase: complete
progress: 8/8
mode: interactive
started: 2026-03-04T23:40:00-08:00
updated: 2026-03-04T23:42:00-08:00
---

## Context

Issue #25: The regeneration workflow's post-regen steps (version bump, changelog, commit) have never run in production. Investigation found one critical bug and one robustness improvement.

**Bug:** Commit message uses bash `${}` syntax for GitHub Actions variables (`${steps.result.outputs.pages_written}`, `${inputs.pai_sha:0:7}`), which expand to empty in GHA run blocks. Should use `${{ }}`.

**Verified working:** sed pattern for footer version, changelog heading detection (line 13), `NEW_VERSION` env var propagation, `echo -e` interpretation.

## Criteria

- [x] ISC-1: Commit message uses ${{ }} for pages_written
- [x] ISC-2: Commit message uses ${{ }} for pai_sha
- [x] ISC-3: PAI SHA correctly truncated to 7 chars in commit subject
- [x] ISC-4: Commit message body preserved with page list and full SHA
- [x] ISC-5: Changelog uses printf instead of echo -e for robustness
- [x] ISC-6: No other GHA expression syntax errors in workflow
- [x] ISC-7: Workflow YAML is valid
- [x] ISC-8: Build still passes

## Decisions

## Verification
