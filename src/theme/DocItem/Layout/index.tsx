import React from 'react';
import Layout from '@theme-original/DocItem/Layout';
import type LayoutType from '@theme/DocItem/Layout';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import DiataxisBadge from '@site/src/components/DiataxisBadge';
import SourceBadges from '@site/src/components/SourceBadges';

type Props = React.ComponentProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): React.JSX.Element {
  const { metadata, frontMatter } = useDoc();
  const diataxisType = (frontMatter as Record<string, unknown>).diataxis_type as string | undefined;

  // Derive page path from doc ID (e.g. "user/what-is-pai")
  const pagePath = metadata.id;

  // Skip badges on overview pages, about, and changelog
  const skipBadges =
    pagePath.endsWith('/overview') || pagePath === 'about' || pagePath === 'changelog';

  return (
    <>
      {!skipBadges && diataxisType && <DiataxisBadge type={diataxisType} />}
      <Layout {...props} />
      {!skipBadges && <SourceBadges pagePath={pagePath} />}
    </>
  );
}
