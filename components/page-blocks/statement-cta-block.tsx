"use client";

import { tinaField } from "tinacms/dist/react";
import { type Components, TinaMarkdown } from "tinacms/dist/rich-text";

import { ActionButton } from "@/components/shared/action-button";
import type { IconName } from "@/components/icons";
import { SectionReveal } from "@/components/shared/section-reveal";
import type { PageBlocksStatementCta } from "@/tina/__generated__/types";

const statementComponents: Components<{}> = {
  p: (props) => <span className="block">{props?.children}</span>,
  break: () => <br />,
  bold: (props) => <strong className="font-medium">{props?.children}</strong>,
  italic: (props) => <em className="italic font-sedan">{props?.children}</em>,
};

export function StatementCtaBlock({
  block,
}: {
  block: PageBlocksStatementCta;
}) {
  if (!block.statement) return null;

  const hasButtons = block.primaryLabel || block.secondaryLabel;

  return (
    <section className="px-4 py-4 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1280px]">
        <SectionReveal delay={0}>
          <h2
            data-tina-field={tinaField(block, "statement")}
            className="font-sedan text-[32px] leading-tight md:text-[64px]"
          >
            <TinaMarkdown
              content={block.statement}
              components={statementComponents}
            />
          </h2>
        </SectionReveal>
        {hasButtons ? (
          <SectionReveal delay={0.15}>
            <div className="mt-10 flex flex-col gap-4 md:flex-row md:gap-6">
              {block.primaryLabel ? (
                <ActionButton
                  label={block.primaryLabel}
                  href={block.primaryHref}
                  icon={"addCall" as IconName}
                  dataTinaField={tinaField(block, "primaryLabel")}
                />
              ) : null}
              {block.secondaryLabel ? (
                <ActionButton
                  color="outlined"
                  label={block.secondaryLabel}
                  href={block.secondaryHref}
                  icon={"forwardToInbox" as IconName}
                  dataTinaField={tinaField(block, "secondaryLabel")}
                />
              ) : null}
            </div>
          </SectionReveal>
        ) : null}
      </div>
    </section>
  );
}
