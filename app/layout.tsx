import { fontSans, lato, nunito, robotoFlex, robotoMono, sedan, spaceGrotesk } from '@/app/fonts';
import { BaseLayout } from '@/components/base-layout';
import { FaviconAnimator } from '@/components/favicon-animator';
import { GoogleAnalytics } from '@/components/google-analytics';
import { cn } from '@/lib/utils';
import client from '@/tina/client';
import type { Metadata } from 'next';
import Script from 'next/script';
import NextTopLoader from 'nextjs-toploader';
import React from 'react';

import '@/styles.css';

export const metadata: Metadata = {
  title: {
    default: 'Prasun1111',
    template: '%s - Prasun1111',
  },
  description: 'Official website of Prasun1111 featuring artworks, installations, films, design, and writings.',
  icons: {
    icon: [{ url: '/favicon/favicon_00.png', type: 'image/png' }],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSettings = await client.queries.global(
    { relativePath: 'site.json' },
    {
      fetchOptions: {
        next: {
          revalidate: 60,
        },
      },
    }
  );

  return (
    <html
      lang='en'
      className={cn(fontSans.variable, nunito.variable, lato.variable, sedan.variable, spaceGrotesk.variable, robotoFlex.variable, robotoMono.variable)}
    >
      <head>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy='afterInteractive' />
            <Script id='google-analytics' strategy='afterInteractive'>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className='min-h-screen bg-background font-sans antialiased'>
        <NextTopLoader color='#ff6400' showSpinner={false} height={4} shadow={false} />
        <BaseLayout siteSettingsQuery={siteSettings.query} siteSettingsData={siteSettings.data} siteSettingsVariables={siteSettings.variables}>
          {children}
        </BaseLayout>
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics />}
      </body>
    </html>
  );
}
