'use client';

import { Icon, IconCircle } from '@/components/icons';
import { cn } from '@/lib/utils';
import animationData from '@/public/uploads/assets/1111.json';
import Lottie from 'lottie-react';
import { AnimatePresence, useReducedMotion } from 'motion/react';
import * as motion from 'motion/react-client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
  return (
    <header className='p-4 md:px-[58px] md:py-9'>
      <div className='font-s flex flex-col gap-y-4 md:flex-row md:items-center md:gap-x-6 md:gap-y-0'>
        <motion.div
          className='hidden min-w-0 flex-[1_1_0%] overflow-hidden md:block'
          initial={{ opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          <div className='flex min-w-0 items-center gap-x-10 lg:gap-x-14'>
            {primaryLinks.slice(0, 2).map((link) => (
              <MenuLink key={link.label} {...link} />
            ))}
          </div>
        </motion.div>

        <CenterMenu />

        <motion.div
          className='hidden min-w-0 flex-[1_1_0%] overflow-hidden md:block'
          initial={{ opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          <div className='flex min-w-0 items-center justify-end gap-x-10 lg:gap-x-14'>
            {primaryLinks.slice(2).map((link) => (
              <MenuLink key={link.label} {...link} />
            ))}
          </div>
        </motion.div>

        <MobilePrimaryNav />
      </div>
    </header>
  );
}

function MobilePrimaryNav() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const scrollContainerRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const scrollContainer = scrollContainerRef.current;
    const activeItem = itemRefs.current[pathname];

    if (!scrollContainer || !activeItem) {
      return;
    }

    const targetLeft = Math.max(0, activeItem.offsetLeft - scrollContainer.clientWidth / 2 + activeItem.clientWidth / 2);

    scrollContainer.scrollTo({
      left: targetLeft,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, [pathname, reduceMotion]);

  return (
    <motion.nav
      className='min-w-0 overflow-hidden md:hidden'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
      aria-label='Primary navigation'
    >
      <motion.ul
        ref={scrollContainerRef}
        layoutScroll
        className='flex snap-x snap-mandatory gap-x-8 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-3'
      >
        {primaryLinks.map((link) => (
          <motion.li
            key={link.href}
            layout
            ref={(element) => {
              itemRefs.current[link.href] = element;
            }}
            className='shrink-0 snap-center'
          >
            <MenuLink {...link} />
          </motion.li>
        ))}
      </motion.ul>
    </motion.nav>
  );
}

function CenterMenu() {
  const [menuExpanded, setMenuExpanded] = useState(false);
  return (
    <div className='w-full shrink-0 grow-0 md:w-[354px] md:max-w-[354px] md:basis-[354px]'>
      <motion.div
        className='flex w-full items-center justify-between rounded-[12px] bg-surface-grey px-5 py-3 md:h-20'
        initial={{ opacity: 0, y: 0, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      >
        <Link href={'/'} role='img' aria-label='Prasun 1111 logo animation' className='flex h-[50px] min-w-0 flex-1 items-center cursor-pointer'>
          <Image src='/uploads/11-logo.svg' width={80} height={30} priority alt='Prasun 1111 Logo' className='h-auto w-20 shrink-0' />
          <div className='h-full shrink-0 overflow-hidden w-[50px]'>
            <Lottie animationData={animationData} autoplay loop className='h-full w-full' />
          </div>
        </Link>
        <motion.button
          layout
          type='button'
          aria-label={menuExpanded ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuExpanded((current) => !current)}
          className={cn(
            'flex size-[38px] items-center justify-center rounded-full cursor-pointer',
            menuExpanded ? 'bg-brand-orange text-brand-white' : 'bg-brand-white text-brand-black'
          )}
        >
          <IconCircle size={35} className={menuExpanded ? 'bg-brand-orange' : 'bg-brand-white'}>
            <AnimatePresence mode='wait' initial={false}>
              {menuExpanded ? (
                <motion.span
                  key='close'
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className='inline-flex'
                >
                  <Icon name='pinchInZoom' size={24} color='#fff' />
                </motion.span>
              ) : (
                <motion.span
                  key='hamburger'
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className='inline-flex'
                >
                  <Icon name='hamburger' size={24} />
                </motion.span>
              )}
            </AnimatePresence>
          </IconCircle>
        </motion.button>
      </motion.div>
    </div>
  );
}
