'use client';

import { useEffect, useRef, useState } from 'react';

import { ActionButton } from '@/components/shared/action-button';
import { TextField } from '@/components/shared/text-field';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: { sitekey: string; callback: (token: string) => void }) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

export interface CommentFormProps {
  pageSlug: string;
  parentId?: number | null;
  onSubmitted: () => void;
}

export function CommentForm({ pageSlug, parentId = null, onSubmitted }: CommentFormProps) {
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
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
      <TextField label='Name' name='author_name' value={authorName} onChange={setAuthorName} maxLength={80} required />
      <TextField type='email' label='Email (optional)' name='author_email' value={authorEmail} onChange={setAuthorEmail} maxLength={254} />
      <TextField as='textarea' label='Comment' name='body' value={body} onChange={setBody} maxLength={2000} required />
      <div ref={widgetContainerRef} />
      {errorMessage ? <p className='text-[13px] text-brand-orange'>{errorMessage}</p> : null}
      <ActionButton
        variant='solid'
        color='black'
        label={status === 'submitting' ? 'Posting…' : 'Post comment'}
        disabled={status === 'submitting'}
        onClick={() => formRef.current?.requestSubmit()}
      />
    </form>
  );
}
