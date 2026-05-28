'use client';

import { useEffect } from 'react';

function DarkModeActivator() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);
  return null;
}

export default function FilmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DarkModeActivator />
      {children}
    </>
  );
}
