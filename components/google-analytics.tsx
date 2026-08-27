'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

function TrackPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GA_ID || !searchParams) return;

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <TrackPageView />
    </Suspense>
  );
}
