'use client';

import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

import { CommentForm } from '@/components/comments/comment-form';
import { ActionButton } from '@/components/shared/action-button';
import { Badge } from '@/components/shared/badge';

export interface CommentItemData {
  id: number;
  page_slug: string;
  parent_id: number | null;
  author_name: string;
  body: string;
  is_author_reply: number;
  created_at: string;
}

export interface CommentItemProps {
  comment: CommentItemData;
  replies: CommentItemData[];
  pageSlug: string;
  onReplySubmitted: () => void;
  allowReply?: boolean;
}

export function CommentItem({ comment, replies, pageSlug, onReplySubmitted, allowReply = false }: CommentItemProps) {
  const [replying, setReplying] = useState(false);

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-col gap-2 rounded-[10px] border border-black/10 p-4'>
        <div className='flex items-center gap-2'>
          <span className='font-space-grotesk text-[13px] uppercase text-black'>{comment.author_name}</span>
          {comment.is_author_reply ? <Badge variant='author' label='Author' /> : null}
          <span className='text-[12px] text-black/40'>{formatDistanceToNow(new Date(`${comment.created_at}Z`), { addSuffix: true })}</span>
        </div>
        <p className='text-[14px] leading-6 text-black/80'>{comment.body}</p>
        {allowReply ? (
          replying ? (
            <div className='mt-2'>
              <CommentForm
                pageSlug={pageSlug}
                parentId={comment.id}
                onSubmitted={() => {
                  setReplying(false);
                  onReplySubmitted();
                }}
              />
            </div>
          ) : (
            <ActionButton variant='ghost' color='black' label='Reply' onClick={() => setReplying(true)} />
          )
        ) : null}
      </div>
      {replies.length > 0 ? (
        <div className='ml-6 flex flex-col gap-3 border-l border-black/10 pl-4'>
          {replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} replies={[]} pageSlug={pageSlug} onReplySubmitted={onReplySubmitted} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
