'use client';

import { AboutHeroBlock } from '@/components/page-blocks/about-hero-block';
import { CvBioBlock } from '@/components/page-blocks/cv-bio-block';
import { MediaBlock } from '@/components/page-blocks/media-block';
import { StatementCtaBlock } from '@/components/page-blocks/statement-cta-block';
import { SectionReveal } from '@/components/shared/section-reveal';
import type { PageQuery, PageQueryVariables } from '@/tina/__generated__/types';
import { useTina } from 'tinacms/dist/react';

type Props = {
  query: string;
  variables: PageQueryVariables;
  data: PageQuery;
};

export default function AboutClientPage(props: Props) {
  const { data } = useTina(props);

  return (
    <>
      {data.page.blocks?.map((block, index) => {
        if (!block) return null;
        switch (block.__typename) {
          case 'PageBlocksAboutHero':
            return (
              <SectionReveal key={index}>
                <AboutHeroBlock block={block} />
              </SectionReveal>
            );
          case 'PageBlocksMedia':
            return (
              <SectionReveal key={index}>
                <MediaBlock block={block} />
              </SectionReveal>
            );
          case 'PageBlocksCvBio':
            return (
              <SectionReveal key={index}>
                <CvBioBlock block={block} />
              </SectionReveal>
            );
          case 'PageBlocksStatementCta':
            return (
              <SectionReveal key={index}>
                <StatementCtaBlock block={block} />
              </SectionReveal>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
