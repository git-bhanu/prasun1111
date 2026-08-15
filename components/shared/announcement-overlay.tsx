'use client';

import { Icon } from '@/components/icons';
import { ActionButton } from '@/components/shared/action-button';
import { useSiteSettings } from '@/components/site-settings-provider';
import { useOverlayAnimation } from '@/hooks/use-overlay-animation';
import animationData from '@/public/uploads/assets/1111.json';
import Lottie from 'lottie-react';
import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export const ANNOUNCEMENT_OVERLAY_EVENT = 'open-announcement-overlay';

export function AnnouncementOverlay() {
  const { showAnnouncementBanner } = useSiteSettings();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener(ANNOUNCEMENT_OVERLAY_EVENT, handleOpen);
    return () => window.removeEventListener(ANNOUNCEMENT_OVERLAY_EVENT, handleOpen);
  }, []);

  if (!showAnnouncementBanner || !isOpen) return null;
  return <AnnouncementOverlayContent onClose={() => setIsOpen(false)} />;
}

function AnnouncementOverlayContent({ onClose }: { onClose: () => void }) {
  const { brand, reachOutHref } = useSiteSettings();

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const { animateOut, animateIn } = useOverlayAnimation({
    closeBtnRef,
    panelRef,
    animation: 'slide-up',
  });

  useLayoutEffect(() => {
    animateIn();
  }, [animateIn]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  return (
    <>
      <button
        ref={closeBtnRef}
        type='button'
        onClick={() => animateOut(onClose)}
        aria-label='Close announcement'
        className='fixed right-6 top-[30px] z-[101] flex size-15 cursor-pointer items-center justify-center rounded-full bg-brand-orange text-white md:right-36'
      >
        <Icon name='pinchInZoom' size={28} color='#fff' />
      </button>
      <div
        ref={panelRef}
        className='fixed inset-x-0 bottom-0 top-[50px] z-[100] flex flex-col items-center justify-center rounded-t-2xl bg-brand-blue px-10 md:px-6'
      >
        <div className='w-full max-w-2xl'>
          <div className='mb-10 inline-flex h-[44px] items-stretch gap-3 md:h-[68px]'>
            <Image src={brand.logo} width={160} height={68} alt={brand.logoAlt} className='h-full w-auto brightness-0 invert' priority />
            <div className='aspect-[680/700] h-full shrink-0 overflow-hidden'>
              <Lottie
                animationData={animationData}
                autoplay
                loop
                rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                className='h-full w-full brightness-0 invert'
              />
            </div>
          </div>
          <p className='mb-10 font-sedan italic leading-tight text-white text-[20px] md:text-[32px]'>
            The shop is still taking shape. <span className='italic font-sedan text-brand-orange'>Give us a little time—we&apos;ll see you soon.</span>
          </p>
          <ActionButton color='white' icon='addCall' label='Reach Out' href={reachOutHref} target='_blank' className='w-auto md:w-full' />
        </div>
      </div>
    </>
  );
}
