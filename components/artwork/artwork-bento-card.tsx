"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { ArtworkInfoCard } from "./artwork-info-card";

type Tag = {
  id?: string | null;
  title: string;
  color?: string | null;
};

type DisplaySize = "hero" | "large" | "medium" | "small";

export interface ArtworkBentoCardProps {
  title: string;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  tags?: Tag[];
  mostViewed?: boolean | null;
  printsAvailable?: boolean | null;
  displaySize?: string | null;
  orientation?: string | null;
  onClick: () => void;
}

const colSpanClass: Record<DisplaySize, string> = {
  hero: "col-span-1 md:col-span-12",
  large: "col-span-1 md:col-span-6",
  medium: "col-span-1 md:col-span-4",
  small: "col-span-1 md:col-span-3",
};

const defaultAspectClass: Record<DisplaySize, string> = {
  hero: "aspect-[16/9]",
  large: "aspect-[3/4]",
  medium: "aspect-[4/3]",
  small: "aspect-square",
};

function resolveAspect(size: DisplaySize, orientation?: string | null): string {
  if (orientation === "landscape")
    return size === "hero" ? "aspect-[16/9]" : "aspect-[4/3]";
  if (orientation === "portrait") return "aspect-[3/4]";
  return defaultAspectClass[size];
}

const imageSizes: Record<DisplaySize, string> = {
  hero: "(max-width: 768px) 100vw, 100vw",
  large: "(max-width: 768px) 100vw, 50vw",
  medium: "(max-width: 768px) 100vw, 33vw",
  small: "(max-width: 768px) 100vw, 25vw",
};

export function ArtworkBentoCard({
  title,
  coverImage,
  coverImageAlt,
  tags = [],
  mostViewed,
  displaySize,
  orientation,
  onClick,
}: ArtworkBentoCardProps) {
  const validSizes: DisplaySize[] = ["hero", "large", "medium", "small"];
  const size: DisplaySize = validSizes.includes(displaySize as DisplaySize)
    ? (displaySize as DisplaySize)
    : "medium";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black cursor-pointer",
        colSpanClass[size],
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-[var(--surface-grey)]",
          resolveAspect(size, orientation),
        )}
      >
        {mostViewed && (
          <div className="absolute left-3 top-3 z-10 rounded-[20px] bg-white/90 px-2 py-0.5 backdrop-blur-sm">
            <span className="font-space-grotesk text-[12px] font-semibold uppercase text-black">
              Most Viewed
            </span>
          </div>
        )}
        {coverImage ? (
          <Image
            src={coverImage}
            alt={coverImageAlt ?? title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={imageSizes[size]}
          />
        ) : (
          <div className="h-full w-full bg-[var(--surface-grey)]" />
        )}
      </div>

      <ArtworkInfoCard
        title={title}
        as="h2"
        arrow="up"
        titleClassName="font-space-grotesk font-bold"
        tags={tags}
        asCard
        className="mt-2 rounded-[8px]"
      />
    </button>
  );
}
