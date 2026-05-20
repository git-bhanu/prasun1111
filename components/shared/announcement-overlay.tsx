"use client";

import { Icon } from "@/components/icons";
import { ActionButton } from "@/components/shared/action-button";
import { SectionMasthead } from "@/components/shared/section-masthead";
import { useSiteSettings } from "@/components/site-settings-provider";
import { useOverlayAnimation } from "@/hooks/use-overlay-animation";
import animationData from "@/public/uploads/assets/1111.json";
import Lottie from "lottie-react";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export const ANNOUNCEMENT_OVERLAY_EVENT = "open-announcement-overlay";

export function AnnouncementOverlay() {
  const { showAnnouncementBanner } = useSiteSettings();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener(ANNOUNCEMENT_OVERLAY_EVENT, handleOpen);
    return () =>
      window.removeEventListener(ANNOUNCEMENT_OVERLAY_EVENT, handleOpen);
  }, []);

  if (!showAnnouncementBanner || !isOpen) return null;
  return <AnnouncementOverlayContent onClose={() => setIsOpen(false)} />;
}

function AnnouncementOverlayContent({ onClose }: { onClose: () => void }) {
  const { brand, primaryLinks, reachOutHref } = useSiteSettings();

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const { animateOut, animateIn } = useOverlayAnimation({
    closeBtnRef,
    panelRef,
    animation: "slide-up",
  });

  useLayoutEffect(() => {
    animateIn();
  }, [animateIn]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  const activeLink = primaryLinks[0];

  return (
    <>
      <button
        ref={closeBtnRef}
        type="button"
        onClick={() => animateOut(onClose)}
        aria-label="Close announcement"
        className="fixed right-6 top-[30px] z-[101] flex size-15 cursor-pointer items-center justify-center rounded-full bg-brand-orange text-white md:right-36"
      >
        <Icon name="pinchInZoom" size={28} color="#fff" />
      </button>
      <div
        ref={panelRef}
        className="fixed inset-x-0 bottom-0 top-[50px] z-[100] flex flex-col items-center justify-center rounded-t-2xl bg-brand-blue px-10 md:px-6"
      >
        <div className="w-full max-w-2xl">
          <div className="mb-10 inline-flex h-[44px] items-stretch gap-3 md:h-[68px]">
            <Image
              src={brand.logo}
              width={160}
              height={68}
              alt={brand.logoAlt}
              className="h-full w-auto brightness-0 invert"
              priority
            />
            <div className="aspect-[680/700] h-full shrink-0 overflow-hidden">
              <Lottie
                animationData={animationData}
                autoplay
                loop
                rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
                className="h-full w-full brightness-0 invert"
              />
            </div>
          </div>
          {activeLink && (
            <div className="mb-6 font-sedan text-[20px] leading-tight text-white md:text-[32px]">
              Selective Access is currently Active, only the{" "}
              <span className="inline-flex align-middle mx-1">
                <span className="md:hidden">
                  <SectionMasthead
                    size="sm"
                    color="white"
                    borderStrength="visible"
                    title={activeLink.label}
                    index={activeLink.index}
                  />
                </span>
                <span className="hidden md:inline-flex">
                  <SectionMasthead
                    size="md"
                    color="white"
                    borderStrength="visible"
                    title={activeLink.label}
                    index={activeLink.index}
                  />
                </span>
              </span>{" "}
              section remains open.
            </div>
          )}
          <p className="mb-10 font-sedan italic text-white text-[16px] md:text-[24px]">
            While the remaining spaces continue to unfold, conversations are
            always welcome.{" "}
            <span className="italic font-sedan text-brand-orange">
              For collaborations, thoughts, or simply to connect.
            </span>
          </p>
          <ActionButton
            color="white"
            icon="addCall"
            label="Reach Out"
            href={reachOutHref}
            target="_blank"
            className="w-auto md:w-full"
          />
        </div>
      </div>
    </>
  );
}
