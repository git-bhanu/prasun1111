"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

export const COPY_TOAST_EVENT = "show-copy-toast";

export function showCopyToast() {
  window.dispatchEvent(new CustomEvent(COPY_TOAST_EVENT));
}

export function CopyToast() {
  const toastRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = toastRef.current;
    if (!el) return;

    gsap.set(el, { autoAlpha: 0, y: -64 });

    const show = () => {
      if (timerRef.current) clearTimeout(timerRef.current);

      gsap.killTweensOf(el);
      gsap.fromTo(
        el,
        { y: -64, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.45, ease: "expo.out" },
      );

      timerRef.current = setTimeout(() => {
        gsap.to(el, { y: -64, autoAlpha: 0, duration: 0.35, ease: "expo.in" });
      }, 2500);
    };

    window.addEventListener(COPY_TOAST_EVENT, show);
    return () => {
      window.removeEventListener(COPY_TOAST_EVENT, show);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      ref={toastRef}
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 top-6 z-[200] flex justify-center"
      style={{ opacity: 0, visibility: 'hidden', transform: 'translateY(-64px)' }}
    >
      <div className="flex items-center gap-3 rounded-full bg-black px-6 py-4 shadow-xl">
        <ClipboardIcon />
        <span className="font-space-grotesk text-[13px] uppercase leading-none tracking-wider text-white">
          Link Copied to Clipboard
        </span>
      </div>
    </div>
  );
}

function ClipboardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-white"
      aria-hidden="true"
    >
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
    </svg>
  );
}
