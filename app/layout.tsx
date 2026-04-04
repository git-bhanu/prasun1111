import { fontSans, lato, nunito } from '@/app/fonts';
import VideoDialog from '@/components/ui/VideoDialog';
import { VideoDialogProvider } from '@/components/ui/VideoDialogContext';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import React from 'react';

import '@/styles.css';
import { TailwindIndicator } from '@/components/ui/breakpoint-indicator';

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
        <VideoDialogProvider>
          {children}
          <VideoDialog />
        </VideoDialogProvider>
        <TailwindIndicator />
      </body>
    </html>
  );
}
