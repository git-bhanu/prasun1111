"use client";

import { tinaField } from "tinacms/dist/react";
import { type Components, TinaMarkdown } from "tinacms/dist/rich-text";
import type { TinaMarkdownContent } from "tinacms/dist/rich-text";
import { type Annotation, AnnotatedLayout } from "./annotation-panel";

type TwoColumnTextBlockData = {
  leftColumn?: TinaMarkdownContent | null;
  rightColumn?: TinaMarkdownContent | null;
  annotations?: Array<Annotation | null> | null;
};

type Props = {
  block: TwoColumnTextBlockData;
};

const components: Components<{}> = {
  p: (props) => <span className="block">{props?.children}</span>,
  break: () => <br />,
  bold: (props) => <strong className="font-bold">{props?.children}</strong>,
  italic: (props) => <em className="italic font-sedan">{props?.children}</em>,
  html_inline: (props) => {
    const ref = props?.value?.match(/^<ref n="([^"]+)"\s*\/>$/);
    if (ref) {
      return (
        <sup className="font-space-grotesk relative top-[-8px] left-0.5 text-[11px] text-brand-orange">
          [{ref[1]}]
        </sup>
      );
    }
    const color = props?.value?.match(/^<color text="([^"]+)"\s*\/>$/);
    if (color) {
      return <span className="text-brand-orange">{color[1]}</span>;
    }
    return <>{props?.value}</>;
  },
};

export function TwoColumnTextBlock({ block }: Props) {
  if (!block.leftColumn && !block.rightColumn) return null;

  const annotations = (block.annotations ?? []).filter(
    (a): a is Annotation => a != null && (!!a.id || !!a.text),
  );

  const columns = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 text-base md:text-xl leading-tight text-black font-sedan">
      {block.leftColumn && (
        <div data-tina-field={tinaField(block, "leftColumn")}>
          <TinaMarkdown content={block.leftColumn} components={components} />
        </div>
      )}
      {block.rightColumn && (
        <div className="pt-4 md:pt-0" data-tina-field={tinaField(block, "rightColumn")}>
          <TinaMarkdown content={block.rightColumn} components={components} />
        </div>
      )}
    </div>
  );
 
  return <AnnotatedLayout annotations={annotations}>{columns}</AnnotatedLayout>;
}
