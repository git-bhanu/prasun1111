'use client';

import gsap from 'gsap';
import { type RefObject, useCallback, useLayoutEffect, useRef } from 'react';

type OverlayAnimationOptions = {
  backdropRef?: RefObject<HTMLElement | null>;
  closeBtnRef: RefObject<HTMLElement | null>;
  panelRef: RefObject<HTMLElement | null>;
  animation?: 'slide-up' | 'fade';
};

export function useOverlayAnimation({ backdropRef, closeBtnRef, panelRef, animation = 'slide-up' }: OverlayAnimationOptions) {
  const isOpenRef = useRef(false);

  useLayoutEffect(() => {
    if (panelRef.current) {
      gsap.set(panelRef.current, animation === 'slide-up' ? { autoAlpha: 0, y: '100%' } : { autoAlpha: 0 });
    }
    if (backdropRef?.current) gsap.set(backdropRef.current, { autoAlpha: 0 });
    if (closeBtnRef.current) gsap.set(closeBtnRef.current, { autoAlpha: 0 });
  }, []);

  const animateIn = useCallback(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef?.current ?? null;
    const closeBtn = closeBtnRef.current;
    if (!panel || !closeBtn) return;

    const skip = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    if (skip) {
      gsap.set(panel, animation === 'slide-up' ? { y: 0, autoAlpha: 1 } : { autoAlpha: 1 });
      if (backdrop) gsap.set(backdrop, { autoAlpha: 1 });
      gsap.set(closeBtn, { autoAlpha: 1, scale: 1 });
    } else {
      if (animation === 'slide-up') {
        gsap.fromTo(panel, { y: '100%', autoAlpha: 1 }, { y: 0, duration: 0.45, ease: 'expo.out' });
      } else {
        gsap.fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'power2.inOut' });
      }
      if (backdrop) {
        gsap.fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power2.inOut' });
      }
      gsap.fromTo(closeBtn, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: 'expo.out' });
    }

    isOpenRef.current = true;
  }, [animation]);

  const animateOut = useCallback(
    (onComplete: () => void) => {
      const panel = panelRef.current;
      const backdrop = backdropRef?.current ?? null;
      const closeBtn = closeBtnRef.current;

      const finish = () => {
        if (panel) gsap.set(panel, { autoAlpha: 0 });
        if (backdrop) gsap.set(backdrop, { autoAlpha: 0 });
        if (closeBtn) gsap.set(closeBtn, { autoAlpha: 0 });
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        isOpenRef.current = false;
        onComplete();
      };

      if (!panel || !closeBtn) {
        finish();
        return;
      }

      const skip = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (skip) {
        finish();
        return;
      }

      const tl = gsap.timeline({ onComplete: finish });
      if (animation === 'slide-up') {
        tl.fromTo(panel, { y: 0 }, { y: '100%', duration: 0.45, ease: 'expo.in' }, 0);
      } else {
        tl.fromTo(panel, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3, ease: 'power2.inOut' }, 0);
      }
      if (backdrop) {
        tl.fromTo(backdrop, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3, ease: 'power2.inOut' }, 0);
      }
      tl.fromTo(closeBtn, { autoAlpha: 1, scale: 1 }, { autoAlpha: 0, scale: 0.9, duration: 0.2, ease: 'power2.in' }, 0);
    },
    [animation]
  );

  return { isOpenRef, animateIn, animateOut };
}
