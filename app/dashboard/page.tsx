'use client';

import { useEffect, useState } from 'react';

import { DashboardView } from '@/components/dashboard/dashboard-view';
import { LoginForm } from '@/components/dashboard/login-form';

export default function DashboardPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [accessEnabled, setAccessEnabled] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard/session')
      .then((res) => res.json())
      .then((payload) => {
        setAuthenticated(Boolean(payload.authenticated));
        setAccessEnabled(Boolean(payload.accessEnabled));
      })
      .catch(() => setAuthenticated(false));
  }, []);

  async function handleLogout() {
    if (accessEnabled) {
      window.location.href = '/cdn-cgi/access/logout';
      return;
    }
    await fetch('/api/dashboard/logout', { method: 'POST' });
    setAuthenticated(false);
  }

  if (authenticated === null) return null;
  if (!authenticated) return <LoginForm onAuthenticated={() => setAuthenticated(true)} />;
  return <DashboardView onLogout={handleLogout} />;
}
