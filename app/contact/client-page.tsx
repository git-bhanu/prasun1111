'use client';

import { ContactBlock } from '@/components/page-blocks/contact-block';
import type { PageQuery, PageQueryVariables } from '@/tina/__generated__/types';
import { useTina } from 'tinacms/dist/react';

type Props = {
  query: string;
  variables: PageQueryVariables;
  data: PageQuery;
};

export default function ContactClientPage(props: Props) {
  const { data } = useTina(props);

  return (
    <>
      {data.page.blocks?.map((block, index) => {
        if (!block) return null;
        switch (block.__typename) {
          case 'PageBlocksContact':
            return <ContactBlock key={index} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
