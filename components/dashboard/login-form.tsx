'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('submitting');
    const res = await fetch('/api/dashboard/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setStatus('error');
      return;
    }
    onAuthenticated();
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <form onSubmit={handleSubmit} className='flex w-full max-w-sm flex-col gap-4 p-8'>
        <Label htmlFor='password'>Password</Label>
        <Input id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        {status === 'error' ? <p className='text-sm text-red-600'>Incorrect password.</p> : null}
        <Button type='submit' disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}
