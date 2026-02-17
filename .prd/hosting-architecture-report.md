# PAI Auto-Docs: Hosting & Auto-Update Architecture

> Generated 2026-02-17 — Decision report for hosting provider and auto-update pipeline

---

## Recommendation: Vercel + GitHub Actions Cron Watcher

### The Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1: CHANGE DETECTION                                      │
│  GitHub Actions cron (every 15 min)                             │
│  → Polls danielmiessler/Personal_AI_Infrastructure via API      │
│  → Compares latest commit SHA against stored SHA                │
│  → If changed: triggers Layer 2                                 │
└─────────────────┬───────────────────────────────────────────────┘
                  │ (only on change)
┌─────────────────▼───────────────────────────────────────────────┐
│  LAYER 2: CONTENT REGENERATION                                  │
│  GitHub Actions workflow                                        │
│  → git diff to find changed source files                        │
│  → Map source files → doc pages (e.g. MEMORYSYSTEM.md → memory) │
│  → Claude API calls to regenerate ONLY affected pages           │
│  → Commit updated .md files + bump site version                 │
│  → Push to main                                                 │
└─────────────────┬───────────────────────────────────────────────┘
                  │ (push to main)
┌─────────────────▼───────────────────────────────────────────────┐
│  LAYER 3: DEPLOY                                                │
│  Vercel auto-deploys on push to main                            │
│  → Builds Astro site (~5s)                                      │
│  → Deploys to edge CDN                                          │
│  → Live in ~30s                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Why Vercel over Alternatives

| Factor | Vercel | GitHub Pages | Cloudflare Pages |
|--------|--------|-------------|-----------------|
| **Deploy speed** | ~30s to global CDN | ~2-5 min | ~1-2 min |
| **Preview deploys** | Every PR gets a URL | Manual only | Every PR gets a URL |
| **API-triggered builds** | Deploy hooks (URL POST) | `workflow_dispatch` only | Deploy hooks |
| **Edge CDN** | Global, automatic | Limited | Global, automatic |
| **Custom domain** | Free | Free | Free |
| **Cost** | Free tier: 100 deploys/day | Free | Free tier: 500 deploys/month |
| **Astro support** | First-class adapter | Static only | Static + SSR |
| **Build logs** | Dashboard + API | Actions tab | Dashboard |

**Vercel wins because:**

1. **Deploy hooks** — Vercel gives you a URL you can POST to trigger a build. Simpler than `workflow_dispatch` for programmatic triggering.
2. **Speed** — 30 seconds from push to live globally. GitHub Pages takes 2-5 minutes.
3. **Preview deployments** — every branch/PR gets its own URL automatically. Useful when the regeneration pipeline creates PRs for review.
4. **Vercel MCP tools available** — we can manage deployments programmatically from PAI.

---

## Layer 1: Change Detection Design

```yaml
# .github/workflows/watch-pai.yml
name: Watch PAI Repository
on:
  schedule:
    - cron: '*/15 * * * *'  # Every 15 minutes
  workflow_dispatch:         # Manual trigger

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Check upstream for changes
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          # Get latest commit SHA from PAI repo
          LATEST=$(gh api repos/danielmiessler/Personal_AI_Infrastructure/commits/main --jq '.sha')
          STORED=$(cat .last-pai-sha 2>/dev/null || echo "none")

          if [ "$LATEST" != "$STORED" ]; then
            echo "PAI repo changed: $STORED → $LATEST"
            echo "$LATEST" > .last-pai-sha
            echo "CHANGED=true" >> $GITHUB_ENV
            echo "NEW_SHA=$LATEST" >> $GITHUB_ENV
          else
            echo "No changes detected"
            echo "CHANGED=false" >> $GITHUB_ENV
          fi

      - name: Trigger regeneration
        if: env.CHANGED == 'true'
        run: gh workflow run regenerate.yml -f pai_sha=${{ env.NEW_SHA }}
```

**Why 15-minute polling, not webhook:** We can't add webhooks to Daniel's repo. 15 minutes is the minimum GitHub Actions cron interval and gives near-real-time detection.

**Faster alternative:** A Cloudflare Worker polling every 60 seconds (free tier: 100k requests/day). Gets detection latency down to 1-3 minutes total.

---

## Layer 2: Incremental Regeneration Design

```yaml
# .github/workflows/regenerate.yml
name: Regenerate Docs from PAI Source
on:
  workflow_dispatch:
    inputs:
      pai_sha:
        description: 'PAI commit SHA to generate from'
        required: true
```

The regeneration workflow:

1. **Fetch PAI source** — clone/sparse-checkout the PAI repo at the specified SHA
2. **Diff against previous** — compare with the last-processed SHA to find changed files
3. **Map source → pages** — a mapping file (`source-map.json`) says which PAI source files feed into which doc pages
4. **Regenerate affected pages** — call Claude API for each affected page
5. **Commit + push** — commit the regenerated `.md` files, bump patch version, update changelog
6. **Vercel auto-deploys** — push to main triggers Vercel build

---

## Cost Analysis

| Component | Cost | Notes |
|-----------|------|-------|
| **Vercel hosting** | $0 | Free tier: 100 deploys/day, 100GB bandwidth |
| **GitHub Actions (cron)** | $0 | Free for public repos, 2000 min/mo for private |
| **Claude API (regeneration)** | ~$0.01-0.50/update | Depends on pages affected; most updates touch 1-3 pages |
| **Total monthly (light changes)** | ~$1-5 | Assuming ~10-20 upstream changes/month |
| **Total monthly (heavy changes)** | ~$10-20 | Assuming daily upstream changes |

---

## Latency Budget

```
Upstream commit detected:     0-15 min (cron poll interval)
Regeneration workflow start:  ~30s (GitHub Actions queue)
Claude API regeneration:      ~30-120s (depends on pages affected)
Git commit + push:            ~10s
Vercel build + deploy:        ~30s
────────────────────────────────────
Total: 1-18 minutes from PAI commit to live docs
```

---

## Key Architectural Constraint

**We cannot add webhooks to Daniel's repo.** All solutions must be external watchers that poll the GitHub API. This is why Layer 1 uses cron-based polling rather than push-based webhooks.

---

## Next Steps

1. **Connect repo to Vercel** — use Vercel dashboard or MCP tools
2. **Build watcher workflow** (`watch-pai.yml`) — the cron-based change detector
3. **Build source mapping** (`source-map.json`) — which PAI files feed which doc pages
4. **Build regeneration workflow** (`regenerate.yml`) — the Claude-powered incremental updater
