import { fontSans, lato, nunito } from '@/app/fonts';
import { BaseLayout } from '@/components/base-layout';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import React from 'react';

import '@/styles.css';

export const metadata: Metadata = {
  title: 'Your Project',
  description: 'A clean starting point for your TinaCMS site.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={cn(fontSans.variable, nunito.variable, lato.variable)}>
      <body className='min-h-screen bg-background font-sans antialiased'>
        <BaseLayout>{children}</BaseLayout>
      </body>
    </html>
  );
}
