'use client';

import { createPortal } from 'react-dom';

import { CommentForm } from '@/components/comments/comment-form';
import { Icon } from '@/components/icons';

export interface CommentModalProps {
  pageSlug: string;
  onClose: () => void;
  onSubmitted: () => void;
}

export function CommentModal({ pageSlug, onClose, onSubmitted }: CommentModalProps) {
  return createPortal(
    <div className='fixed inset-0 z-[100] flex items-center justify-center p-6'>
      <button type='button' aria-label='Close' onClick={onClose} className='fixed inset-0 bg-black/60' />
      <div className='relative w-full max-w-[750px] rounded-2xl bg-white p-8'>
        <button
          type='button'
          aria-label='Close'
          onClick={onClose}
          className='absolute -right-6 -top-6 flex size-14 cursor-pointer items-center justify-center rounded-full bg-brand-orange text-white'
        >
          <Icon name='pinchInZoom' size={24} color='#fff' />
        </button>
        <h2 className='font-space-grotesk text-[36px] font-bold uppercase leading-[36px] tracking-normal text-black'>
          Let&apos;s start
          <br />a conversation
        </h2>
        <p className='mt-2 font-sedan text-[24px] font-normal leading-none tracking-normal text-black'>Leave a thought, question, or reflection.</p>
        <div className='mt-6'>
          <CommentForm
            pageSlug={pageSlug}
            onSubmitted={() => {
              onSubmitted();
              onClose();
            }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
