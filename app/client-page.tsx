"use client";

import { ArtistIntroBlock } from "@/components/page-blocks/artist-intro-block";
import { DesignSliderBlock } from "@/components/page-blocks/design-slider-block";
import { FeaturedSliderBlock } from "@/components/page-blocks/featured-slider-block";
import { ArtworkSliderBlock } from "@/components/page-blocks/artwork-slider-block";
import { HeroStatementBlock } from "@/components/page-blocks/hero-statement-block";
import { InstallationSliderBlock } from "@/components/page-blocks/installation-slider-block";
import { MovieListBlock } from "@/components/page-blocks/movie-list-block";
import { ShopBlock } from "@/components/page-blocks/shop-block";
import { SectionReveal } from "@/components/shared/section-reveal";
import type { PageQuery, PageQueryVariables } from "@/tina/__generated__/types";
import { useTina } from "tinacms/dist/react";

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
          case "PageBlocksHeroStatement":
            return (
              <SectionReveal key={`${block.__typename}-${index}`}>
                <HeroStatementBlock block={block} />
              </SectionReveal>
            );
          case "PageBlocksArtistIntro":
            return (
              <SectionReveal key={`${block.__typename}-${index}`}>
                <ArtistIntroBlock block={block} />
              </SectionReveal>
            );
          case "PageBlocksFeaturedWorkSlider":
            return (
              <SectionReveal key={`${block.__typename}-${index}`}>
                <ArtworkSliderBlock block={block as any} />
              </SectionReveal>
            );
          case "PageBlocksFeaturedSlider":
            return (
              <FeaturedSliderBlock
                key={`${block.__typename}-${index}`}
                block={block as any}
              />
            );
          case "PageBlocksInstallationSlider":
            return (
              <SectionReveal key={`${block.__typename}-${index}`}>
                <InstallationSliderBlock block={block as any} />
              </SectionReveal>
            );
          case "PageBlocksMovieList":
            return (
              <SectionReveal key={`${block.__typename}-${index}`}>
                <MovieListBlock block={block as any} />
              </SectionReveal>
            );
          case "PageBlocksDesignSlider":
            return (
              <SectionReveal key={`${block.__typename}-${index}`}>
                <DesignSliderBlock block={block as any} />
              </SectionReveal>
            );
          case "PageBlocksShop":
            return (
              <SectionReveal key={`${block.__typename}-${index}`}>
                <ShopBlock block={block} />
              </SectionReveal>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
