'use client';

import { AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import * as motion from 'motion/react-client';
import { BlurUpImage } from '@/components/shared/blur-up-image';
import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { tinaField } from 'tinacms/dist/react';

import { Icon, IconCircleButton } from '@/components/icons';
import { ActionButton } from '@/components/shared/action-button';
import { SectionMasthead } from '@/components/shared/section-masthead';
import { useSiteSettings } from '@/components/site-settings-provider';
import { cn } from '@/lib/utils';
import type { PageBlocksInstallationSlider } from '@/tina/__generated__/types';

type InstallationSliderBlockProps = {
  block: PageBlocksInstallationSlider;
};

type SlideInstallation = {
  __typename?: string | null;
  title: string;
  slug?: string | null;
  medium?: string | null;
  artists?: Array<string | null> | null;
  dimensions?: string | null;
  weight?: string | null;
  year?: string | null;
  watchFilmLabel?: string | null;
  watchFilmHref?: string | null;
  filmDuration?: string | null;
  readMoreLabel?: string | null;
  _sys?: { filename: string } | null;
};

type InstallationSlide = {
  __typename?: string | null;
  installation?: SlideInstallation | null;
  eyebrow?: string | null;
  backgroundType?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  videoUrl?: string | null;
  videoPoster?: string | null;
};

const slideEase = [0.22, 1, 0.36, 1] as const;

export function InstallationSliderBlock({ block }: InstallationSliderBlockProps) {
  const router = useRouter();
  const { sliders } = useSiteSettings();
  const slides = (block.slides as Array<InstallationSlide | null> | null | undefined)
    ?.filter((slide): slide is InstallationSlide => Boolean(slide?.installation?.title)) ?? [];
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
  const installation = activeSlide.installation ?? null;
  const installationSlug = installation ? (installation.slug ?? installation._sys?.filename ?? '').toLowerCase() : '';
  const openInstallation = () => {
    if (installationSlug) router.push(`/installations?installation=${encodeURIComponent(installationSlug)}`);
  };
  const canNavigate = slides.length > 1;
  const showVideo = activeSlide.backgroundType === 'video' && Boolean(activeSlide.videoUrl);
  const mediaField = showVideo ? 'videoUrl' : 'image';
  const artists = installation?.artists?.filter((artist): artist is string => Boolean(artist)) ?? [];
  const mediaTransition = shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: slideEase };
  const contentTransition = shouldReduceMotion ? { duration: 0 } : { duration: 0.45, ease: slideEase };

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

  const renderMedia = () => (
    <AnimatePresence initial={false} mode='sync'>
      <motion.div
        key={`${activeIndex}-${activeSlide.image ?? activeSlide.videoUrl ?? installation?.title}`}
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
          <BlurUpImage
            src={activeSlide.image}
            alt={activeSlide.imageAlt || installation?.title || ''}
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
          <div data-tina-field={tinaField(activeSlide as any, 'eyebrow')}>
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
          data-tina-field={tinaField(activeSlide as any, mediaField)}
        >
          {renderMedia()}
        </div>

        {renderControls('mt-6')}

        <div className='mt-12'>
          <AnimatePresence initial={false} mode='wait'>
            <motion.h2
              key={`title-mobile-${activeIndex}`}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={contentTransition}
              className='font-space-grotesk text-[20px] md:text-[30px] font-bold leading-[1.25] uppercase text-black'
              data-tina-field={installation ? tinaField(installation as any, 'title') : undefined}
            >
              {installation?.title}
            </motion.h2>
          </AnimatePresence>

          <InstallationDetails installation={installation} artists={artists} className='mt-7 border-t border-black/25 pt-6' slideKey={activeIndex} />

          <div className='mt-18 flex flex-col gap-1.5'>
              <ActionButton
                color='orange'
                icon='playCircle'
                label={installation?.watchFilmLabel}
                subLabel={installation?.filmDuration}
                href={installation?.watchFilmHref}
                target="_blank"
                fullWidth
                dataTinaField={installation ? tinaField(installation as any, 'watchFilmLabel') : undefined}
              />
              <ActionButton
                color='black'
                icon='error'
                label={installation?.readMoreLabel}
                onClick={openInstallation}
                fullWidth
                dataTinaField={installation ? tinaField(installation as any, 'readMoreLabel') : undefined}
              />
            </div>
        </div>
      </div>

      <div className='relative isolate hidden min-h-[650px] overflow-hidden bg-black md:block' data-tina-field={tinaField(activeSlide as any, mediaField)}>
        {renderMedia()}
        <div className='absolute inset-0 bg-black/[0.12]' />

        <div className='relative z-10 flex min-h-[650px] flex-col justify-between px-12 py-14 text-white'>
          {activeSlide.eyebrow ? (
            <div data-tina-field={tinaField(activeSlide as any, 'eyebrow')}>
              <SectionMasthead
                index='02'
                title={activeSlide.eyebrow}
                size='sm'

              />
            </div>
          ) : null}

          <div>
            <div className='max-w-[930px]'>
              <AnimatePresence initial={false} mode='wait'>
                <motion.h2
                  key={`title-desktop-${activeIndex}`}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={contentTransition}
                  className='font-space-grotesk text-[36px] font-bold leading-[1.1] uppercase'
                  data-tina-field={installation ? tinaField(installation as any, 'title') : undefined}
                >
                  {installation?.title}
                </motion.h2>
              </AnimatePresence>
            </div>

            <div className='mt-8 border-t border-white/20 pt-9'>
              <InstallationDetails installation={installation} artists={artists} variant='desktop' slideKey={activeIndex} />
            </div>
          </div>

          <div className='flex items-end justify-between gap-6'>
            <div className='flex items-center gap-3'>
                <ActionButton
                  color='black'
                  icon='error'
                  label={installation?.readMoreLabel}
                  onClick={openInstallation}
                  dataTinaField={installation ? tinaField(installation as any, 'readMoreLabel') : undefined}
                />
                <ActionButton
                  color='orange'
                  icon='playCircle'
                  label={installation?.watchFilmLabel}
                  subLabel={installation?.filmDuration}
                  href={installation?.watchFilmHref}
                target="_blank"
                  dataTinaField={installation ? tinaField(installation as any, 'watchFilmLabel') : undefined}
                />
              </div>

            {renderControls()}
          </div>
        </div>
      </div>
    </section>
  );
}

function InstallationDetails({
  installation,
  artists,
  variant = 'mobile',
  className,
  slideKey,
}: {
  installation: SlideInstallation | null;
  artists: string[];
  variant?: 'mobile' | 'desktop';
  className?: string;
  slideKey: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={cn('grid grid-cols-[1fr_1px_1.28fr] gap-x-8', variant === 'desktop' && 'max-w-[520px] gap-x-7', className)}>
      <div className='space-y-6'>
        <DetailItem label='MEDIUM' value={installation?.medium} field='medium' installation={installation} variant={variant} slideKey={slideKey} />
        <DetailItem label='DIMENSIONS' value={installation?.dimensions} field='dimensions' installation={installation} variant={variant} slideKey={slideKey} />
        <DetailItem label='WEIGHT' value={installation?.weight} field='weight' installation={installation} variant={variant} withBorder={false} slideKey={slideKey} />
      </div>

      <div className={cn('bg-black/25', variant === 'desktop' && 'bg-white/[0.18]')} />

      <div className='flex flex-col justify-between gap-10'>
        {artists.length ? (
          <div data-tina-field={installation ? tinaField(installation as any, 'artists') : undefined}>
            <DetailLabel variant={variant}>ARTISTS</DetailLabel>
            <AnimatePresence initial={false} mode='wait'>
              <motion.p
                key={`artists-${slideKey}`}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.45, ease: slideEase }}
                className={cn('mt-3 font-space-grotesk text-[14px] leading-[1.35] uppercase', variant === 'desktop' && 'text-[20px] text-white')}
              >
                {artists.map((artist, index) => (
                  <span key={artist} className='md:block'>
                    {artist}
                    {index < artists.length - 1 ? <span className='md:hidden'>, </span> : null}
                  </span>
                ))}
              </motion.p>
            </AnimatePresence>
          </div>
        ) : null}

        <DetailItem label='YEAR' value={installation?.year} field='year' installation={installation} variant={variant} withBorder={false} slideKey={slideKey} />
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  field,
  installation,
  variant,
  withBorder = true,
  slideKey,
}: {
  label: string;
  value?: string | null;
  field: keyof SlideInstallation;
  installation: SlideInstallation | null;
  variant: 'mobile' | 'desktop';
  withBorder?: boolean;
  slideKey: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (!value) {
    return null;
  }

  return (
    <div
      className={cn(withBorder && 'border-b border-black/20 pb-5', variant === 'desktop' && withBorder && 'border-white/[0.18]')}
      data-tina-field={installation ? tinaField(installation as any, field as string) : undefined}
    >
      <DetailLabel variant={variant}>{label}</DetailLabel>
      <AnimatePresence initial={false} mode='wait'>
        <motion.p
          key={`${field}-${slideKey}`}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.45, ease: slideEase }}
          className={cn('mt-1 font-space-grotesk text-[14px]', variant === 'desktop' && 'text-[20px] text-white')}
        >
          {value}
        </motion.p>
      </AnimatePresence>
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
