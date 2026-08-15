'use client';

import { Icon, IconCircle } from '@/components/icons';
import { ANNOUNCEMENT_OVERLAY_EVENT } from '@/components/shared/announcement-overlay';
import { useSiteSettings } from '@/components/site-settings-provider';
import { type SiteNavigationLink, type SiteSettings, formatSiteTime } from '@/lib/site-settings';
import { cn } from '@/lib/utils';
import animationData from '@/public/uploads/assets/1111.json';
import gsap from 'gsap';
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
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const { brand, primaryLinks, utilityLinks, meta } = useSiteSettings();

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const updateHeight = () => setHeaderHeight(el.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (menuExpanded) {
        lastScrollY.current = currentScrollY;
        return;
      }
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setHeaderHidden(true);
      } else if (currentScrollY < lastScrollY.current) {
        setHeaderHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuExpanded]);

  useEffect(() => {
    if (!menuExpanded) {
      return;
    }

    const scrollY = window.scrollY;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [menuExpanded]);

  return (
    <motion.header
      ref={headerRef}
      className='sticky top-0 z-50 bg-white p-4 md:p-0 dark:bg-black'
      animate={{ y: headerHidden && !menuExpanded ? '-100%' : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className='font-s flex flex-col gap-y-4'>
        <div className='flex flex-col gap-y-4'>
          <DesktopPrimaryNav brand={brand} links={primaryLinks} menuExpanded={menuExpanded} onToggle={() => setMenuExpanded((current) => !current)} />
          <div className='md:hidden'>
            <CenterMenu brand={brand} menuExpanded={menuExpanded} onToggle={() => setMenuExpanded((current) => !current)} />
          </div>
          <MobilePrimaryNav menuExpanded={menuExpanded} links={primaryLinks} />
        </div>

        <CenterMenuPanel topOffset={headerHeight} menuExpanded={menuExpanded} links={utilityLinks} meta={meta} onNavigate={() => setMenuExpanded(false)} />
      </div>
    </motion.header>
  );
}

function DesktopPrimaryNav({
  brand,
  links,
  menuExpanded,
  onToggle,
}: {
  brand: SiteSettings['brand'];
  links: SiteNavigationLink[];
  menuExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.nav
      className='hidden min-w-0 items-center justify-between gap-8 bg-white px-[42px] py-5 md:flex dark:bg-brand-black'
      initial={{ opacity: 0, y: -10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.08,
      }}
      aria-label='Primary navigation'
    >
      <div className='flex min-w-0 flex-1 items-center gap-x-[clamp(28px,3.8vw,64px)] overflow-hidden'>
        {links.map((link) => (
          <MenuLink key={link.label} {...link} />
        ))}
      </div>

      <div className='shrink-0'>
        <CenterMenu brand={brand} menuExpanded={menuExpanded} onToggle={onToggle} />
      </div>
    </motion.nav>
  );
}

function MobilePrimaryNav({
  menuExpanded,
  links,
}: {
  menuExpanded: boolean;
  links: SiteNavigationLink[];
}) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const scrollContainerRef = useRef<HTMLUListElement | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isResettingRef = useRef(false);
  const isTweeningRef = useRef(false);
  const setWidthRef = useRef(0);
  const count = links.length;
  const tripleLinks = [...links, ...links, ...links];

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const currentPathname = pathname;
    const id = requestAnimationFrame(() => {
      const items = el.querySelectorAll<HTMLLIElement>('li');
      if (items.length < count * 2) return;
      const sw = items[count].offsetLeft - items[0].offsetLeft;
      setWidthRef.current = sw;

      const activeIndex = links.findIndex((l) => currentPathname === l.href || (l.href !== '/' && currentPathname?.startsWith(l.href + '/')));
      const idx = count + (activeIndex >= 0 ? activeIndex : 0);
      el.scrollLeft = items[idx].offsetLeft - items[0].offsetLeft;
    });

    return () => cancelAnimationFrame(id);
    // only re-run if links count changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => {
    if (!pathname) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    const activeIndex = links.findIndex((l) => pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href + '/')));
    if (activeIndex === -1) return;

    const items = el.querySelectorAll<HTMLLIElement>('li');
    let sw = setWidthRef.current;
    if (!sw && items.length >= count * 2) {
      sw = items[count].offsetLeft - items[0].offsetLeft;
      setWidthRef.current = sw;
    }
    if (!sw) return;

    const middleItem = items[count + activeIndex];
    if (!middleItem) return;

    const containerRect = el.getBoundingClientRect();
    const itemRect = middleItem.getBoundingClientRect();
    let targetLeft = el.scrollLeft + itemRect.left - containerRect.left;
    let useNextCopy = false;

    if (targetLeft < el.scrollLeft) {
      targetLeft += sw;
      useNextCopy = true;
    }

    isTweeningRef.current = true;

    const tween = gsap.to(el, {
      scrollLeft: targetLeft,
      duration: reduceMotion ? 0 : 0.5,
      ease: 'expo.out',
      overwrite: true,
      onComplete: () => {
        isTweeningRef.current = false;
        if (useNextCopy) el.scrollLeft -= sw;
      },
    });

    return () => {
      tween.kill();
      isTweeningRef.current = false;
    };
  }, [pathname, reduceMotion, links, count]);

  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 800);

    const el = scrollContainerRef.current;
    if (!el || isResettingRef.current || isTweeningRef.current) return;
    const sw = setWidthRef.current;
    if (!sw) return;

    if (el.scrollLeft < sw) {
      isResettingRef.current = true;
      el.scrollLeft += sw;
      isResettingRef.current = false;
    } else if (el.scrollLeft >= sw * 2) {
      isResettingRef.current = true;
      el.scrollLeft -= sw;
      isResettingRef.current = false;
    }
  };

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
        onScroll={handleScroll}
        className={cn(
          'flex gap-x-8 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-3 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-[2.5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:transition-colors [&::-webkit-scrollbar-thumb]:duration-300',
          isScrolling
            ? '[&::-webkit-scrollbar-thumb]:bg-surface-grey [scrollbar-color:#e5e5e5_transparent]'
            : '[&::-webkit-scrollbar-thumb]:bg-transparent [scrollbar-color:transparent_transparent]'
        )}
      >
        {tripleLinks.map((link, i) => (
          <li key={`${link.href}-${i}`} className='shrink-0'>
            <MenuLink {...link} />
          </li>
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
    <div className='w-full shrink-0 grow-0 md:w-[300px] md:max-w-[350px] md:basis-[283.2px]'>
      <motion.div
        className='flex w-full items-center justify-between rounded-[12px] bg-surface-grey px-5 py-3 md:h-20 md:px-5 dark:bg-neutral-900'
        initial={{ opacity: 0, y: 0, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      >
        <Link href={'/'} role='img' aria-label={brand.homeAriaLabel} className='inline-flex h-[34px] shrink-0 cursor-pointer items-stretch gap-2 md:h-[35px]'>
          <Image src={brand.logo} width={80} height={34} priority alt={brand.logoAlt} className='h-full w-auto shrink-0 object-contain dark:invert' />
          <div className='aspect-[680/700] h-full shrink-0 overflow-hidden'>
            <Lottie
              animationData={animationData}
              autoplay
              loop
              rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
              className='h-full w-full brightness-0 dark:invert'
            />
          </div>
        </Link>
        <motion.button
          type='button'
          aria-label={menuExpanded ? 'Close menu' : 'Open menu'}
          aria-expanded={menuExpanded}
          aria-controls='center-menu-panel'
          onClick={onToggle}
          className={cn(
            'flex size-[38px] cursor-pointer items-center justify-center rounded-full [--header-menu-circle-size:35px] [--header-menu-icon-size:24px] md:size-[30.4px] md:[--header-menu-circle-size:40px] md:[--header-menu-icon-size:22px]',
            menuExpanded ? 'bg-brand-orange text-brand-white' : 'bg-brand-white text-brand-black'
          )}
        >
          <IconCircle size='var(--header-menu-circle-size)' className={menuExpanded ? 'bg-brand-orange' : 'bg-brand-white'}>
            <AnimatePresence mode='wait' initial={false}>
              {menuExpanded ? (
                <span key='close' className='inline-flex'>
                  <Icon name='pinchInZoom' size='var(--header-menu-icon-size)' color='#fff' />
                </span>
              ) : (
                <motion.span
                  key='hamburger'
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className='inline-flex'
                >
                  <Icon name='hamburger' size='var(--header-menu-icon-size)' />
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
  topOffset,
  menuExpanded,
  links,
  meta,
  onNavigate,
}: {
  topOffset: number;
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
          style={{ top: topOffset }}
          className='fixed inset-x-0 bottom-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-white dark:bg-black px-5 py-6 md:px-0 md:py-4'
        >
          <MenuMeta meta={meta} />

          <div className='flex flex-1 items-center justify-center'>
            <nav aria-label='Expanded menu' className='w-full'>
              <ul className='flex flex-col items-center gap-y-5'>
                {links.map((link) => (
                  <li key={link.href}>
                    <UtilityMenuLink href={link.href} label={link.label} locked={link.locked} source={link.source} onNavigate={onNavigate} />
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
  const [timeLabel, setTimeLabel] = useState('');

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
    <div className='font-space-grotesk flex items-center justify-center gap-x-4 text-center text-[10px] uppercase text-black dark:text-white md:gap-x-5 md:text-[12px]'>
      <span>{timeLabel}</span>
    </div>
  );
}

function MenuFooter({ meta }: { meta: SiteSettings['meta'] }) {
  return (
    <div className='font-space-grotesk mt-auto flex items-center justify-center gap-x-4 pt-8 text-center text-[10px] uppercase text-black dark:text-white md:gap-x-5 md:pt-0 md:text-[12px]'>
      <span>{meta.issueLabel}</span>
      <span className='text-black/50 dark:text-white/50'>|</span>
      <span>{meta.location}</span>
    </div>
  );
}

function UtilityMenuLink({
  href,
  label,
  locked,
  source,
  onNavigate,
}: {
  href: string;
  label: string;
  locked: boolean;
  source: SiteNavigationLink['source'];
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname !== null && (pathname === href || (href !== '/' && pathname.startsWith(href + '/')));

  const handleClick = (e: React.MouseEvent) => {
    if (locked) {
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
      window.dispatchEvent(new CustomEvent(ANNOUNCEMENT_OVERLAY_EVENT));
    } else {
      onNavigate();
    }
  };

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      onClick={handleClick}
      data-tina-field={tinaField(source, 'label')}
      className={cn(
        'font-space-grotesk text-center text-[24px] uppercase leading-none tracking-[-0.05em] transition-opacity duration-150 md:text-[32px]',
        isActive ? 'font-bold text-black dark:text-white' : 'text-black hover:opacity-60 dark:text-white'
      )}
    >
      {label}
    </Link>
  );
}
