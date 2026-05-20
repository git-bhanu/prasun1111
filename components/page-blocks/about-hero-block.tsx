"use client";

import { tinaField } from "tinacms/dist/react";
import { type Components, TinaMarkdown } from "tinacms/dist/rich-text";

import { SectionReveal } from "@/components/shared/section-reveal";
import type { PageBlocksAboutHero } from "@/tina/__generated__/types";

const statementComponents: Components<{}> = {
  p: (props) => <span className="block">{props?.children}</span>,
  break: () => <br />,
  italic: (props) => <em className="italic font-sedan">{props?.children}</em>,
};

const bodyComponents: Components<{}> = {
  p: (props) => <p className="mb-4 last:mb-0">{props?.children}</p>,
  bold: (props) => <strong className="font-medium">{props?.children}</strong>,
  italic: (props) => <em className="italic font-sedan">{props?.children}</em>,
};

export function AboutHeroBlock({ block }: { block: PageBlocksAboutHero }) {
  if (!block.statement) return null;

  return (
    <section className="px-4 pt-0 pb-10 md:px-12 md:pt-24 md:pb-16">
      <div className="mx-auto max-w-full">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
          <div className="md:self-end">
            <SectionReveal delay={0}>
              <div>
                {block.eyebrow ? (
                  <p
                    data-tina-field={tinaField(block, "eyebrow")}
                    className="mb-5 font-space-grotesk text-[10px] uppercase text-brand-blue md:text-[20px]"
                  >
                    {block.eyebrow}
                  </p>
                ) : null}
                <h1
                  data-tina-field={tinaField(block, "statement")}
                  className="font-sedan text-[32px] leading-tight md:text-[64px]"
                >
                  <TinaMarkdown
                    content={block.statement}
                    components={statementComponents}
                  />
                </h1>
              </div>
            </SectionReveal>
          </div>
          {block.body ? (
            <SectionReveal delay={0.15}>
              <div
                data-tina-field={tinaField(block, "body")}
                className="font-sedan text-[16px] leading-relaxed md:flex md:flex-col md:justify-center md:text-[32px]"
              >
                <TinaMarkdown
                  content={block.body}
                  components={bodyComponents}
                />
              </div>
            </SectionReveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
