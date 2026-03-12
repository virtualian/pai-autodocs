# Multi-Signal Watcher: Commits + Releases + Silent Edits

## Context

The PAI auto-docs site watches Daniel Miessler's PAI repo for changes and auto-regenerates documentation. Currently, the watcher **only detects new commits on `main`** via SHA comparison. This misses two important signals:

1. **New GitHub Releases** (e.g. v4.0.4 published) — contain version numbers, breaking changes, migration paths
2. **Silent release body edits** (e.g. v4.0.3 notes updated to reference Algorithm v3.7.0) — no `updated_at` field exists, so content hashing is required

Release notes are high-value documentation source material that the regeneration pipeline currently never sees.

## Approach

Extend the watcher to track three signals. Keep `.last-pai-sha` for backwards compatibility, add `.last-pai-state.json` for structured state.

## Files to Modify

| File | Change |
|------|--------|
| `.github/workflows/watch-pai.yml` | Rewrite: three-phase detection (commits, new release, body edits) |
| `.github/workflows/regenerate.yml` | Add new `workflow_dispatch` inputs, pass through to script |
| `scripts/regenerate.mjs` | Add release fetching, trigger-type branching, release context in prompts |
| `source-map.json` | Add `releasePages` array |
| `.last-pai-state.json` | New structured state file |
| `.last-pai-sha` | Preserved as derived file (written alongside state.json) |

## Implementation Steps

### 1. Create `.last-pai-state.json` structure

```json
{
  "sha": "2306de68a...",
  "latestRelease": {
    "tag": "v4.0.3",
    "id": 291883971,
    "publishedAt": "2026-03-02T02:30:06Z",
    "bodyHash": "sha256..."
  },
  "releaseBodyHashes": {
    "v4.0.3": "sha256...",
    "v4.0.1": "sha256...",
    "v4.0.0": "sha256..."
  }
}
```

Tracks last 5 releases. First run migrates from `.last-pai-sha` automatically.

### 2. Rewrite `watch-pai.yml`

Three detection steps:
- **Check commits**: existing SHA comparison (unchanged logic)
- **Check releases**: fetch latest 5 releases, compare tags for new release, hash bodies for silent edits
- **Update state**: write both `.last-pai-state.json` and `.last-pai-sha`, commit, trigger regeneration

Trigger `regenerate.yml` with expanded inputs:
```
pai_sha, trigger_type (commit|new_release|release_body_edit), release_tag, edited_tags
```

### 3. Update `regenerate.yml`

Add optional `workflow_dispatch` inputs with defaults so it's backwards-compatible:
- `trigger_type` (default: `commit`)
- `release_tag` (default: `""`)
- `edited_tags` (default: `""`)

Pass all through to `regenerate.mjs`. Enrich changelog entries with trigger context.

### 4. Update `regenerate.mjs`

- Parse new CLI args: `--trigger-type`, `--release-tag`, `--edited-tags`
- Add `fetchReleaseNotes(tags)` — fetches release bodies from GitHub API
- Branch page selection by trigger type:
  - `commit` → existing logic (GitHub Compare API → source-map)
  - `new_release` → `sourceMap.releasePages` + fetch release notes
  - `release_body_edit` → `sourceMap.releasePages` + fetch edited release notes
- When commit + release coincide: union both page sets
- Pass release notes into `buildPrompt()` as additional context section

### 5. Add `releasePages` to `source-map.json`

```json
"releasePages": [
  "user/what-is-pai",
  "user/install-pai",
  "contributor/architecture",
  "contributor/upgrade-pai"
]
```

Small set (4 pages) where release context matters most. Keeps costs low.

## Sequencing

1. `source-map.json` — add `releasePages` (no runtime effect yet)
2. `regenerate.mjs` — add new args + release logic (backwards-compatible with defaults)
3. `regenerate.yml` — add new inputs + pass-through (backwards-compatible)
4. `watch-pai.yml` — rewrite with three-phase detection (activates everything)
5. Seed `.last-pai-state.json` with current state
6. Test via `gh workflow run watch-pai.yml`

## Verification

1. **Local**: Verify `regenerate.mjs` parses new args and falls back gracefully when absent
2. **Build**: `npx docusaurus build` passes after source-map.json changes
3. **Push + trigger**: Push to branch, then manually trigger `watch-pai.yml` via `gh workflow run watch-pai.yml` and verify:
   - `.last-pai-state.json` is created with correct structure
   - `.last-pai-sha` continues to be written
   - No false positives on release body edits (hashes match on first run)
4. **Simulate edit**: Manually trigger `regenerate.yml` with `trigger_type=release_body_edit` and verify release notes appear in the prompt context
