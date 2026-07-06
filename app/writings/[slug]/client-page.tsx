"use client";

import React, { useEffect, useRef, useState } from "react";
import { HeaderBlock } from "@/components/blocks/header-block";
import { ImageBlock } from "@/components/blocks/image-block";
import { SpaceBlock } from "@/components/blocks/space-block";
import { TwoColumnTextBlock } from "@/components/blocks/two-column-text-block";
import { VideoBlock } from "@/components/blocks/video-block";
import { Icon } from "@/components/icons";
import { BlurUpImage } from "@/components/shared/blur-up-image";
import { WritingListItem } from "@/components/writings/writing-list-item";
import { WritingTitle } from "@/components/writings/writing-title";
import { consumePendingArrowRect, hasPendingArrowRect } from "@/lib/writing-nav-state";
import type {
  WritingConnectionQuery,
  WritingQuery,
  WritingQueryVariables,
} from "@/tina/__generated__/types";
import { animate, motion, useMotionValue } from "motion/react";
import { useRouter } from "next/navigation";
import { useTina } from "tinacms/dist/react";

type WritingNode = NonNullable<
  NonNullable<WritingConnectionQuery["writingConnection"]["edges"]>[number]
>["node"];

type Props = {
  query: string;
  data: WritingQuery;
  variables: WritingQueryVariables;
  otherWritings?: NonNullable<WritingNode>[];
};

function renderWritingDate(iso: string | null | undefined): React.ReactNode {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    const day = d.getUTCDate();
    const suffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
          ? "nd"
          : day === 3 || day === 23
            ? "rd"
            : "th";
    const month = d
      .toLocaleString("en-GB", { month: "long", timeZone: "UTC" })
      .toUpperCase();
    const year = d.getUTCFullYear();
    return (
      <>
        {day}
        <sup className="text-[0.65em]">{suffix}</sup> {month} {year}
      </>
    );
  } catch {
    return iso;
  }
}

function blockWrapperClass(width: string, verticalPadding: string) {
  switch (width) {
    case "full":
      return `w-full ${verticalPadding}`;
    case "wide":
      return `w-full px-[5svw] md:pl-[10svw] md:pr-[10svw] ${verticalPadding}`;
    case "narrow":
    default:
      return `w-full px-[5svw] md:pl-[10svw] md:pr-[10svw] md:max-w-[75svw] ${verticalPadding}`;
  }
}

export default function WritingDetailClientPage({
  query,
  data,
  variables,
  otherWritings = [],
}: Props) {
  const { data: tinaData } = useTina({ query, data, variables });
  const writing = tinaData.writing;
  const router = useRouter();
  const slug = writing._sys.filename;

  const tagLabels = (writing.tags ?? []).filter((t): t is string => Boolean(t));

  const otherWritingsRef = useRef<HTMLDivElement>(null);
  const [btnVisible, setBtnVisible] = useState(true);
  // Start hidden when a pending arrow rect exists — revealed after useEffect (post-paint, post-snapshot)
  const [btnReady, setBtnReady] = useState(!hasPendingArrowRect());
  const btnRef = useRef<HTMLButtonElement>(null);
  const motionX = useMotionValue(0);
  const motionY = useMotionValue(0);
  const motionScaleX = useMotionValue(1);
  const motionScaleY = useMotionValue(1);

  useEffect(() => {
    const el = otherWritingsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setBtnVisible(!entry.isIntersecting),
      { rootMargin: "0px 0px -50% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const from = consumePendingArrowRect();
    const btn = btnRef.current;
    if (from && btn) {
      const to = btn.getBoundingClientRect();
      const dx = from.x - to.x + (from.width - to.width) / 2;
      const dy = from.y - to.y + (from.height - to.height) / 2;
      const sx = from.width / to.width;
      const sy = from.height / to.height;
      motionX.set(dx);
      motionY.set(dy);
      motionScaleX.set(sx);
      motionScaleY.set(sy);
      // Reveal at arrow position then spring to natural — runs after view-transition snapshot
      setBtnReady(true);
      animate(motionX, 0, { type: 'spring', stiffness: 380, damping: 32 });
      animate(motionY, 0, { type: 'spring', stiffness: 380, damping: 32 });
      animate(motionScaleX, 1, { type: 'spring', stiffness: 380, damping: 32 });
      animate(motionScaleY, 1, { type: 'spring', stiffness: 380, damping: 32 });
    }
  }, [motionX, motionY, motionScaleX, motionScaleY]);

  return (
    <>
      <motion.button
        ref={btnRef}
        type="button"
        onClick={() => router.push('/writings')}
        aria-label="Back to writings"
        style={{
          x: motionX,
          y: motionY,
          scaleX: motionScaleX,
          scaleY: motionScaleY,
          opacity: btnReady && btnVisible ? 1 : 0,
          pointerEvents: btnReady && btnVisible ? 'auto' : 'none',
          transition: 'opacity 0.25s',
        }}
        className="fixed right-4 top-[220px] z-[101] flex w-10 h-10 md:w-14 md:h-14 cursor-pointer items-center justify-center rounded-full bg-brand-orange md:right-[66px] md:top-[225px]"
      >
        <Icon name="pinchInZoom" size={20} color="#fff" />
      </motion.button>
      <article className="w-full">
        <div className="px-4 pt-8 md:px-[58px] md:pt-12">
          {(writing.date || tagLabels.length > 0) && (
            <div className="mb-6 flex items-baseline gap-1 font-space-grotesk text-[11px] uppercase leading-none tracking-normal md:gap-8 md:text-[18px]">
              {writing.date && (
                <span className="shrink-0 whitespace-nowrap font-normal text-black">
                  {renderWritingDate(writing.date)}
                </span>
              )}
              {writing.date && tagLabels.length > 0 && (
                <span className="shrink-0 font-normal text-black/50">·</span>
              )}
              {tagLabels.length > 0 && (
                <strong className="leading-[1.2em] font-bold text-black">
                  {tagLabels.join(" / ")}
                </strong>
              )}
            </div>
          )}

          <h1 className="mb-6 text-[36px] leading-[1.05] tracking-[-0.01em] text-black sm:text-[60px] md:text-[76px]">
            <WritingTitle sections={writing.titleSections ?? []} />
          </h1>

          {(writing.visualsCount != null || writing.readingType) && (
            <div className="mb-12 flex flex-wrap items-center gap-2">
              {writing.visualsCount != null && (
                <span className="flex h-6 items-center gap-2 rounded-[4px] bg-[#f5f5f5] px-3 py-1 font-space-grotesk text-[12px] uppercase text-black">
                  <Icon name="animatedImages" size={16} color="currentColor" />
                  {writing.visualsCount} VISUALS
                </span>
              )}
              {writing.readingType && (
                <span className="flex h-6 items-center gap-2 rounded-[4px] bg-[#f5f5f5] px-3 py-1 font-space-grotesk text-[12px] uppercase text-black">
                  <Icon
                    name="chromeReaderMode"
                    size={16}
                    color="currentColor"
                  />
                  {writing.readingType}
                </span>
              )}
            </div>
          )}
        </div>

        {writing.heroImage && (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--surface-grey)]">
            <BlurUpImage
              src={writing.heroImage}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        )}

        {writing.blocks && writing.blocks.length > 0 && (
          <div className="mt-8">
            {writing.blocks.map((block, i) => {
              switch (block?.__typename) {
                case "WritingBlocksHeader":
                  return (
                    <div
                      key={`${block.__typename}-${i}`}
                      className={blockWrapperClass("wide", "pb-2 md:py-4")}
                    >
                      <HeaderBlock block={block} />
                    </div>
                  );
                case "WritingBlocksTwoColumnText":
                  return (
                    <div
                      key={`${block.__typename}-${i}`}
                      className={blockWrapperClass("wide", "py-4")}
                    >
                      <TwoColumnTextBlock block={block} />
                    </div>
                  );
                case "WritingBlocksVideo":
                  return (
                    <div
                      key={`${block.__typename}-${i}`}
                      className={blockWrapperClass("wide", "py-10")}
                    >
                      <VideoBlock block={block} />
                    </div>
                  );
                case "WritingBlocksImage": {
                  const b = block as unknown as {
                    __typename: "WritingBlocksImage";
                    width?: string | null;
                    orientation?: string | null;
                    images?: Array<{
                      src?: string | null;
                      alt?: string | null;
                    } | null> | null;
                  };
                  return (
                    <div
                      key={`${block.__typename}-${i}`}
                      className={blockWrapperClass(
                        b.width ?? "narrow",
                        "py-2 md:py-4",
                      )}
                    >
                      <ImageBlock block={b} />
                    </div>
                  );
                }
                case "WritingBlocksSpace": {
                  const b = block as unknown as {
                    __typename: "WritingBlocksSpace";
                    desktopSpace?: string | null;
                    mobileSpace?: string | null;
                  };
                  return (
                    <SpaceBlock key={`${block.__typename}-${i}`} block={b} />
                  );
                }
                default:
                  return null;
              }
            })}
          </div>
        )}

        {otherWritings.length > 0 && (
          <div ref={otherWritingsRef} className="mt-16">
            <div className="px-4 md:px-[58px]">
              <div className="border-t border-black" />
            </div>
            <div className="mt-3 px-4 md:mt-4 md:px-[58px]">
              <div className="border-t border-black" />
            </div>
            <div className="[&>a:last-child>div:last-child]:hidden">
              {otherWritings.map((w) => (
                <WritingListItem
                  key={w.id}
                  slug={w._sys.filename}
                  titleSections={w.titleSections ?? []}
                  date={w.date}
                  tags={w.tags}
                  visualsCount={w.visualsCount}
                  readingType={w.readingType}
                  linkClassName="group block px-4 md:px-[58px]"
                />
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
