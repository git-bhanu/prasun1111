'use client';

import { tinaField } from 'tinacms/dist/react';
import { type Components, TinaMarkdown } from 'tinacms/dist/rich-text';
import type { TinaMarkdownContent } from 'tinacms/dist/rich-text';

type Annotation = {
  id?: string | null;
  text?: string | null;
};

type HeaderH2BlockData = {
  heading?: TinaMarkdownContent | null;
  width?: string | null;
  annotations?: Array<Annotation | null> | null;
};

type Props = {
  block: HeaderH2BlockData;
};

const components: Components<{}> = {
  p: (props) => <span className='block'>{props?.children}</span>,
  break: () => <br />,
  bold: (props) => <strong className='font-bold'>{props?.children}</strong>,
  italic: (props) => <em className='italic font-sedan'>{props?.children}</em>,
  html_inline: (props) => {
    const match = props?.value?.match(/^<ref n="([^"]+)"\s*\/>$/);
    if (match) {
      return <sup className='font-space-grotesk text-[10px] text-brand-orange'>[{match[1]}]</sup>;
    }
    return <>{props?.value}</>;
  },
};

function AnnotationPanel({ annotations }: { annotations: Annotation[] }) {
  return (
    <div>
      {annotations.map((a, i) => (
        <div key={a.id ?? i}>
          <hr className='border-black/15' />
          <div className='py-3'>
            <span className='font-space-grotesk text-[10px] text-brand-orange'>[{a.id}]</span>
            <p className='mt-1 text-xs leading-relaxed text-black/60'>{a.text}</p>
          </div>
        </div>
      ))}
      <hr className='border-black/15' />
    </div>
  );
}

export function HeaderH2Block({ block }: Props) {
  if (!block.heading) return null;

  const isFull = block.width === 'full';
  const annotations = (block.annotations ?? []).filter((a): a is Annotation => a != null && (!!a.id || !!a.text));
  const hasAnnotations = isFull && annotations.length > 0;

  const heading = (
    <h2 data-tina-field={tinaField(block, 'heading')} className='font-space-grotesk text-2xl tracking-[-0.04em] text-black'>
      <TinaMarkdown content={block.heading} components={components} />
    </h2>
  );

  if (hasAnnotations) {
    return (
      <div className='grid grid-cols-[2fr_1fr] gap-12'>
        {heading}
        <AnnotationPanel annotations={annotations} />
      </div>
    );
  }

  return heading;
}
