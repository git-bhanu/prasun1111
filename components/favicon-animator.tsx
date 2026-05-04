'use client';

import { useEffect } from 'react';

const FRAME_COUNT = 38;
const FRAME_RATE = 10;
const FRAME_INTERVAL_MS = 1000 / FRAME_RATE;
const FAVICON_FRAMES = Array.from({ length: FRAME_COUNT }, (_, index) => `/favicon/favicon_${index.toString().padStart(2, '0')}.png`);

export function FaviconAnimator() {
  useEffect(() => {
    let frameIndex = 0;
    const existingIcon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    const icon = existingIcon ?? document.createElement('link');

    icon.rel = 'icon';
    icon.type = 'image/png';

    if (!existingIcon) {
      document.head.appendChild(icon);
    }

    FAVICON_FRAMES.forEach((frame) => {
      const image = new Image();
      image.src = frame;
    });

    const updateFavicon = () => {
      icon.href = FAVICON_FRAMES[frameIndex];
      frameIndex = (frameIndex + 1) % FAVICON_FRAMES.length;
    };

    updateFavicon();
    const intervalId = window.setInterval(updateFavicon, FRAME_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return null;
}
