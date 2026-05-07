'use client';

import { AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import * as motion from 'motion/react-client';
import Image from 'next/image';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { tinaField } from 'tinacms/dist/react';

import { Icon, IconCircleButton } from '@/components/icons';
import { ActionButton } from '@/components/shared/action-button';
import { SectionMasthead } from '@/components/shared/section-masthead';
import { cn } from '@/lib/utils';
import type { PageBlocksInstallationSlider } from '@/tina/__generated__/types';

type InstallationSliderBlockProps = {
  block: PageBlocksInstallationSlider;
};

type InstallationSlide = NonNullable<NonNullable<PageBlocksInstallationSlider['slides']>[number]>;
type InstallationSlideField = Exclude<keyof InstallationSlide, '__typename'>;

const slideEase = [0.22, 1, 0.36, 1] as const;

export function InstallationSliderBlock({ block }: InstallationSliderBlockProps) {
  const slides = block.slides?.filter((slide): slide is InstallationSlide => Boolean(slide?.title)) ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
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
    }, 4000);

    return () => window.clearInterval(timer);
  }, [slides.length, shouldReduceMotion, isInView]);

  if (slides.length === 0) {
    return null;
  }

  const activeSlide = slides[activeIndex] ?? slides[0];
  const canNavigate = slides.length > 1;
  const showVideo = activeSlide.backgroundType === 'video' && Boolean(activeSlide.videoUrl);
  const mediaField = showVideo ? 'videoUrl' : 'image';
  const artists = activeSlide.artists?.filter((artist): artist is string => Boolean(artist)) ?? [];
  const mediaTransition = shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: slideEase };
  const contentTransition = shouldReduceMotion ? { duration: 0 } : { duration: 0.45, ease: slideEase };

  const goToPrevious = () => {
    setDirection(-1);
    setActiveIndex((currentIndex) => (currentIndex === 0 ? slides.length - 1 : currentIndex - 1));
  };

  const goToNext = () => {
    setDirection(1);
    setActiveIndex((currentIndex) => (currentIndex === slides.length - 1 ? 0 : currentIndex + 1));
  };

  const renderMedia = () => (
    <AnimatePresence initial={false} mode='sync'>
      <motion.div
        key={`${activeIndex}-${activeSlide.image ?? activeSlide.videoUrl ?? activeSlide.title}`}
        className='absolute inset-0'
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.035 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.015 }}
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

  const renderControls = (className?: string) => {
    if (!canNavigate) {
      return null;
    }

    return (
      <div className={cn('flex items-center gap-4', className)}>
        <IconCircleButton onClick={goToPrevious} aria-label='Show previous installation'>
          <Icon name='keyboardBackspace' color='currentColor' className='rotate-180' aria-hidden='true' />
        </IconCircleButton>
        <IconCircleButton onClick={goToNext} aria-label='Show next installation'>
          <Icon name='keyboardBackspace' color='currentColor' aria-hidden='true' />
        </IconCircleButton>
      </div>
    );
  };

  return (
    <section ref={sectionRef} className='bg-white px-4 md:px-0 py-8 md:py-0'>
      <div className='mx-auto max-w-[536px] md:hidden'>
        {activeSlide.eyebrow ? (
          <div data-tina-field={tinaField(activeSlide, 'eyebrow')}>
            <SectionMasthead
              index='02'
              title={activeSlide.eyebrow}
              size='sm'
              mobileColor='black'
            />
          </div>
        ) : null}

        <div
          className='relative left-1/2 mt-6 h-[175px] w-screen -translate-x-1/2 overflow-hidden bg-black'
          data-tina-field={tinaField(activeSlide, mediaField)}
        >
          {renderMedia()}
        </div>

        {renderControls('mt-6')}

        <AnimatePresence initial={false} mode='wait' custom={direction}>
          <motion.div
            key={`mobile-installation-content-${activeIndex}`}
            custom={direction}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18, x: direction * 10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, x: direction * -10 }}
            transition={contentTransition}
            className='mt-12'
          >
            <h2
              className='font-space-grotesk text-[20px] md:text-[30px] font-bold leading-[1.25] uppercase text-black'
              data-tina-field={tinaField(activeSlide, 'title')}
            >
              {activeSlide.title}
            </h2>

            <InstallationDetails slide={activeSlide} artists={artists} className='mt-7 border-t border-black/25 pt-6' />

            <div className='mt-18 flex flex-col gap-1.5'>
              <ActionButton
                color='orange'
                icon='playCircle'
                label={activeSlide.watchFilmLabel}
                subLabel={activeSlide.filmDuration}
                href={activeSlide.watchFilmHref}
                fullWidth
                dataTinaField={tinaField(activeSlide, 'watchFilmLabel')}
              />
              <ActionButton
                color='black'
                icon='error'
                label={activeSlide.readMoreLabel}
                href={activeSlide.readMoreHref}
                fullWidth
                dataTinaField={tinaField(activeSlide, 'readMoreLabel')}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className='relative isolate hidden min-h-[650px] overflow-hidden bg-black md:block' data-tina-field={tinaField(activeSlide, mediaField)}>
        {renderMedia()}
        <div className='absolute inset-0 bg-black/[0.12]' />

        <div className='relative z-10 flex min-h-[650px] flex-col justify-between px-12 py-14 text-white'>
          {activeSlide.eyebrow ? (
            <div data-tina-field={tinaField(activeSlide, 'eyebrow')}>
              <SectionMasthead
                index='02'
                title={activeSlide.eyebrow}
                size='sm'

              />
            </div>
          ) : null}

          <AnimatePresence initial={false} mode='wait' custom={direction}>
            <motion.div
              key={`installation-body-${activeIndex}`}
              custom={direction}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18, x: direction * 10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, x: direction * -10 }}
              transition={contentTransition}
              className='max-w-[930px]'
            >
              <h2 className='font-space-grotesk text-[36px] font-bold leading-[1.1] uppercase' data-tina-field={tinaField(activeSlide, 'title')}>
                {activeSlide.title}
              </h2>

              <div className='mt-8 border-t border-white/20 pt-9'>
                <InstallationDetails slide={activeSlide} artists={artists} variant='desktop' />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className='flex items-end justify-between gap-6'>
            <AnimatePresence initial={false} mode='wait' custom={direction}>
              <motion.div
                key={`installation-actions-${activeIndex}`}
                custom={direction}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12, x: direction * 8 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, x: direction * -8 }}
                transition={contentTransition}
                className='flex items-center gap-3'
              >
                <ActionButton
                  color='black'
                  icon='error'
                  label={activeSlide.readMoreLabel}
                  href={activeSlide.readMoreHref}
                  dataTinaField={tinaField(activeSlide, 'readMoreLabel')}
                />
                <ActionButton
                  color='orange'
                  icon='playCircle'
                  label={activeSlide.watchFilmLabel}
                  subLabel={activeSlide.filmDuration}
                  href={activeSlide.watchFilmHref}
                  dataTinaField={tinaField(activeSlide, 'watchFilmLabel')}
                />
              </motion.div>
            </AnimatePresence>

            {renderControls()}
          </div>
        </div>
      </div>
    </section>
  );
}

function InstallationDetails({
  slide,
  artists,
  variant = 'mobile',
  className,
}: {
  slide: InstallationSlide;
  artists: string[];
  variant?: 'mobile' | 'desktop';
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-[1fr_1px_1.28fr] gap-x-8', variant === 'desktop' && 'max-w-[520px] gap-x-7', className)}>
      <div className='space-y-6'>
        <DetailItem label='MEDIUM' value={slide.medium} field='medium' slide={slide} variant={variant} />
        <DetailItem label='DIMENSIONS' value={slide.dimensions} field='dimensions' slide={slide} variant={variant} />
        <DetailItem label='WEIGHT' value={slide.weight} field='weight' slide={slide} variant={variant} withBorder={false} />
      </div>

      <div className={cn('bg-black/25', variant === 'desktop' && 'bg-white/[0.18]')} />

      <div className='flex flex-col justify-between gap-10'>
        {artists.length ? (
          <div data-tina-field={tinaField(slide, 'artists')}>
            <DetailLabel variant={variant}>ARTISTS</DetailLabel>
            <p className={cn('mt-3 font-space-grotesk text-[14px] leading-[1.35] uppercase', variant === 'desktop' && 'text-[20px] text-white')}>
              {artists.map((artist, index) => (
                <span key={artist} className='md:block'>
                  {artist}
                  {index < artists.length - 1 ? <span className='md:hidden'>, </span> : null}
                </span>
              ))}
            </p>
          </div>
        ) : null}

        <DetailItem label='YEAR' value={slide.year} field='year' slide={slide} variant={variant} withBorder={false} />
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  field,
  slide,
  variant,
  withBorder = true,
}: {
  label: string;
  value?: string | null;
  field: InstallationSlideField;
  slide: InstallationSlide;
  variant: 'mobile' | 'desktop';
  withBorder?: boolean;
}) {
  if (!value) {
    return null;
  }

  return (
    <div
      className={cn(withBorder && 'border-b border-black/20 pb-5', variant === 'desktop' && withBorder && 'border-white/[0.18]')}
      data-tina-field={tinaField(slide, field)}
    >
      <DetailLabel variant={variant}>{label}</DetailLabel>
      <p className={cn('mt-1 font-space-grotesk text-[14px]', variant === 'desktop' && 'text-[20px] text-white')}>{value}</p>
    </div>
  );
}

function DetailLabel({
  variant,
  children,
}: {
  variant: 'mobile' | 'desktop';
  children: ReactNode;
}) {
  return (
    <p className={cn('font-space-grotesk text-[10px] leading-none text-neutral-500 uppercase', variant === 'desktop' && 'text-sm text-white/50')}>{children}</p>
  );
}
