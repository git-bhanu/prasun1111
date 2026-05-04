'use client';

import { ArtistIntroBlock } from '@/components/page-blocks/artist-intro-block';
import { FeaturedWorkSliderBlock } from '@/components/page-blocks/featured-work-slider-block';
import { HeroStatementBlock } from '@/components/page-blocks/hero-statement-block';
import { InstallationSliderBlock } from '@/components/page-blocks/installation-slider-block';
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
          case 'PageBlocksArtistIntro':
            return <ArtistIntroBlock key={`${block.__typename}-${index}`} block={block} />;
          case 'PageBlocksFeaturedWorkSlider':
            return <FeaturedWorkSliderBlock key={`${block.__typename}-${index}`} block={block} />;
          case 'PageBlocksInstallationSlider':
            return <InstallationSliderBlock key={`${block.__typename}-${index}`} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
