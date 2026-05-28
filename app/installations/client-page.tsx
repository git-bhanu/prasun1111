'use client';

import { HeaderBlock } from '@/components/blocks/header-block';
import { ImageBlock } from '@/components/blocks/image-block';
import { SpaceBlock } from '@/components/blocks/space-block';
import { TwoColumnTextBlock } from '@/components/blocks/two-column-text-block';
import { VideoBlock } from '@/components/blocks/video-block';
import { Icon, IconCircleButton } from '@/components/icons';
import { ActionButton } from '@/components/shared/action-button';
import { SectionMasthead } from '@/components/shared/section-masthead';
import { useOverlayAnimation } from '@/hooks/use-overlay-animation';
import { cn } from '@/lib/utils';
import type { InstallationConnectionQuery, InstallationConnectionQueryVariables } from '@/tina/__generated__/types';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { tinaField, useTina } from 'tinacms/dist/react';

type InstallationNode = NonNullable<NonNullable<NonNullable<InstallationConnectionQuery['installationConnection']['edges']>[number]>['node']>;

type Props = {
  query: string;
  data: InstallationConnectionQuery;
  variables: InstallationConnectionQueryVariables;
};

export default function InstallationsClientPage(props: Props) {
  return (
    <Suspense>
      <InstallationsContent {...props} />
    </Suspense>
  );
}

function InstallationsContent({ query, data, variables }: Props) {
  const { data: tinaData } = useTina({ query, data, variables });
  const searchParams = useSearchParams();

  const backdropRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const detailScrollRef = useRef<HTMLDivElement | null>(null);

  const { isOpenRef, animateIn, animateOut } = useOverlayAnimation({
    backdropRef,
    closeBtnRef,
    panelRef,
  });

  const [selectedSlug, setSelectedSlug] = useState<string | null>(() => searchParams?.get('installation') ?? null);
  const [displayInstallation, setDisplayInstallation] = useState<InstallationNode | null>(null);

  useEffect(() => {
    const handlePop = () => {
      const params = new URLSearchParams(window.location.search);
      setSelectedSlug(params.get('installation') ?? null);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const installations: InstallationNode[] = (tinaData.installationConnection.edges ?? [])
    .map((e) => e?.node)
    .filter((n): n is InstallationNode => n != null)
    .sort((a, b) => {
      const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder;
    });

  const installationSlug = (i: InstallationNode) => (i.slug ?? i._sys.filename).toLowerCase();

  const selectedIndex = selectedSlug ? installations.findIndex((i) => installationSlug(i) === selectedSlug) : -1;
  const selectedInstallation = selectedIndex >= 0 ? installations[selectedIndex] : null;

  const prevSlugRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    const prev = prevSlugRef.current;
    prevSlugRef.current = selectedSlug;

    if (selectedSlug && selectedInstallation) {
      setDisplayInstallation(selectedInstallation);
      if (!isOpenRef.current) animateIn();
    } else if (!selectedSlug && prev) {
      animateOut(() => setDisplayInstallation(null));
    }
  }, [selectedSlug, selectedInstallation, animateIn, animateOut]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  const goTo = (slug: string) => {
    setSelectedSlug(slug);
    window.history.pushState({}, '', `/installations?installation=${encodeURIComponent(slug)}`);
  };

  const close = () => {
    setSelectedSlug(null);
    window.history.pushState({}, '', '/installations');
  };

  const displayIndex = displayInstallation ? installations.findIndex((i) => installationSlug(i) === installationSlug(displayInstallation)) : -1;

  return (
    <>
      {installations.length === 0 ? (
        <div className='px-8 py-12 sm:px-10 md:px-[58px]'>
          <p className='text-black/45'>No installations yet.</p>
        </div>
      ) : (
        <div className='px-4 py-8 sm:px-10 md:px-[58px]'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {installations.map((installation) => (
              <button
                key={installation.id}
                type='button'
                onClick={() => goTo(installationSlug(installation))}
                className='cursor-pointer rounded bg-[var(--surface-grey)] p-4 text-left font-space-grotesk text-sm font-bold uppercase hover:bg-[var(--surface-grey-1)]'
              >
                {installation.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div ref={backdropRef} onClick={close} className='fixed inset-0 z-[99] bg-black/60' />
      <button
        ref={closeBtnRef}
        type='button'
        onClick={close}
        aria-label='Close overlay'
        className='fixed right-6 top-[30px] z-[101] flex size-15 cursor-pointer items-center justify-center rounded-full bg-brand-orange text-white md:right-36'
      >
        <Icon name='pinchInZoom' size={28} color='#fff' />
      </button>
      <div
        ref={(el) => {
          panelRef.current = el;
          detailScrollRef.current = el;
        }}
        className='fixed inset-x-0 bottom-0 top-[50px] z-[100] overflow-y-auto rounded-t-2xl bg-white'
      >
        {displayInstallation && (
          <DetailPanel
            installation={displayInstallation}
            onPrev={displayIndex > 0 ? () => goTo(installationSlug(installations[displayIndex - 1])) : undefined}
            onNext={displayIndex < installations.length - 1 ? () => goTo(installationSlug(installations[displayIndex + 1])) : undefined}
            scrollToTop={() => detailScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        )}
      </div>
    </>
  );
}

function blockWrapperClass(width: string, verticalPadding: string) {
  switch (width) {
    case 'full':
      return `w-full ${verticalPadding}`;
    case 'wide':
      return `w-full px-[5svw] md:pl-[10svw] md:pr-[10svw] ${verticalPadding}`;
    case 'narrow':
    default:
      return `w-full px-[5svw] md:pl-[10svw] md:pr-[10svw] md:max-w-[75svw] ${verticalPadding}`;
  }
}

export const INSTALLATION_DETAIL_DESKTOP_HEIGHT = '80svh';
export const INSTALLATION_DETAIL_MOBILE_IMAGE_HEIGHT = '60svh';

function DetailPanel({
  installation,
  onPrev,
  onNext,
  scrollToTop,
  desktopHeight = INSTALLATION_DETAIL_DESKTOP_HEIGHT,
}: {
  installation: InstallationNode;
  onPrev?: () => void;
  onNext?: () => void;
  scrollToTop?: () => void;
  desktopHeight?: string;
}) {
  const showVideo = installation.backgroundType === 'video' && Boolean(installation.videoUrl);
  const artists = (installation.artists ?? []).filter((a): a is string => Boolean(a));
  const canNavigate = Boolean(onPrev || onNext);

  const renderMedia = () => {
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
          data-tina-field={tinaField(installation, 'videoUrl')}
        />
      );
    }
    if (installation.image) {
      return (
        <Image
          src={installation.image}
          alt={installation.imageAlt || installation.title}
          fill
          sizes='100vw'
          className='object-cover'
          priority
          data-tina-field={tinaField(installation, 'image')}
        />
      );
    }
    return <div className='absolute inset-0 bg-neutral-900' />;
  };

  const renderControls = (className?: string) => {
    if (!canNavigate) return null;
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <IconCircleButton onClick={onPrev} disabled={!onPrev} aria-label='Previous installation' className={cn(!onPrev && 'opacity-30 cursor-not-allowed')}>
          <Icon name='keyboardBackspace' color='currentColor' className='rotate-180' aria-hidden='true' />
        </IconCircleButton>
        <IconCircleButton onClick={onNext} disabled={!onNext} aria-label='Next installation' className={cn(!onNext && 'opacity-30 cursor-not-allowed')}>
          <Icon name='keyboardBackspace' color='currentColor' aria-hidden='true' />
        </IconCircleButton>
      </div>
    );
  };

  return (
    <>
      {/* Mobile layout */}
      <div className='md:hidden'>
        <div
          className='relative w-full aspect-[16/9] overflow-hidden bg-black'
          data-tina-field={tinaField(installation, showVideo ? 'videoUrl' : 'image')}
        >
          {renderMedia()}
        </div>

        <div className='px-4 pt-6 pb-8'>
          <SectionMasthead index='01' title='INSTALLATIONS' size='sm' mobileColor='black' />

          {renderControls('mt-4')}

          <h1
            className='mt-5 font-space-grotesk text-[22px] font-bold leading-[1.2] uppercase text-black'
            data-tina-field={tinaField(installation, 'title')}
          >
            {installation.title}
          </h1>

          <InstallationDetails installation={installation} artists={artists} className='mt-6 border-t border-black/25 pt-6' />
        </div>
      </div>

      {/* Desktop layout */}
      <div
        className='relative isolate hidden overflow-hidden bg-black md:block'
        style={{ minHeight: desktopHeight }}
        data-tina-field={tinaField(installation, showVideo ? 'videoUrl' : 'image')}
      >
        {renderMedia()}
        <div className='absolute inset-0 bg-black/[0.12]' />

        <div className='relative z-10 flex flex-col justify-between px-12 py-14 text-white' style={{ minHeight: desktopHeight }}>
          <SectionMasthead index='01' title='INSTALLATIONS' size='sm' />

          <div className='max-w-[930px]'>
            <h1 className='font-space-grotesk text-[36px] font-bold leading-[1.1] uppercase' data-tina-field={tinaField(installation, 'title')}>
              {installation.title}
            </h1>

            <div className='mt-8 border-t border-white/20 pt-9'>
              <InstallationDetails installation={installation} artists={artists} variant='desktop' />
            </div>
          </div>

          <div className='flex items-end justify-end'>
            {renderControls()}
          </div>
        </div>
      </div>

      {/* Blocks */}
      {installation.blocks && installation.blocks.length > 0 && (
        <div className='mt-8'>
          {installation.blocks.map((block, i) => {
            switch (block?.__typename) {
              case 'InstallationBlocksHeader':
                return (
                  <div key={`${block.__typename}-${i}`} className={blockWrapperClass('narrow', 'pb-2 md:py-4')}>
                    <HeaderBlock block={block} />
                  </div>
                );
              case 'InstallationBlocksTwoColumnText':
                return (
                  <div key={`${block.__typename}-${i}`} className={blockWrapperClass('wide', 'py-4')}>
                    <TwoColumnTextBlock block={block} />
                  </div>
                );
              case 'InstallationBlocksVideo':
                return (
                  <div key={`${block.__typename}-${i}`} className={blockWrapperClass('wide', 'py-10')}>
                    <VideoBlock block={block} />
                  </div>
                );
              case 'InstallationBlocksImage': {
                const b = block as unknown as {
                  __typename: 'InstallationBlocksImage';
                  width?: string | null;
                  orientation?: string | null;
                  images?: Array<{ src?: string | null; alt?: string | null } | null> | null;
                };
                return (
                  <div key={`${block.__typename}-${i}`} className={blockWrapperClass(b.width ?? 'narrow', 'py-4')}>
                    <ImageBlock block={b} />
                  </div>
                );
              }
              case 'InstallationBlocksSpace': {
                const b = block as unknown as {
                  __typename: 'InstallationBlocksSpace';
                  desktopSpace?: string | null;
                  mobileSpace?: string | null;
                };
                return <SpaceBlock key={`${block.__typename}-${i}`} block={b} />;
              }
              default:
                return null;
            }
          })}
        </div>
      )}

      <div className='mt-10 flex justify-center px-6 pb-10'>
        <ActionButton color='white' icon='arrowUpwardAlt' label='Back to Top' onClick={scrollToTop} className='bg-surface-grey' />
      </div>
    </>
  );
}

function InstallationDetails({
  installation,
  artists,
  variant = 'mobile',
  className,
}: {
  installation: InstallationNode;
  artists: string[];
  variant?: 'mobile' | 'desktop';
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-[1fr_1px_1.28fr] gap-x-8', variant === 'desktop' && 'max-w-[520px] gap-x-7', className)}>
      <div className='space-y-6'>
        <DetailItem label='MEDIUM' value={installation.medium} field='medium' installation={installation} variant={variant} />
        <DetailItem label='DIMENSIONS' value={installation.dimensions} field='dimensions' installation={installation} variant={variant} />
        <DetailItem label='WEIGHT' value={installation.weight} field='weight' installation={installation} variant={variant} withBorder={false} />
      </div>

      <div className={cn('bg-black/25', variant === 'desktop' && 'bg-white/[0.18]')} />

      <div className='flex flex-col justify-between gap-10'>
        {artists.length > 0 && (
          <div data-tina-field={tinaField(installation, 'artists')}>
            <p className={cn('font-space-grotesk text-[10px] leading-none uppercase text-neutral-500', variant === 'desktop' && 'text-sm text-white/50')}>
              ARTISTS
            </p>
            <p className={cn('mt-3 font-space-grotesk text-[14px] leading-[1.35] uppercase', variant === 'desktop' && 'text-[20px] text-white')}>
              {artists.map((artist, index) => (
                <span key={artist} className='md:block'>
                  {artist}
                  {index < artists.length - 1 ? <span className='md:hidden'>, </span> : null}
                </span>
              ))}
            </p>
          </div>
        )}

        <DetailItem label='YEAR' value={installation.year} field='year' installation={installation} variant={variant} withBorder={false} />
      </div>
    </div>
  );
}

type InstallationDetailField = 'medium' | 'dimensions' | 'weight' | 'year';

function DetailItem({
  label,
  value,
  field,
  installation,
  variant,
  withBorder = true,
}: {
  label: string;
  value?: string | null;
  field: InstallationDetailField;
  installation: InstallationNode;
  variant: 'mobile' | 'desktop';
  withBorder?: boolean;
}) {
  if (!value) return null;

  return (
    <div
      className={cn(withBorder && 'border-b border-black/20 pb-5', variant === 'desktop' && withBorder && 'border-white/[0.18]')}
      data-tina-field={tinaField(installation, field)}
    >
      <p className={cn('font-space-grotesk text-[10px] leading-none uppercase text-neutral-500', variant === 'desktop' && 'text-sm text-white/50')}>{label}</p>
      <p className={cn('mt-1 font-space-grotesk text-[14px]', variant === 'desktop' && 'text-[20px] text-white')}>{value}</p>
    </div>
  );
}
