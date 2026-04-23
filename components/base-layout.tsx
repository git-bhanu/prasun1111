'use client';
import Header from '@/components/shared/Header/index';
import type React from 'react';

type BaseLayoutProps = {
  children: React.ReactNode;
};

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className='flex min-h-screen flex-col bg-white text-black'>
      <Header />
      <main className='flex-1'>{children}</main>
    </div>
  );
}
