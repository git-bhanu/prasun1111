'use client';

import { Icon, IconCircleButton } from '@/components/icons';
import { ActionButton } from '@/components/shared/action-button';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import Image from 'next/image';
import { type RefObject, useCallback, useRef, useState } from 'react';
import { tinaField } from 'tinacms/dist/react';
import { InstallationDetails } from './installation-details';

export interface ListingImage {
  src?: string | null;
  alt?: string | null;
}

export interface InstallationCardData {
  title: string;
  backgroundType?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  videoUrl?: string | null;
  videoPoster?: string | null;
  listingImages?: Array<ListingImage | null> | null;
  medium?: string | null;
  dimensions?: string | null;
  weight?: string | null;
  year?: string | null;
  artists?: Array<string | null> | null;
  watchFilmLabel?: string | null;
  watchFilmHref?: string | null;
  filmDuration?: string | null;
  readMoreLabel?: string | null;
}

export interface InstallationListCardProps {
  installation: InstallationCardData;
  tinaSource: object;
  onOpen: () => void;
}

export function InstallationListCard({ installation, tinaSource, onOpen }: InstallationListCardProps) {
  const slides = (installation.listingImages ?? []).filter((img): img is ListingImage => Boolean(img?.src));
  const hasSlider = slides.length > 0;
  const showVideo = !hasSlider && installation.backgroundType === 'video' && Boolean(installation.videoUrl);

  const [activeIndex, setActiveIndex] = useState(0);
  const canNavigate = slides.length > 1;

  const mobileSlideRef = useRef<HTMLDivElement>(null);
  const desktopSlideRef = useRef<HTMLDivElement>(null);

  const navigate = useCallback(
    (newIndex: number) => {
      const targets = [mobileSlideRef.current, desktopSlideRef.current].filter(Boolean) as HTMLElement[];
      const skip = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (targets.length === 0 || skip) {
        setActiveIndex(newIndex);
        return;
      }

      gsap.to(targets, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          setActiveIndex(newIndex);
          gsap.to(targets, { opacity: 1, duration: 0.3, ease: 'power2.out' });
        },
      });
    },
    [],
  );

  const goToPrev = () => navigate(activeIndex === 0 ? slides.length - 1 : activeIndex - 1);
  const goToNext = () => navigate(activeIndex === slides.length - 1 ? 0 : activeIndex + 1);

  const renderSlideContent = (sizes: string) => {
    if (hasSlider) {
      const slide = slides[activeIndex] ?? slides[0];
      return (
        <Image
          src={slide.src!}
          alt={slide.alt || installation.title}
          fill
          sizes={sizes}
          className='object-cover'
          data-tina-field={tinaField(tinaSource as any, 'listingImages')}
        />
      );
    }
    if (showVideo) {
      return (
        <video
          className='absolute inset-0 h-full w-full object-cover'
          src={installation.videoUrl ?? undefined}
          poster={installation.videoPoster ?? installation.image ?? undefined}
          autoPlay
          muted
          loop
          playsInline
          preload='metadata'
          data-tina-field={tinaField(tinaSource as any, 'videoUrl')}
        />
      );
    }
    if (installation.image) {
      return (
        <Image
          src={installation.image}
          alt={installation.imageAlt || installation.title}
          fill
          sizes={sizes}
          className='object-cover'
          data-tina-field={tinaField(tinaSource as any, 'image')}
        />
      );
    }
    return <div className='absolute inset-0 bg-neutral-200' />;
  };

  const renderSlide = (sizes: string, ref: RefObject<HTMLDivElement>) => (
    <div ref={ref} className='absolute inset-0'>
      {renderSlideContent(sizes)}
    </div>
  );

  const renderControls = (className?: string) => {
    if (!canNavigate) return null;
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <IconCircleButton onClick={goToPrev} aria-label='Previous image'>
          <Icon name='keyboardBackspace' color='currentColor' className='rotate-180' aria-hidden='true' />
        </IconCircleButton>
        <IconCircleButton onClick={goToNext} aria-label='Next image'>
          <Icon name='keyboardBackspace' color='currentColor' aria-hidden='true' />
        </IconCircleButton>
      </div>
    );
  };

  const renderButtons = (fullWidth?: boolean) => (
    <div className={cn('flex gap-2', fullWidth && 'flex-col')}>
      {installation.readMoreLabel && (
        <ActionButton
          color='black'
          icon='error'
          label={installation.readMoreLabel}
          onClick={onOpen}
          fullWidth={fullWidth}
          dataTinaField={tinaField(tinaSource as any, 'readMoreLabel')}
        />
      )}
      {installation.watchFilmLabel && (
        <ActionButton
          color='orange'
          icon='playCircle'
          label={installation.watchFilmLabel}
          subLabel={installation.filmDuration}
          href={installation.watchFilmHref}
          target='_blank'
          fullWidth={fullWidth}
          dataTinaField={tinaField(tinaSource as any, 'watchFilmLabel')}
        />
      )}
    </div>
  );

  return (
    <article className='w-full'>
      {/* Mobile */}
      <div className='md:hidden'>
        <div className='relative aspect-[16/9] w-full overflow-hidden bg-neutral-200'>
          {renderSlide('100vw', mobileSlideRef)}
        </div>

        <div className='pt-4 pb-8'>
          {renderControls('mt-1 mb-5')}

          <h2
            className='mt-4 font-space-grotesk text-[20px] font-bold leading-[1.25] uppercase text-black'
            data-tina-field={tinaField(tinaSource as any, 'title')}
          >
            {installation.title}
          </h2>

          <InstallationDetails source={installation} tinaSource={tinaSource} className='mt-6 border-t border-black/25 pt-6' />

          <div className='mt-8'>{renderButtons(true)}</div>
        </div>
      </div>

      {/* Desktop */}
      <div className='hidden md:grid md:grid-cols-[2fr_3fr]'>
        <div className='flex flex-col justify-between py-10 pr-16'>
          <div>
            <h2
              className='font-space-grotesk text-[36px] font-bold leading-[1.1] uppercase text-black'
              data-tina-field={tinaField(tinaSource as any, 'title')}
            >
              {installation.title}
            </h2>
            <InstallationDetails source={installation} tinaSource={tinaSource} className='mt-8 border-t border-black/20 pt-6' />
          </div>

          <div className='mt-10'>{renderButtons()}</div>
        </div>

        <div className='relative overflow-hidden bg-neutral-200' style={{ minHeight: 420 }}>
          {renderSlide('60vw', desktopSlideRef)}
          {canNavigate && <div className='absolute bottom-4 right-4 z-10'>{renderControls()}</div>}
        </div>
      </div>
    </article>
  );
}
