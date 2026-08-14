'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { CommentForm } from '@/components/comments/comment-form';
import { Icon } from '@/components/icons';
import { useOverlayAnimation } from '@/hooks/use-overlay-animation';
import { cn } from '@/lib/utils';

export interface CommentModalProps {
  pageSlug: string;
  onClose: () => void;
  onSubmitted: () => void;
  dark?: boolean;
}

export function CommentModal({ pageSlug, onClose, onSubmitted, dark = false }: CommentModalProps) {
  const backdropRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { animateIn, animateOut } = useOverlayAnimation({ backdropRef, closeBtnRef, panelRef, animation: 'slide-up' });

  useEffect(() => {
    animateIn();
  }, [animateIn]);

  const close = () => animateOut(onClose);

  return createPortal(
    <div className='fixed inset-0 z-[150] flex items-center justify-center md:p-6'>
      <button
        ref={backdropRef}
        type='button'
        aria-label='Close'
        onClick={close}
        className='fixed inset-0 bg-black/60'
        style={{ opacity: 0, visibility: 'hidden' }}
      />
      <div
        ref={panelRef}
        className={cn(
          'fixed inset-x-0 bottom-0 top-16 rounded-t-2xl md:static md:top-auto md:w-full md:max-w-[750px] md:rounded-2xl',
          dark ? 'border border-white/10 bg-neutral-900' : 'bg-white'
        )}
        style={{ opacity: 0, visibility: 'hidden', transform: 'translateY(100%)' }}
      >
        <button
          ref={closeBtnRef}
          type='button'
          aria-label='Close'
          onClick={close}
          className='absolute right-6 -top-7 flex size-14 cursor-pointer items-center justify-center rounded-full bg-brand-orange text-white md:right-16'
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          <Icon name='pinchInZoom' size={24} color='#fff' />
        </button>
        <div className='h-full overflow-y-auto rounded-t-2xl pt-12 px-4 pb-6 md:p-[48px] md:rounded-2xl'>
          <h2
            className={cn(
              'font-space-grotesk text-[20px] font-bold uppercase leading-[1.2] tracking-normal md:text-[36px] md:leading-[36px]',
              dark ? 'text-white' : 'text-black'
            )}
          >
            Let&apos;s start
            <br />a conversation
          </h2>
          <p
            className={cn('mt-2 font-sedan text-[16px] font-normal leading-none tracking-normal md:text-[24px]', dark ? 'text-white' : 'text-black')}
          >
            Leave a thought, question, or reflection.
          </p>
          <div className='mt-8 md:mt-[72px]'>
            <CommentForm
              pageSlug={pageSlug}
              dark={dark}
              onSubmitted={() =>
                animateOut(() => {
                  onSubmitted();
                  onClose();
                })
              }
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
