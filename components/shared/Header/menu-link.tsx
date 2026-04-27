'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { tinaField } from 'tinacms/dist/react';

import type { SiteNavigationLink } from '@/lib/site-settings';
import { cn } from '@/lib/utils';

type MenuLinkProps = {
  index: string;
  label: string;
  href: string;
  source?: SiteNavigationLink['source'];
};

export function MenuLink({ index, label, href, source }: MenuLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className='font-space-grotesk group flex items-start gap-1 md:gap-1.5 whitespace-nowrap uppercase'
    >
      <span
        className={cn(
          'text-[9px] font-normal leading-none tracking-[-0.04em] text-black transition-all duration-100 md:text-[15px] md:pt-1',
          isActive ? 'text-brand-orange' : 'group-hover:text-brand-orange'
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
            isActive ? 'font-bold text-black' : 'font-normal text-black/12 group-hover:font-bold group-hover:text-black'
          )}
        >
          {label}
        </span>
      </span>
    </Link>
  );
}
