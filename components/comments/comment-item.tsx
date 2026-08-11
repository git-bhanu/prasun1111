'use client';

import { formatDistanceToNow } from 'date-fns';
import { Heart, Pin } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

const LIKED_STORAGE_KEY = 'liked-comments';

function readLikedIds(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(LIKED_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLikedIds(ids: number[]) {
  window.localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(ids));
}

export interface CommentItemData {
  id: number;
  page_slug: string;
  parent_id: number | null;
  author_name: string;
  body: string;
  is_author_reply: number;
  is_pinned?: number;
  likes_count: number;
  created_at: string;
}

export interface CommentItemProps {
  comment: CommentItemData;
  replies: CommentItemData[];
}

function useCommentLike(comment: CommentItemData) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes_count);

  useEffect(() => {
    setLiked(readLikedIds().includes(comment.id));
  }, [comment.id]);

  async function toggleLike() {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount((count) => Math.max(0, count + (nextLiked ? 1 : -1)));

    const res = await fetch(`/api/comments/${comment.id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ liked: nextLiked }),
    });
    if (!res.ok) {
      setLiked(!nextLiked);
      setLikesCount((count) => Math.max(0, count + (nextLiked ? -1 : 1)));
      return;
    }
    const payload = await res.json();
    setLikesCount(payload.likes_count);

    const likedIds = readLikedIds();
    writeLikedIds(nextLiked ? [...likedIds, comment.id] : likedIds.filter((id) => id !== comment.id));
  }

  return { liked, likesCount, toggleLike };
}

function LikeButton({ liked, likesCount, onToggle }: { liked: boolean; likesCount: number; onToggle: () => void }) {
  return (
    <button
      type='button'
      onClick={onToggle}
      className='flex cursor-pointer items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-[13px] text-black/70 hover:border-black/20'
    >
      <Heart size={16} className={cn(liked ? 'fill-brand-orange text-brand-orange' : 'text-black/50')} />
      <span>{likesCount === 0 ? 'Be the first to like' : likesCount}</span>
    </button>
  );
}

function CommentAuthor({ comment }: { comment: CommentItemData }) {
  return (
    <div className='flex items-center gap-3'>
      <div className='flex items-center gap-2 rounded-xl border border-black/10 p-2'>
        <span className='font-space-grotesk text-[16px] font-bold uppercase text-black'>{comment.author_name}</span>
        {comment.is_author_reply ? <span className='font-space-grotesk text-[13px] font-bold uppercase text-brand-orange'>Author</span> : null}
      </div>
      <span className='font-space-grotesk text-[12px] uppercase tracking-wide text-[#D9D9D9]'>
        {formatDistanceToNow(new Date(`${comment.created_at}Z`), { addSuffix: true })}
      </span>
    </div>
  );
}

function CommentReply({ comment }: { comment: CommentItemData }) {
  const { liked, likesCount, toggleLike } = useCommentLike(comment);

  return (
    <div className='mt-4 border-l-2 border-brand-orange pl-4'>
      <CommentAuthor comment={comment} />
      <p className='mt-2 text-[15px] leading-7 text-black'>{comment.body}</p>
      <div className='mt-2'>
        <LikeButton liked={liked} likesCount={likesCount} onToggle={toggleLike} />
      </div>
    </div>
  );
}

export function CommentItem({ comment, replies }: CommentItemProps) {
  const { liked, likesCount, toggleLike } = useCommentLike(comment);

  return (
    <div className='rounded-2xl border border-black/10 bg-white p-6'>
      <div className='flex items-center gap-3'>
        <CommentAuthor comment={comment} />
        {comment.is_pinned ? (
          <span
            aria-label='Pinned comment'
            title='Pinned comment'
            className='ml-auto flex size-9 shrink-0 items-center justify-center rounded-full border border-black/10 text-black/40'
          >
            <Pin size={16} fill='currentColor' />
          </span>
        ) : null}
      </div>
      <p className='mt-4 text-[15px] leading-7 text-black'>{comment.body}</p>
      <div className='mt-4'>
        <LikeButton liked={liked} likesCount={likesCount} onToggle={toggleLike} />
      </div>
      {replies.map((reply) => (
        <CommentReply key={reply.id} comment={reply} />
      ))}
    </div>
  );
}
