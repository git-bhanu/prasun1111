'use client';
import Header from '@/components/shared/Header/index';
import { ViewTransitionProvider } from '@/components/view-transition-provider';
import type React from 'react';

type BaseLayoutProps = {
  children: React.ReactNode;
};

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className='flex min-h-screen flex-col overflow-x-clip bg-white text-black'>
      <Header />
      <ViewTransitionProvider>
        <main className='flex-1'>{children}</main>
      </ViewTransitionProvider>
    </div>
  );
}
