#!/usr/bin/env node

/**
 * PAI Auto-Docs Regeneration Script
 *
 * Fetches changed PAI source files, identifies affected doc pages via source-map.json,
 * and regenerates them using Claude Batch API (Haiku 4.5).
 *
 * Usage:
 *   node scripts/regenerate.mjs --pai-sha <sha> --prev-sha <sha>
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
const MODEL = 'claude-haiku-4-5-20251001';
const PAI_REPO = 'danielmiessler/Personal_AI_Infrastructure';
const PAI_RAW_BASE = `https://raw.githubusercontent.com/${PAI_REPO}`;
const BATCH_API_URL = 'https://api.anthropic.com/v1/messages/batches';
const BATCH_POLL_INTERVAL_MS = 30_000; // 30 seconds
const BATCH_MAX_WAIT_MS = 3_600_000; // 1 hour

// --- Args ---
const args = process.argv.slice(2);
const paiSha = getArg(args, '--pai-sha');
const prevSha = getArg(args, '--prev-sha');

if (!paiSha) {
  console.error('Usage: node regenerate.mjs --pai-sha <sha> [--prev-sha <sha>]');
  process.exit(1);
}

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('Error: ANTHROPIC_API_KEY environment variable is required');
  process.exit(1);
}

// --- Main ---
await main();

async function main() {
  console.log(`\n--- PAI Auto-Docs Regeneration ---`);
  console.log(`PAI SHA: ${paiSha}`);
  console.log(`Prev SHA: ${prevSha || '(full regeneration)'}`);

  // 1. Load source map
  const sourceMap = JSON.parse(readFileSync(join(ROOT, 'source-map.json'), 'utf-8'));

  // 2. Determine changed PAI files
  const changedFiles = await getChangedFiles(prevSha, paiSha);
  console.log(`\nChanged PAI files: ${changedFiles.length}`);
  changedFiles.forEach(f => console.log(`  - ${f}`));

  // 3. Map to affected doc pages
  const affectedPages = getAffectedPages(changedFiles, sourceMap.mappings);
  if (affectedPages.length === 0) {
    console.log('\nNo doc pages affected by these changes. Done.');
    // Write empty result for the workflow
    writeFileSync(join(ROOT, '.regeneration-result.json'), JSON.stringify({
      pages: [],
      paiSha,
      timestamp: new Date().toISOString(),
    }));
    process.exit(0);
  }
  console.log(`\nAffected doc pages: ${affectedPages.length}`);
  affectedPages.forEach(p => console.log(`  - ${p}`));

  // 4. Fetch PAI source content for each affected page
  const pageSourceMap = sourceMap.reverse;
  const batchRequests = [];

  for (const page of affectedPages) {
    const sources = pageSourceMap[page] || [];
    const sourceContents = await fetchSources(sources, paiSha);
    const existingDoc = readExistingDoc(page);

    batchRequests.push({
      custom_id: page,
      params: {
        model: MODEL,
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: buildPrompt(page, sourceContents, existingDoc),
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
      const page = result.custom_id;
      const content = result.result.message.content[0].text;
      writeDocPage(page, content);
      pagesWritten++;
      console.log(`  Updated: ${page}`);
    } else {
      console.error(`  Failed: ${result.custom_id} — ${result.result.type}`);
    }
  }

  // 8. Write result summary
  const resultSummary = {
    pages: affectedPages,
    pagesWritten,
    paiSha,
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
    const mapped = mappings[file];
    if (mapped) {
      mapped.forEach(page => pages.add(page));
    }
  }
  return [...pages];
}

async function fetchSources(sourceFiles, sha) {
  const contents = {};
  for (const file of sourceFiles) {
    const url = `${PAI_RAW_BASE}/${sha}/${file}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        contents[file] = await res.text();
      } else {
        console.warn(`  Could not fetch ${file}: ${res.status}`);
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
  const mdPath = join(ROOT, 'src/content/docs', `${page}.md`);
  const mdxPath = join(ROOT, 'src/content/docs', `${page}.mdx`);
  if (existsSync(mdPath)) return readFileSync(mdPath, 'utf-8');
  if (existsSync(mdxPath)) return readFileSync(mdxPath, 'utf-8');
  return null;
}

function writeDocPage(page, content) {
  const mdPath = join(ROOT, 'src/content/docs', `${page}.md`);
  const mdxPath = join(ROOT, 'src/content/docs', `${page}.mdx`);
  // Prefer existing file extension
  const target = existsSync(mdxPath) ? mdxPath : mdPath;
  writeFileSync(target, content, 'utf-8');
}

function buildPrompt(page, sourceContents, existingDoc) {
  const sourceSection = Object.entries(sourceContents)
    .map(([file, content]) => `### Source: ${file}\n\n${content}`)
    .join('\n\n---\n\n');

  const existingSection = existingDoc
    ? `\n\n## Existing Documentation Page\n\nUpdate this page to reflect any changes in the source material. Preserve the frontmatter (title, description), overall structure, and Starlight-compatible formatting. Only change content that is affected by the source changes.\n\n${existingDoc}`
    : '\n\n## No Existing Page\n\nCreate a new documentation page for this topic.';

  return `You are a technical documentation writer for PAI (Personal AI Infrastructure) by Daniel Miessler.

## Task

Regenerate the documentation page "${page}" based on the PAI source material below. This page is part of an Astro Starlight documentation site.

## Rules

1. Output ONLY the complete markdown file content including frontmatter (---title/description---)
2. Use Starlight-compatible markdown (Astro components like <Aside>, <Card> are available via imports)
3. Follow the Diataxis framework: getting-started/* = tutorials, using-pai/* = how-to guides, customizing/* = how-to guides, developing/* = reference/explanation
4. Keep content accurate to the source material — do not invent features
5. Write for PAI users, not PAI developers (unless in the developing/ section)
6. Be concise but complete — users should be able to follow instructions successfully
7. Preserve any existing structure and section ordering where possible
8. Attribution: PAI is by Daniel Miessler. These docs are AI-generated and community-maintained.

## PAI Source Material

${sourceSection}
${existingSection}`;
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
