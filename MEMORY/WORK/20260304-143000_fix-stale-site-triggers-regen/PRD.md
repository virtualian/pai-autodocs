---
task: Fix stale site triggers and regenerate docs
slug: 20260304-143000_fix-stale-site-triggers-regen
effort: extended
phase: complete
progress: 18/18
mode: interactive
started: 2026-03-04T14:30:00-08:00
updated: 2026-03-04T14:31:00-08:00
---

## Context

Issue #23: The PAI autodocs site is stale — still reflects v3.0.0-era content while PAI is at v4.0.3 / Algorithm v3.7.0.

**Root cause (verified):** Two bugs in the regeneration pipeline cause every regeneration attempt to fail:

1. **Source file paths are wrong (404s):** The PAI repo restructured from v3→v4. Files like `SYSTEM/PAISYSTEMARCHITECTURE.md` now live at `Releases/v4.0.3/.claude/PAI/PAISYSTEMARCHITECTURE.md`. The `source-map.json` still uses v3-era paths, so all `fetchSources()` calls 404.

2. **Batch API custom_id validation fails:** Page paths like `user/what-is-pai` contain `/` which violates the Anthropic Batch API pattern `^[a-zA-Z0-9_-]{1,64}$`.

**Watcher status (verified):** The watcher IS running correctly — it detects SHA changes and new releases, updates state, and dispatches `regenerate.yml`. The regeneration workflow has been dispatched at least twice (March 2 and 3) but both runs failed with the above errors.

**Additional issues:**
- Footer still says "PAI v3.0" and "Algorithm v1.8.0"
- `BROWSERAUTOMATION.md` no longer exists as a system doc in v4 (moved to skill)
- Watcher doesn't always pass the release tag to regeneration (needed for path resolution)

## Criteria

- [x] ISC-1: source-map.json uses canonical names without SYSTEM/ prefix
- [x] ISC-2: source-map.json removes BROWSERAUTOMATION.md mapping (doesn't exist in v4)
- [x] ISC-3: source-map.json reverse index matches updated forward mappings
- [x] ISC-4: regenerate.mjs resolves canonical names to versioned repo paths
- [x] ISC-5: resolveSourcePath handles PAI/ prefix files correctly
- [x] ISC-6: resolveSourcePath handles settings.json under .claude/ correctly
- [x] ISC-7: resolveSourcePath handles README.md at repo root correctly
- [x] ISC-8: custom_id replaces slashes with valid separator character
- [x] ISC-9: Results processing reverses custom_id encoding to page path
- [x] ISC-10: getAffectedPages strips version prefix from GitHub compare paths
- [x] ISC-11: regenerate.mjs resolves release tag from state file when not provided
- [x] ISC-12: watch-pai.yml always passes release tag to regeneration dispatch
- [x] ISC-13: Footer PAI version updated to v4.0.3
- [x] ISC-14: Footer Algorithm version updated to v3.7.0
- [x] ISC-15: Footer site version uses dynamic pattern for sed replacement
- [x] ISC-16: Source file fetch succeeds for at least one PAI source (verified via dry-run URL)
- [x] ISC-17: All batch custom_ids match ^[a-zA-Z0-9_-]{1,64}$ pattern
- [x] ISC-18: Build succeeds after all changes (npm run build)

## Decisions

## Verification
