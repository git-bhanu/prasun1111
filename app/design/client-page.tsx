'use client';

import { HeaderBlock } from '@/components/blocks/header-block';
import { ImageBlock } from '@/components/blocks/image-block';
import { SpaceBlock } from '@/components/blocks/space-block';
import { TwoColumnTextBlock } from '@/components/blocks/two-column-text-block';
import { VideoBlock } from '@/components/blocks/video-block';
import { CommentsSection } from '@/components/comments/comments-section';
import { DesignListCard, DesignListGrid } from '@/components/design';
import { Icon } from '@/components/icons';
import { ActionButton } from '@/components/shared/action-button';
import { BlurUpImage } from '@/components/shared/blur-up-image';
import { useOverlayAnimation } from '@/hooks/use-overlay-animation';
import type { DesignConnectionQuery, DesignConnectionQueryVariables } from '@/tina/__generated__/types';
import { motion } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTina } from 'tinacms/dist/react';
import { type Components, TinaMarkdown } from 'tinacms/dist/rich-text';

type DesignNode = NonNullable<NonNullable<NonNullable<DesignConnectionQuery['designConnection']['edges']>[number]>['node']>;

type Props = {
  query: string;
  data: DesignConnectionQuery;
  variables: DesignConnectionQueryVariables;
};

export default function DesignClientPage(props: Props) {
  return (
    <Suspense>
      <DesignContent {...props} />
    </Suspense>
  );
}

function DesignContent({ query, data, variables }: Props) {
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

  const [selectedSlug, setSelectedSlug] = useState<string | null>(() => searchParams?.get('design') ?? null);
  const [displayDesign, setDisplayDesign] = useState<DesignNode | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'byDoing' | 'byKnowing'>('all');

  useEffect(() => {
    const handlePop = () => {
      const params = new URLSearchParams(window.location.search);
      setSelectedSlug(params.get('design') ?? null);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const designs: DesignNode[] = (tinaData.designConnection.edges ?? [])
    .map((e) => e?.node)
    .filter((n): n is DesignNode => n != null)
    .sort((a, b) => {
      const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder;
    });

  const designSlug = (d: DesignNode) => (d.slug ?? d._sys.filename).toLowerCase();

  const selectedIndex = selectedSlug ? designs.findIndex((d) => designSlug(d) === selectedSlug) : -1;
  const selectedDesign = selectedIndex >= 0 ? designs[selectedIndex] : null;

  const prevSlugRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    const prev = prevSlugRef.current;
    prevSlugRef.current = selectedSlug;

    if (selectedSlug && selectedDesign) {
      setDisplayDesign(selectedDesign);
      if (!isOpenRef.current) animateIn();
    } else if (!selectedSlug && prev) {
      animateOut(() => setDisplayDesign(null));
    }
  }, [selectedSlug, selectedDesign, animateIn, animateOut]);

  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, []);

  const goTo = (slug: string) => {
    setSelectedSlug(slug);
    window.history.pushState({}, '', `/design?design=${encodeURIComponent(slug)}`);
  };

  const close = () => {
    setSelectedSlug(null);
    window.history.pushState({}, '', '/design');
  };

  const filteredDesigns = activeFilter === 'all' ? designs : designs.filter((d) => d.designType === activeFilter);

  return (
    <>
      <div className='px-4 mb-6 md:mb-12 pt-2 md:pt-6 md:px-[58px]'>
        <div className='inline-flex rounded-[8px] bg-[#f0f0f0] p-1'>
          {(['all', 'byDoing', 'byKnowing'] as const).map((filter) => (
            <button
              key={filter}
              type='button'
              onClick={() => setActiveFilter(filter)}
              className={`relative cursor-pointer rounded-[8px] px-5 py-2 font-space-grotesk text-[14px] md:text-[20px] font-normal tracking-wide transition-colors ${activeFilter !== filter ? 'hover:bg-black/10' : ''}`}
            >
              {activeFilter === filter && (
                <motion.span
                  layoutId='design-filter-pill'
                  className='absolute inset-0 rounded-[8px] bg-black'
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <span
                className={`relative z-10 transition-colors duration-200 ${activeFilter === filter ? 'text-white underline decoration-brand-orange decoration-2 underline-offset-2' : 'text-black'}`}
              >
                {filter === 'all' ? 'All' : filter === 'byDoing' ? 'By Doing' : 'By Knowing'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filteredDesigns.length === 0 ? (
        <div className='px-4 py-12 sm:px-10 md:px-[58px]'>
          <p className='text-black/45'>No design work yet.</p>
        </div>
      ) : (
        <DesignListGrid
          items={filteredDesigns.map((d) => ({
            id: d.id,
            slug: d.slug,
            _sys: d._sys,
            data: d,
          }))}
          onItemClick={goTo}
        />
      )}

      <div ref={backdropRef} onClick={close} className='fixed inset-0 z-[99] bg-black/60' style={{ opacity: 0, visibility: 'hidden' }} />
      <button
        ref={closeBtnRef}
        type='button'
        onClick={close}
        aria-label='Close overlay'
        className='fixed right-6 top-[30px] z-[101] flex size-15 cursor-pointer items-center justify-center rounded-full bg-brand-orange text-white md:right-36'
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <Icon name='pinchInZoom' size={28} color='#fff' />
      </button>
      <div
        ref={(el) => {
          panelRef.current = el;
          detailScrollRef.current = el;
        }}
        className='fixed inset-x-0 bottom-0 top-[50px] z-[100] overflow-y-auto rounded-t-2xl bg-white'
        style={{ opacity: 0, visibility: 'hidden', transform: 'translateY(100%)' }}
      >
        {displayDesign && (
          <DetailPanel
            design={displayDesign}
            allDesigns={designs}
            onClose={close}
            onItemClick={(slug) => {
              goTo(slug);
              detailScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            scrollToTop={() => detailScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        )}
      </div>
    </>
  );
}

function renderDesignDate(iso: string): React.ReactNode {
  try {
    const d = new Date(iso);
    const day = d.getUTCDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
    const month = d.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' });
    const year = d.getUTCFullYear();
    return (
      <>
        {day}
        <sup>{suffix}</sup> <span className='uppercase'>{month}</span> {year}
      </>
    );
  } catch {
    return iso;
  }
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

function DetailPanel({
  design,
  allDesigns,
  onClose: _onClose,
  onItemClick,
  scrollToTop,
}: {
  design: DesignNode;
  allDesigns: DesignNode[];
  onClose: () => void;
  onItemClick: (slug: string) => void;
  scrollToTop?: () => void;
}) {
  const designSlug = (d: DesignNode) => (d.slug ?? d._sys.filename).toLowerCase();
  const otherDesigns = allDesigns.filter((d) => d.id !== design.id).slice(0, 3);

  return (
    <>
      <div>
        <div className='px-4 pt-8 pb-4 md:px-[10svw] md:pt-20 shrink-0'>
          {(design.date || design.category) && (
            <p className='font-space-grotesk text-[12px] md:text-[16px] font-normal leading-none uppercase tracking-normal mb-4'>
              {design.date && <span className='normal-case'>{renderDesignDate(design.date)}</span>}
              {design.date && design.category && ' · '}
              {design.category && <strong className='font-semibold text-black'>{design.category.title}</strong>}
            </p>
          )}
          <h1 className='font-sedan text-[28px] md:text-[48px] font-normal leading-tight tracking-normal text-black'>
            <TinaMarkdown
              content={design.title as any}
              components={
                {
                  p: (props: any) => <span className='block'>{props?.children}</span>,
                  bold: (props: any) => <strong className='font-bold'>{props?.children}</strong>,
                  italic: (props: any) => <em className='italic'>{props?.children}</em>,
                } as Components<object>
              }
            />
          </h1>
        </div>
        <div className='mx-4 md:mx-[10svw] border-b border-black/10' />

        {design.image && (
          <div className='mt-6 w-full px-4 md:px-[10svw]'>
            <div className='relative aspect-[16/9] w-full overflow-hidden bg-neutral-100'>
              <BlurUpImage src={design.image} alt={design.imageAlt ?? design._sys.filename} fill className='object-cover' sizes='100vw' priority />
            </div>
          </div>
        )}
      </div>

      {design.blocks && design.blocks.length > 0 && (
        <div className='mt-8'>
          {design.blocks.map((block, i) => {
            switch (block?.__typename) {
              case 'DesignBlocksHeader':
                return (
                  <div key={`${block.__typename}-${i}`} className={blockWrapperClass('wide', 'pb-2 md:py-4')}>
                    <HeaderBlock block={block} />
                  </div>
                );
              case 'DesignBlocksTwoColumnText':
                return (
                  <div key={`${block.__typename}-${i}`} className={blockWrapperClass('wide', 'py-4')}>
                    <TwoColumnTextBlock block={block} />
                  </div>
                );
              case 'DesignBlocksVideo':
                return (
                  <div key={`${block.__typename}-${i}`} className={blockWrapperClass('wide', 'py-10')}>
                    <VideoBlock block={block} />
                  </div>
                );
              case 'DesignBlocksImage': {
                const b = block as unknown as {
                  __typename: 'DesignBlocksImage';
                  width?: string | null;
                  orientation?: string | null;
                  images?: Array<{
                    src?: string | null;
                    alt?: string | null;
                  } | null> | null;
                };
                return (
                  <div key={`${block.__typename}-${i}`} className={blockWrapperClass(b.width ?? 'narrow', 'py-2 md:py-4')}>
                    <ImageBlock block={b} />
                  </div>
                );
              }
              case 'DesignBlocksSpace': {
                const b = block as unknown as {
                  __typename: 'DesignBlocksSpace';
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

      {otherDesigns.length > 0 && (
        <div className='mt-20 pt-10 px-4 pb-12 md:px-[10svw]'>
          <p className='font-space-grotesk text-[20px] md:text-[28px] font-bold uppercase tracking-wide text-black mb-8'>Related Content ↓</p>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {otherDesigns.map((d) => (
              <DesignListCard key={d.id} design={d} onClick={() => onItemClick(designSlug(d))} sizes='(max-width: 767px) 100vw, 33vw' />
            ))}
          </div>
        </div>
      )}

      <CommentsSection pageSlug={`design/${designSlug(design)}`} onBackToTop={scrollToTop} />
    </>
  );
}
