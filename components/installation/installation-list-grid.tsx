'use client';

import { SectionReveal } from '@/components/shared/section-reveal';
import { cn } from '@/lib/utils';
import type { Components } from 'tinacms/dist/rich-text';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import type { TinaMarkdownContent } from 'tinacms/dist/rich-text';
import type { InstallationCardData } from './installation-list-card';
import { InstallationListCard } from './installation-list-card';

export type QuoteBreak = {
  afterPosition?: number | null;
  afterAll?: boolean | null;
  leftText?: TinaMarkdownContent | null;
  rightText?: TinaMarkdownContent | null;
  rightTextFootnote?: TinaMarkdownContent | null;
};

export interface InstallationListItem {
  id: string;
  slug?: string | null;
  _sys: { filename: string };
  tinaSource: object;
  data: InstallationCardData;
}

type InstallationSection = { type: 'installations'; items: InstallationListItem[] };
type BreakSection = { type: 'quoteBreak'; quoteBreak: QuoteBreak };
type Section = InstallationSection | BreakSection;

interface InstallationListGridProps {
  items: InstallationListItem[];
  quoteBreaks?: QuoteBreak[];
  onItemClick: (slug: string) => void;
}

function itemSlug(item: InstallationListItem) {
  return (item.slug ?? item._sys.filename).toLowerCase();
}

function buildSections(items: InstallationListItem[], quoteBreaks: QuoteBreak[]): Section[] {
  const positional = quoteBreaks.filter((qb) => !qb.afterAll);
  const afterAll = quoteBreaks.filter((qb) => qb.afterAll);
  const sorted = [...positional].sort((a, b) => (a.afterPosition ?? 0) - (b.afterPosition ?? 0));

  const sections: Section[] = [];
  let group: InstallationListItem[] = [];

  for (let i = 0; i < items.length; i++) {
    group.push(items[i]);
    const position = i + 1;
    const breaksHere = sorted.filter((qb) => qb.afterPosition === position);
    if (breaksHere.length > 0) {
      sections.push({ type: 'installations', items: group });
      group = [];
      for (const qb of breaksHere) sections.push({ type: 'quoteBreak', quoteBreak: qb });
    }
  }

  if (group.length > 0) sections.push({ type: 'installations', items: group });
  for (const qb of afterAll) sections.push({ type: 'quoteBreak', quoteBreak: qb });

  return sections;
}

const richComponents: Components<{}> = {
  p: (props) => <span className='block'>{props?.children}</span>,
  break: () => <br />,
  bold: (props) => <strong className='font-bold'>{props?.children}</strong>,
  italic: (props) => <em className='font-sedan italic'>{props?.children}</em>,
  html_inline: (props) => {
    const color = props?.value?.match(/^<color text="([^"]+)"\s*\/>$/);
    if (color) return <span className='text-brand-orange'>{color[1]}</span>;
    return <>{props?.value}</>;
  },
};

function InstallationQuoteBreak({ leftText, rightText, rightTextFootnote }: Omit<QuoteBreak, 'afterPosition' | 'afterAll'>) {
  if (!leftText && !rightText) return null;

  return (
    <div className='my-[48px] bg-black px-8 py-16 sm:px-10 md:px-[58px] md:py-24'>
      <div className='mx-auto grid max-w-7xl grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2'>
        {leftText && (
          <div className='font-sedan text-[20px] text-white md:text-[48px]'>
            <TinaMarkdown content={leftText} components={richComponents} />
          </div>
        )}
        {(rightText || rightTextFootnote) && (
          <div className='space-y-6'>
            {rightText && (
              <div className='font-sedan text-sm text-white md:text-[32px]'>
                <TinaMarkdown content={rightText} components={richComponents} />
              </div>
            )}
            {rightTextFootnote && (
              <div className='font-space-grotesk mt-6 text-[12px] uppercase tracking-widest text-white md:mt-12 md:text-[24px]'>
                <TinaMarkdown content={rightTextFootnote} components={richComponents} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function InstallationListGrid({ items, quoteBreaks = [], onItemClick }: InstallationListGridProps) {
  const sections = buildSections(items, quoteBreaks);

  let itemCount = 0;

  return (
    <div className='w-full'>
      {sections.map((section, sectionIndex) => {
        if (section.type === 'quoteBreak') {
          return (
            <SectionReveal key={sectionIndex}>
              <InstallationQuoteBreak
                leftText={section.quoteBreak.leftText}
                rightText={section.quoteBreak.rightText}
                rightTextFootnote={section.quoteBreak.rightTextFootnote}
              />
            </SectionReveal>
          );
        }

        return (
          <div key={sectionIndex}>
            {section.items.map((item) => {
              itemCount++;
              const slug = itemSlug(item);

              return (
                <div key={item.id} className={cn('px-4 sm:px-10 md:px-[58px]', itemCount > 1 && 'border-t border-black/10')}>
                  <InstallationListCard
                    installation={item.data}
                    tinaSource={item.tinaSource}
                    onOpen={() => onItemClick(slug)}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
