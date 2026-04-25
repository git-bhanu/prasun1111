'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

type MenuLinkProps = {
  index: string;
  label: string;
  href: string;
};

export function MenuLink({ index, label, href }: MenuLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} aria-current={isActive ? 'page' : undefined} className='font-space-grotesk group flex items-start gap-[10px] whitespace-nowrap uppercase'>
      <span
        className={cn(
          'pt-[4px] text-[12px] font-normal leading-none tracking-[-0.04em] text-black transition-all duration-100 md:text-[15px]',
          isActive ? 'text-brand-orange' : 'group-hover:text-brand-orange'
        )}
      >
        ({index})
      </span>
      <span className='relative block text-[22px] leading-none tracking-[-0.05em] sm:text-[28px] md:text-[40px]'>
        <span className='invisible font-bold'>{label}</span>
        <span
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
