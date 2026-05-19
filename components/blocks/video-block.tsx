"use client";

import { ActionButton } from "@/components/shared/action-button";
import { CloudinaryPlayer } from "@/components/blocks/cloudinary-player";
import { tinaField } from "tinacms/dist/react";
import Image from "next/image";
import { useState } from "react";

type VideoBlockData = {
  posterImage?: string | null;
  youtubeUrl?: string | null;
  videoUrl?: string | null;
  duration?: string | null;
};

type Props = {
  block: VideoBlockData;
};

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
  );
  return match?.[1] ?? null;
}

export function VideoBlock({ block }: Props) {
  const [playing, setPlaying] = useState(false);

  const hasYouTube = Boolean(block.youtubeUrl);
  const hasCloudinary = Boolean(block.videoUrl);
  const hasPoster = Boolean(block.posterImage);

  if (!hasPoster && !hasYouTube && !hasCloudinary) return null;

  const videoId = block.youtubeUrl ? extractYouTubeId(block.youtubeUrl) : null;

  if (hasCloudinary) {
    return (
      <div
        className="flex flex-col gap-4 w-full"
        data-tina-field={tinaField(block, "videoUrl")}
      >
        <div className="relative w-full overflow-hidden rounded-2xl bg-black">
          <CloudinaryPlayer src={block.videoUrl!} poster={block.posterImage} />
        </div>
      </div>
    );
  }

  const button = videoId && !playing ? (
    <ActionButton
      variant="solid"
      color="orange"
      icon="playCircle"
      iconPosition="left"
      label="Watch Film"
      subLabel={block.duration ?? undefined}
      onClick={() => setPlaying(true)}
    />
  ) : null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-black">
        {playing && videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <>
            {block.posterImage && (
              <Image
                src={block.posterImage}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, calc(100vw - 116px)"
                data-tina-field={tinaField(block, "posterImage")}
              />
            )}
            {videoId && (
              <div className="hidden md:block absolute left-5 top-5" data-tina-field={tinaField(block, "youtubeUrl")}>
                {button}
              </div>
            )}
          </>
        )}
      </div>
      {videoId && (
        <div className="md:hidden w-full" data-tina-field={tinaField(block, "youtubeUrl")}>
          {button}
        </div>
      )}
    </div>
  );
}
