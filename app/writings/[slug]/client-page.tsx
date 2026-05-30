'use client';

import { WritingTitle } from '@/components/writings/writing-title';
import type { WritingQuery, WritingQueryVariables } from '@/tina/__generated__/types';
import { useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';

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

export default function WritingDetailClientPage({ query, data, variables }: Props) {
  const { data: tinaData } = useTina({ query, data, variables });
  const writing = tinaData.writing;

  const formattedDate = formatWritingDate(writing.date);
  const tagLabels = (writing.tags ?? []).filter((t): t is string => Boolean(t));

  return (
    <article className='w-full'>
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

        {writing.body && (
          <div className='prose prose-lg max-w-none font-space-grotesk text-[16px] leading-[1.8] text-black/75 md:text-[18px]'>
            <TinaMarkdown content={writing.body} />
          </div>
        )}
      </div>
    </article>
  );
}
