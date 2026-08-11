'use client';

import gsap from 'gsap';
import { ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { CommentItem } from '@/components/comments/comment-item';
import type { CommentItemData } from '@/components/comments/comment-item';
import { CommentList } from '@/components/comments/comment-list';
import { CommentModal } from '@/components/comments/comment-modal';
import { Icon } from '@/components/icons';
import { ActionButton } from '@/components/shared/action-button';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

export interface CommentsSectionProps {
  pageSlug: string;
  onBackToTop?: () => void;
  dark?: boolean;
}

interface PinnedComment extends CommentItemData {
  replies: CommentItemData[];
}

function CommentsToggle({ hidden, onClick, dark }: { hidden: boolean; onClick: () => void; dark?: boolean }) {
  const ToggleIcon = hidden ? Eye : EyeOff;
  return (
    <div className='flex w-full items-center gap-4'>
      <span className={cn('h-px flex-1', dark ? 'bg-white/10' : 'bg-black/10')} />
      <button
        type='button'
        onClick={onClick}
        className={cn(
          'flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 font-space-grotesk text-[20px] font-normal leading-none tracking-normal',
          dark ? 'border-white/15 bg-transparent text-white' : 'border-black/10 bg-white text-black'
        )}
      >
        <ToggleIcon size={18} />
        {hidden ? 'View comments' : 'Hide comments'}
      </button>
      <span className={cn('h-px flex-1', dark ? 'bg-white/10' : 'bg-black/10')} />
    </div>
  );
}

export function CommentsSection({ pageSlug, onBackToTop, dark }: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentItemData[]>([]);
  const [pinned, setPinned] = useState<PinnedComment | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [hidden, setHidden] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const loadComments = useCallback(async () => {
    const res = await fetch(`/api/comments?page=${encodeURIComponent(pageSlug)}&pageNum=${page}`);
    if (!res.ok) return;
    const payload = await res.json();
    setComments(payload.comments ?? []);
    setPinned(payload.pinned ?? null);
    setTotalPages(payload.pagination?.totalPages ?? 1);
    setTotalComments(payload.pagination?.total ?? 0);
    setLoaded(true);
  }, [pageSlug, page]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  useEffect(() => {
    if (hidden) return;
    const el = contentRef.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
  }, [hidden]);

  const scrollToTop = onBackToTop ?? (() => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const handleToggle = () => {
    if (hidden) {
      setHidden(false);
      requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top, behavior: 'smooth' });
      });
      return;
    }

    const el = contentRef.current;
    if (!el) {
      setHidden(true);
      return;
    }
    gsap.to(el, { opacity: 0, y: -12, duration: 0.3, ease: 'power2.in', onComplete: () => setHidden(true) });
  };

  const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  const isEmpty = loaded && totalComments === 0;

  return (
    <section ref={sectionRef} className='mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-16 sm:px-10'>
      {isEmpty ? (
        <div className='flex flex-col items-center gap-6 py-4 text-center'>
          <h2
            className={cn(
              'self-stretch text-left font-space-grotesk text-[20px] font-bold uppercase leading-none tracking-normal md:text-center md:text-[32px]',
              dark ? 'text-white' : 'text-black'
            )}
          >
            Comments
          </h2>
          <Icon name='commentEmpty' size={64} />
          <div className='flex flex-col gap-1'>
            <p className={cn('font-space-grotesk text-[16px] font-bold uppercase md:text-[24px]', dark ? 'text-white' : 'text-black')}>No comments yet</p>
            <p className={cn('font-space-grotesk text-[12px] md:text-[24px]', dark ? 'text-white/40' : 'text-black/40')}>
              Be the first to share your perspective.
            </p>
          </div>
          <ActionButton variant='solid' color={dark ? 'white' : 'black'} icon='chatAddOn' label='Post a comment' onClick={() => setComposerOpen(true)} />
        </div>
      ) : (
        <>
          {!hidden ? (
            <div ref={contentRef} className='flex flex-col gap-8'>
              <h2
                className={cn(
                  'text-left font-space-grotesk text-[20px] font-bold uppercase leading-none tracking-normal md:text-center md:text-[32px]',
                  dark ? 'text-white' : 'text-black'
                )}
              >
                Comments
              </h2>

              <div className='flex flex-col gap-2'>
                {pinned ? <CommentItem comment={pinned} replies={pinned.replies} dark={dark} /> : null}
                {loaded ? <CommentList comments={comments} dark={dark} hasPinned={pinned !== null} /> : null}
              </div>

              <ActionButton
                variant='solid'
                color={dark ? 'white' : 'black'}
                icon='chatAddOn'
                label='Post a comment'
                fullWidth
                onClick={() => setComposerOpen(true)}
              />

              {totalPages > 1 ? (
                <div className='flex w-full items-center justify-between'>
                  <button
                    type='button'
                    aria-label='Go to previous page'
                    onClick={() => page > 1 && setPage(page - 1)}
                    className={cn(
                      'flex h-9 w-auto cursor-pointer items-center gap-1 rounded-[8px] border px-4 font-space-grotesk text-[13px] font-bold uppercase',
                      dark ? 'border-white/15 bg-transparent text-white hover:bg-white/5' : 'border-black/15 bg-white text-black hover:bg-white',
                      page <= 1 && (dark ? 'pointer-events-none border-white/10 text-white/30' : 'pointer-events-none border-black/10 text-black/30')
                    )}
                  >
                    <ChevronLeft size={16} />
                    Prev
                  </button>

                  <Pagination className='w-auto'>
                    <PaginationContent className='gap-2'>
                      {visiblePages.map((p, i) => (
                        <PaginationItem key={p}>
                          {i > 0 && p - visiblePages[i - 1] > 1 ? <PaginationEllipsis className={dark ? 'text-white/40' : 'text-black/40'} /> : null}
                          <PaginationLink
                            href='#'
                            isActive={p === page}
                            onClick={(event) => {
                              event.preventDefault();
                              setPage(p);
                            }}
                            className={cn(
                              'flex size-9 cursor-pointer items-center justify-center rounded-[8px] border font-space-grotesk text-[13px] font-bold',
                              p === page
                                ? dark
                                  ? 'border-white bg-white text-black hover:bg-white hover:text-black'
                                  : 'border-black bg-black text-white hover:bg-black hover:text-white'
                                : dark
                                  ? 'border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white'
                                  : 'border-black/15 bg-white text-black hover:bg-white hover:text-black'
                            )}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                    </PaginationContent>
                  </Pagination>

                  <button
                    type='button'
                    aria-label='Go to next page'
                    onClick={() => page < totalPages && setPage(page + 1)}
                    className={cn(
                      'flex h-9 w-auto cursor-pointer items-center gap-1 rounded-[8px] border px-4 font-space-grotesk text-[13px] font-bold uppercase',
                      dark ? 'border-white/15 bg-transparent text-white hover:bg-white/5' : 'border-black/15 bg-white text-black hover:bg-white',
                      page >= totalPages && (dark ? 'pointer-events-none border-white/10 text-white/30' : 'pointer-events-none border-black/10 text-black/30')
                    )}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

          <CommentsToggle hidden={hidden} onClick={handleToggle} dark={dark} />
        </>
      )}

      <ActionButton
        color={dark ? 'black' : 'white'}
        icon='arrowUpwardAlt'
        label='Back to Top'
        onClick={scrollToTop}
        className={cn('self-center', dark ? 'bg-white/10 hover:bg-white/15' : 'bg-surface-grey')}
      />

      {composerOpen ? (
        <CommentModal
          pageSlug={pageSlug}
          dark={dark}
          onClose={() => setComposerOpen(false)}
          onSubmitted={() => {
            loadComments();
            setHidden(false);
          }}
        />
      ) : null}
    </section>
  );
}
