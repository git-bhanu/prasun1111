'use client';

import { AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import * as motion from 'motion/react-client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { tinaField } from 'tinacms/dist/react';

import { Icon, IconCircleButton } from '@/components/icons';
import { SectionMasthead } from '@/components/shared/section-masthead';
import { cn } from '@/lib/utils';
import type { PageBlocksFeaturedSlider } from '@/tina/__generated__/types';

type FeaturedSliderBlockProps = {
  block: PageBlocksFeaturedSlider;
};

type FeaturedSliderSlide = NonNullable<NonNullable<PageBlocksFeaturedSlider['slides']>[number]>;
type FeaturedSliderSlideField = Exclude<keyof FeaturedSliderSlide, '__typename'>;
type MediaVariant = 'desktop' | 'mobile';

type SlideMedia = {
  src: string | null | undefined;
  alt: string;
  poster: string | null | undefined;
  isVideo: boolean;
  field: FeaturedSliderSlideField;
};

const slideEase = [0.22, 1, 0.36, 1] as const;

export function FeaturedSliderBlock({ block }: FeaturedSliderBlockProps) {
  const slides = block.slides?.filter((slide): slide is FeaturedSliderSlide => Boolean(slide?.title)) ?? [];
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
  const desktopMedia = getSlideMedia(activeSlide, 'desktop');
  const mobileMedia = getSlideMedia(activeSlide, 'mobile');
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

  const renderMedia = (variant: MediaVariant, media: SlideMedia) => (
    <AnimatePresence initial={false} mode='sync'>
      <motion.div
        key={`${variant}-${activeIndex}-${media.src ?? activeSlide.title}`}
        className='absolute inset-0'
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.025 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
        transition={mediaTransition}
      >
        {media.isVideo && media.src ? (
          <video
            className='absolute inset-0 h-full w-full object-cover'
            src={media.src}
            poster={media.poster ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            preload='metadata'
          />
        ) : media.src ? (
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes={variant === 'desktop' ? '(min-width: 768px) 90vw, 0vw' : '(max-width: 767px) 100vw, 0vw'}
            className='object-contain'
            priority={activeIndex === 0}
          />
        ) : (
          <div className='absolute inset-0 bg-neutral-50' />
        )}
      </motion.div>
    </AnimatePresence>
  );

  const renderControl = (variant: 'previous' | 'next') => {
    if (!canNavigate) {
      return null;
    }

    const isPrevious = variant === 'previous';

    return (
      <IconCircleButton
        onClick={isPrevious ? goToPrevious : goToNext}
        aria-label={isPrevious ? 'Show previous featured slide' : 'Show next featured slide'}
        className='bg-surface-grey shadow-none md:bg-surface-grey md:shadow-none'
      >
        <Icon name='keyboardBackspace' color='currentColor' className={cn(isPrevious && 'rotate-180')} aria-hidden='true' />
      </IconCircleButton>
    );
  };

  return (
    <section ref={sectionRef} className='bg-white px-4 py-10 md:px-12 md:py-20'>
      <div className='mx-auto max-w-[1780px]'>
        <div className='hidden md:block'>
          <div className='relative aspect-[2.75/1] overflow-hidden bg-neutral-50' data-tina-field={tinaField(activeSlide, desktopMedia.field)}>
            {renderMedia('desktop', desktopMedia)}
          </div>
        </div>

        <div className='md:hidden'>
          <div
            className='relative mx-auto aspect-[0.75/1] max-w-[456px] overflow-hidden bg-neutral-50'
            data-tina-field={tinaField(activeSlide, mobileMedia.field)}
          >
            {renderMedia('mobile', mobileMedia)}
          </div>
        </div>

        <div className='mx-auto mt-6 grid w-full max-w-[760px] grid-cols-[4rem_minmax(0,1fr)_4rem] items-start gap-4 md:mt-5 md:grid-cols-[5rem_minmax(0,1fr)_5rem]'>
          <div className='flex justify-end pt-0 md:pt-9'>{renderControl('previous')}</div>
          <AnimatePresence initial={false} mode='wait' custom={direction}>
            <motion.div
              key={`featured-slider-title-${activeIndex}`}
              custom={direction}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14, x: direction * 8 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, x: direction * -8 }}
              transition={contentTransition}
              className='min-h-[84px] min-w-0 text-center md:min-h-[96px]'
            >
              {activeSlide.eyebrow ? (
                <div className='mb-3 flex justify-center' data-tina-field={tinaField(activeSlide, 'eyebrow')}>
                  <SectionMasthead
                    index='01'
                    title={activeSlide.eyebrow}
                    size='sm'
                    color='black'
                  />
                </div>
              ) : null}

              <FeaturedSlideTitle slide={activeSlide} />
            </motion.div>
          </AnimatePresence>
          <div className='flex justify-start pt-0 md:pt-9'>{renderControl('next')}</div>
        </div>
      </div>
    </section>
  );
}

function FeaturedSlideTitle({ slide }: { slide: FeaturedSliderSlide }) {
  const className = 'font-sedan text-[22px] leading-tight text-black md:text-[32px]';

  if (slide.href) {
    return (
      <Link href={slide.href} className={className} data-tina-field={tinaField(slide, 'title')}>
        {slide.title}
      </Link>
    );
  }

  return (
    <h2 className={className} data-tina-field={tinaField(slide, 'title')}>
      {slide.title}
    </h2>
  );
}

function getSlideMedia(slide: FeaturedSliderSlide, variant: MediaVariant): SlideMedia {
  const isMobile = variant === 'mobile';
  const assetType = isMobile ? slide.mobileAssetType || slide.desktopAssetType : slide.desktopAssetType;
  const videoUrl = isMobile ? slide.mobileVideoUrl || slide.desktopVideoUrl : slide.desktopVideoUrl;
  const image = isMobile
    ? slide.mobileImage || slide.desktopImage || slide.mobileVideoPoster || slide.desktopVideoPoster
    : slide.desktopImage || slide.desktopVideoPoster;
  const poster = isMobile
    ? slide.mobileVideoPoster || slide.mobileImage || slide.desktopVideoPoster || slide.desktopImage
    : slide.desktopVideoPoster || slide.desktopImage;
  const imageAlt = isMobile ? slide.mobileImageAlt || slide.desktopImageAlt : slide.desktopImageAlt;
  const isVideo = assetType === 'video' && Boolean(videoUrl);

  if (isVideo) {
    return {
      src: videoUrl,
      alt: imageAlt || slide.title,
      poster,
      isVideo,
      field: isMobile && slide.mobileVideoUrl ? 'mobileVideoUrl' : 'desktopVideoUrl',
    };
  }

  return {
    src: image,
    alt: imageAlt || slide.title,
    poster: null,
    isVideo: false,
    field: getImageField(slide, isMobile),
  };
}

function getImageField(slide: FeaturedSliderSlide, isMobile: boolean): FeaturedSliderSlideField {
  if (isMobile && slide.mobileImage) {
    return 'mobileImage';
  }

  if (slide.desktopImage) {
    return 'desktopImage';
  }

  if (isMobile && slide.mobileVideoPoster) {
    return 'mobileVideoPoster';
  }

  return 'desktopVideoPoster';
}
