import React from 'react';

const labels: Record<string, string> = {
  explanation: 'Explanation',
  tutorial: 'Tutorials',
  'how-to': 'How-to',
  reference: 'Reference',
};

interface DiataxisBadgeProps {
  type: string;
}

export default function DiataxisBadge({ type }: DiataxisBadgeProps): React.JSX.Element | null {
  const label = labels[type];
  if (!label) return null;

  return (
    <span className={`diataxis-badge diataxis-badge--${type}`}>
      {label}
    </span>
  );
}
