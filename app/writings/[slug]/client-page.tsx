'use client';

import { HeaderBlock } from '@/components/blocks/header-block';
import { ImageBlock } from '@/components/blocks/image-block';
import { SpaceBlock } from '@/components/blocks/space-block';
import { TwoColumnTextBlock } from '@/components/blocks/two-column-text-block';
import { VideoBlock } from '@/components/blocks/video-block';
import { ActionButton } from '@/components/shared/action-button';
import { BlurUpImage } from '@/components/shared/blur-up-image';
import { WritingTitle } from '@/components/writings/writing-title';
import type { WritingQuery, WritingQueryVariables } from '@/tina/__generated__/types';
import { useRef } from 'react';
import { useTina } from 'tinacms/dist/react';

type Props = {
  query: string;
  data: WritingQuery;
  variables: WritingQueryVariables;
};

function formatWritingDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    const day = d.getUTCDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
    const month = d.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' }).toUpperCase();
    const year = d.getUTCFullYear();
    return `${day}${suffix} ${month} ${year}`;
  } catch {
    return iso;
  }
}

function blockWrapperClass(width: string, verticalPadding: string) {
  switch (width) {
    case 'full':
      return `w-full ${verticalPadding}`;
    case 'wide':
      return `w-full px-[5svw] md:pl-[10svw] md:pr-[10svw] ${verticalPadding}`;
    case 'narrow':
    default:
      return `w-full px-[5svw] md:pl-[10svw] md:pr-[10svw] md:max-w-[75svw] ${verticalPadding}`;
  }
}

export default function WritingDetailClientPage({ query, data, variables }: Props) {
  const { data: tinaData } = useTina({ query, data, variables });
  const writing = tinaData.writing;
  const articleRef = useRef<HTMLElement>(null);

  const formattedDate = formatWritingDate(writing.date);
  const tagLabels = (writing.tags ?? []).filter((t): t is string => Boolean(t));

  return (
    <article ref={articleRef} className='w-full'>
      <div className='mx-auto max-w-5xl px-4 pb-24 pt-8 md:px-[58px] md:pt-12'>
        {(formattedDate || tagLabels.length > 0) && (
          <p className='mb-6 font-space-grotesk text-[12px] uppercase tracking-[0.14em] text-black/50'>
            {formattedDate && <span>{formattedDate}</span>}
            {formattedDate && tagLabels.length > 0 && <span className='mx-3 text-black/20'>·</span>}
            {tagLabels.length > 0 && <strong className='font-bold tracking-[0.1em] text-black'>{tagLabels.join(' / ')}</strong>}
          </p>
        )}

        <h1 className='mb-8 text-[56px] leading-[1.0] tracking-[-0.02em] text-black sm:text-[72px] md:text-[96px]'>
          <WritingTitle sections={writing.titleSections ?? []} />
        </h1>

        {(writing.visualsCount != null || writing.readingType) && (
          <div className='mb-12 flex items-center gap-5 font-space-grotesk text-[11px] uppercase tracking-[0.14em] text-black/40'>
            {writing.visualsCount != null && (
              <span className='flex items-center gap-1.5'>
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' aria-hidden='true'>
                  <rect x='3' y='3' width='18' height='18' rx='2' />
                  <circle cx='8.5' cy='8.5' r='1.5' />
                  <path d='m21 15-5-5L5 21' />
                </svg>
                {writing.visualsCount} VISUALS
              </span>
            )}
            {writing.readingType && (
              <span className='flex items-center gap-1.5'>
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' aria-hidden='true'>
                  <path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20' />
                  <path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' />
                </svg>
                {writing.readingType}
              </span>
            )}
          </div>
        )}
      </div>

      {writing.heroImage && (
        <div className='relative aspect-[16/9] w-full overflow-hidden bg-[var(--surface-grey)]'>
          <BlurUpImage src={writing.heroImage} alt='' fill className='object-cover' sizes='100vw' priority />
        </div>
      )}

      {writing.blocks && writing.blocks.length > 0 && (
        <div className='mt-8'>
          {writing.blocks.map((block, i) => {
            switch (block?.__typename) {
              case 'WritingBlocksHeader':
                return (
                  <div key={`${block.__typename}-${i}`} className={blockWrapperClass('narrow', 'pb-2 md:py-4')}>
                    <HeaderBlock block={block} />
                  </div>
                );
              case 'WritingBlocksTwoColumnText':
                return (
                  <div key={`${block.__typename}-${i}`} className={blockWrapperClass('wide', 'py-4')}>
                    <TwoColumnTextBlock block={block} />
                  </div>
                );
              case 'WritingBlocksVideo':
                return (
                  <div key={`${block.__typename}-${i}`} className={blockWrapperClass('wide', 'py-10')}>
                    <VideoBlock block={block} />
                  </div>
                );
              case 'WritingBlocksImage': {
                const b = block as unknown as {
                  __typename: 'WritingBlocksImage';
                  width?: string | null;
                  orientation?: string | null;
                  images?: Array<{ src?: string | null; alt?: string | null } | null> | null;
                };
                return (
                  <div key={`${block.__typename}-${i}`} className={blockWrapperClass(b.width ?? 'narrow', 'py-4')}>
                    <ImageBlock block={b} />
                  </div>
                );
              }
              case 'WritingBlocksSpace': {
                const b = block as unknown as {
                  __typename: 'WritingBlocksSpace';
                  desktopSpace?: string | null;
                  mobileSpace?: string | null;
                };
                return <SpaceBlock key={`${block.__typename}-${i}`} block={b} />;
              }
              default:
                return null;
            }
          })}
        </div>
      )}

      <div className='mt-10 flex justify-center px-6 pb-10'>
        <ActionButton
          color='white'
          icon='arrowUpwardAlt'
          label='Back to Top'
          onClick={() => articleRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className='bg-surface-grey'
        />
      </div>
    </article>
  );
}
