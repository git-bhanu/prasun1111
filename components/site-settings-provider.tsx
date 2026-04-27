'use client';

import { type ReactNode, createContext, useContext } from 'react';
import { useTina } from 'tinacms/dist/react';

import { type SiteSettings, normalizeSiteSettings } from '@/lib/site-settings';
import type { GlobalQuery, GlobalQueryVariables } from '@/tina/__generated__/types';

type SiteSettingsProviderProps = {
  children: ReactNode;
  query: string;
  data: GlobalQuery;
  variables: GlobalQueryVariables;
};

const SiteSettingsContext = createContext<SiteSettings | null>(null);

export function SiteSettingsProvider(props: SiteSettingsProviderProps) {
  const { children, ...tinaProps } = props;
  const { data } = useTina(tinaProps);
  const settings = normalizeSiteSettings(data.global);

  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  const settings = useContext(SiteSettingsContext);

  if (!settings) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider.');
  }

  return settings;
}
