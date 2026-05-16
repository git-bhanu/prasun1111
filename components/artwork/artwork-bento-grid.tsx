'use client';

import { Fragment } from 'react';
import { ArtworkBentoCard } from './artwork-bento-card';

type Tag = {
  id?: string | null;
  title: string;
  color?: string | null;
};

type Artwork = {
  id: string;
  title: string;
  slug?: string | null;
  _sys: { filename: string };
  coverImage?: string | null;
  coverImageAlt?: string | null;
  tags?: Array<{ tag?: Tag | null } | null> | null;
  mostViewed?: boolean | null;
  printsAvailable?: boolean | null;
  displaySize?: string | null;
  orientation?: string | null;
};

export type QuoteBreak = {
  afterPosition?: number | null;
  leftText?: string | null;
  rightText?: string | null;
  rightTextFootnote?: string | null;
};

type ArtworkSection = { type: 'artworks'; artworks: Artwork[] };
type BreakSection = { type: 'quoteBreak'; quoteBreak: QuoteBreak };
type Section = ArtworkSection | BreakSection;

interface ArtworkBentoGridProps {
  artworks: Artwork[];
  quoteBreaks?: QuoteBreak[];
  onArtworkClick: (slug: string) => void;
}

function artworkSlug(a: Artwork) {
  return (a.slug ?? a._sys.filename).toLowerCase();
}

function buildSections(artworks: Artwork[], quoteBreaks: QuoteBreak[]): Section[] {
  const sorted = [...quoteBreaks].sort((a, b) => (a.afterPosition ?? 0) - (b.afterPosition ?? 0));
  const sections: Section[] = [];
  let group: Artwork[] = [];

  for (let i = 0; i < artworks.length; i++) {
    group.push(artworks[i]);
    const position = i + 1;
    const breaksHere = sorted.filter((qb) => qb.afterPosition === position);

    if (breaksHere.length > 0) {
      sections.push({ type: 'artworks', artworks: group });
      group = [];
      for (const qb of breaksHere) {
        sections.push({ type: 'quoteBreak', quoteBreak: qb });
      }
    }
  }

  if (group.length > 0) {
    sections.push({ type: 'artworks', artworks: group });
  }

  return sections;
}

function ArtworkQuoteBreak({ leftText, rightText, rightTextFootnote }: Omit<QuoteBreak, 'afterPosition'>) {
  if (!leftText && !rightText) return null;

  return (
    <div className='bg-black px-8 py-16 sm:px-10 md:px-[58px] md:py-24'>
      <div className='mx-auto grid max-w-7xl grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2'>
        {leftText && <p className='font-sedan text-2xl leading-tight text-white md:text-[2rem]'>{leftText}</p>}
        {(rightText || rightTextFootnote) && (
          <div className='space-y-6'>
            {rightText && <p className='font-sedan text-sm leading-relaxed text-white/80 md:text-base'>{rightText}</p>}
            {rightTextFootnote && <p className='font-space-grotesk text-[10px] uppercase tracking-widest text-white/60'>{rightTextFootnote}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export function ArtworkBentoGrid({ artworks, quoteBreaks = [], onArtworkClick }: ArtworkBentoGridProps) {
  const sections = buildSections(artworks, quoteBreaks);

  return (
    <div className='w-full'>
      {sections.map((section, sectionIndex) => {
        if (section.type === 'quoteBreak') {
          return (
            <ArtworkQuoteBreak
              key={sectionIndex}
              leftText={section.quoteBreak.leftText}
              rightText={section.quoteBreak.rightText}
              rightTextFootnote={section.quoteBreak.rightTextFootnote}
            />
          );
        }

        return (
          <div key={sectionIndex} className='px-8 py-6 sm:px-10 md:px-[58px] md:py-8'>
            <div className='grid grid-cols-1 gap-x-3 gap-y-12 md:grid-cols-12'>
              {section.artworks.map((artwork) => {
                const tags = (artwork.tags ?? []).map((t) => t?.tag).filter((t): t is Tag => t != null);

                return (
                  <Fragment key={artwork.id}>
                    <ArtworkBentoCard
                      title={artwork.title}
                      coverImage={artwork.coverImage}
                      coverImageAlt={artwork.coverImageAlt}
                      tags={tags}
                      mostViewed={artwork.mostViewed}
                      printsAvailable={artwork.printsAvailable}
                      displaySize={artwork.displaySize}
                      orientation={artwork.orientation}
                      onClick={() => onArtworkClick(artworkSlug(artwork))}
                    />
                  </Fragment>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
