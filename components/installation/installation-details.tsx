"use client";

import { cn } from "@/lib/utils";
import { tinaField } from "tinacms/dist/react";

export interface InstallationMetaSource {
  medium?: string | null;
  dimensions?: string | null;
  weight?: string | null;
  year?: string | null;
  artists?: Array<string | null> | null;
}

type DetailField = "medium" | "dimensions" | "weight" | "year";

export interface InstallationDetailsProps {
  source: InstallationMetaSource;
  tinaSource: object;
  variant?: "light" | "dark";
  className?: string;
}

export function InstallationDetails({
  source,
  tinaSource,
  variant = "light",
  className,
}: InstallationDetailsProps) {
  const artists = (source.artists ?? []).filter((a): a is string => Boolean(a));
  const dark = variant === "dark";

  return (
    <div
      className={cn(
        "grid grid-cols-[1fr_1px_1.28fr] gap-x-8",
        dark && "max-w-[520px] gap-x-7",
        className,
      )}
    >
      <div className="space-y-6">
        <DetailItem
          label="MEDIUM"
          value={source.medium}
          field="medium"
          tinaSource={tinaSource}
          dark={dark}
        />
        <DetailItem
          label="DIMENSIONS"
          value={source.dimensions}
          field="dimensions"
          tinaSource={tinaSource}
          dark={dark}
        />
        <DetailItem
          label="WEIGHT"
          value={source.weight}
          field="weight"
          tinaSource={tinaSource}
          dark={dark}
          withBorder={false}
        />
      </div>

      <div className={cn("bg-black/25", dark && "bg-white/[0.18]")} />

      <div className="flex flex-col justify-between gap-10">
        {artists.length > 0 && (
          <div data-tina-field={tinaField(tinaSource as any, "artists")}>
            <p
              className={cn(
                "font-space-grotesk text-[10px] md:text-sm leading-none uppercase text-neutral-500",
                dark && "text-[10px] md:text-sm text-white/50",
              )}
            >
              ARTISTS
            </p>
            <p
              className={cn(
                "mt-3 font-space-grotesk text-[14px] md:text-xl leading-[1.35] uppercase",
                dark && "text-[20px] text-white",
              )}
            >
              {artists.map((artist, index) => (
                <span key={artist} className="md:block">
                  {artist}
                  {index < artists.length - 1 ? (
                    <span className="md:hidden">, </span>
                  ) : null}
                </span>
              ))}
            </p>
          </div>
        )}

        <DetailItem
          label="YEAR"
          value={source.year}
          field="year"
          tinaSource={tinaSource}
          dark={dark}
          withBorder={false}
        />
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  field,
  tinaSource,
  dark,
  withBorder = true,
}: {
  label: string;
  value?: string | null;
  field: DetailField;
  tinaSource: object;
  dark: boolean;
  withBorder?: boolean;
}) {
  if (!value) return null;

  return (
    <div
      className={cn(
        withBorder && "border-b border-black/20 pb-5",
        dark && withBorder && "border-white/[0.18]",
      )}
      data-tina-field={tinaField(tinaSource as any, field)}
    >
      <p
        className={cn(
          "font-space-grotesk text-[10px] md:text-[14px] leading-none uppercase text-neutral-500",
          dark && "text-sm text-white/50",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-space-grotesk text-[14px] md:text-xl",
          dark && "text-[20px] text-white",
        )}
      >
        {value}
      </p>
    </div>
  );
}
