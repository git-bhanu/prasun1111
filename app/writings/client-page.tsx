'use client';

import { Icon } from '@/components/icons';
import { WritingDetailPanel } from '@/components/writings/writing-detail-panel';
import { WritingListItem } from '@/components/writings/writing-list-item';
import { useOverlayAnimation } from '@/hooks/use-overlay-animation';
import type { WritingConnectionQuery, WritingConnectionQueryVariables } from '@/tina/__generated__/types';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTina } from 'tinacms/dist/react';

type Props = {
  query: string;
  data: WritingConnectionQuery;
  variables: WritingConnectionQueryVariables;
};

type WritingNode = NonNullable<NonNullable<WritingConnectionQuery['writingConnection']['edges']>[number]>['node'];

export default function WritingsClientPage(props: Props) {
  return (
    <Suspense>
      <WritingsContent {...props} />
    </Suspense>
  );
}

function WritingsContent({ query, data, variables }: Props) {
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

  const [selectedSlug, setSelectedSlug] = useState<string | null>(() => searchParams?.get('writing') ?? null);
  const [displayWriting, setDisplayWriting] = useState<NonNullable<WritingNode> | null>(null);

  useEffect(() => {
    const handlePop = () => {
      const params = new URLSearchParams(window.location.search);
      setSelectedSlug(params.get('writing') ?? null);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const writings: NonNullable<WritingNode>[] = (tinaData.writingConnection.edges ?? [])
    .map((e) => e?.node)
    .filter((n): n is NonNullable<WritingNode> => n != null && !n.archived)
    .filter((n, i, arr) => arr.findIndex((m) => m._sys.filename === n._sys.filename) === i)
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const selectedWriting = selectedSlug ? (writings.find((w) => w._sys.filename === selectedSlug) ?? null) : null;

  const prevSlugRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    const prev = prevSlugRef.current;
    prevSlugRef.current = selectedSlug;

    if (selectedSlug && selectedWriting) {
      setDisplayWriting(selectedWriting);
      if (!isOpenRef.current) {
        animateIn();
      } else {
        detailScrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
      }
    } else if (!selectedSlug && prev) {
      animateOut(() => setDisplayWriting(null));
    }
  }, [selectedSlug, selectedWriting, animateIn, animateOut]);

  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, []);

  const goTo = (slug: string) => {
    setSelectedSlug(slug);
    window.history.pushState({}, '', `/writings?writing=${encodeURIComponent(slug)}`);
  };

  const close = () => {
    setSelectedSlug(null);
    window.history.pushState({}, '', '/writings');
  };

  const relatedWritings = displayWriting ? writings.filter((w) => w._sys.filename !== displayWriting._sys.filename).slice(0, 4) : [];

  return (
    <>
      <section className='w-full pb-20 pt-0 md:pt-2'>
        {writings.length === 0 ? (
          <p className='px-4 py-12 font-space-grotesk text-black/40 md:px-[58px]'>No writings yet.</p>
        ) : (
          <div>
            {writings.map((writing) => (
              <WritingListItem
                key={writing.id}
                slug={writing._sys.filename}
                titleSections={writing.titleSections ?? []}
                date={writing.date}
                tags={writing.tags}
                visualsCount={writing.visualsCount}
                readingType={writing.readingType}
                onClick={goTo}
              />
            ))}
          </div>
        )}
      </section>

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
        {displayWriting && <WritingDetailPanel writing={displayWriting} relatedWritings={relatedWritings} onWritingClick={goTo} />}
      </div>
    </>
  );
}
