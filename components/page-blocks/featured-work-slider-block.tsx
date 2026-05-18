'use client';

import { AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import * as motion from 'motion/react-client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { tinaField } from 'tinacms/dist/react';

import { ArtworkInfoCard } from '@/components/artwork';
import { Icon, IconCircleButton } from '@/components/icons';
import { SectionMasthead } from '@/components/shared/section-masthead';
import { useSiteSettings } from '@/components/site-settings-provider';
import type { PageBlocksFeaturedWorkSlider } from '@/tina/__generated__/types';

type FeaturedWorkSliderBlockProps = {
  block: PageBlocksFeaturedWorkSlider;
};

type FeaturedSlide = NonNullable<NonNullable<PageBlocksFeaturedWorkSlider['slides']>[number]>;

const slideEase = [0.22, 1, 0.36, 1] as const;

export function FeaturedWorkSliderBlock({ block }: FeaturedWorkSliderBlockProps) {
  const { sliders } = useSiteSettings();
  const slides = block.slides?.filter((slide): slide is FeaturedSlide => Boolean(slide?.title)) ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [autoplayResetKey, setAutoplayResetKey] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.4 });

  useEffect(() => {
    if (activeIndex > slides.length - 1) {
      setActiveIndex(Math.max(slides.length - 1, 0));
    }
  }, [activeIndex, slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || shouldReduceMotion || !isInView) {
      return;
    }

    const timer = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((currentIndex) => (currentIndex === slides.length - 1 ? 0 : currentIndex + 1));
    }, sliders.autoplaySeconds * 1000);

    return () => window.clearInterval(timer);
  }, [slides.length, shouldReduceMotion, isInView, autoplayResetKey, sliders.autoplaySeconds]);

  if (slides.length === 0) {
    return null;
  }

  const activeSlide = slides[activeIndex] ?? slides[0];
  const canNavigate = slides.length > 1;
  const showVideo = activeSlide.backgroundType === 'video' && Boolean(activeSlide.videoUrl);
  const mediaField = showVideo ? 'videoUrl' : 'image';
  const tags = activeSlide.tags?.filter((tag): tag is string => Boolean(tag)) ?? [];
  const tagItems = tags.map((tag) => ({
    title: tag,
    color: tag.toLowerCase().includes('available') ? ('blue' as const) : ('orange' as const),
  }));

  const goToPrevious = () => {
    setDirection(-1);
    setActiveIndex((currentIndex) => (currentIndex === 0 ? slides.length - 1 : currentIndex - 1));
    setAutoplayResetKey((k) => k + 1);
  };

  const goToNext = () => {
    setDirection(1);
    setActiveIndex((currentIndex) => (currentIndex === slides.length - 1 ? 0 : currentIndex + 1));
    setAutoplayResetKey((k) => k + 1);
  };

  const goToSlide = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setAutoplayResetKey((k) => k + 1);
  };

  const mediaTransition = shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: slideEase };
  const contentTransition = shouldReduceMotion ? { duration: 0 } : { duration: 0.45, ease: slideEase };

  const renderMedia = () => (
    <AnimatePresence initial={false} mode='sync'>
      <motion.div
        key={`${activeIndex}-${activeSlide.image ?? activeSlide.videoUrl ?? activeSlide.title}`}
        className='absolute inset-0'
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
        transition={mediaTransition}
      >
        {showVideo ? (
          <video
            className='absolute inset-0 h-full w-full object-cover'
            src={activeSlide.videoUrl ?? undefined}
            poster={activeSlide.videoPoster ?? activeSlide.image ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            preload='metadata'
          />
        ) : activeSlide.image ? (
          <Image
            src={activeSlide.image}
            alt={activeSlide.imageAlt || activeSlide.title}
            fill
            sizes='100vw'
            className='object-cover'
            priority={activeIndex === 0}
          />
        ) : (
          <div className='absolute inset-0 bg-neutral-900' />
        )}
      </motion.div>
    </AnimatePresence>
  );

  const renderControls = () => (
    <>
      <IconCircleButton onClick={goToPrevious} aria-label='Show previous slide'>
        <Icon name='keyboardBackspace' color='currentColor' className='rotate-180' aria-hidden='true' />
      </IconCircleButton>
      <IconCircleButton onClick={goToNext} aria-label='Show next slide'>
        <Icon name='keyboardBackspace' color='currentColor' className='' aria-hidden='true' />
      </IconCircleButton>
    </>
  );

  return (
    <section ref={sectionRef} className='mx-auto w-full bg-white py-8 md:py-0'>
      <div className='md:hidden'>
        {activeSlide.eyebrow ? (
          <div data-tina-field={tinaField(activeSlide, 'eyebrow')} className='px-4'>
            <SectionMasthead
              index='01'
              title={activeSlide.eyebrow}
              size='sm'
              mobileColor='black'
            />
          </div>
        ) : null}

        <div className='relative mt-7 overflow-hidden bg-black h-[165px]' data-tina-field={tinaField(activeSlide, mediaField)}>
          {renderMedia()}
        </div>

        <AnimatePresence initial={false} mode='wait' custom={direction}>
          <motion.div
            key={`mobile-card-${activeIndex}`}
            custom={direction}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={contentTransition}
            className='mx-4 mt-7 rounded-[4px] bg-surface-grey-1 p-2'
          >
            <ArtworkInfoCard
              asCard={false}
              title={activeSlide.title}
              href={activeSlide.href}
              titleTinaField={tinaField(activeSlide, 'title')}
              titleClassName='text-[18px]'
              tags={tagItems}
              tagsTinaField={tinaField(activeSlide, 'tags')}
              tabClassName='font-medium'
            />
          </motion.div>
        </AnimatePresence>

        {canNavigate ? <div className='mt-6 flex items-center gap-4 pl-4'>{renderControls()}</div> : null}
      </div>

      <div className='relative isolate hidden min-h-168 overflow-hidden bg-black md:block' data-tina-field={tinaField(activeSlide, mediaField)}>
        {renderMedia()}

        <div className='relative z-10 flex min-h-[34rem] flex-col justify-between p-6 sm:p-8 md:min-h-[42rem] md:p-10'>
          {activeSlide.eyebrow ? (
            <div data-tina-field={tinaField(activeSlide, 'eyebrow')}>
              <SectionMasthead
                index={1}
                title={activeSlide.eyebrow}
                size='sm'

              />
            </div>
          ) : null}

          <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
            <AnimatePresence initial={false} mode='wait' custom={direction}>
              <motion.div
                key={`card-${activeIndex}`}
                custom={direction}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
                transition={contentTransition}
                className='max-w-[28rem] rounded-[8px] bg-surface-grey-1 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-5'
              >
                <ArtworkInfoCard
                  asCard={false}
                  title={activeSlide.title}
                  href={activeSlide.href}
                  titleTinaField={tinaField(activeSlide, 'title')}
                  titleClassName='text-[1.65rem] sm:text-[2rem] leading-[1.1em]'
                  tags={tagItems}
                  tagsTinaField={tinaField(activeSlide, 'tags')}
                />
              </motion.div>
            </AnimatePresence>

            {canNavigate ? <div className='flex items-center gap-3 self-end md:self-auto'>{renderControls()}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
