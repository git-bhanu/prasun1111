'use client';

import { HeaderBlock } from '@/components/blocks/header-block';
import { ImageBlock } from '@/components/blocks/image-block';
import { SpaceBlock } from '@/components/blocks/space-block';
import { TwoColumnTextBlock } from '@/components/blocks/two-column-text-block';
import { VideoBlock } from '@/components/blocks/video-block';
import { Icon } from '@/components/icons';
import { BlurUpImage } from '@/components/shared/blur-up-image';
import { WritingListItem } from '@/components/writings/writing-list-item';
import { WritingTitle } from '@/components/writings/writing-title';
import type { WritingConnectionQuery, WritingQuery, WritingQueryVariables } from '@/tina/__generated__/types';
import { useTina } from 'tinacms/dist/react';

type WritingNode = NonNullable<NonNullable<WritingConnectionQuery['writingConnection']['edges']>[number]>['node'];

type Props = {
  query: string;
  data: WritingQuery;
  variables: WritingQueryVariables;
  otherWritings?: NonNullable<WritingNode>[];
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

export default function WritingDetailClientPage({ query, data, variables, otherWritings = [] }: Props) {
  const { data: tinaData } = useTina({ query, data, variables });
  const writing = tinaData.writing;

  const formattedDate = formatWritingDate(writing.date);
  const tagLabels = (writing.tags ?? []).filter((t): t is string => Boolean(t));

  return (
    <article className='w-full'>
      <div className='px-4 pt-2 md:px-[42px] md:pt-6'>
        {(formattedDate || tagLabels.length > 0) && (
          <div className='mb-6 flex items-center gap-4 font-space-grotesk text-[11px] uppercase leading-none tracking-normal md:gap-8 md:text-[18px]'>
            {formattedDate && <span className='font-normal text-black/50'>{formattedDate}</span>}
            {formattedDate && tagLabels.length > 0 && <span className='font-normal text-black/50'>·</span>}
            {tagLabels.length > 0 && <strong className='font-bold text-black'>{tagLabels.join(' / ')}</strong>}
          </div>
        )}

        <h1 className='mb-8 text-[36px] leading-[1.05] tracking-[-0.01em] text-black sm:text-[60px] md:text-[76px]'>
          <WritingTitle sections={writing.titleSections ?? []} />
        </h1>

        {(writing.visualsCount != null || writing.readingType) && (
          <div className='mb-12 flex flex-wrap items-center gap-2'>
            {writing.visualsCount != null && (
              <span className='flex h-6 items-center gap-2 rounded-[4px] bg-[#f5f5f5] px-3 py-1 font-space-grotesk text-[12px] uppercase tracking-[0.1em] text-black'>
                <Icon name='animatedImages' size={16} color='currentColor' />
                {writing.visualsCount} VISUALS
              </span>
            )}
            {writing.readingType && (
              <span className='flex h-6 items-center gap-2 rounded-[4px] bg-[#f5f5f5] px-3 py-1 font-space-grotesk text-[12px] uppercase tracking-[0.1em] text-black'>
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
                  images?: Array<{
                    src?: string | null;
                    alt?: string | null;
                  } | null> | null;
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

      {otherWritings.length > 0 && (
        <div className='mt-16'>
          <div className='px-4 md:px-[42px]'><div className='border-t border-black' /></div>
          <div className='mt-3 px-4 md:mt-4 md:px-[42px]'><div className='border-t border-black' /></div>
          <div className='[&>a:last-child>div:last-child]:hidden'>
            {otherWritings.map((w) => (
              <WritingListItem
                key={w.id}
                slug={w._sys.filename}
                titleSections={w.titleSections ?? []}
                date={w.date}
                tags={w.tags}
                visualsCount={w.visualsCount}
                readingType={w.readingType}
                linkClassName='group block px-4 md:px-[42px]'
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
