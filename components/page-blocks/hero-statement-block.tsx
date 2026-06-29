"use client";

import { useEffect, useState } from "react";
import { tinaField } from "tinacms/dist/react";
import { type Components, TinaMarkdown } from "tinacms/dist/rich-text";

import type { PageBlocksHeroStatement } from "@/tina/__generated__/types";

type HeroStatementBlockProps = {
  block: PageBlocksHeroStatement & { consultingSince?: string | null };
};

const statementComponents: Components<{}> = {
  p: (props) => <span className="block">{props?.children}</span>,
  break: () => <br />,
  bold: (props) => <strong className="font-medium">{props?.children}</strong>,
  italic: (props) => <em className="italic font-sedan">{props?.children}</em>,
  underline: (props) => (
    <span className="underline decoration-1 underline-offset-[0.12em]">
      {props?.children}
    </span>
  ),
  html_inline: (props) => {
    const underlineMatch = props?.value?.match(/^<u>(.*)<\/u>$/);

    if (underlineMatch) {
      return (
        <span className="underline decoration-1 decoration-brand-blue underline-offset-[0.1em]">
          {underlineMatch[1]}
        </span>
      );
    }

    return <>{props?.value}</>;
  },
};

export function HeroStatementBlock({ block }: HeroStatementBlockProps) {
  if (!block.statement) {
    return null;
  }

  return (
    <section className="mx-auto flex min-h-[calc(80svh-10rem)] w-full max-w-[65em] flex-col items-center justify-center px-6 py-24 text-center sm:px-10">
      {block.eyebrow ? (
        <p
          data-tina-field={tinaField(block, "eyebrow")}
          className="mb-6 md:mb-10 text-[10px] md:text-xs font-medium font-space-grotesk uppercase tracking-[0.32em] text-text-grey"
        >
          {renderEyebrow(block.eyebrow)}
        </p>
      ) : null}
      <h1
        data-tina-field={tinaField(block, "statement")}
        className="font-sedan text-[32px] md:text-[64px] leading-tight text-black"
      >
        <TinaMarkdown
          content={block.statement}
          components={statementComponents}
        />
      </h1>
      {block.consultingSince ? (
        <ConsultingTimer since={block.consultingSince} />
      ) : null}
    </section>
  );
}

function ConsultingTimer({ since }: { since: string }) {
  const [elapsed, setElapsed] = useState(() => getElapsed(since));

  useEffect(() => {
    setElapsed(getElapsed(since));
    const interval = setInterval(() => setElapsed(getElapsed(since)), 60_000);
    return () => clearInterval(interval);
  }, [since]);

  return (
    <p className="mt-12 md:mt-20 text-[10px] md:text-xs font-medium font-space-grotesk uppercase tracking-[0.32em] text-text-grey leading-relaxed md:leading-normal">
      Consulting brands since last{" "}
      <span className="block sm:inline text-brand-blue">
        {elapsed.years} {elapsed.years === 1 ? "year" : "years"},{" "}
        {elapsed.months} {elapsed.months === 1 ? "month" : "months"}, and{" "}
        {elapsed.days} {elapsed.days === 1 ? "day" : "days"}
      </span>
    </p>
  );
}

function getElapsed(since: string): {
  years: number;
  months: number;
  days: number;
} {
  const start = new Date(since);
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

function renderEyebrow(eyebrow: string) {
  const slashIndex = eyebrow.indexOf("/");

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
      {label} / <span className="text-brand-blue">{artistName}</span>
    </>
  );
}
