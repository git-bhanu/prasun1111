'use client';
import { Icon } from '@/components/icons';
import { WritingTitle } from '@/components/writings/writing-title';
import type { WritingConnectionQuery } from '@/tina/__generated__/types';
import Link from 'next/link';

type WritingNode = NonNullable<NonNullable<WritingConnectionQuery['writingConnection']['edges']>[number]>['node'];

type Props = {
  slug: string;
  titleSections: NonNullable<NonNullable<WritingNode>['titleSections']>;
  date?: string | null;
  tags?: (string | null)[] | null;
  visualsCount?: number | null;
  readingType?: string | null;
  linkClassName?: string;
  onClick?: (slug: string) => void;
};

function parseDateParts(iso: string | null | undefined) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    const day = d.getUTCDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
    const month = d.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' }).toUpperCase();
    const year = d.getUTCFullYear();
    return { day, suffix, month, year };
  } catch {
    return null;
  }
}

export function WritingListItem({ slug, titleSections, date, tags, visualsCount, readingType, linkClassName, onClick }: Props) {
  const dateParts = parseDateParts(date);
  const tagLabels = (tags ?? []).filter((t): t is string => Boolean(t));

  const inner = (
    <>
      <div className='py-8 md:py-10'>
        <div className='mb-6 flex items-baseline gap-1 font-space-grotesk text-[11px] uppercase leading-none tracking-normal md:gap-8 md:text-[18px]'>
          {dateParts && (
            <span className='shrink-0 whitespace-nowrap font-normal text-black transition-colors duration-300 ease-in-out group-hover:text-brand-blue'>
              {dateParts.day}
              <sup className='text-[0.65em]'>{dateParts.suffix}</sup> {dateParts.month} {dateParts.year}
            </span>
          )}
          {dateParts && tagLabels.length > 0 && (
            <span className='shrink-0 font-normal text-black transition-colors duration-300 ease-in-out group-hover:text-brand-blue'>·</span>
          )}
          {tagLabels.length > 0 && (
            <strong className='leading-[1.2em] font-bold text-black transition-colors duration-300 ease-in-out group-hover:text-brand-blue'>
              {tagLabels.join(' / ')}
            </strong>
          )}
        </div>

        <div className='flex items-end justify-between gap-6'>
          <h2 className='text-[36px] leading-[1.05] tracking-[-0.01em] text-black transition-colors duration-300 ease-in-out group-hover:text-brand-blue sm:text-[60px] md:text-[76px]'>
            <WritingTitle sections={titleSections} />
          </h2>
          <span className='mb-[0.05em] shrink-0'>
            <Icon name='outbound' size={48} className='block h-12 w-12 group-hover:hidden md:h-[72px] md:w-[72px]' />
            <Icon name='outboundHover' size={48} className='hidden h-12 w-12 group-hover:block md:h-[72px] md:w-[72px]' />
          </span>
        </div>

        {(visualsCount != null || readingType) && (
          <div className='mt-6 flex flex-wrap items-center gap-2'>
            {visualsCount != null && (
              <span className='flex h-6 items-center gap-2 rounded-[4px] bg-[#f5f5f5] px-3 py-1 font-space-grotesk text-[12px] uppercase text-black transition-colors duration-300 ease-in-out group-hover:text-brand-blue'>
                <Icon name='animatedImages' size={16} color='currentColor' />
                {visualsCount} VISUALS
              </span>
            )}
            {readingType && (
              <span className='flex h-6 items-center gap-2 rounded-[4px] bg-[#f5f5f5] px-3 py-1 font-space-grotesk text-[12px] uppercase text-black transition-colors duration-300 ease-in-out group-hover:text-brand-blue'>
                <Icon name='chromeReaderMode' size={16} color='currentColor' />
                {readingType}
              </span>
            )}
          </div>
        )}
      </div>

      <div className='border-b border-black' />
    </>
  );

  if (onClick) {
    return (
      <div
        role='button'
        tabIndex={0}
        onClick={() => onClick(slug)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(slug);
          }
        }}
        className={linkClassName ?? 'group block cursor-pointer px-4 md:px-[58px]'}
      >
        {inner}
      </div>
    );
  }

  return (
    <Link href={`/writings/${slug}`} className={linkClassName ?? 'group block px-4 md:px-[58px]'}>
      {inner}
    </Link>
  );
}
