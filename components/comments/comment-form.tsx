'use client';

import { useEffect, useRef, useState } from 'react';

import { ActionButton } from '@/components/shared/action-button';
import { TextField } from '@/components/shared/text-field';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: { sitekey: string; appearance?: 'always' | 'execute' | 'interaction-only'; callback: (token: string) => void }
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

export interface CommentFormProps {
  pageSlug: string;
  parentId?: number | null;
  onSubmitted: () => void;
  dark?: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CommentForm({ pageSlug, parentId = null, onSubmitted, dark = false }: CommentFormProps) {
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const isEmailValid = authorEmail.trim().length === 0 || EMAIL_PATTERN.test(authorEmail.trim());
  const isFormValid = authorName.trim().length > 0 && body.trim().length > 0 && isEmailValid;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const turnstileTokenRef = useRef('');
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    function renderWidget() {
      const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
      if (!siteKey || !window.turnstile || !widgetContainerRef.current) return;
      widgetIdRef.current = window.turnstile.render(widgetContainerRef.current, {
        sitekey: siteKey,
        appearance: 'interaction-only',
        callback: (token) => {
          turnstileTokenRef.current = token;
        },
      });
    }

    const scriptId = 'cf-turnstile-script';
    if (document.getElementById(scriptId)) {
      renderWidget();
      return;
    }
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.onload = renderWidget;
    document.body.appendChild(script);
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isFormValid) return;
    setStatus('submitting');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_slug: pageSlug,
          parent_id: parentId,
          author_name: authorName,
          author_email: authorEmail,
          body,
          turnstileToken: turnstileTokenRef.current,
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setErrorMessage(payload.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
        if (window.turnstile && widgetIdRef.current) window.turnstile.reset(widgetIdRef.current);
        return;
      }

      setAuthorName('');
      setAuthorEmail('');
      setBody('');
      setStatus('idle');
      onSubmitted();
    } catch {
      setErrorMessage('Network error. Please try again.');
      setStatus('error');
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <TextField label='Name' name='author_name' value={authorName} onChange={setAuthorName} maxLength={80} required dark={dark} />
      <TextField
        type='email'
        label='Email Address [ Optional ]'
        name='author_email'
        value={authorEmail}
        onChange={setAuthorEmail}
        maxLength={254}
        error={isEmailValid ? null : 'Enter a valid email address.'}
        dark={dark}
      />
      <div className='flex flex-col gap-2'>
        <span className='flex items-baseline justify-between'>
          <label htmlFor='body' className='font-space-grotesk text-[12px] font-bold uppercase leading-none tracking-normal text-[#D9D9D9]'>
            Thoughts
          </label>
          <span className={cn('font-space-grotesk text-[11px] uppercase tracking-[0.08em]', dark ? 'text-white/30' : 'text-black/30')}>
            {1000 - body.length} characters remaining
          </span>
        </span>
        <div className={cn('flex flex-col rounded-[8px] border-[0.5px]', dark ? 'border-white/15 bg-white/5' : 'border-black/15 bg-white')}>
          <textarea
            id='body'
            name='body'
            value={body}
            maxLength={1000}
            required
            onChange={(e) => setBody(e.target.value)}
            className={cn(
              'h-[190px] w-full resize-none overflow-y-auto rounded-t-[8px] bg-transparent p-4 font-space-grotesk text-[16px] font-normal leading-[1.2] tracking-normal outline-none transition-colors md:text-[20px]',
              dark ? 'text-white focus:border-white/40' : 'text-black focus:border-black'
            )}
          />
          <div className='flex justify-end p-4 pt-3'>
            <ActionButton
              variant='solid'
              color={dark ? 'white' : 'black'}
              icon='arrowCircleUp'
              label={status === 'submitting' ? 'Posting…' : 'Post comment'}
              disabled={status === 'submitting' || !isFormValid}
              onClick={() => formRef.current?.requestSubmit()}
              className='h-[44px] w-auto min-w-[197px] gap-2 whitespace-nowrap rounded-[4px] px-6 py-3 text-[16px] md:w-auto md:min-w-[197px] md:gap-2 md:rounded-[4px] md:text-[16px]'
            />
          </div>
        </div>
      </div>
      <div ref={widgetContainerRef} />
      <p className='block h-[18px] text-[13px] leading-[18px] text-brand-orange'>{errorMessage ?? ''}</p>
    </form>
  );
}
