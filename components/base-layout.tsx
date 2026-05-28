'use client';
import { RouteScrollTop } from '@/components/route-scroll-top';
import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header/index';
import { AnnouncementOverlay } from '@/components/shared/announcement-overlay';
import { SiteSettingsProvider } from '@/components/site-settings-provider';
import { ViewTransitionProvider } from '@/components/view-transition-provider';
import type { GlobalQuery, GlobalQueryVariables } from '@/tina/__generated__/types';
import type React from 'react';

type BaseLayoutProps = {
  children: React.ReactNode;
  siteSettingsQuery: string;
  siteSettingsData: GlobalQuery;
  siteSettingsVariables: GlobalQueryVariables;
};

export function BaseLayout({ children, siteSettingsQuery, siteSettingsData, siteSettingsVariables }: BaseLayoutProps) {
  return (
    <SiteSettingsProvider query={siteSettingsQuery} data={siteSettingsData} variables={siteSettingsVariables}>
      <div className='flex min-h-screen flex-col overflow-x-clip bg-white text-black dark:bg-neutral-950 dark:text-white'>
        <RouteScrollTop />
        <AnnouncementOverlay />
        <Header />
        <ViewTransitionProvider>
          <main className='flex-1'>{children}</main>
        </ViewTransitionProvider>
        <Footer />
      </div>
    </SiteSettingsProvider>
  );
}
