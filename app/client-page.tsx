'use client';

import { spaceGrotesk } from '@/app/fonts';
import { PrasunLogo } from '@/components/prasun-logo';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

function getIstTime() {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());
}

export default function ClientPage() {
  const [time, setTime] = useState(() => getIstTime());
  const [menuExpanded, setMenuExpanded] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTime(getIstTime());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className='min-h-screen bg-white text-black'>
      <section className='flex min-h-screen flex-col px-8 py-9 sm:px-10 md:px-[58px] md:py-9'>
        <div className={spaceGrotesk.className + ' grid grid-cols-[1fr_auto_1fr] items-center gap-x-6'}>
          <div className='flex min-w-0 items-center gap-x-10 lg:gap-x-14'>
            {primaryLinks.slice(0, 2).map((link) => (
              <MenuLink key={link.label} {...link} />
            ))}
          </div>

          <div className='shrink-0'>
            <PrasunLogo expanded={menuExpanded} onToggle={() => setMenuExpanded((current) => !current)} />
          </div>

          <div className='flex min-w-0 items-center justify-end gap-x-10 lg:gap-x-14'>
            {primaryLinks.slice(2).map((link) => (
              <MenuLink key={link.label} {...link} />
            ))}
          </div>
        </div>

        {menuExpanded ? (
          <>
            <div
              className={
                spaceGrotesk.className +
                ' mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] font-normal uppercase tracking-[-0.03em] text-black sm:mt-20 sm:text-[24px]'
              }
            >
              <span>EST. 1991</span>
              <span className='hidden sm:inline'>|</span>
              <span>{time} (IST)</span>
            </div>

            <div className='mt-8 flex flex-col items-center gap-4 xl:hidden'>
              <div className='flex flex-wrap justify-center gap-x-8 gap-y-4'>
                {primaryLinks.slice(2).map((link) => (
                  <MenuLink key={link.label} {...link} compact />
                ))}
              </div>
            </div>

            <nav className='flex flex-1 items-center justify-center'>
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

            <div
              className={
                spaceGrotesk.className +
                ' flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pb-2 text-center text-[13px] font-normal uppercase tracking-[-0.03em] text-black sm:text-[24px]'
              }
            >
              <span>ISSUE 11.11</span>
              <span className='hidden sm:inline'>|</span>
              <span>GURUGRAM, HARYANA - 122022.</span>
            </div>
          </>
        ) : (
          <div className='flex-1' />
        )}
      </section>
    </main>
  );
}

type MenuLinkProps = {
  index: string;
  label: string;
  href: string;
  compact?: boolean;
};

function MenuLink({ index, label, href, compact = false }: MenuLinkProps) {
  return (
    <Link href={href} className={spaceGrotesk.className + ' group flex items-start gap-[10px] whitespace-nowrap uppercase'}>
      <span className='pt-[4px] text-[12px] font-normal leading-none tracking-[-0.04em] text-black md:text-[15px]'>({index})</span>
      <span
        className={
          compact
            ? 'text-[24px] font-normal leading-none tracking-[-0.04em] text-black/20 transition-colors duration-150 group-hover:text-black/55 sm:text-[32px]'
            : 'text-[22px] font-normal leading-none tracking-[-0.05em] text-black/12 transition-colors duration-150 group-hover:text-black/38 sm:text-[28px] md:text-[40px]'
        }
      >
        {label}
      </span>
    </Link>
  );
}
