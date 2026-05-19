'use client';

import { useEffect, useId, useRef } from 'react';

type Props = {
  src: string;
  poster?: string | null;
};

function extractPublicId(url: string): string {
  const match = url.match(/\/(?:video|image)\/upload\/(?:(?:[^/]+\/)*v\d+\/)?(.+?)(?:\.[^./?]+)?(?:\?.*)?$/);
  return match?.[1] ?? url;
}

export function CloudinaryPlayer({ src, poster }: Props) {
  const rawId = useId();
  const elementId = `cld-player-${rawId.replace(/[^a-zA-Z0-9-]/g, '')}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let mounted = true;

    const videoEl = document.createElement('video');
    videoEl.id = elementId;
    if (poster) videoEl.poster = poster;
    container.appendChild(videoEl);

    Promise.all([
      import('cloudinary-video-player'),
      import('cloudinary-video-player/player.min.css' as any),
    ]).then(([mod]) => {
      if (!mounted) return;

      const playerFn = mod.player ?? mod.default?.player;
      if (!playerFn) return;

      playerFn(elementId, {
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        controls: true,
        fluid: true,
        loop: false,
        muted: false,
        logoImageUrl: '/uploads/11-logo.svg',
        logoOnclickUrl: '/',
        showLogo: true,
      }).then((p: any) => {
        if (!mounted) return;
        playerRef.current = p;
        p.source(extractPublicId(src));
      });
    });

    return () => {
      mounted = false;
      try { playerRef.current?.dispose(); } catch {}
      playerRef.current = null;
      container.innerHTML = '';
    };
  }, [src, poster, elementId]);

  return <div ref={containerRef} className="w-full" />;
}
