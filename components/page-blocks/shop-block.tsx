"use client";

import { useInView, useReducedMotion } from "motion/react";
import { BlurUpImage } from "@/components/shared/blur-up-image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { tinaField } from "tinacms/dist/react";
import { type Components, TinaMarkdown } from "tinacms/dist/rich-text";

import { ActionButton } from "@/components/shared/action-button";
import { ANNOUNCEMENT_OVERLAY_EVENT } from "@/components/shared/announcement-overlay";
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

export function ShopBlock({ block }: ShopBlockProps) {
  const items =
    block.items?.filter((item): item is ShopItem => Boolean(item?.image)) ?? [];
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.1 });
  const dragState = useRef({ active: false, startX: 0, baseOffset: 0 });
  const marqueeRef = useRef<HTMLDivElement>(null);
  const dragWrapperRef = useRef<HTMLDivElement>(null);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current.active = true;
    dragState.current.startX = e.clientX;
    setIsDragging(true);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragState.current.active || !dragWrapperRef.current) return;
    const dx = e.clientX - dragState.current.startX;
    dragWrapperRef.current.style.transform = `translateX(${dragState.current.baseOffset + dx}px)`;
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragState.current.active) return;
    dragState.current.baseOffset += e.clientX - dragState.current.startX;
    dragState.current.active = false;
    setIsDragging(false);
  }

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
                onClick={() => window.dispatchEvent(new Event(ANNOUNCEMENT_OVERLAY_EVENT))}
                dataTinaField={tinaField(block, "buttonLabel")}
              />
            </div>
          </div>
        </div>
      </div>

      {items.length > 0 ? (
        <div
          className={cn("mt-8 overflow-hidden md:mt-16 select-none", isDragging ? "cursor-grabbing" : "cursor-grab")}
          style={{ touchAction: "pan-y" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={(e) => { dragState.current.active = false; setIsDragging(false); }}
        >
          <div ref={dragWrapperRef}>
            <div
              ref={marqueeRef}
              className={cn("flex gap-4 md:gap-6", !shouldReduceMotion && "animate-marquee")}
              style={{ animationPlayState: (!isInView || isHovered || isDragging) ? "paused" : "running" }}
            >
              {[...items, ...items].map((item, index) => (
                <ProductCard
                  key={index}
                  item={item}
                  priority={index === 0}
                  ariaHidden={index >= items.length}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ProductCard({
  item,
  priority,
  ariaHidden,
}: {
  item: ShopItem;
  priority: boolean;
  ariaHidden?: boolean;
}) {
  const cardClassName = cn(
    "flex-none aspect-[140/182] md:aspect-[176/227] w-[50vw] md:w-[calc((100vw-144px)/4)] md:min-w-[260px] overflow-hidden bg-neutral-100",
  );

  const inner = (
    <div
      className="relative w-full h-full overflow-hidden"
      data-tina-field={tinaField(item, "image")}
    >
      <BlurUpImage
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
      <article className={cardClassName} aria-hidden={ariaHidden}>
        <Link href={item.href} data-tina-field={tinaField(item, "href")} tabIndex={ariaHidden ? -1 : undefined}>
          {inner}
        </Link>
      </article>
    );
  }

  return <article className={cardClassName} aria-hidden={ariaHidden}>{inner}</article>;
}
