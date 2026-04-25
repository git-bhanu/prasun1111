import { fontSans, lato, nunito, spaceGrotesk } from '@/app/fonts';
import { BaseLayout } from '@/components/base-layout';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import React from 'react';

import '@/styles.css';

export const metadata: Metadata = {
  title: 'Prasun1111',
  description: 'Official website of Prasun1111 featuring artworks, installations, films, design, and writings.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={cn(fontSans.variable, nunito.variable, lato.variable, spaceGrotesk.variable)}>
      <body className='min-h-screen bg-background font-sans antialiased'>
        <BaseLayout>{children}</BaseLayout>
      </body>
    </html>
  );
}
