"use client";

import {
  ArtworkBentoGrid,
  ArtworkDetailActions,
  ArtworkInfoCard,
} from "@/components/artwork";
import type { QuoteBreak } from "@/components/artwork";
import { HeaderBlock } from "@/components/blocks/header-block";
import { ImageBlock } from "@/components/blocks/image-block";
import { SpaceBlock } from "@/components/blocks/space-block";
import { TwoColumnTextBlock } from "@/components/blocks/two-column-text-block";
import { VideoBlock } from "@/components/blocks/video-block";
import { Icon } from "@/components/icons";
import { ActionButton } from "@/components/shared/action-button";
import { SectionMasthead } from "@/components/shared/section-masthead";
import type {
  ArtworkConnectionQuery,
  ArtworkConnectionQueryVariables,
} from "@/tina/__generated__/types";
import gsap from "gsap";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTina } from "tinacms/dist/react";

type ArtworkNode = NonNullable<
  NonNullable<
    NonNullable<ArtworkConnectionQuery["artworkConnection"]["edges"]>[number]
  >["node"]
>;
type TagItem = NonNullable<
  NonNullable<NonNullable<ArtworkNode["tags"]>[number]>["tag"]
>;

type Props = {
  query: string;
  data: ArtworkConnectionQuery;
  variables: ArtworkConnectionQueryVariables;
  quoteBreaks: QuoteBreak[];
};

export default function ArtworksClientPage(props: Props) {
  return (
    <Suspense>
      <ArtworksContent {...props} />
    </Suspense>
  );
}

function ArtworksContent({ query, data, variables, quoteBreaks }: Props) {
  const { data: tinaData } = useTina({ query, data, variables });
  const searchParams = useSearchParams();

  const backdropRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const detailScrollRef = useRef<HTMLDivElement | null>(null);
  const isOpenRef = useRef(false);

  useLayoutEffect(() => {
    if (backdropRef.current) gsap.set(backdropRef.current, { autoAlpha: 0 });
    if (closeBtnRef.current) gsap.set(closeBtnRef.current, { autoAlpha: 0 });
    if (panelRef.current) gsap.set(panelRef.current, { autoAlpha: 0, y: "100%" });
  }, []);

  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    () => searchParams?.get("artwork") ?? null,
  );
  const [displayArtwork, setDisplayArtwork] = useState<ArtworkNode | null>(null);

  useEffect(() => {
    const handlePop = () => {
      const params = new URLSearchParams(window.location.search);
      setSelectedSlug(params.get("artwork") ?? null);
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const artworks: ArtworkNode[] = (tinaData.artworkConnection.edges ?? [])
    .map((e) => e?.node)
    .filter((n): n is ArtworkNode => n != null)
    .sort((a, b) => {
      const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder;
    });

  const artworkSlug = (a: ArtworkNode) =>
    (a.slug ?? a._sys.filename).toLowerCase();

  const selectedIndex = selectedSlug
    ? artworks.findIndex((a) => artworkSlug(a) === selectedSlug)
    : -1;

  const selectedArtwork = selectedIndex >= 0 ? artworks[selectedIndex] : null;

  const animateIn = useCallback(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const closeBtn = closeBtnRef.current;
    if (!panel || !backdrop || !closeBtn) return;

    const skip = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    if (skip) {
      gsap.set(panel, { y: 0, autoAlpha: 1 });
      gsap.set(backdrop, { autoAlpha: 1 });
      gsap.set(closeBtn, { autoAlpha: 1, scale: 1 });
    } else {
      gsap.fromTo(panel, { y: "100%", autoAlpha: 1 }, { y: 0, duration: 0.45, ease: "expo.out" });
      gsap.fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: "power2.inOut" });
      gsap.fromTo(closeBtn, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "expo.out" });
    }

    isOpenRef.current = true;
  }, []);

  const animateOut = useCallback((onComplete: () => void) => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const closeBtn = closeBtnRef.current;

    const finish = () => {
      if (panel) gsap.set(panel, { autoAlpha: 0 });
      if (backdrop) gsap.set(backdrop, { autoAlpha: 0 });
      if (closeBtn) gsap.set(closeBtn, { autoAlpha: 0 });
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      isOpenRef.current = false;
      onComplete();
    };

    if (!panel || !backdrop || !closeBtn) { finish(); return; }

    const skip = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (skip) { finish(); return; }

    gsap.timeline({ onComplete: finish })
      .fromTo(panel, { y: 0 }, { y: "100%", duration: 0.45, ease: "expo.in" }, 0)
      .fromTo(backdrop, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3, ease: "power2.inOut" }, 0)
      .fromTo(closeBtn, { autoAlpha: 1, scale: 1 }, { autoAlpha: 0, scale: 0.9, duration: 0.2, ease: "power2.in" }, 0);
  }, []);

  const prevSlugRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    const prev = prevSlugRef.current;
    prevSlugRef.current = selectedSlug;

    if (selectedSlug && selectedArtwork) {
      setDisplayArtwork(selectedArtwork);
      if (!isOpenRef.current) animateIn();
    } else if (!selectedSlug && prev) {
      animateOut(() => setDisplayArtwork(null));
    }
  }, [selectedSlug, selectedArtwork, animateIn, animateOut]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  const goTo = (slug: string) => {
    setSelectedSlug(slug);
    window.history.pushState({}, "", `/artworks?artwork=${encodeURIComponent(slug)}`);
  };
  const close = () => {
    setSelectedSlug(null);
    window.history.pushState({}, "", "/artworks");
  };

  const displayIndex = displayArtwork
    ? artworks.findIndex((a) => artworkSlug(a) === artworkSlug(displayArtwork))
    : -1;

  return (
    <>
      {artworks.length === 0 ? (
        <div className="px-8 py-12 sm:px-10 md:px-[58px]">
          <p className="text-black/45">No artworks yet.</p>
        </div>
      ) : (
        <ArtworkBentoGrid
          artworks={artworks}
          quoteBreaks={quoteBreaks}
          onArtworkClick={goTo}
        />
      )}

      <div
        ref={backdropRef}
        onClick={close}
        className="fixed inset-0 z-[99] bg-black/60"
      />
      <button
        ref={closeBtnRef}
        type="button"
        onClick={close}
        aria-label="Close overlay"
        className="fixed right-6 top-[30px] z-[101] flex size-15 cursor-pointer items-center justify-center rounded-full bg-brand-orange text-white md:right-36"
      >
        <Icon name="pinchInZoom" size={28} color="#fff" />
      </button>
      <div
        ref={(el) => {
          panelRef.current = el;
          detailScrollRef.current = el;
        }}
        className="fixed inset-x-0 bottom-0 top-[50px] z-[100] overflow-y-auto rounded-t-2xl bg-white"
      >
        {displayArtwork && (
          <DetailPanel
            artwork={displayArtwork}
            onClose={close}
            onPrev={displayIndex > 0 ? () => goTo(artworkSlug(artworks[displayIndex - 1])) : undefined}
            onNext={displayIndex < artworks.length - 1 ? () => goTo(artworkSlug(artworks[displayIndex + 1])) : undefined}
            scrollToTop={() =>
              detailScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
            }
          />
        )}
      </div>
    </>
  );
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

function DetailPanel({
  artwork,
  onClose,
  onPrev,
  onNext,
  scrollToTop,
}: {
  artwork: ArtworkNode;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  scrollToTop?: () => void;
}) {
  const tags = (artwork.tags ?? [])
    .map((t) => t?.tag)
    .filter((t): t is TagItem => t != null);

  return (
    <>
      <div className="flex min-h-full flex-col md:flex-row">
        <div className="order-2 flex w-full flex-col px-6 py-6 md:order-1 md:w-[50%] md:shrink-0 md:items-start md:justify-center md:pl-[10svw]">
          <SectionMasthead
            index={"04"}
            title={"Artworks"}
            size="sm"
            color="black"
            className="mb-3 md:hidden"
          />
          <div className="hidden md:block">
            <ArtworkDetailActions mode="close-only" onClose={onClose} />
          </div>

          <div className="w-full md:max-w-[450px]">
            <ArtworkInfoCard
              title={artwork.title}
              as="h1"
              arrow="down"
              titleClassName="inline-block font-space-grotesk font-bold uppercase text-black text-[1.4rem] leading-[1.15em] sm:text-[1.65rem]"
              tags={tags}
              className="mb-10 md:my-20"
            />

            <div className="mt-4 md:hidden">
              <ArtworkDetailActions mode="all" onClose={onClose} />
            </div>
            <div className="mt-4 hidden md:block">
              <ArtworkDetailActions mode="secondary" onClose={onClose} />
            </div>
          </div>
        </div>

        {artwork.coverImage && (
          <div className="relative order-1 aspect-[4/3] h-[500px] w-full flex-shrink-0 bg-[var(--surface-grey)] md:order-2 md:aspect-auto md:min-h-full md:h-auto md:flex-1">
            <Image
              src={artwork.coverImage}
              alt={artwork.coverImageAlt ?? artwork.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority
            />
          </div>
        )}
      </div>
      {artwork.blocks && artwork.blocks.length > 0 && (
        <div className="mt-8">
          {artwork.blocks.map((block, i) => {
            switch (block?.__typename) {
              case "ArtworkBlocksHeader":
                return (
                  <div
                    key={`${block.__typename}-${i}`}
                    className={blockWrapperClass("narrow", "pb-2 md:py-4")}
                  >
                    <HeaderBlock block={block} />
                  </div>
                );
              case "ArtworkBlocksTwoColumnText":
                return (
                  <div
                    key={`${block.__typename}-${i}`}
                    className={blockWrapperClass("wide", "py-4")}
                  >
                    <TwoColumnTextBlock block={block} />
                  </div>
                );
              case "ArtworkBlocksVideo":
                return (
                  <div
                    key={`${block.__typename}-${i}`}
                    className={blockWrapperClass("wide", "py-10")}
                  >
                    <VideoBlock block={block} />
                  </div>
                );
              case "ArtworkBlocksImage": {
                const b = block as unknown as {
                  __typename: "ArtworkBlocksImage";
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
                    className={blockWrapperClass(b.width ?? "narrow", "py-4")}
                  >
                    <ImageBlock block={b} />
                  </div>
                );
              }
              case "ArtworkBlocksSpace": {
                const b = block as unknown as {
                  __typename: "ArtworkBlocksSpace";
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
      <div className="mt-10 flex justify-center px-6 pb-10">
        <ActionButton
          color="white"
          icon="arrowUpwardAlt"
          label="Back to Top"
          onClick={scrollToTop}
          className="bg-surface-grey"
        />
      </div>
    </>
  );
}
