'use client';

import { Icon, IconCircle } from '@/components/icons';
import { useSiteSettings } from '@/components/site-settings-provider';
import { type SiteNavigationLink, type SiteSettings, formatSiteTime } from '@/lib/site-settings';
import { cn } from '@/lib/utils';
import animationData from '@/public/uploads/assets/1111.json';
import Lottie from 'lottie-react';
import { AnimatePresence, useReducedMotion } from 'motion/react';
import * as motion from 'motion/react-client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { tinaField } from 'tinacms/dist/react';
import { MenuLink } from './menu-link';

export default function Header() {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const { brand, primaryLinks, utilityLinks, meta } = useSiteSettings();

  return (
    <header className='p-4 md:px-[58px] md:py-9'>
      <div className='font-s flex flex-col gap-y-4'>
        <div className='flex flex-col gap-y-4 md:flex-row md:items-center md:gap-x-6 md:gap-y-0'>
          <motion.div
            className='hidden min-w-0 flex-[1_1_0%] overflow-hidden md:block'
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.08,
            }}
          >
            <div className='flex min-w-0 items-center gap-x-10 lg:gap-x-14'>
              {primaryLinks.slice(0, 2).map((link) => (
                <MenuLink key={link.label} {...link} />
              ))}
            </div>
          </motion.div>

          <CenterMenu brand={brand} menuExpanded={menuExpanded} onToggle={() => setMenuExpanded((current) => !current)} />

          <motion.div
            className='hidden min-w-0 flex-[1_1_0%] overflow-hidden md:block'
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.08,
            }}
          >
            <div className='flex min-w-0 items-center justify-end gap-x-10 lg:gap-x-14'>
              {primaryLinks.slice(2).map((link) => (
                <MenuLink key={link.label} {...link} />
              ))}
            </div>
          </motion.div>

          <MobilePrimaryNav menuExpanded={menuExpanded} links={primaryLinks} />
        </div>

        <CenterMenuPanel menuExpanded={menuExpanded} links={utilityLinks} meta={meta} onNavigate={() => setMenuExpanded(false)} />
      </div>
    </header>
  );
}

function MobilePrimaryNav({ menuExpanded, links }: { menuExpanded: boolean; links: SiteNavigationLink[] }) {
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
      className={cn('min-w-0 overflow-hidden md:hidden', menuExpanded && 'hidden')}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      aria-label='Primary navigation'
    >
      <motion.ul
        ref={scrollContainerRef}
        layoutScroll
        className='flex snap-x snap-mandatory gap-x-8 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-3'
      >
        {links.map((link) => (
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

function CenterMenu({
  brand,
  menuExpanded,
  onToggle,
}: {
  brand: SiteSettings['brand'];
  menuExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className='w-full shrink-0 grow-0 md:w-[354px] md:max-w-[354px] md:basis-[354px]'>
      <motion.div
        className='flex w-full items-center justify-between rounded-[12px] bg-surface-grey px-5 py-3 md:h-20'
        initial={{ opacity: 0, y: 0, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      >
        <Link href={'/'} role='img' aria-label={brand.homeAriaLabel} className='inline-flex h-[50px] shrink-0 items-center cursor-pointer'>
          <Image src={brand.logo} width={80} height={30} priority alt={brand.logoAlt} className='h-auto w-20 shrink-0' />
          <div className='h-full shrink-0 overflow-hidden w-[50px]'>
            <Lottie animationData={animationData} autoplay loop className='h-full w-full' />
          </div>
        </Link>
        <motion.button
          layout
          type='button'
          aria-label={menuExpanded ? 'Close menu' : 'Open menu'}
          aria-expanded={menuExpanded}
          aria-controls='center-menu-panel'
          onClick={onToggle}
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

function CenterMenuPanel({
  menuExpanded,
  links,
  meta,
  onNavigate,
}: {
  menuExpanded: boolean;
  links: SiteNavigationLink[];
  meta: SiteSettings['meta'];
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    if (menuExpanded && previousPathnameRef.current !== pathname) {
      onNavigate();
    }

    previousPathnameRef.current = pathname;
  }, [menuExpanded, onNavigate, pathname]);

  return (
    <AnimatePresence initial={false}>
      {menuExpanded ? (
        <motion.section
          id='center-menu-panel'
          key='center-menu-panel'
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className='flex min-h-[calc(100dvh-6rem)] flex-col rounded-[12px] bg-white px-5 py-6 md:min-h-[calc(100vh-9.5rem)] md:px-0 md:py-4'
        >
          <MenuMeta meta={meta} />

          <div className='flex flex-1 items-center justify-center'>
            <nav aria-label='Expanded menu' className='w-full'>
              <ul className='flex flex-col items-center gap-y-5'>
                {links.map((link) => (
                  <li key={link.href}>
                    <UtilityMenuLink href={link.href} label={link.label} source={link.source} onNavigate={onNavigate} />
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <MenuFooter meta={meta} />
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}

function MenuMeta({ meta }: { meta: SiteSettings['meta'] }) {
  const [timeLabel, setTimeLabel] = useState(() => formatSiteTime(new Date(), meta));

  useEffect(() => {
    setTimeLabel(formatSiteTime(new Date(), meta));

    const intervalId = window.setInterval(() => {
      setTimeLabel(formatSiteTime(new Date(), meta));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [meta]);

  return (
    <div className='flex items-center justify-center gap-x-4 text-center text-[10px] uppercase tracking-[-0.04em] text-black md:gap-x-5 md:text-[12px]'>
      <span>{meta.establishedLabel}</span>
      <span className='text-black/50'>|</span>
      <span>{timeLabel}</span>
    </div>
  );
}

function MenuFooter({ meta }: { meta: SiteSettings['meta'] }) {
  return (
    <div className='mt-auto flex items-center justify-center gap-x-4 pt-8 text-center text-[10px] uppercase tracking-[-0.04em] text-black md:gap-x-5 md:pt-0 md:text-[12px]'>
      <span>{meta.issueLabel}</span>
      <span className='text-black/50'>|</span>
      <span>{meta.location}</span>
    </div>
  );
}

function UtilityMenuLink({
  href,
  label,
  source,
  onNavigate,
}: {
  href: string;
  label: string;
  source: SiteNavigationLink['source'];
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      onClick={onNavigate}
      data-tina-field={tinaField(source, 'label')}
      className={cn(
        'font-space-grotesk text-center text-[24px] uppercase leading-none tracking-[-0.05em] transition-opacity duration-150 md:text-[32px]',
        isActive ? 'font-bold text-black' : 'text-black hover:opacity-60'
      )}
    >
      {label}
    </Link>
  );
}
