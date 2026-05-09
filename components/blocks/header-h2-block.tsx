"use client";

import { tinaField } from "tinacms/dist/react";
import { type Components, TinaMarkdown } from "tinacms/dist/rich-text";
import type { TinaMarkdownContent } from "tinacms/dist/rich-text";
import { type Annotation, AnnotationPanel } from "./annotation-panel";

type HeaderH2BlockData = {
  heading?: TinaMarkdownContent | null;
  annotations?: Array<Annotation | null> | null;
};

type Props = {
  block: HeaderH2BlockData;
};

const components: Components<{}> = {
  p: (props) => <span className="block">{props?.children}</span>,
  break: () => <br />,
  bold: (props) => <strong className="font-bold">{props?.children}</strong>,
  italic: (props) => <em className="italic font-sedan">{props?.children}</em>,
  html_inline: (props) => {
    const match = props?.value?.match(/^<ref n="([^"]+)"\s*\/>$/);
    if (match) {
      return (
        <sup className="font-space-grotesk relative top-[-19px] left-0.5 text-[20px] text-brand-orange">
          [{match[1]}]
        </sup>
      );
    }
    return <>{props?.value}</>;
  },
};

export function HeaderH2Block({ block }: Props) {
  if (!block.heading) return null;

  const annotations = (block.annotations ?? []).filter(
    (a): a is Annotation => a != null && (!!a.id || !!a.text),
  );

  const heading = (
    <h2
      data-tina-field={tinaField(block, "heading")}
      className="font-sedan text-[48px] leading-tight text-black"
    >
      <TinaMarkdown content={block.heading} components={components} />
    </h2>
  );

  if (annotations.length > 0) {
    return (
      <section className="w-full align-top flex">
        <div className="px-6 max-w-[45svw] w-[890px]">{heading}</div>
        <div className=" max-w-[55svw] w-[55svw] flex justify-center">
          <AnnotationPanel annotations={annotations} />
        </div>
      </section>
    );
  }

  return heading;
}
