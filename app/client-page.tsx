'use client';

import { HeroStatementBlock } from '@/components/page-blocks/hero-statement-block';
import type { PageQuery, PageQueryVariables } from '@/tina/__generated__/types';
import { useTina } from 'tinacms/dist/react';

type ClientPageProps = {
  query: string;
  variables: PageQueryVariables;
  data: PageQuery;
};

export default function ClientPage(props: ClientPageProps) {
  const { data } = useTina(props);

  return (
    <>
      {data.page.blocks?.map((block, index) => {
        switch (block?.__typename) {
          case 'PageBlocksHeroStatement':
            return <HeroStatementBlock key={`${block.__typename}-${index}`} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
