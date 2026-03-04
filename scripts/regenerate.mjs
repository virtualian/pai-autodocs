#!/usr/bin/env node

/**
 * PAI Auto-Docs Regeneration Script
 *
 * Fetches changed PAI source files, identifies affected doc pages via source-map.json,
 * and regenerates them using Claude Batch API (Sonnet 4.6).
 *
 * Usage:
 *   node scripts/regenerate.mjs --pai-sha <sha> --prev-sha <sha> [--trigger-type commit|new_release|release_body_edit] [--release-tag v4.0.3] [--edited-tags "v4.0.3 v4.0.1"]
 *
 * Environment:
 *   ANTHROPIC_API_KEY - Required for Claude Batch API
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// --- Config ---
const MODEL = 'claude-sonnet-4-6-20250514';
const PAI_REPO = 'danielmiessler/Personal_AI_Infrastructure';
const PAI_RAW_BASE = `https://raw.githubusercontent.com/${PAI_REPO}`;
const BATCH_API_URL = 'https://api.anthropic.com/v1/messages/batches';
const BATCH_POLL_INTERVAL_MS = 30_000; // 30 seconds
const BATCH_MAX_WAIT_MS = 3_600_000; // 1 hour
// PAI repo stores releases under Releases/{tag}/.claude/
const RELEASE_PATH_PREFIX_RE = /^Releases\/[^/]+\/\.claude\//;

// --- Args ---
const args = process.argv.slice(2);
const paiSha = getArg(args, '--pai-sha');
const prevSha = getArg(args, '--prev-sha');
const triggerType = getArg(args, '--trigger-type') || 'commit';
let releaseTag = getArg(args, '--release-tag') || '';
const editedTags = (getArg(args, '--edited-tags') || '').split(/\s+/).filter(Boolean);

if (!paiSha) {
  console.error('Usage: node regenerate.mjs --pai-sha <sha> [--prev-sha <sha>] [--trigger-type commit|new_release|release_body_edit]');
  process.exit(1);
}

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('Error: ANTHROPIC_API_KEY environment variable is required');
  process.exit(1);
}

// --- Main ---

// Resolve release tag from state file if not provided via args
if (!releaseTag) {
  releaseTag = resolveReleaseTag();
}

await main();

async function main() {
  console.log(`\n--- PAI Auto-Docs Regeneration ---`);
  console.log(`PAI SHA: ${paiSha}`);
  console.log(`Prev SHA: ${prevSha || '(full regeneration)'}`);
  console.log(`Release tag: ${releaseTag || '(unknown)'}`);
  console.log(`Trigger: ${triggerType}${releaseTag ? ` (${releaseTag})` : ''}${editedTags.length ? ` [edited: ${editedTags.join(', ')}]` : ''}`);

  if (!releaseTag) {
    console.error('Error: Could not determine release tag. Pass --release-tag or ensure .last-pai-state.json exists.');
    process.exit(1);
  }

  // 1. Load source map
  const sourceMap = JSON.parse(readFileSync(join(ROOT, 'source-map.json'), 'utf-8'));

  // 2. Determine affected pages based on trigger type
  let affectedPages;
  let releaseNotes = {};

  if (triggerType === 'commit') {
    // Existing logic: compare API → changed files → affected pages
    const changedFiles = await getChangedFiles(prevSha, paiSha);
    console.log(`\nChanged PAI files: ${changedFiles.length}`);
    changedFiles.forEach(f => console.log(`  - ${f}`));
    affectedPages = getAffectedPages(changedFiles, sourceMap.mappings);

    // If a new release also exists, include release-sensitive pages
    if (releaseTag) {
      releaseNotes = await fetchReleaseNotes([releaseTag]);
      const releasePages = sourceMap.releasePages || [];
      affectedPages = [...new Set([...affectedPages, ...releasePages])];
    }
  } else if (triggerType === 'new_release') {
    // Regenerate release-sensitive pages with release notes as context
    affectedPages = sourceMap.releasePages || [];
    releaseNotes = await fetchReleaseNotes([releaseTag]);
    console.log(`\nNew release detected: ${releaseTag}`);
  } else if (triggerType === 'release_body_edit') {
    // Regenerate release-sensitive pages with edited release notes
    affectedPages = sourceMap.releasePages || [];
    releaseNotes = await fetchReleaseNotes(editedTags);
    console.log(`\nRelease body edits detected: ${editedTags.join(', ')}`);
  } else {
    console.error(`Unknown trigger type: ${triggerType}`);
    process.exit(1);
  }

  // Deduplicate
  affectedPages = [...new Set(affectedPages)];

  if (affectedPages.length === 0) {
    console.log('\nNo doc pages affected by these changes. Done.');
    writeFileSync(join(ROOT, '.regeneration-result.json'), JSON.stringify({
      pages: [],
      paiSha,
      triggerType,
      timestamp: new Date().toISOString(),
    }));
    process.exit(0);
  }
  console.log(`\nAffected doc pages: ${affectedPages.length}`);
  affectedPages.forEach(p => console.log(`  - ${p}`));

  // 3. Fetch PAI source content for each affected page
  const pageSourceMap = sourceMap.reverse;
  const batchRequests = [];

  for (const page of affectedPages) {
    const sources = pageSourceMap[page] || [];
    const sourceContents = await fetchSources(sources, paiSha, releaseTag);
    const existingDoc = readExistingDoc(page);

    batchRequests.push({
      custom_id: encodeCustomId(page),
      params: {
        model: MODEL,
        max_tokens: 8192,
        messages: [
          {
            role: 'user',
            content: buildPrompt(page, sourceContents, existingDoc, releaseNotes),
          },
        ],
      },
    });
  }

  // 5. Submit batch request
  console.log(`\nSubmitting batch of ${batchRequests.length} requests to Claude Batch API...`);
  const batch = await submitBatch(batchRequests);
  console.log(`Batch ID: ${batch.id}`);

  // 6. Poll for completion
  console.log('Waiting for batch completion...');
  const completedBatch = await pollBatch(batch.id);

  // 7. Retrieve results and write files
  console.log('\nRetrieving results...');
  const results = await retrieveResults(completedBatch.results_url);
  let pagesWritten = 0;

  for (const result of results) {
    if (result.result.type === 'succeeded') {
      const page = decodeCustomId(result.custom_id);
      const content = result.result.message.content[0].text;
      writeDocPage(page, content);
      pagesWritten++;
      console.log(`  Updated: ${page}`);
    } else {
      console.error(`  Failed: ${decodeCustomId(result.custom_id)} — ${result.result.type}`);
    }
  }

  // 8. Write result summary
  const resultSummary = {
    pages: affectedPages,
    pagesWritten,
    paiSha,
    triggerType,
    releaseTag: releaseTag || undefined,
    timestamp: new Date().toISOString(),
  };
  writeFileSync(join(ROOT, '.regeneration-result.json'), JSON.stringify(resultSummary, null, 2));
  console.log(`\nDone. ${pagesWritten}/${affectedPages.length} pages regenerated.`);
}

// --- Functions ---

function getArg(args, name) {
  const idx = args.indexOf(name);
  return idx !== -1 ? args[idx + 1] : null;
}

async function getChangedFiles(prevSha, currentSha) {
  if (!prevSha || prevSha === 'none') {
    // No previous SHA — treat all mapped source files as changed (full regen)
    const sourceMap = JSON.parse(readFileSync(join(ROOT, 'source-map.json'), 'utf-8'));
    return Object.keys(sourceMap.mappings);
  }

  // Use GitHub compare API to get changed files
  const url = `https://api.github.com/repos/${PAI_REPO}/compare/${prevSha}...${currentSha}`;
  const res = await fetch(url, {
    headers: { 'Accept': 'application/vnd.github.v3+json' },
  });

  if (!res.ok) {
    console.warn(`GitHub compare API returned ${res.status}. Falling back to full regeneration.`);
    const sourceMap = JSON.parse(readFileSync(join(ROOT, 'source-map.json'), 'utf-8'));
    return Object.keys(sourceMap.mappings);
  }

  const data = await res.json();
  return data.files.map(f => f.filename);
}

function getAffectedPages(changedFiles, mappings) {
  const pages = new Set();
  for (const file of changedFiles) {
    // Try direct match first
    let mapped = mappings[file];
    if (!mapped) {
      // Strip versioned prefix: Releases/v4.0.3/.claude/PAI/X.md -> PAI/X.md
      // Also handle: Releases/v4.0.3/.claude/settings.json -> settings.json
      const stripped = file.replace(RELEASE_PATH_PREFIX_RE, '');
      mapped = mappings[stripped];
    }
    if (mapped) {
      mapped.forEach(page => pages.add(page));
    }
  }
  return [...pages];
}

/**
 * Resolve a canonical source name to a full repo path using the release tag.
 *
 * Canonical names in source-map.json:
 *   - "PAI/SKILL.md"            -> "Releases/{tag}/.claude/PAI/SKILL.md"
 *   - "settings.json"           -> "Releases/{tag}/.claude/settings.json"
 *   - "README.md"               -> "README.md" (repo root)
 */
function resolveSourcePath(canonicalName, tag) {
  if (canonicalName === 'README.md') {
    return 'README.md';
  }
  return `Releases/${tag}/.claude/${canonicalName}`;
}

async function fetchSources(sourceFiles, sha, tag) {
  const contents = {};
  for (const file of sourceFiles) {
    const repoPath = resolveSourcePath(file, tag);
    const url = `${PAI_RAW_BASE}/${sha}/${repoPath}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        contents[file] = await res.text();
      } else {
        console.warn(`  Could not fetch ${file} (${repoPath}): ${res.status}`);
        contents[file] = `[File not found at SHA ${sha}]`;
      }
    } catch (err) {
      console.warn(`  Error fetching ${file}: ${err.message}`);
      contents[file] = `[Fetch error: ${err.message}]`;
    }
  }
  return contents;
}

function readExistingDoc(page) {
  const mdPath = join(ROOT, 'docs', `${page}.md`);
  const mdxPath = join(ROOT, 'docs', `${page}.mdx`);
  if (existsSync(mdPath)) return readFileSync(mdPath, 'utf-8');
  if (existsSync(mdxPath)) return readFileSync(mdxPath, 'utf-8');
  return null;
}

function writeDocPage(page, content) {
  const mdPath = join(ROOT, 'docs', `${page}.md`);
  const mdxPath = join(ROOT, 'docs', `${page}.mdx`);
  // Prefer existing file extension
  const target = existsSync(mdxPath) ? mdxPath : mdPath;
  writeFileSync(target, content, 'utf-8');
}

function buildPrompt(page, sourceContents, existingDoc, releaseNotes = {}) {
  const sourceSection = Object.entries(sourceContents)
    .map(([file, content]) => `### Source: ${file}\n\n${content}`)
    .join('\n\n---\n\n');

  let releaseSection = '';
  if (Object.keys(releaseNotes).length > 0) {
    releaseSection = '\n\n## Release Notes Context\n\nThe following release notes provide additional context about recent PAI changes. Use this to update version references, migration instructions, and feature descriptions where relevant.\n\n';
    releaseSection += Object.entries(releaseNotes)
      .map(([tag, info]) => `### ${info.name} (${tag})\n\nPublished: ${info.publishedAt}\n\n${info.body}`)
      .join('\n\n---\n\n');
  }

  const existingSection = existingDoc
    ? `\n\n## Existing Documentation Page\n\nBelow is the current page. Apply a **surgical update**: change only content affected by the source changes. Preserve all frontmatter fields (title, description, diataxis_type), section ordering, cross-references, and existing content that isn't contradicted by the sources.\n\n${existingDoc}`
    : '\n\n## No Existing Page\n\nCreate a new documentation page for this topic. Include frontmatter with title, description, and diataxis_type fields.';

  // Determine content type and audience from the page path
  const [role] = page.split('/');
  const contentTypeGuidance = getContentTypeGuidance(page, role);
  const audienceGuidance = getAudienceGuidance(role);

  return `You are a technical documentation writer for PAI (Personal AI Infrastructure) by Daniel Miessler. You produce Diataxis-structured documentation for a Docusaurus 3.x site hosted on Vercel.

This site is AI-generated documentation, automatically regenerated from PAI source material using the Diataxis framework. It is not community-written — it is programmatically produced and editorially steered.

## Task

Regenerate the documentation page "${page}" based on the PAI source material below.

## The Soul of PAI (CRITICAL — Read This First)

PAI is not a tool to configure — it is an AI agent that magnifies you. Every page, especially in the Users section, must convey PAI's agentic power and soul:

- **Lead with what PAI does for the reader**, not how it works internally
- **Frame capabilities as outcomes**: "Your AI remembers your preferences across sessions" not "The memory system stores signals in MEMORY/"
- **Use-case thinking**: Consider "As a User I want to do X to achieve Y" and "What can PAI do for me?"
- **Make readers feel** what it's like to have a personal AI that already knows them, learns from their feedback, and gets measurably better over time

The #1 failure mode is writing from the builder's perspective ("here's what I built") instead of the reader's perspective ("here's what this does for me"). Avoid this at all costs.

## Output Format

Output ONLY the complete markdown file content. Start with YAML frontmatter:

\`\`\`
---
title: "Page Title"
description: "One-sentence description for SEO and sidebar"
diataxis_type: tutorial|how-to|reference|explanation
---
\`\`\`

Use Docusaurus-compatible markdown throughout:
- Admonitions: \`:::note\`, \`:::tip\`, \`:::warning\`, \`:::danger\`, \`:::info\`
- Code blocks with language identifiers
- Relative links to other doc pages (e.g., \`../user/memory\`)

## Source Fidelity (CRITICAL)

Documentation MUST be derived from the source material provided. Never invent features, behaviors, or capabilities not present in the sources.

- **Extract and transform** — restructure source information for the target audience and content type
- **No hallucination** — if the source doesn't cover something, omit it or note it briefly
- **Trust the source** — the PAI source files are the ground truth for what PAI does
- When sources contain temporal signals ("deprecated", "experimental", "planned"), reflect these accurately using Docusaurus admonitions

${contentTypeGuidance}

${audienceGuidance}

## Content Tier Rules (CRITICAL)

Each page belongs to ONE audience tier. Content from a higher tier MUST NOT leak into a lower tier.

| Tier | Forbidden Content |
|------|------------------|
| **Users** | File paths, code/config blocks, internal architecture, hook names, system directories, TypeScript, ISC rules, Algorithm phase specs, SYSTEM/USER folder structure |
| **Power-Users** | Architecture theory, TypeScript internals, cascading lookup patterns, internal mechanics |
| **Developers** | Nothing forbidden — full technical detail appropriate |
| **Contributors** | Nothing forbidden — deep architectural detail appropriate |

**The test:** If a sentence contains a file path like \`~/.claude/skills/PAI/USER/\`, it does NOT belong in a Users page. If it mentions \`TaskCreate\` or "ISC criteria must be exactly 8 words", it does NOT belong in Users.

## Integration Rules

1. **Surgical updates** — When an existing page is provided, change only what the source material affects. Do not rewrite sections that haven't changed.
2. **Preserve structure** — Keep existing section ordering, heading hierarchy, and cross-references unless the source material requires restructuring.
3. **No cross-role duplication** — If content belongs in another role's section, link to it rather than repeating it. Place detailed content where its primary audience lives.
4. **Version awareness** — When release notes are provided, integrate version references, breaking changes, and migration paths where they naturally belong. Don't force release notes into pages where they aren't relevant.
5. **Attribution** — PAI is created by Daniel Miessler. This documentation is AI-generated, structured with the Diataxis framework. Repository by @virtualian.

## Anti-Patterns to Avoid

- Tutorial with long explanations → link to explanation pages instead
- How-to that teaches basics → link to tutorial instead
- Reference with opinions or advice → keep factual
- Explanation with step-by-step instructions → link to how-to/tutorial instead
- Users page with file paths or code → move to Power-Users or Developers
- Writing from the builder's perspective ("here's what I built") instead of the reader's ("here's what this does for me")
- Inventing features not in the source material
- Removing existing content that isn't contradicted by sources

## PAI Source Material

${sourceSection}
${releaseSection}
${existingSection}`;
}

function getContentTypeGuidance(page, role) {
  // Determine diataxis type from the page's position in the site structure
  // This maps known pages to their content types based on .prd/.diataxis.md
  const typeMap = {
    // Explanations
    'user/what-is-pai': 'explanation',
    'user/memory': 'explanation',
    'user/self-improvement': 'explanation',
    'power-user/how-customization-works': 'explanation',
    'developer/extension-model': 'explanation',
    'developer/algorithm': 'reference',
    'contributor/architecture': 'explanation',
    'contributor/the-algorithm': 'explanation',
    'contributor/memory-and-learning': 'explanation',
    'contributor/cli-first': 'explanation',
    'contributor/system-user-model': 'explanation',
    // Tutorials
    'user/install-pai': 'tutorial',
    'user/first-session': 'tutorial',
    'power-user/customize-your-ai': 'tutorial',
    'developer/first-skill': 'tutorial',
    'developer/first-hook': 'tutorial',
    // How-to
    'user/giving-feedback': 'how-to',
    'user/working-with-skills': 'how-to',
    'power-user/configure-skills': 'how-to',
    'developer/write-hooks': 'how-to',
    'developer/manage-memory': 'how-to',
    'developer/set-up-agents': 'how-to',
    'contributor/upgrade-pai': 'how-to',
    // Reference
    'user/skills-catalog': 'reference',
    'power-user/configuration': 'reference',
    'developer/hook-types': 'reference',
    'developer/agent-types': 'reference',
    'developer/tools-reference': 'reference',
  };

  const type = typeMap[page] || 'explanation';

  const guidance = {
    tutorial: `## Content Type: Tutorial (Learning-Oriented)

This page is a **tutorial** — it teaches by guiding the reader through steps to achieve a meaningful result.

**Rules:**
- Use second person ("you") throughout
- Make every step explicit — show commands, expected output, what happens next
- Don't explain theory (link to explanation pages instead)
- Don't offer choices — make decisions for the learner
- End with a summary of what was learned and natural next steps
- Celebrate progress at key milestones

**Structure:** What You'll Build → Prerequisites → Steps (with expected output) → What You've Learned → Next Steps`,

    'how-to': `## Content Type: How-to Guide (Task-Oriented)

This page is a **how-to guide** — it helps an experienced user accomplish a specific goal.

**Rules:**
- Start with a clear goal statement
- Assume the reader knows PAI basics — don't teach concepts
- Use numbered steps, be specific about what to do
- Include a verification section (how to confirm success)
- Cover common problems in a troubleshooting section
- Link to explanation pages for "why" context

**Structure:** Overview/Goal → Prerequisites → Steps → Verification → Troubleshooting → Related`,

    reference: `## Content Type: Reference (Information-Oriented)

This page is a **reference** — it provides accurate, complete technical description.

**Rules:**
- Be factual — no opinions, no advice, no guidance on what to do
- Be exhaustive — cover every option, parameter, type
- Use consistent structure throughout (same format for each item)
- Include types, defaults, constraints, and examples for each item
- Don't explain why things work this way (link to explanation)
- Don't include tutorials or step-by-step instructions

**Structure:** Overview → Sections with consistent item format (Type/Default/Required/Description/Example) → See Also`,

    explanation: `## Content Type: Explanation (Understanding-Oriented)

This page is an **explanation** — it helps the reader understand concepts, design decisions, and how things work.

**Rules:**
- Provide context and background first
- Explain "why" not just "what" — design decisions, trade-offs, alternatives considered
- Connect concepts to each other — show how pieces fit together
- Don't give step-by-step instructions (link to tutorials and how-to guides)
- Don't be exhaustive about every detail (that's for reference pages)
- Use analogies and diagrams (Mermaid) when they aid understanding

**Structure:** Overview → Background/Context → Core Concepts → Design Decisions/Trade-offs → Related Concepts`,
  };

  return guidance[type] || guidance.explanation;
}

function getAudienceGuidance(role) {
  const audiences = {
    user: `## Audience: Users (Primary)

Write for people who want to USE PAI day-to-day. Convey the agentic soul of PAI — it's an AI agent that magnifies you, remembers you, learns from you, and has real capabilities.

- Lead with **outcomes and what PAI does for them**, not internals
- **FORBIDDEN in this tier:** file paths, code blocks, configuration files, directory structures, internal architecture, hook names, system directories, TypeScript, ISC rules, Algorithm phase specs
- Frame every capability as a benefit: "Your AI remembers your preferences" not "The memory system captures signals"
- Make readers feel what it's like to have a personal AI that already knows them
- Use warm, empowering language — PAI is their ally, not a tool to configure
- Think in use-cases: "As a User I want to do X to achieve Y" and "What can PAI do for me?"`,

    'power-user': `## Audience: Power-Users (Secondary)

Write for people who want to CUSTOMISE PAI's behavior, identity, and settings.

- **Configuration-focused** — show what to change, not how the internals work
- **FORBIDDEN in this tier:** architecture theory, TypeScript internals, cascading lookup implementation details, internal mechanics
- Emphasise the SYSTEM/USER two-tier model that keeps customisations safe across upgrades
- Include specific file paths, setting names, and example JSON values
- Assume familiarity with PAI basics but not with implementation details`,

    developer: `## Audience: Developers (Secondary)

Write for people who want to EXTEND their PAI install — building new skills, hooks, tools, and agents on PAI's extension model.

- **Full technical detail is appropriate** — nothing is forbidden in this tier
- Code examples, hook payloads, system architecture, TypeScript patterns
- Cover the extension model: skills, hooks, agents, and how they interact
- Include working code examples with expected behavior
- Assume programming competence and PAI familiarity`,

    contributor: `## Audience: Contributors (Tertiary)

Write for people who want to CONTRIBUTE to future versions of PAI — the open-source project itself.

- **Full technical detail is appropriate** — nothing is forbidden in this tier
- Deep architectural understanding: system design, algorithm philosophy, memory internals
- Explain design decisions and their rationale
- Connect implementation choices to PAI's core principles
- Assume strong technical background and familiarity with PAI's codebase`,
  };

  return audiences[role] || audiences.user;
}

async function fetchReleaseNotes(tags) {
  const notes = {};
  for (const tag of tags) {
    if (!tag) continue;
    const url = `https://api.github.com/repos/${PAI_REPO}/releases/tags/${tag}`;
    try {
      const res = await fetch(url, {
        headers: { 'Accept': 'application/vnd.github.v3+json' },
      });
      if (res.ok) {
        const data = await res.json();
        notes[tag] = { name: data.name, body: data.body, publishedAt: data.published_at };
        console.log(`  Fetched release notes: ${tag} (${data.name})`);
      } else {
        console.warn(`  Could not fetch release ${tag}: ${res.status}`);
      }
    } catch (err) {
      console.warn(`  Error fetching release ${tag}: ${err.message}`);
    }
  }
  return notes;
}

async function submitBatch(requests) {
  const res = await fetch(BATCH_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ requests }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Batch API submission failed (${res.status}): ${err}`);
  }

  return res.json();
}

async function pollBatch(batchId) {
  const startTime = Date.now();

  while (Date.now() - startTime < BATCH_MAX_WAIT_MS) {
    const res = await fetch(`${BATCH_API_URL}/${batchId}`, {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
    });

    if (!res.ok) {
      throw new Error(`Batch poll failed (${res.status}): ${await res.text()}`);
    }

    const batch = await res.json();
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`  [${elapsed}s] Status: ${batch.processing_status} (${batch.request_counts?.succeeded || 0}/${batch.request_counts?.processing || '?'} done)`);

    if (batch.processing_status === 'ended') {
      return batch;
    }

    await sleep(BATCH_POLL_INTERVAL_MS);
  }

  throw new Error(`Batch timed out after ${BATCH_MAX_WAIT_MS / 1000}s`);
}

async function retrieveResults(resultsUrl) {
  const res = await fetch(resultsUrl, {
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
  });

  if (!res.ok) {
    throw new Error(`Results retrieval failed (${res.status}): ${await res.text()}`);
  }

  // Batch results are JSONL (one JSON object per line)
  const text = await res.text();
  return text.trim().split('\n').map(line => JSON.parse(line));
}

/**
 * Resolve the release tag from .last-pai-state.json when not passed via CLI args.
 */
function resolveReleaseTag() {
  const statePath = join(ROOT, '.last-pai-state.json');
  if (existsSync(statePath)) {
    try {
      const state = JSON.parse(readFileSync(statePath, 'utf-8'));
      const tag = state.latestRelease?.tag;
      if (tag) {
        console.log(`Resolved release tag from state file: ${tag}`);
        return tag;
      }
    } catch (err) {
      console.warn(`Could not read state file: ${err.message}`);
    }
  }
  return '';
}

/**
 * Encode a page path as a Batch API custom_id.
 * The Batch API requires custom_id to match ^[a-zA-Z0-9_-]{1,64}$.
 * Page paths like "user/what-is-pai" contain slashes, so we replace / with --.
 */
function encodeCustomId(page) {
  return page.replace(/\//g, '--');
}

/**
 * Decode a Batch API custom_id back to a page path.
 */
function decodeCustomId(customId) {
  return customId.replace(/--/g, '/');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
