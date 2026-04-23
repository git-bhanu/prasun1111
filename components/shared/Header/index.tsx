'use client';

import { spaceGrotesk } from '@/app/fonts';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { MenuLink } from './menu-link';

const primaryLinks = [
  { index: '01', label: 'ARTWORKS', href: '/artworks' },
  { index: '02', label: 'INSTALLATIONS', href: '/installations' },
  { index: '03', label: 'FILMS', href: '/films' },
  { index: '04', label: 'DESIGN', href: '/design' },
  { index: '05', label: 'WRITINGS', href: '/writings' },
];

const utilityLinks = [
  { label: 'SHOP', href: '/shop' },
  { label: 'CART', href: '/cart' },
  { label: 'ABOUT', href: '/about' },
  { label: 'CONTACT', href: '/contact' },
];

export default function Header() {
  const [menuExpanded, setMenuExpanded] = useState(false);
  return (
    <header className='px-8 py-9 sm:px-10 md:px-[58px] md:py-9'>
      <div className={spaceGrotesk.className + ' grid grid-cols-[1fr_auto_1fr] items-center gap-x-6'}>
        <div className='flex min-w-0 items-center gap-x-10 lg:gap-x-14'>
          {primaryLinks.slice(0, 2).map((link) => (
            <MenuLink key={link.label} {...link} />
          ))}
        </div>

        <div className='shrink-0'>
          <div className='flex items-center justify-between rounded-[14px] bg-[#f3f2ee] px-5 py-3 md:h-14 md:w-[354px]'>
            <Image src='/uploads/11-logo.svg' alt='Prasun 1111 logo' width={79} height={35} priority className='h-[35px] w-[79px] shrink-0' />
            <button
              type='button'
              aria-label={menuExpanded ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuExpanded((current) => !current)}
              className={
                menuExpanded
                  ? 'flex size-[38px] items-center justify-center rounded-full bg-[#ff6a00] text-white transition-colors'
                  : 'flex size-[38px] items-center justify-center rounded-full bg-white text-black transition-colors'
              }
            >
              {menuExpanded ? <X className='size-4' strokeWidth={2} /> : <Menu className='size-4' strokeWidth={2} />}
            </button>
          </div>
        </div>

        <div className='flex min-w-0 items-center justify-end gap-x-10 lg:gap-x-14'>
          {primaryLinks.slice(2).map((link) => (
            <MenuLink key={link.label} {...link} />
          ))}
        </div>
      </div>

      {menuExpanded ? (
        <nav className='pt-10'>
          <ul
            className={
              spaceGrotesk.className +
              ' flex flex-col items-center gap-4 text-center text-[24px] font-normal uppercase leading-none tracking-[-0.04em] sm:text-[30px] md:gap-5 md:text-[42px]'
            }
          >
            {utilityLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className='transition-opacity duration-150 hover:opacity-55'>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
