'use client';

import { tinaField } from 'tinacms/dist/react';
import { type Components, TinaMarkdown } from 'tinacms/dist/rich-text';
import type { TinaMarkdownContent } from 'tinacms/dist/rich-text';

type HeaderH2BlockData = {
  heading?: TinaMarkdownContent | null;
  width?: string | null;
};

type Props = {
  block: HeaderH2BlockData;
};

const components: Components<{}> = {
  p: (props) => <span className='block'>{props?.children}</span>,
  break: () => <br />,
  bold: (props) => <strong className='font-bold'>{props?.children}</strong>,
  italic: (props) => <em className='italic font-sedan'>{props?.children}</em>,
};

export function HeaderH2Block({ block }: Props) {
  if (!block.heading) return null;

  return (
    <h2 data-tina-field={tinaField(block, 'heading')} className='font-space-grotesk text-2xl tracking-[-0.04em] text-black'>
      <TinaMarkdown content={block.heading} components={components} />
    </h2>
  );
}
