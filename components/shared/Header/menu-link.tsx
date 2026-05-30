'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { tinaField } from 'tinacms/dist/react';

import { ANNOUNCEMENT_OVERLAY_EVENT } from '@/components/shared/announcement-overlay';
import type { SiteNavigationLink } from '@/lib/site-settings';
import { cn } from '@/lib/utils';

type MenuLinkProps = {
  index: string;
  label: string;
  href: string;
  locked: boolean;
  source?: SiteNavigationLink['source'];
};

export function MenuLink({ index, label, href, locked, source }: MenuLinkProps) {
  const pathname = usePathname();
  const isActive = pathname !== null && (pathname === href || (href !== '/' && pathname.startsWith(href + '/')));

  const handleClick = (e: React.MouseEvent) => {
    if (locked) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent(ANNOUNCEMENT_OVERLAY_EVENT));
    }
  };

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      onClick={handleClick}
      className='font-space-grotesk group flex shrink-0 items-start gap-1 whitespace-nowrap uppercase md:gap-[4.8px]'
    >
      <span
        className={cn(
          'text-[9px] font-normal leading-none tracking-[-0.04em] text-black dark:text-white transition-all duration-100 md:pt-[3.2px] md:text-[15px]',
          isActive ? 'text-brand-orange dark:text-brand-orange' : 'group-hover:text-brand-orange dark:group-hover:text-brand-orange'
        )}
      >
        ({index})
      </span>
      <span className='relative block text-[24px] leading-none tracking-[-0.05em] sm:text-[28px] md:text-[40px]'>
        <span className='invisible font-bold'>{label}</span>
        <span
          data-tina-field={source ? tinaField(source, 'label') : undefined}
          className={cn(
            'absolute inset-0 transition-all duration-100',
            isActive
              ? 'font-bold text-black dark:text-white'
              : 'font-normal text-black/12 group-hover:font-bold group-hover:text-black dark:text-white/24 dark:group-hover:text-white'
          )}
        >
          {label}
        </span>
      </span>
    </Link>
  );
}
