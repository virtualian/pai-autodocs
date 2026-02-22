import React from 'react';
import sourceMapData from '../../source-map.json';

const PAI_REPO_BASE =
  'https://github.com/danielmiessler/Personal_AI_Infrastructure/blob/main/';

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

  return (
    <>
      <div className="source-badges" aria-label="PAI source files">
        {sources.map((source) => (
          <a
            key={source}
            className="source-badge"
            href={`${PAI_REPO_BASE}${source}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {source.replace('SYSTEM/', '')}
          </a>
        ))}
      </div>
      <div className="last-synced">Last synced from PAI: 20 Feb 2026</div>
    </>
  );
}
