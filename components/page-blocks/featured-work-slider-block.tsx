"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as motion from "motion/react-client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { tinaField } from "tinacms/dist/react";

import { Icon, IconCircleButton } from "@/components/icons";
import { SectionMasthead } from "@/components/shared/section-masthead";
import { cn } from "@/lib/utils";
import type { PageBlocksFeaturedWorkSlider } from "@/tina/__generated__/types";

type FeaturedWorkSliderBlockProps = {
  block: PageBlocksFeaturedWorkSlider;
};

type FeaturedSlide = NonNullable<
  NonNullable<PageBlocksFeaturedWorkSlider["slides"]>[number]
>;

const slideEase = [0.22, 1, 0.36, 1] as const;

export function FeaturedWorkSliderBlock({
  block,
}: FeaturedWorkSliderBlockProps) {
  const slides =
    block.slides?.filter((slide): slide is FeaturedSlide =>
      Boolean(slide?.title),
    ) ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (activeIndex > slides.length - 1) {
      setActiveIndex(Math.max(slides.length - 1, 0));
    }
  }, [activeIndex, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const activeSlide = slides[activeIndex] ?? slides[0];
  const canNavigate = slides.length > 1;
  const showVideo =
    activeSlide.backgroundType === "video" && Boolean(activeSlide.videoUrl);
  const mediaField = showVideo ? "videoUrl" : "image";
  const tags =
    activeSlide.tags?.filter((tag): tag is string => Boolean(tag)) ?? [];

  const goToPrevious = () => {
    setDirection(-1);
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? slides.length - 1 : currentIndex - 1,
    );
  };

  const goToNext = () => {
    setDirection(1);
    setActiveIndex((currentIndex) =>
      currentIndex === slides.length - 1 ? 0 : currentIndex + 1,
    );
  };

  const goToSlide = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const mediaTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.7, ease: slideEase };
  const contentTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: slideEase };

  const getTagColorClass = (tag: string) =>
    tag.toLowerCase().includes("available")
      ? "text-brand-blue"
      : "text-brand-orange";

  const renderMedia = () => (
    <AnimatePresence initial={false} mode="sync">
      <motion.div
        key={`${activeIndex}-${activeSlide.image ?? activeSlide.videoUrl ?? activeSlide.title}`}
        className="absolute inset-0"
        initial={
          shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.035 }
        }
        animate={{ opacity: 1, scale: 1 }}
        exit={
          shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.015 }
        }
        transition={mediaTransition}
      >
        {showVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={activeSlide.videoUrl ?? undefined}
            poster={activeSlide.videoPoster ?? activeSlide.image ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : activeSlide.image ? (
          <Image
            src={activeSlide.image}
            alt={activeSlide.imageAlt || activeSlide.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority={activeIndex === 0}
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-900" />
        )}
      </motion.div>
    </AnimatePresence>
  );

  const renderControls = () => (
    <>
      <IconCircleButton onClick={goToPrevious} aria-label="Show previous slide">
        <Icon
          name="keyboardBackspace"
          color="currentColor"
          className="rotate-180"
          aria-hidden="true"
        />
      </IconCircleButton>
      <IconCircleButton onClick={goToNext} aria-label="Show next slide">
        <Icon
          name="keyboardBackspace"
          color="currentColor"
          className=""
          aria-hidden="true"
        />
      </IconCircleButton>
    </>
  );

  return (
    <section className="mx-auto w-full bg-white">
      <div className="md:hidden">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          {activeSlide.eyebrow ? (
            <motion.div
              key={`mobile-eyebrow-${activeIndex}`}
              data-tina-field={tinaField(activeSlide, "eyebrow")}
              custom={direction}
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, x: direction * 18 }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction * -18 }
              }
              transition={contentTransition}
              className="px-4"
            >
              <SectionMasthead
                index={1}
                title={activeSlide.eyebrow}
                size="sm"
                className="w-fit items-center gap-3 rounded-lg border border-black/4 p-3"
                titleClassName="text-black"
              />
            </motion.div>
          ) : (
            <motion.span key={`mobile-eyebrow-empty-${activeIndex}`} />
          )}
        </AnimatePresence>

        <div
          className="relative mt-7 overflow-hidden bg-black h-[165px]"
          data-tina-field={tinaField(activeSlide, mediaField)}
        >
          {renderMedia()}
        </div>

        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={`mobile-card-${activeIndex}`}
            custom={direction}
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 18, x: direction * 10 }
            }
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 12, x: direction * -10 }
            }
            transition={contentTransition}
            className="mx-4 mt-7 rounded-lg bg-neutral-50 p-4"
          >
            {activeSlide.href ? (
              <Link
                href={activeSlide.href}
                data-tina-field={tinaField(activeSlide, "title")}
                className="group inline-flex items-start gap-1 font-space-grotesk text-[18px] font-bold uppercase leading-[0.98] tracking-[-0.06em] text-black"
              >
                <span>{activeSlide.title}</span>
                <ArrowUpRight
                  className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            ) : (
              <h2
                data-tina-field={tinaField(activeSlide, "title")}
                className="font-space-grotesk text-[1.8rem] font-bold uppercase leading-[0.98] tracking-[-0.06em] text-black"
              >
                {activeSlide.title}
              </h2>
            )}

            {tags.length ? (
              <ul
                className="mt-4 flex flex-wrap gap-2"
                data-tina-field={tinaField(activeSlide, "tags")}
              >
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className={cn(
                      "rounded-md bg-white px-5 py-2 font-space-grotesk text-xs font-medium uppercase tracking-[0.02em]",
                      getTagColorClass(tag),
                    )}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {canNavigate ? (
          <div className="mt-6 flex items-center gap-4 pl-7">
            {renderControls()}
          </div>
        ) : null}
      </div>

      <div
        className="relative isolate hidden min-h-168 overflow-hidden bg-black md:block"
        data-tina-field={tinaField(activeSlide, mediaField)}
      >
        {renderMedia()}

        <div className="relative z-10 flex min-h-[34rem] flex-col justify-between p-6 sm:p-8 md:min-h-[42rem] md:p-10">
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            {activeSlide.eyebrow ? (
              <motion.div
                key={`eyebrow-${activeIndex}`}
                data-tina-field={tinaField(activeSlide, "eyebrow")}
                custom={direction}
                initial={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 0, x: direction * 18 }
                }
                animate={{ opacity: 1, x: 0 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: direction * -18 }
                }
                transition={contentTransition}
              >
                <SectionMasthead
                  index={1}
                  title={activeSlide.eyebrow}
                  size="sm"
                  className="w-fit items-center gap-2 rounded-lg border border-white/4 bg-black/5 px-3 py-3"
                />
              </motion.div>
            ) : (
              <motion.span key={`eyebrow-empty-${activeIndex}`} />
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              <motion.div
                key={`card-${activeIndex}`}
                custom={direction}
                initial={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 0, y: 18, x: direction * 10 }
                }
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 12, x: direction * -10 }
                }
                transition={contentTransition}
                className="max-w-[28rem] rounded-md bg-white/92 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-5"
              >
                {activeSlide.href ? (
                  <Link
                    href={activeSlide.href}
                    data-tina-field={tinaField(activeSlide, "title")}
                    className="group inline-flex items-start gap-1 font-space-grotesk text-[1.65rem] font-bold uppercase leading-[0.98] tracking-[-0.06em] text-black sm:text-[2rem]"
                  >
                    <span>{activeSlide.title}</span>
                    <ArrowUpRight
                      className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                ) : (
                  <h2
                    data-tina-field={tinaField(activeSlide, "title")}
                    className="font-space-grotesk text-[1.65rem] font-bold uppercase leading-[0.98] tracking-[-0.06em] text-black sm:text-[2rem]"
                  >
                    {activeSlide.title}
                  </h2>
                )}

                {tags.length ? (
                  <ul
                    className="mt-3 flex flex-wrap gap-2"
                    data-tina-field={tinaField(activeSlide, "tags")}
                  >
                    {tags.map((tag) => (
                      <li
                        key={tag}
                        className={cn(
                          "rounded-sm bg-slate-100 px-2.5 py-1 font-space-grotesk text-[0.55rem] font-medium uppercase tracking-[0.08em]",
                          getTagColorClass(tag),
                        )}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </motion.div>
            </AnimatePresence>

            {canNavigate ? (
              <div className="flex items-center gap-3 self-end md:self-auto">
                {renderControls()}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
