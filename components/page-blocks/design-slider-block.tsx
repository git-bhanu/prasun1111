"use client";

import { useInView, useReducedMotion } from "motion/react";
import { BlurUpImage } from "@/components/shared/blur-up-image";
import { formatDesignDate } from "@/components/design";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { tinaField } from "tinacms/dist/react";
import { type Components, TinaMarkdown } from "tinacms/dist/rich-text";

import { ActionButton } from "@/components/shared/action-button";
import { SectionMasthead } from "@/components/shared/section-masthead";
import { cn } from "@/lib/utils";
import type { PageBlocksDesignSlider } from "@/tina/__generated__/types";

const headingComponents: Components<{}> = {
  p: (props) => <span className="block">{props?.children}</span>,
  break: () => <br />,
  bold: (props) => <strong className="font-medium">{props?.children}</strong>,
  italic: (props) => <em className="italic font-sedan">{props?.children}</em>,
};

const descriptionComponents: Components<{}> = {
  p: (props) => <span className="block">{props?.children}</span>,
  break: () => <br />,
  bold: (props) => <strong className="font-semibold">{props?.children}</strong>,
  italic: (props) => <em className="italic font-sedan">{props?.children}</em>,
};

type DesignSliderBlockProps = {
  block: PageBlocksDesignSlider;
};

type DesignItem = NonNullable<
  NonNullable<PageBlocksDesignSlider["items"]>[number]
>;

const SCROLL_SPEED = 0.5;

export function DesignSliderBlock({ block }: DesignSliderBlockProps) {
  const items =
    block.items?.filter(
      (item): item is DesignItem => Boolean((item as any)?.design),
    ) ?? [];
  const shouldReduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.1 });

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || shouldReduceMotion || !isInView) return;

    const direction = { value: 1 };
    let rafId: number;

    const tick = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (!isPausedRef.current && maxScroll > 2) {
        container.scrollLeft += SCROLL_SPEED * direction.value;
        if (container.scrollLeft >= maxScroll - 1) {
          direction.value = -1;
        } else if (container.scrollLeft <= 1) {
          direction.value = 1;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [shouldReduceMotion, items.length, isInView]);

  if (items.length === 0) return null;

  return (
    <section ref={sectionRef} className="bg-white py-10 md:py-20">
      <div className="px-4 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="flex-1">
            {block.eyebrow ? (
              <div data-tina-field={tinaField(block, "eyebrow")}>
                <SectionMasthead
                  index={block.eyebrowIndex || "04"}
                  title={block.eyebrow}
                  size="sm"
                  color="black"
                />
              </div>
            ) : null}

            {block.heading ? (
              <h2
                className="mt-4 leading-none font-sedan text-[24px] md:text-[64px] w-[90svw] md:w-[75svw] text-black"
                data-tina-field={tinaField(block, "heading")}
              >
                <TinaMarkdown
                  content={block.heading}
                  components={headingComponents}
                />
              </h2>
            ) : null}
          </div>

          <div className="mt-6 hidden shrink-0 md:mt-4 md:block">
            <ActionButton
              color="black"
              label={block.buttonLabel}
              icon="arrowRightAlt"
              iconPosition="right"
              href="/design"
              dataTinaField={tinaField(block, "buttonLabel")}
            />
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="mt-8 flex gap-4 overflow-x-auto px-4 md:mt-25 md:gap-6 md:px-12"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onMouseEnter={() => {
          isPausedRef.current = true;
        }}
        onMouseLeave={() => {
          isPausedRef.current = false;
        }}
      >
        {items.map((item, index) => (
          <DesignCard
            key={`design-card-${index}`}
            item={item}
            priority={index === 0}
          />
        ))}
      </div>

      <div className="mt-6 px-4 md:hidden">
        <ActionButton
          color="black"
          label={block.buttonLabel}
          fullWidth
          href="/design"
          dataTinaField={tinaField(block, "buttonLabel")}
        />
      </div>
    </section>
  );
}

function DesignCard({
  item,
  priority,
}: {
  item: DesignItem;
  priority: boolean;
}) {
  const design = (item as any).design as {
    title: string;
    slug?: string | null;
    image?: string | null;
    imageAlt?: string | null;
    cardImage?: string | null;
    cardImageAlt?: string | null;
    date?: string | null;
    category?: { title: string } | null;
    description?: any;
    accentColor?: string | null;
    _sys: { filename: string };
  };

  if (!design) return null;

  const displayImage = design.cardImage ?? design.image;
  const displayAlt = design.cardImageAlt ?? design.imageAlt ?? design.title;
  const slug = design.slug ?? design._sys.filename;
  const href = `/design?design=${encodeURIComponent(slug.toLowerCase())}`;

  const accentBg = design.accentColor ?? "#e0f2fe";
  const cardClassName = cn(
    "group flex-none w-[85vw] md:w-[calc((100vw-144px)/3)] md:min-w-[400px] overflow-hidden transition-colors duration-300",
    "[background-color:var(--card-accent)] md:bg-white md:hover:[background-color:var(--card-accent)]",
  );
  const cardStyle = { "--card-accent": accentBg } as React.CSSProperties;

  const inner = (
    <>
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100 mt-6 md:mt-0">
        {displayImage ? (
          <BlurUpImage
            src={displayImage}
            alt={displayAlt}
            fill
            sizes="(max-width: 767px) 85vw, 420px"
            className="object-cover"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-100" />
        )}
      </div>

      <div className="my-4 px-4 md:p-6">
        {(design.date || design.category) ? (
          <p className="font-space-grotesk text-xs md:text-[18px] mt-4 uppercase leading-tight tracking-wide text-black">
            {design.date ? (
              <span>{formatDesignDate(design.date)}</span>
            ) : null}
            {design.date && design.category ? " · " : null}
            {design.category ? (
              <strong className="font-semibold text-black">
                {design.category.title}
              </strong>
            ) : null}
          </p>
        ) : null}

        {design.title ? (
          <h3 className="mt-4 md:mt-6 mb-4 font-sedan text-[20px] leading-[1.1] text-black md:text-[36px] cursor-pointer">
            {design.title}
          </h3>
        ) : null}

        {design.description ? (
          <div className="border-t border-black/8 pt-4 mb-4 font-sedan text-sm md:text-[24px] italic leading-tight md:leading-none text-black md:line-clamp-2 line-clamp-3">
            <TinaMarkdown
              content={design.description}
              components={descriptionComponents}
            />
          </div>
        ) : null}
      </div>
    </>
  );

  return (
    <article>
      <Link href={href} className={cardClassName} style={cardStyle}>
        {inner}
      </Link>
    </article>
  );
}
