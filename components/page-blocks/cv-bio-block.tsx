"use client";

import { tinaField } from "tinacms/dist/react";
import { type Components, TinaMarkdown } from "tinacms/dist/rich-text";

import { SectionReveal } from "@/components/shared/section-reveal";
import type {
  PageBlocksCvBio,
  PageBlocksCvBioEntries,
} from "@/tina/__generated__/types";

const bodyComponents: Components<{}> = {
  p: (props) => <p className="mb-4 last:mb-0">{props?.children}</p>,
  bold: (props) => <strong className="font-medium">{props?.children}</strong>,
  italic: (props) => <em className="italic font-sedan">{props?.children}</em>,
};

export function CvBioBlock({ block }: { block: PageBlocksCvBio }) {
  const entries = (block.entries?.filter(Boolean) ??
    []) as PageBlocksCvBioEntries[];

  return (
    <section className="px-4 py-4 md:px-12 md:py-24">
      <div className="mx-auto w-full">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {entries.length > 0 ? (
            <SectionReveal delay={0}>
              <div data-tina-field={tinaField(block, "entries")}>
                {entries.map((entry, i) => (
                  <div key={i}>
                    {i > 0 ? <hr className="border-t border-black" /> : null}
                    <div className="flex items-start justify-between gap-4 py-4">
                      <div>
                        <p className="font-space-grotesk text-[16px] font-bold uppercase md:text-xl">
                          {entry.organization}
                        </p>
                        {entry.role ? (
                          <p className="mt-1 font-space-grotesk text-[14px] md:text-sm">
                            {entry.role}
                          </p>
                        ) : null}
                      </div>
                      {entry.period ? (
                        <p className="shrink-0 font-space-grotesk text-[12px] text-[#c4c4c4] md:text-xl">
                          {entry.period}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </SectionReveal>
          ) : null}
          {block.body ? (
            <SectionReveal delay={0.15}>
              <div
                data-tina-field={tinaField(block, "body")}
                className="font-sedan text-[16px] leading-tight md:text-4xl"
              >
                <TinaMarkdown content={block.body} components={bodyComponents} />
              </div>
            </SectionReveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
