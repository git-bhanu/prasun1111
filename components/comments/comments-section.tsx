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
}

interface PinnedComment extends CommentItemData {
  replies: CommentItemData[];
}

function CommentsToggle({ hidden, onClick }: { hidden: boolean; onClick: () => void }) {
  const ToggleIcon = hidden ? Eye : EyeOff;
  return (
    <div className='flex w-full items-center gap-4'>
      <span className='h-px flex-1 bg-black/10' />
      <button
        type='button'
        onClick={onClick}
        className='flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 font-space-grotesk text-[20px] font-normal leading-none tracking-normal text-black'
      >
        <ToggleIcon size={18} />
        {hidden ? 'View comments' : 'Hide comments'}
      </button>
      <span className='h-px flex-1 bg-black/10' />
    </div>
  );
}

export function CommentsSection({ pageSlug }: CommentsSectionProps) {
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
  const isFirstRun = useRef(true);

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
    const el = contentRef.current;
    if (!el) return;

    if (isFirstRun.current) {
      isFirstRun.current = false;
      gsap.set(el, { height: hidden ? 0 : 'auto', opacity: hidden ? 0 : 1 });
      return;
    }

    gsap.to(el, {
      height: hidden ? 0 : 'auto',
      opacity: hidden ? 0 : 1,
      duration: 0.45,
      ease: 'power2.inOut',
    });
  }, [hidden]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleToggle = () => {
    const wasHidden = hidden;
    setHidden(!wasHidden);
    if (wasHidden) {
      requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    }
  };

  const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  const isEmpty = loaded && totalComments === 0;

  return (
    <section ref={sectionRef} className='mx-auto flex w-full max-w-3xl flex-col gap-8 px-8 py-16 sm:px-10'>
      <h2 className='text-center font-space-grotesk text-[32px] font-bold uppercase leading-none tracking-normal text-black'>Comments</h2>

      {isEmpty ? (
        <div className='flex flex-col items-center gap-6 py-4 text-center'>
          <Icon name='commentEmpty' size={64} />
          <div className='flex flex-col gap-1'>
            <p className='font-space-grotesk text-[24px] font-bold uppercase text-black'>No comments yet</p>
            <p className='font-space-grotesk text-[24px] text-black/40'>Be the first to share your perspective.</p>
          </div>
          <ActionButton variant='solid' color='black' icon='chatAddOn' label='Post a comment' onClick={() => setComposerOpen(true)} />
          <ActionButton color='white' icon='arrowUpwardAlt' label='Back to Top' onClick={scrollToTop} className='bg-surface-grey' />
        </div>
      ) : (
        <>
          <div ref={contentRef} className='flex flex-col gap-8 overflow-hidden'>
            <div className='flex flex-col gap-2'>
              {pinned ? <CommentItem comment={pinned} replies={pinned.replies} /> : null}
              {loaded ? <CommentList comments={comments} /> : null}
            </div>

            <ActionButton variant='solid' color='black' icon='chatAddOn' label='Post a comment' fullWidth onClick={() => setComposerOpen(true)} />

            {totalPages > 1 ? (
              <div className='flex w-full items-center justify-between'>
                <button
                  type='button'
                  aria-label='Go to previous page'
                  onClick={() => page > 1 && setPage(page - 1)}
                  className={cn(
                    'flex h-9 w-auto items-center gap-1 rounded-[8px] border border-black/15 bg-white px-4 font-space-grotesk text-[13px] font-bold uppercase text-black hover:bg-white',
                    page <= 1 && 'pointer-events-none border-black/10 text-black/30'
                  )}
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>

                <Pagination className='w-auto'>
                  <PaginationContent className='gap-2'>
                    {visiblePages.map((p, i) => (
                      <PaginationItem key={p}>
                        {i > 0 && p - visiblePages[i - 1] > 1 ? <PaginationEllipsis className='text-black/40' /> : null}
                        <PaginationLink
                          href='#'
                          isActive={p === page}
                          onClick={(event) => {
                            event.preventDefault();
                            setPage(p);
                          }}
                          className={cn(
                            'flex size-9 items-center justify-center rounded-[8px] border font-space-grotesk text-[13px] font-bold',
                            p === page ? 'border-black bg-black text-white hover:bg-black' : 'border-black/15 bg-white text-black hover:bg-white'
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
                    'flex h-9 w-auto items-center gap-1 rounded-[8px] border border-black/15 bg-white px-4 font-space-grotesk text-[13px] font-bold uppercase text-black hover:bg-white',
                    page >= totalPages && 'pointer-events-none border-black/10 text-black/30'
                  )}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            ) : null}
          </div>

          <CommentsToggle hidden={hidden} onClick={handleToggle} />

          <ActionButton color='white' icon='arrowUpwardAlt' label='Back to Top' onClick={scrollToTop} className='self-center bg-surface-grey' />
        </>
      )}

      {composerOpen ? <CommentModal pageSlug={pageSlug} onClose={() => setComposerOpen(false)} onSubmitted={loadComments} /> : null}
    </section>
  );
}
