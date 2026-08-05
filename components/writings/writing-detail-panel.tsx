'use client';

import { HeaderBlock } from '@/components/blocks/header-block';
import { ImageBlock } from '@/components/blocks/image-block';
import { SpaceBlock } from '@/components/blocks/space-block';
import { TwoColumnTextBlock } from '@/components/blocks/two-column-text-block';
import { VideoBlock } from '@/components/blocks/video-block';
import { CommentsSection } from '@/components/comments/comments-section';
import { Icon } from '@/components/icons';
import { BlurUpImage } from '@/components/shared/blur-up-image';
import { WritingListItem } from '@/components/writings/writing-list-item';
import { WritingTitle } from '@/components/writings/writing-title';
import type { WritingConnectionQuery } from '@/tina/__generated__/types';
import React from 'react';

type WritingNode = NonNullable<NonNullable<WritingConnectionQuery['writingConnection']['edges']>[number]>['node'];

type Props = {
  writing: NonNullable<WritingNode>;
  relatedWritings: NonNullable<WritingNode>[];
  onWritingClick: (slug: string) => void;
};

function renderWritingDate(iso: string | null | undefined): React.ReactNode {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    const day = d.getUTCDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
    const month = d.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' }).toUpperCase();
    const year = d.getUTCFullYear();
    return (
      <>
        {day}
        <sup className='text-[0.65em]'>{suffix}</sup> {month} {year}
      </>
    );
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

export function WritingDetailPanel({ writing, relatedWritings, onWritingClick }: Props) {
  const tagLabels = (writing.tags ?? []).filter((t): t is string => Boolean(t));

  return (
    <article className='w-full'>
      <div className='px-4 pt-8 md:px-[58px] md:pt-12'>
        {(writing.date || tagLabels.length > 0) && (
          <div className='mb-6 flex items-baseline gap-1 font-space-grotesk text-[11px] uppercase leading-none tracking-normal md:gap-8 md:text-[18px]'>
            {writing.date && <span className='shrink-0 whitespace-nowrap font-normal text-black'>{renderWritingDate(writing.date)}</span>}
            {writing.date && tagLabels.length > 0 && <span className='shrink-0 font-normal text-black/50'>·</span>}
            {tagLabels.length > 0 && <strong className='leading-[1.2em] font-bold text-black'>{tagLabels.join(' / ')}</strong>}
          </div>
        )}

        <h1 className='mb-6 text-[36px] leading-[1.05] tracking-[-0.01em] text-black sm:text-[60px] md:text-[76px]'>
          <WritingTitle sections={writing.titleSections ?? []} />
        </h1>

        {(writing.visualsCount != null || writing.readingType) && (
          <div className='mb-12 flex flex-wrap items-center gap-2'>
            {writing.visualsCount != null && (
              <span className='flex h-6 items-center gap-2 rounded-[4px] bg-[#f5f5f5] px-3 py-1 font-space-grotesk text-[12px] uppercase text-black'>
                <Icon name='animatedImages' size={16} color='currentColor' />
                {writing.visualsCount} VISUALS
              </span>
            )}
            {writing.readingType && (
              <span className='flex h-6 items-center gap-2 rounded-[4px] bg-[#f5f5f5] px-3 py-1 font-space-grotesk text-[12px] uppercase text-black'>
                <Icon name='chromeReaderMode' size={16} color='currentColor' />
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
                  <div key={`${block.__typename}-${i}`} className={blockWrapperClass('wide', 'pb-2 md:py-4')}>
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
                  <div key={`${block.__typename}-${i}`} className={blockWrapperClass(b.width ?? 'narrow', 'py-2 md:py-4')}>
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

      {relatedWritings.length > 0 && (
        <div className='mt-16'>
          <div className='px-4 md:px-[58px]'>
            <div className='border-t border-black' />
          </div>
          <div className='mt-3 px-4 md:mt-4 md:px-[58px]'>
            <div className='border-t border-black' />
          </div>
          <div className='[&>div:last-child>div:last-child]:hidden'>
            {relatedWritings.map((w) => (
              <WritingListItem
                key={w.id}
                slug={w._sys.filename}
                titleSections={w.titleSections ?? []}
                date={w.date}
                tags={w.tags}
                visualsCount={w.visualsCount}
                readingType={w.readingType}
                linkClassName='group block px-4 md:px-[58px]'
                onClick={onWritingClick}
              />
            ))}
          </div>
        </div>
      )}
      <CommentsSection pageSlug={`writings/${writing._sys.filename}`} />
    </article>
  );
}
