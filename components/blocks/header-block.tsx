'use client';

import { tinaField } from 'tinacms/dist/react';
import { type Components, TinaMarkdown } from 'tinacms/dist/rich-text';
import type { TinaMarkdownContent } from 'tinacms/dist/rich-text';
import { AnnotatedLayout, type Annotation } from './annotation-panel';

type HeaderBlockData = {
  level?: string | null;
  font?: string | null;
  heading?: TinaMarkdownContent | null;
  annotations?: Array<Annotation | null> | null;
};

type Props = {
  block: HeaderBlockData;
};

const components: Components<{}> = {
  p: (props) => <span className='block mb-5 last:mb-0'>{props?.children}</span>,
  break: () => <br />,
  bold: (props) => <strong className='font-bold'>{props?.children}</strong>,
  italic: (props) => <em className='italic font-sedan'>{props?.children}</em>,
  html_inline: (props) => {
    const match = props?.value?.match(/^<ref n="([^"]+)"\s*\/>$/);
    if (match) {
      return <sup className='font-space-grotesk relative top-[-19px] left-0.5 text-[20px] text-brand-orange'>[{match[1]}]</sup>;
    }
    return <>{props?.value}</>;
  },
};

export function HeaderBlock({ block }: Props) {
  if (!block.heading) return null;

  const annotations = (block.annotations ?? []).filter((a): a is Annotation => a != null && (!!a.id || !!a.text));

  const level = block.level ?? 'h2';
  const Tag = level as 'h2' | 'h3' | 'h6';
  const sizeClass = level === 'h3' ? 'text-[18px] md:text-[36px]' : level === 'h6' ? 'text-[12px] md:text-[14px]' : 'text-[20px] md:text-[48px]';
  const fontClass = block.font === 'space-grotesk' ? 'font-space-grotesk' : 'font-sedan';

  const heading = (
    <Tag data-tina-field={tinaField(block, 'heading')} className={`${fontClass} ${sizeClass} leading-tight text-black dark:text-white`}>
      <TinaMarkdown content={block.heading} components={components} />
    </Tag>
  );

  return (
    <AnnotatedLayout annotations={annotations} className={level === 'h6' ? 'mt-8' : ''}>
      {heading}
    </AnnotatedLayout>
  );
}
