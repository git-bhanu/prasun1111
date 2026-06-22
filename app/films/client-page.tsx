"use client";

import { CloudinaryPlayer } from "@/components/blocks/cloudinary-player";
import { HeaderBlock } from "@/components/blocks/header-block";
import { ImageBlock } from "@/components/blocks/image-block";
import { SpaceBlock } from "@/components/blocks/space-block";
import { TwoColumnTextBlock } from "@/components/blocks/two-column-text-block";
import { VideoBlock } from "@/components/blocks/video-block";
import { ActionButton } from "@/components/shared/action-button";
import { BlurUpImage } from "@/components/shared/blur-up-image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { tinaField, useTina } from "tinacms/dist/react";
import {
  type Components,
  TinaMarkdown,
  type TinaMarkdownContent,
} from "tinacms/dist/rich-text";

type AwardItem = {
  image?: string | null;
  alt?: string | null;
};

type FilmBlock = {
  __typename?: string | null;
  [key: string]: unknown;
};

const inlineComponents: Components<{}> = {
  p: (props) => <>{props?.children}</>,
};

const synopsisComponents: Components<{}> = {
  p: (props) => <p className="mt-4 first:mt-0">{props?.children}</p>,
};

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
  );
  return match?.[1] ?? null;
}

type Film = {
  __typename?: string;
  id?: string;
  title?: TinaMarkdownContent | null;
  tagline?: TinaMarkdownContent | null;
  synopsis?: TinaMarkdownContent | null;
  awards?: Array<AwardItem | null> | null;
  backgroundType?: string | null;
  heroImage?: string | null;
  heroVideo?: string | null;
  youtubeUrl?: string | null;
  medium?: string | null;
  storyDirection?: string | null;
  resolution?: string | null;
  year?: string | null;
  watchFilmLabel?: string | null;
  watchFilmHref?: string | null;
  filmDuration?: string | null;
  blocks?: Array<FilmBlock | null> | null;
};

type Props = {
  query: string;
  data: {
    filmsPage?: {
      featuredFilm?: Film | null;
    };
  };
  variables: Record<string, unknown>;
};

export default function FilmsClientPage(props: Props) {
  const { data } = useTina({
    query: props.query,
    data: props.data,
    variables: props.variables,
  });

  const film = data.filmsPage?.featuredFilm;

  if (!film) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <p className="font-space-grotesk text-sm uppercase tracking-widest text-white/40">
          No film selected.
        </p>
      </div>
    );
  }

  return <FilmDetail film={film} />;
}

function FilmDetail({ film }: { film: Film }) {
  const awards = (film.awards ?? []).filter(
    (a): a is AwardItem => a != null && Boolean(a.image),
  );

  const hasHeaderVideo = Boolean(
    film.heroImage || film.heroVideo || film.youtubeUrl,
  );

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="flex w-full flex-col bg-black">
      {/* Mobile */}
      <div className="md:hidden">
        <div className="px-4 pt-6">
          {awards.length > 0 && (
            <div className="mb-5 grid grid-cols-3 gap-3">
              {awards.map((award, i) => (
                <BlurUpImage
                  key={i}
                  src={award.image!}
                  alt={award.alt ?? ""}
                  height={60}
                  width={150}
                  className="w-full object-contain"
                />
              ))}
            </div>
          )}
          <h1
            className="font-space-grotesk text-[28px] font-bold leading-[1.05] text-white"
            data-tina-field={tinaField(film as any, "title")}
          >
            {film.title && (
              <TinaMarkdown
                content={film.title}
                components={inlineComponents}
              />
            )}
          </h1>
          {film.tagline && (
            <p
              className="mt-3 font-sedan text-[20px] md:text-[24px] text-white mb-4"
              data-tina-field={tinaField(film as any, "tagline")}
            >
              <TinaMarkdown
                content={film.tagline ?? undefined}
                components={inlineComponents}
              />
            </p>
          )}
        </div>

        {film.synopsis && (
          <div
            className="px-4 pt-3 pb-4 font-sedan text-[16px] md:text-[24px] leading-tight text-white"
            data-tina-field={tinaField(film as any, "synopsis")}
          >
            <TinaMarkdown
              content={film.synopsis ?? undefined}
              components={synopsisComponents}
            />
          </div>
        )}

        <FilmMeta film={film} />

        {hasHeaderVideo && (
          <div className="px-4 pt-6 pb-8">
            <FilmHeaderVideo film={film} />
          </div>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden bg-black px-12 pt-14 pb-16 md:block">
        {awards.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-4">
            {awards.map((award, i) => (
              <BlurUpImage
                key={i}
                src={award.image!}
                alt={award.alt ?? ""}
                height={60}
                width={150}
                className="object-contain"
              />
            ))}
          </div>
        )}
        <h1
          className="font-space-grotesk text-[48px] font-bold text-white"
          data-tina-field={tinaField(film as any, "title")}
        >
          {film.title && (
            <TinaMarkdown content={film.title} components={inlineComponents} />
          )}
        </h1>

        {film.tagline && (
          <p
            className="mt-5 font-sedan text-[14px] md:text-[24px] leading-snug text-white"
            data-tina-field={tinaField(film as any, "tagline")}
          >
            <TinaMarkdown
              content={film.tagline ?? undefined}
              components={inlineComponents}
            />
          </p>
        )}

        <div className="mt-8 flex items-start justify-between gap-12">
          <div className="max-w-[600px] border-t border-white/20 pt-8 pr-10">
            {film.synopsis && (
              <div
                className="font-sedan text-[14px] md:text-[24px] leading-snug text-white"
                data-tina-field={tinaField(film as any, "synopsis")}
              >
                <TinaMarkdown
                  content={film.synopsis ?? undefined}
                  components={synopsisComponents}
                />
              </div>
            )}
            {!hasHeaderVideo && film.watchFilmLabel && film.watchFilmHref && (
              <div className="mt-8">
                <ActionButton
                  color="orange"
                  icon="playCircle"
                  label={film.watchFilmLabel}
                  subLabel={film.filmDuration ?? undefined}
                  href={film.watchFilmHref}
                  target="_blank"
                  dataTinaField={tinaField(film as any, "watchFilmLabel")}
                />
              </div>
            )}
          </div>

          <div className="w-[500px] shrink-0">
            <FilmMeta film={film} />
          </div>
        </div>

        {hasHeaderVideo && <FilmHeaderVideo film={film} />}
      </div>

      {/* Blocks */}
      {film.blocks && film.blocks.length > 0 && (
        <div className="mt-8">
          {film.blocks.map((block, i) => {
            if (!block) return null;
            switch (block.__typename) {
              case "FilmBlocksHeader":
                return (
                  <div
                    key={`${block.__typename}-${i}`}
                    className={blockWrapperClass("wide", "pb-2 md:py-4")}
                  >
                    <HeaderBlock block={block as any} />
                  </div>
                );
              case "FilmBlocksTwoColumnText":
                return (
                  <div
                    key={`${block.__typename}-${i}`}
                    className={blockWrapperClass("wide", "py-4")}
                  >
                    <TwoColumnTextBlock block={block as any} />
                  </div>
                );
              case "FilmBlocksVideo":
                return (
                  <div
                    key={`${block.__typename}-${i}`}
                    className={blockWrapperClass("wide", "py-10")}
                  >
                    <VideoBlock block={block as any} />
                  </div>
                );
              case "FilmBlocksImage": {
                const b = block as {
                  __typename: string;
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
              case "FilmBlocksSpace": {
                const b = block as {
                  __typename: string;
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

      <div className=" flex justify-center bg-black px-6 pb-10">
        <ActionButton
          color="white"
          icon="arrowUpwardAlt"
          label="Back to Top"
          onClick={scrollToTop}
        />
      </div>
    </div>
  );
}

function FilmHeaderVideo({ film }: { film: Film }) {
  const [playing, setPlaying] = useState(false);

  const videoId = film.youtubeUrl ? extractYouTubeId(film.youtubeUrl) : null;
  const hasCloudinary = Boolean(film.heroVideo);

  if (!videoId && !hasCloudinary && !film.heroImage) return null;

  const watchButton = (fullWidth?: boolean) =>
    film.watchFilmLabel && !playing ? (
      <ActionButton
        color="orange"
        icon="playCircle"
        label={film.watchFilmLabel}
        subLabel={film.filmDuration ?? undefined}
        fullWidth={fullWidth}
        dataTinaField={tinaField(film as any, "watchFilmLabel")}
        {...(videoId
          ? { onClick: () => setPlaying(true) }
          : {
              href: film.youtubeUrl ?? film.watchFilmHref ?? "#",
              target: "_blank",
            })}
      />
    ) : null;

  return (
    <div className="mt-10 flex w-full flex-col gap-4">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-black">
        {playing && videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : hasCloudinary ? (
          <CloudinaryPlayer
            src={film.heroVideo!}
            poster={film.heroImage ?? undefined}
          />
        ) : (
          film.heroImage && (
            <BlurUpImage
              src={film.heroImage}
              alt="Film"
              fill
              className="object-cover"
              priority
            />
          )
        )}

        {/* Desktop: watch button overlay top-left */}
        <div className="absolute left-5 top-5 z-10 hidden md:block">
          {watchButton()}
        </div>
      </div>

      {/* Mobile: watch button full-width below video */}
      <div className="w-full md:hidden">{watchButton(true)}</div>
    </div>
  );
}

function FilmMeta({ film }: { film: Film }) {
  const left = [
    { label: "MEDIUM", value: film.medium },
    { label: "RESOLUTION", value: film.resolution },
  ];
  const right = [
    { label: "STORY & DIRECTION", value: film.storyDirection },
    { label: "YEAR", value: film.year },
  ];

  const hasAny = [...left, ...right].some((f) => f.value);
  if (!hasAny) return null;

  return (
    <div className="border-t pb- border-white/[0.15] mx-4">
      <div className="grid grid-cols-[1fr_1px_1fr] mt-4">
        <div>
          {left.map((f, i) => (
            <div
              key={f.label}
              className={cn(
                "py-4 pr-4",
                i < left.length - 1 && "border-b border-white/[0.15] mr-4",
              )}
            >
              <p className="font-space-grotesk text-[10px] md:text-[12px] uppercase text-white/50">
                {f.label}
              </p>
              <p className="mt-3 font-space-grotesk text-[14px] md:text-xl uppercase text-white">
                {f.value || "—"}
              </p>
            </div>
          ))}
        </div>
        <div className="bg-white/[0.15]" />
        <div>
          {right.map((f) => (
            <div key={f.label} className="py-4 pl-4">
              <p className="font-space-grotesk text-[10px] md:text-[12px] uppercase text-white/50">
                {f.label}
              </p>
              <p className="mt-3 font-space-grotesk text-[14px] md:text-xl uppercase text-white">
                {f.value || "—"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
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
