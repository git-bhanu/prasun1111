'use client';

import { tinaField } from 'tinacms/dist/react';
import { type Components, TinaMarkdown } from 'tinacms/dist/rich-text';

import type { PageBlocksHeroStatement } from '@/tina/__generated__/types';

type HeroStatementBlockProps = {
  block: PageBlocksHeroStatement;
};

const statementComponents: Components<{}> = {
  p: (props) => <span className='block'>{props?.children}</span>,
  break: () => <br />,
  bold: (props) => <strong className='font-medium'>{props?.children}</strong>,
  italic: (props) => <em className='italic font-sedan'>{props?.children}</em>,
  underline: (props) => <span className='underline decoration-1 underline-offset-[0.12em]'>{props?.children}</span>,
  html_inline: (props) => {
    const underlineMatch = props?.value?.match(/^<u>(.*)<\/u>$/);

    if (underlineMatch) {
      return <span className='underline decoration-1 decoration-brand-blue underline-offset-[0.1em]'>{underlineMatch[1]}</span>;
    }

    return <>{props?.value}</>;
  },
};

export function HeroStatementBlock({ block }: HeroStatementBlockProps) {
  if (!block.statement) {
    return null;
  }

  return (
    <section className='mx-auto flex min-h-[calc(80svh-10rem)] w-full max-w-[65em] flex-col items-center justify-center px-6 py-24 text-center sm:px-10'>
      {block.eyebrow ? (
        <p
          data-tina-field={tinaField(block, 'eyebrow')}
          className='mb-6 md:mb-10 text-[10px] md:text-xs font-medium font-space-grotesk uppercase tracking-[0.32em] text-text-grey'
        >
          {renderEyebrow(block.eyebrow)}
        </p>
      ) : null}
      <h1 data-tina-field={tinaField(block, 'statement')} className='font-sedan text-[32px] md:text-[64px] leading-tight text-black'>
        <TinaMarkdown content={block.statement} components={statementComponents} />
      </h1>
    </section>
  );
}

function renderEyebrow(eyebrow: string) {
  const slashIndex = eyebrow.indexOf('/');

  if (slashIndex === -1) {
    return eyebrow;
  }

  const label = eyebrow.slice(0, slashIndex).trimEnd();
  const artistName = eyebrow.slice(slashIndex + 1).trimStart();

  if (!artistName) {
    return eyebrow;
  }

  return (
    <>
      {label} / <span className='text-brand-blue'>{artistName}</span>
    </>
  );
}
