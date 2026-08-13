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
  dark?: boolean;
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

function formatTimestamp(createdAt: string) {
  return formatDistanceToNow(new Date(`${createdAt}Z`), { addSuffix: true });
}

function LikeButton({ liked, likesCount, onToggle, dark }: { liked: boolean; likesCount: number; onToggle: () => void; dark?: boolean }) {
  return (
    <button
      type='button'
      onClick={onToggle}
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-[13px]',
        dark ? 'border-white/15 text-white/70 hover:border-white/30' : 'border-[#F6F6F6] text-black/70 hover:border-black/20'
      )}
    >
      <Heart size={16} className={cn(liked ? 'fill-brand-orange text-brand-orange' : dark ? 'text-white/40' : 'text-black/50')} />
      <span>{likesCount === 0 ? 'Be the first to like' : likesCount}</span>
    </button>
  );
}

function CommentMeta({
  liked,
  likesCount,
  onToggle,
  comment,
  dark,
}: { liked: boolean; likesCount: number; onToggle: () => void; comment: CommentItemData; dark?: boolean }) {
  return (
    <div className='mt-5 flex items-center justify-between gap-3'>
      <LikeButton liked={liked} likesCount={likesCount} onToggle={onToggle} dark={dark} />
      <span className={cn('shrink-0 font-space-grotesk text-[12px] uppercase tracking-wide md:hidden', dark ? 'text-white/30' : 'text-[#D9D9D9]')}>
        {formatTimestamp(comment.created_at)}
      </span>
    </div>
  );
}

function CommentAuthor({ comment, dark }: { comment: CommentItemData; dark?: boolean }) {
  return (
    <div className='flex items-center gap-3'>
      <div className={cn('flex items-start gap-2 rounded-lg border p-4', dark ? 'border-white/15' : 'border-black/25')}>
        <span className={cn('font-space-grotesk text-[12px] font-bold uppercase leading-none md:text-[16px]', dark ? 'text-white' : 'text-black')}>
          {comment.author_name}
        </span>
        {comment.is_author_reply ? <span className='font-space-grotesk text-[8px] font-bold uppercase leading-none text-brand-orange'>Author</span> : null}
      </div>
      <span className={cn('hidden font-space-grotesk text-[12px] uppercase tracking-wide md:inline-block', dark ? 'text-white/30' : 'text-[#D9D9D9]')}>
        {formatTimestamp(comment.created_at)}
      </span>
    </div>
  );
}

function CommentReply({ comment, dark }: { comment: CommentItemData; dark?: boolean }) {
  const { liked, likesCount, toggleLike } = useCommentLike(comment);

  return (
    <div className='mt-4 border-l-2 border-brand-orange pl-6'>
      <CommentAuthor comment={comment} dark={dark} />
      <p className={cn('mt-2 text-[14px] leading-7 md:text-[15px]', dark ? 'text-white/80' : 'text-black')}>{comment.body}</p>
      <CommentMeta liked={liked} likesCount={likesCount} onToggle={toggleLike} comment={comment} dark={dark} />
    </div>
  );
}

export function CommentItem({ comment, replies, dark }: CommentItemProps) {
  const { liked, likesCount, toggleLike } = useCommentLike(comment);

  return (
    <div className={cn('rounded-lg border p-3', dark ? 'border-white/15 bg-transparent' : 'border-black/25 bg-white')}>
      <div className='flex items-center gap-3'>
        <CommentAuthor comment={comment} dark={dark} />
        {comment.is_pinned ? (
          <span
            aria-label='Pinned comment'
            title='Pinned comment'
            className={cn(
              'ml-auto flex size-9 shrink-0 items-center justify-center rounded-full border',
              dark ? 'border-white/15 text-white/40' : 'border-black/25 text-black/40'
            )}
          >
            <Pin size={16} fill='currentColor' />
          </span>
        ) : null}
      </div>
      <p className={cn('mt-4 text-[14px] leading-7 md:text-[15px]', dark ? 'text-white/80' : 'text-black')}>{comment.body}</p>
      <CommentMeta liked={liked} likesCount={likesCount} onToggle={toggleLike} comment={comment} dark={dark} />
      {replies.map((reply) => (
        <CommentReply key={reply.id} comment={reply} dark={dark} />
      ))}
    </div>
  );
}
