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
};

function parseDateParts(iso: string | null | undefined) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    const day = d.getUTCDate();
    const suffix =
      day === 1 || day === 21 || day === 31
        ? 'st'
        : day === 2 || day === 22
          ? 'nd'
          : day === 3 || day === 23
            ? 'rd'
            : 'th';
    const month = d.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' }).toUpperCase();
    const year = d.getUTCFullYear();
    return { day, suffix, month, year };
  } catch {
    return null;
  }
}

export function WritingListItem({ slug, titleSections, date, tags, visualsCount, readingType }: Props) {
  const dateParts = parseDateParts(date);
  const tagLabels = (tags ?? []).filter((t): t is string => Boolean(t));

  return (
    <Link href={`/writings/${slug}`} className='group block px-4 md:px-[58px]'>
      <div className='py-8 md:py-10'>

        {/* meta line */}
        <div className='mb-6 flex items-center gap-4 font-space-grotesk text-[11px] uppercase leading-none tracking-normal md:gap-8 md:text-[18px]'>
          {dateParts && (
            <span className='font-normal text-black/50 transition-colors duration-300 ease-in-out group-hover:text-brand-blue'>
              {dateParts.day}
              <sup className='text-[0.65em]'>{dateParts.suffix}</sup> {dateParts.month} {dateParts.year}
            </span>
          )}
          {dateParts && tagLabels.length > 0 && (
            <span className='font-normal text-black/50 transition-colors duration-300 ease-in-out group-hover:text-brand-blue'>·</span>
          )}
          {tagLabels.length > 0 && (
            <strong className='font-bold text-black transition-colors duration-300 ease-in-out group-hover:text-brand-blue'>
              {tagLabels.join(' / ')}
            </strong>
          )}
        </div>

        {/* title row — arrow aligns to title baseline */}
        <div className='flex items-end justify-between gap-6'>
          <h2 className='text-[36px] leading-[1.05] tracking-[-0.01em] text-black transition-colors duration-300 ease-in-out group-hover:text-brand-blue sm:text-[60px] md:text-[76px]'>
            <WritingTitle sections={titleSections} />
          </h2>
          <span className='mb-[0.05em] flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full border-2 border-brand-orange text-brand-orange transition-all duration-300 ease-in-out group-hover:bg-brand-orange group-hover:text-white md:h-[72px] md:w-[72px] md:border-[3px]'>
            <svg className='h-8 w-8 md:h-12 md:w-12' viewBox='0 0 48 48' fill='none' aria-hidden='true'>
              <path d='M13 35L35 13M35 13H16M35 13V32' stroke='currentColor' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          </span>
        </div>

        {/* pills */}
        {(visualsCount != null || readingType) && (
          <div className='mt-6 flex flex-wrap items-center gap-2'>
            {visualsCount != null && (
              <span className='flex h-6 items-center gap-2 rounded-[4px] bg-[#f5f5f5] px-3 py-1 font-space-grotesk text-[12px] uppercase tracking-[0.1em] text-black transition-colors duration-300 ease-in-out group-hover:text-brand-blue'>
                <Icon name='animatedImages' size={16} color='currentColor' />
                {visualsCount} VISUALS
              </span>
            )}
            {readingType && (
              <span className='flex h-6 items-center gap-2 rounded-[4px] bg-[#f5f5f5] px-3 py-1 font-space-grotesk text-[12px] uppercase tracking-[0.1em] text-black transition-colors duration-300 ease-in-out group-hover:text-brand-blue'>
                <Icon name='chromeReaderMode' size={16} color='currentColor' />
                {readingType}
              </span>
            )}
          </div>
        )}
      </div>

      <div className='border-b border-black' />
    </Link>
  );
}
