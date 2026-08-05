'use client';

import { useCallback, useEffect, useState } from 'react';

import { CommentForm } from '@/components/comments/comment-form';
import type { CommentItemData } from '@/components/comments/comment-item';
import { CommentList } from '@/components/comments/comment-list';
import { SectionMasthead } from '@/components/shared/section-masthead';

export interface CommentsSectionProps {
  pageSlug: string;
}

export function CommentsSection({ pageSlug }: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentItemData[]>([]);
  const [loaded, setLoaded] = useState(false);

  const loadComments = useCallback(async () => {
    const res = await fetch(`/api/comments?page=${encodeURIComponent(pageSlug)}`);
    if (!res.ok) return;
    const payload = await res.json();
    setComments(payload.comments ?? []);
    setLoaded(true);
  }, [pageSlug]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return (
    <section className='mx-auto flex w-full max-w-3xl flex-col gap-8 px-8 py-16 sm:px-10'>
      <SectionMasthead title='Comments' size='md' color='black' />
      {loaded ? <CommentList comments={comments} pageSlug={pageSlug} onReplySubmitted={loadComments} /> : null}
      <CommentForm pageSlug={pageSlug} onSubmitted={loadComments} />
    </section>
  );
}
