"use client";

import { ActionButton } from "@/components/shared/action-button";
import { tinaField } from "tinacms/dist/react";
import Image from "next/image";
import { useState } from "react";

type VideoBlockData = {
  posterImage?: string | null;
  youtubeUrl?: string | null;
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

  if (!block.posterImage && !block.youtubeUrl) return null;

  const videoId = block.youtubeUrl ? extractYouTubeId(block.youtubeUrl) : null;

  return (
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
            <div className="absolute left-5 top-5" data-tina-field={tinaField(block, "youtubeUrl")}>
              <ActionButton
                variant="solid"
                color="orange"
                icon="playCircle"
                iconPosition="left"
                label="Watch Film"
                subLabel={block.duration ?? undefined}
                onClick={() => setPlaying(true)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
