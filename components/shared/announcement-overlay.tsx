'use client';

import { Icon } from '@/components/icons';
import { ActionButton } from '@/components/shared/action-button';
import { SectionMasthead } from '@/components/shared/section-masthead';
import { useSiteSettings } from '@/components/site-settings-provider';
import { useOverlayAnimation } from '@/hooks/use-overlay-animation';
import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef } from 'react';

export function AnnouncementOverlay() {
  const { showAnnouncementBanner } = useSiteSettings();
  if (!showAnnouncementBanner) return null;
  return <AnnouncementOverlayContent />;
}

function AnnouncementOverlayContent() {
  const { brand, primaryLinks, utilityLinks } = useSiteSettings();

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const { animateOut, animateIn } = useOverlayAnimation({
    closeBtnRef,
    panelRef,
    animation: 'fade',
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

  const activeLink = primaryLinks[0];
  const contactHref = utilityLinks[0]?.href ?? '/contact';

  const close = () => animateOut(() => {});

  return (
    <>
      <button
        ref={closeBtnRef}
        type='button'
        onClick={close}
        aria-label='Close announcement'
        className='fixed right-6 top-[30px] z-[101] flex size-15 cursor-pointer items-center justify-center rounded-full bg-brand-orange text-white md:right-36'
      >
        <Icon name='pinchInZoom' size={28} color='#fff' />
      </button>
      <div ref={panelRef} className='fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-blue px-6'>
        <Image src={brand.logo} width={160} height={68} alt={brand.logoAlt} className='mb-10 h-auto w-auto brightness-0 invert' priority />
        {activeLink && (
          <div className='mb-6 text-center'>
            <p className='font-sedan text-[1.25rem] leading-snug text-white md:text-[1.75rem]'>Selective Access is currently Active, only the</p>
            <div className='mt-3 flex items-center justify-center gap-3'>
              <SectionMasthead size='sm' color='white' borderStrength='visible' title={activeLink.label} index={activeLink.index} />
              <span className='font-sedan text-[1.25rem] leading-snug text-white md:text-[1.75rem]'>section remains open.</span>
            </div>
          </div>
        )}
        <p className='mb-10 max-w-[560px] text-center font-sedan italic text-white/80 text-[1rem] md:text-[1.125rem]'>
          While the remaining spaces continue to unfold, conversations are always welcome.{' '}
          <span className='text-brand-orange not-italic font-sedan'>For collaborations, thoughts, or simply to connect.</span>
        </p>
        <ActionButton color='white' icon='addCall' label='Reach Out' href={contactHref} />
      </div>
    </>
  );
}
