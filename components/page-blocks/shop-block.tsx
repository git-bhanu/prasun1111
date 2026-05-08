"use client";

import { useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { tinaField } from "tinacms/dist/react";
import { type Components, TinaMarkdown } from "tinacms/dist/rich-text";

import { ActionButton } from "@/components/shared/action-button";
import { SectionMasthead } from "@/components/shared/section-masthead";
import { cn } from "@/lib/utils";
import type { PageBlocksShop } from "@/tina/__generated__/types";

const headingComponents: Components<{}> = {
  p: (props) => <span className="block">{props?.children}</span>,
  break: () => <br />,
  bold: (props) => <strong className="font-medium">{props?.children}</strong>,
  italic: (props) => <em className="italic font-sedan">{props?.children}</em>,
};

type ShopBlockProps = {
  block: PageBlocksShop;
};

type ShopItem = NonNullable<NonNullable<PageBlocksShop["items"]>[number]>;

const SCROLL_SPEED = 0.5;

export function ShopBlock({ block }: ShopBlockProps) {
  const items =
    block.items?.filter((item): item is ShopItem => Boolean(item?.image)) ?? [];
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

  return (
    <section
      ref={sectionRef}
      className="bg-brand-blue mx-4 my-8 py-8 md:py-11 md:mx-8 rounded-[8px] md:rounded-[12px]"
    >
      <div className="px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between md:gap-4">
          <div className="flex-1">
            {block.eyebrow ? (
              <div data-tina-field={tinaField(block, "eyebrow")}>
                <SectionMasthead
                  index={block.eyebrowIndex || undefined}
                  title={block.eyebrow}
                  size="sm"
                  color="white"
                  borderStrength="subtle"
                />
              </div>
            ) : null}

            {block.heading ? (
              <h2
                className="mt-6 leading-none font-sedan text-[24px] w-full md:text-[64px] md:w-[45svw] text-white"
                data-tina-field={tinaField(block, "heading")}
              >
                <TinaMarkdown
                  content={block.heading}
                  components={headingComponents}
                />
              </h2>
            ) : null}
          </div>

          <div className="mt-6 md:mt-0 shrink-0 md:w-[40svw] flex flex-col gap-6 md:pt-2 md:mr-4">
            {block.description ? (
              <p
                className="font-sedan text-white text-[16px] md:text-[32px] leading-none"
                data-tina-field={tinaField(block, "description")}
              >
                {block.description}
              </p>
            ) : null}

            <div className="">
              <ActionButton
                color="white"
                label={block.buttonLabel}
                icon="shoppingBag"
                iconPosition="left"
                href={block.buttonHref}
                dataTinaField={tinaField(block, "buttonLabel")}
              />
            </div>
          </div>
        </div>
      </div>

      {items.length > 0 ? (
        <div
          ref={scrollRef}
          className="mt-8 flex gap-4 overflow-x-auto px-4 md:mt-16 md:gap-6 md:px-12"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseEnter={() => {
            isPausedRef.current = true;
          }}
          onMouseLeave={() => {
            isPausedRef.current = false;
          }}
        >
          {items.map((item, index) => (
            <ProductCard
              key={`product-card-${index}`}
              item={item}
              priority={index === 0}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function ProductCard({
  item,
  priority,
}: {
  item: ShopItem;
  priority: boolean;
}) {
  const cardClassName = cn(
    "flex-none aspect-[140/182] md:aspect-[176/227] w-[50vw] md:w-[calc((100vw-144px)/4)] md:min-w-[260px] overflow-hidden bg-neutral-100",
  );

  const inner = (
    <div
      className="relative w-full h-full overflow-hidden"
      data-tina-field={tinaField(item, "image")}
    >
      <Image
        src={item.image}
        alt={item.imageAlt || "Product"}
        fill
        sizes="(max-width: 400px) 85vw, 25vw"
        className="object-cover object-center"
        priority={priority}
      />
    </div>
  );

  if (item.href) {
    return (
      <article className={cardClassName}>
        <Link href={item.href} data-tina-field={tinaField(item, "href")}>
          {inner}
        </Link>
      </article>
    );
  }

  return <article className={cardClassName}>{inner}</article>;
}
