import type { GlobalQuery } from '@/tina/__generated__/types';

type GlobalData = GlobalQuery['global'];
type NavigationLinkSource = NonNullable<NonNullable<NonNullable<GlobalData['navigation']>['links']>[number]>;

export type NavigationGroup = 'primary' | 'utility';

export type SiteNavigationLink = {
  index: string;
  label: string;
  href: string;
  group: NavigationGroup;
  showInFooter: boolean;
  locked: boolean;
  source: NavigationLinkSource;
};

export type SiteSettings = {
  showAnnouncementBanner: boolean;
  reachOutHref: string;
  sliders: {
    autoplaySeconds: number;
  };
  brand: {
    logo: string;
    logoAlt: string;
    homeAriaLabel: string;
  };
  links: SiteNavigationLink[];
  primaryLinks: SiteNavigationLink[];
  utilityLinks: SiteNavigationLink[];
  footerLinks: SiteNavigationLink[];
  meta: {
    establishedLabel: string;
    timeZone: string;
    timeZoneSuffix: string;
    issueLabel: string;
    location: string;
  };
};

const DEFAULT_SETTINGS = {
  brand: {
    logo: '/uploads/11-logo.svg',
    logoAlt: 'Prasun 1111 Logo',
    homeAriaLabel: 'Prasun 1111 home',
  },
  meta: {
    establishedLabel: '',
    timeZone: 'UTC',
    timeZoneSuffix: 'UTC',
    issueLabel: '',
    location: '',
  },
} satisfies Pick<SiteSettings, 'brand' | 'meta'>;

export function normalizeSiteSettings(global: GlobalData): SiteSettings {
  const links = (global.navigation?.links ?? []).reduce<SiteNavigationLink[]>((items, link) => {
    if (!link?.label || !link.href || !isNavigationGroup(link.group)) {
      return items;
    }

    items.push({
      index: link.index ?? '',
      label: link.label,
      href: link.href,
      group: link.group,
      showInFooter: link.showInFooter ?? false,
      locked: (link as any).locked ?? false,
      source: link,
    });

    return items;
  }, []);

  return {
    showAnnouncementBanner: (global as any).showAnnouncementBanner ?? false,
    reachOutHref: (global as any).reachOutHref ?? '',
    sliders: {
      autoplaySeconds: (global as any).sliders?.autoplaySeconds ?? 4,
    },
    brand: {
      logo: global.brand?.logo ?? DEFAULT_SETTINGS.brand.logo,
      logoAlt: global.brand?.logoAlt ?? DEFAULT_SETTINGS.brand.logoAlt,
      homeAriaLabel: global.brand?.homeAriaLabel ?? DEFAULT_SETTINGS.brand.homeAriaLabel,
    },
    links,
    primaryLinks: links.filter((link) => link.group === 'primary'),
    utilityLinks: links.filter((link) => link.group === 'utility'),
    footerLinks: links.filter((link) => link.showInFooter),
    meta: {
      establishedLabel: global.siteMeta?.establishedLabel ?? DEFAULT_SETTINGS.meta.establishedLabel,
      timeZone: global.siteMeta?.timeZone ?? DEFAULT_SETTINGS.meta.timeZone,
      timeZoneSuffix: global.siteMeta?.timeZoneSuffix ?? DEFAULT_SETTINGS.meta.timeZoneSuffix,
      issueLabel: global.siteMeta?.issueLabel ?? DEFAULT_SETTINGS.meta.issueLabel,
      location: global.siteMeta?.location ?? DEFAULT_SETTINGS.meta.location,
    },
  };
}

export function formatSiteTime(date: Date, meta: SiteSettings['meta']) {
  try {
    const time = new Intl.DateTimeFormat('en-GB', {
      timeZone: meta.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);

    return meta.timeZoneSuffix ? `${time} (${meta.timeZoneSuffix})` : time;
  } catch {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: DEFAULT_SETTINGS.meta.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  }
}

function isNavigationGroup(group: string | null | undefined): group is NavigationGroup {
  return group === 'primary' || group === 'utility';
}
