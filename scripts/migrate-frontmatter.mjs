#!/usr/bin/env node

/**
 * Migrates Starlight frontmatter to Docusaurus format:
 * 1. Removes sidebar: { order: N } blocks
 * 2. Adds diataxis_type frontmatter from the diataxis map
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DOCS_DIR = join(import.meta.dirname, '..', 'docs');

const diataxisMap = {
  'user/what-is-pai': 'explanation',
  'user/memory': 'explanation',
  'user/self-improvement': 'explanation',
  'user/install-pai': 'tutorial',
  'user/first-session': 'tutorial',
  'user/giving-feedback': 'how-to',
  'user/working-with-skills': 'how-to',
  'user/skills-catalog': 'reference',
  'power-user/how-customization-works': 'explanation',
  'power-user/customize-your-ai': 'tutorial',
  'power-user/configure-skills': 'how-to',
  'power-user/configuration': 'reference',
  'developer/extension-model': 'explanation',
  'developer/first-skill': 'tutorial',
  'developer/first-hook': 'tutorial',
  'developer/write-hooks': 'how-to',
  'developer/manage-memory': 'how-to',
  'developer/set-up-agents': 'how-to',
  'developer/algorithm': 'reference',
  'developer/hook-types': 'reference',
  'developer/agent-types': 'reference',
  'developer/tools-reference': 'reference',
  'contributor/architecture': 'explanation',
  'contributor/the-algorithm': 'explanation',
  'contributor/memory-and-learning': 'explanation',
  'contributor/cli-first': 'explanation',
  'contributor/system-user-model': 'explanation',
  'contributor/upgrade-pai': 'how-to',
};

function walkDir(dir, prefix = '') {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const relPath = prefix ? `${prefix}/${entry}` : entry;
    if (statSync(fullPath).isDirectory()) {
      files.push(...walkDir(fullPath, relPath));
    } else if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
      files.push({ fullPath, relPath });
    }
  }
  return files;
}

let modified = 0;
for (const { fullPath, relPath } of walkDir(DOCS_DIR)) {
  let content = readFileSync(fullPath, 'utf-8');
  const pageKey = relPath.replace(/\.mdx?$/, '');
  let changed = false;

  // Remove Starlight sidebar frontmatter (sidebar:\n  order: N)
  const sidebarRegex = /sidebar:\s*\n\s+order:\s*\d+\s*\n/;
  if (sidebarRegex.test(content)) {
    content = content.replace(sidebarRegex, '');
    changed = true;
  }

  // Add diataxis_type if mapped
  const dtype = diataxisMap[pageKey];
  if (dtype && !content.includes('diataxis_type:')) {
    // Insert before closing ---
    content = content.replace(/^---\n([\s\S]*?)---/, (match, fm) => {
      return `---\n${fm.trimEnd()}\ndiataxis_type: ${dtype}\n---`;
    });
    changed = true;
  }

  if (changed) {
    writeFileSync(fullPath, content, 'utf-8');
    modified++;
    console.log(`  Updated: ${relPath}${dtype ? ` (diataxis: ${dtype})` : ''}`);
  }
}

console.log(`\nDone. ${modified} files updated.`);
