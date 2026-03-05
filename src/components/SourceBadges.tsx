import React from 'react';
import sourceMapData from '../../source-map.json';
import stateData from '../../.last-pai-state.json';

const PAI_REPO_BASE =
  'https://github.com/danielmiessler/Personal_AI_Infrastructure/blob/main/';

const releaseTag = (stateData as Record<string, unknown> & { latestRelease?: { tag?: string } })
  .latestRelease?.tag || '';

/**
 * Resolve a canonical source name to the full repo path.
 * Same logic as resolveSourcePath() in regenerate.mjs.
 */
function resolveSourcePath(canonicalName: string): string {
  if (canonicalName === 'README.md') {
    return 'README.md';
  }
  if (!releaseTag) {
    return canonicalName;
  }
  return `Releases/${releaseTag}/.claude/${canonicalName}`;
}

/** Format ISO date string as "DD Mon YYYY" */
function formatSyncDate(): string {
  const publishedAt = (stateData as Record<string, unknown> & { latestRelease?: { publishedAt?: string } })
    .latestRelease?.publishedAt;
  if (!publishedAt) return '';
  const d = new Date(publishedAt);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface SourceBadgesProps {
  /** Doc page path relative to docs/, e.g. "user/what-is-pai" */
  pagePath: string;
}

export default function SourceBadges({ pagePath }: SourceBadgesProps): React.JSX.Element | null {
  const reverse = (sourceMapData as Record<string, unknown>).reverse as Record<string, string[]>;
  const sources = reverse[pagePath];

  if (!sources || sources.length === 0) {
    return null;
  }

  const syncDate = formatSyncDate();

  return (
    <>
      <div className="source-badges" aria-label="PAI source files">
        {sources.map((source) => (
          <a
            key={source}
            className="source-badge"
            href={`${PAI_REPO_BASE}${resolveSourcePath(source)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {source}
          </a>
        ))}
      </div>
      {syncDate && <div className="last-synced">Last synced from PAI: {syncDate}</div>}
    </>
  );
}
