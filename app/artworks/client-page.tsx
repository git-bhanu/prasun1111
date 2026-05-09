"use client";

import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTina } from "tinacms/dist/react";
import type {
  ArtworkConnectionQuery,
  ArtworkConnectionQueryVariables,
  ArtworkQuery,
} from "@/tina/__generated__/types";

type ArtworkNode = NonNullable<
  NonNullable<
    NonNullable<ArtworkConnectionQuery["artworkConnection"]["edges"]>[number]
  >["node"]
>;
type ArtworkDetail = ArtworkQuery["artwork"];
type TagItem = NonNullable<
  NonNullable<NonNullable<ArtworkDetail["tags"]>[number]>["tag"]
>;

type Props = {
  query: string;
  data: ArtworkConnectionQuery;
  variables: ArtworkConnectionQueryVariables;
};

export default function ArtworksClientPage(props: Props) {
  return (
    <Suspense>
      <ArtworksContent {...props} />
    </Suspense>
  );
}

function ArtworksContent({ query, data, variables }: Props) {
  const { data: tinaData } = useTina({ query, data, variables });
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSlug = searchParams?.get("artwork") ?? null;

  const [detail, setDetail] = useState<ArtworkDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const artworks: ArtworkNode[] = (tinaData.artworkConnection.edges ?? [])
    .map((e) => e?.node)
    .filter((n): n is ArtworkNode => n != null);

  useEffect(() => {
    if (!selectedSlug) {
      setDetail(null);
      return;
    }
    setLoading(true);
    fetch(`/api/artwork?slug=${encodeURIComponent(selectedSlug)}`)
      .then((r) => r.json())
      .then((d: ArtworkDetail) => setDetail(d))
      .finally(() => setLoading(false));
  }, [selectedSlug]);

  const artworkSlug = (a: ArtworkNode) =>
    (a.slug ?? a._sys.filename).toLowerCase();

  const selectedIndex = selectedSlug
    ? artworks.findIndex((a) => artworkSlug(a) === selectedSlug)
    : -1;

  const goTo = (slug: string) =>
    router.push(`/artworks?artwork=${encodeURIComponent(slug)}`);
  const close = () => router.push("/artworks");
  const prev = () =>
    selectedIndex > 0 && goTo(artworkSlug(artworks[selectedIndex - 1]));
  const next = () =>
    selectedIndex < artworks.length - 1 &&
    goTo(artworkSlug(artworks[selectedIndex + 1]));

  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-8 py-12 sm:px-10 md:px-[58px]">
        <p className="mb-2 text-sm uppercase tracking-[0.24em] text-black/45">
          Collection
        </p>
        <h1 className="mb-10 font-space-grotesk text-5xl tracking-[-0.06em] text-black sm:text-6xl">
          Artworks
        </h1>
        {artworks.length === 0 ? (
          <p className="text-black/45">No artworks yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                onClick={() => goTo(artworkSlug(artwork))}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedSlug && (
          <>
            {/* Black transparent backdrop */}
            <motion.div
              key="artwork-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: "easeOut", duration: 0.3 }}
              onClick={close}
              className="fixed inset-0 z-[99] bg-black/60"
            />

            {/* Slide-up panel — starts 200px from top */}
            <motion.div
              key="artwork-detail"
              initial={{ y: prefersReducedMotion ? 0 : "100%" }}
              animate={{ y: 0 }}
              exit={{ y: prefersReducedMotion ? 0 : "100%" }}
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
              className="fixed inset-x-0 bottom-0 top-[50px] z-[100] overflow-y-auto rounded-t-2xl bg-white"
            >
              {loading || !detail ? (
                <div className="flex min-h-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
                </div>
              ) : (
                <DetailPanel
                  artwork={detail}
                  onClose={close}
                  onPrev={selectedIndex > 0 ? prev : undefined}
                  onNext={
                    selectedIndex < artworks.length - 1 ? next : undefined
                  }
                  index={selectedIndex}
                  total={artworks.length}
                />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function ArtworkCard({
  artwork,
  onClick,
}: {
  artwork: ArtworkNode;
  onClick: () => void;
}) {
  const tags = (artwork.tags ?? [])
    .map((t) => t?.tag)
    .filter((t): t is TagItem => t != null);

  return (
    <button
      onClick={onClick}
      className="group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
    >
      <div className="relative mb-3 aspect-[4/3] overflow-hidden bg-[var(--surface-grey)]">
        {artwork.coverImage ? (
          <Image
            src={artwork.coverImage}
            alt={artwork.coverImageAlt ?? artwork.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-[var(--surface-grey)]" />
        )}
      </div>
      <h2 className="font-space-grotesk text-xl tracking-[-0.04em] text-black">
        {artwork.title}
      </h2>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              style={{ color: tag.color ?? "currentColor" }}
              className="font-space-grotesk text-[10px] uppercase tracking-widest"
            >
              {tag.title}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

function DetailPanel({
  artwork,
  onClose,
  onPrev,
  onNext,
  index,
  total,
}: {
  artwork: ArtworkDetail;
  onClose: () => void;
  onPrev?: (() => void) | false;
  onNext?: (() => void) | false;
  index: number;
  total: number;
}) {
  const tags = (artwork.tags ?? [])
    .map((t) => t?.tag)
    .filter((t): t is TagItem => t != null);

  return (
    <div className="w-full">
      <div className="flex min-h-screen flex-col md:flex-row">
        <div className="flex flex-1 flex-col justify-between px-8 py-12 sm:px-10 md:max-w-md md:px-[58px]">
          <div>
            <p className="mb-4 font-space-grotesk text-xs tracking-[0.2em] text-black/40">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </p>
            <h1 className="font-space-grotesk text-4xl tracking-[-0.05em] text-black sm:text-5xl">
              {artwork.title}
            </h1>
            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    style={{ color: tag.color ?? "currentColor" }}
                    className="font-space-grotesk text-[10px] uppercase tracking-widest"
                  >
                    {tag.title}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={onPrev || undefined}
              disabled={!onPrev}
              className="rounded-full border border-black/20 px-4 py-2 text-xs uppercase tracking-widest transition hover:border-black disabled:opacity-30"
            >
              ← Prev
            </button>
            <button
              onClick={onNext || undefined}
              disabled={!onNext}
              className="rounded-full border border-black/20 px-4 py-2 text-xs uppercase tracking-widest transition hover:border-black disabled:opacity-30"
            >
              Next →
            </button>
            <button
              onClick={onClose}
              className="ml-auto rounded-full border border-black/20 px-4 py-2 text-xs uppercase tracking-widest transition hover:border-black"
            >
              Close
            </button>
          </div>
        </div>
        {artwork.coverImage && (
          <div className="relative min-h-[50vh] flex-1 bg-[var(--surface-grey)] md:min-h-screen">
            <Image
              src={artwork.coverImage}
              alt={artwork.coverImageAlt ?? artwork.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority
            />
          </div>
        )}
      </div>
    </div>
  );
}
