'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

function isPlainInternalLinkClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
    return false;
  }

  if (!(event.target instanceof Element)) {
    return false;
  }

  const anchor = event.target.closest('a[href]');

  return anchor instanceof HTMLAnchorElement && !anchor.target && anchor.origin === window.location.origin;
}

export function RouteScrollTop() {
  const pathname = usePathname();
  const shouldScrollTopRef = useRef(false);
  const isInitialRenderRef = useRef(true);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (isPlainInternalLinkClick(event)) {
        shouldScrollTopRef.current = true;
      }
    };

    const handlePopState = () => {
      shouldScrollTopRef.current = false;
    };

    document.addEventListener('click', handleDocumentClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      return;
    }

    if (!shouldScrollTopRef.current) {
      return;
    }

    shouldScrollTopRef.current = false;

    for (const delay of [0, 50, 150]) {
      window.setTimeout(() => {
        window.scrollTo(0, 0);
      }, delay);
    }
  }, [pathname]);

  return null;
}
