'use client';

import { Icon, IconCircle } from '@/components/icons';
import { ANNOUNCEMENT_OVERLAY_EVENT } from '@/components/shared/announcement-overlay';
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

  useEffect(() => {
    if (!menuExpanded) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [menuExpanded]);

  return (
    <header className='p-4 md:pt-4'>
      <div className='font-s flex flex-col gap-y-4'>
        <div className='flex flex-col gap-y-4'>
          <DesktopPrimaryNav brand={brand} links={primaryLinks} menuExpanded={menuExpanded} onToggle={() => setMenuExpanded((current) => !current)} />
          <div className='md:hidden'>
            <CenterMenu brand={brand} menuExpanded={menuExpanded} onToggle={() => setMenuExpanded((current) => !current)} />
          </div>
          <MobilePrimaryNav menuExpanded={menuExpanded} links={primaryLinks} />
        </div>

        <CenterMenuPanel menuExpanded={menuExpanded} links={utilityLinks} meta={meta} onNavigate={() => setMenuExpanded(false)} />
      </div>
    </header>
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
      className='hidden min-w-0 items-center justify-between gap-8 bg-white px-[42px] py-5 md:flex'
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
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 800);
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
          'flex snap-x snap-mandatory gap-x-8 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-3 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-[2.5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:transition-colors [&::-webkit-scrollbar-thumb]:duration-300',
          isScrolling
            ? '[&::-webkit-scrollbar-thumb]:bg-surface-grey [scrollbar-color:#e5e5e5_transparent]'
            : '[&::-webkit-scrollbar-thumb]:bg-transparent [scrollbar-color:transparent_transparent]'
        )}
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
    <div className='w-full shrink-0 grow-0 md:w-[300px] md:max-w-[350px] md:basis-[283.2px]'>
      <motion.div
        className='flex w-full items-center justify-between rounded-[12px] bg-surface-grey px-5 py-3 md:h-20 md:px-5'
        initial={{ opacity: 0, y: 0, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      >
        <Link href={'/'} role='img' aria-label={brand.homeAriaLabel} className='inline-flex h-[34px] shrink-0 cursor-pointer items-stretch gap-2 md:h-[35px]'>
          <Image src={brand.logo} width={80} height={34} priority alt={brand.logoAlt} className='h-full w-auto shrink-0 object-contain' />
          <div className='aspect-[680/700] h-full shrink-0 overflow-hidden'>
            <Lottie
              animationData={animationData}
              autoplay
              loop
              rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
              className='h-full w-full brightness-0'
            />
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
            'flex size-[38px] cursor-pointer items-center justify-center rounded-full [--header-menu-circle-size:35px] [--header-menu-icon-size:24px] md:size-[30.4px] md:[--header-menu-circle-size:40px] md:[--header-menu-icon-size:22px]',
            menuExpanded ? 'bg-brand-orange text-brand-white' : 'bg-brand-white text-brand-black'
          )}
        >
          <IconCircle size='var(--header-menu-circle-size)' className={menuExpanded ? 'bg-brand-orange' : 'bg-brand-white'}>
            <AnimatePresence mode='wait' initial={false}>
              {menuExpanded ? (
                <motion.span
                  key='close'
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className='inline-flex'
                >
                  <Icon name='pinchInZoom' size='var(--header-menu-icon-size)' color='#fff' />
                </motion.span>
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
  const { showAnnouncementBanner } = useSiteSettings();

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
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-white px-5 py-6 md:px-0 md:py-4',
            showAnnouncementBanner ? 'top-[144px] md:top-[178px]' : 'top-[106px] md:top-[140px]'
          )}
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
    <div className='font-space-grotesk flex items-center justify-center gap-x-4 text-center text-[10px] uppercase text-black md:gap-x-5 md:text-[12px]'>
      <span>{meta.establishedLabel}</span>
      <span className='text-black/50'>|</span>
      <span>{timeLabel}</span>
    </div>
  );
}

function MenuFooter({ meta }: { meta: SiteSettings['meta'] }) {
  return (
    <div className=' font-space-grotesk mt-auto flex items-center justify-center gap-x-4 pt-8 text-center text-[10px] uppercase text-black md:gap-x-5 md:pt-0 md:text-[12px]'>
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
  const { primaryLinks } = useSiteSettings();
  const isAccessible = href === primaryLinks[0]?.href;

  const handleClick = (e: React.MouseEvent) => {
    if (!isAccessible) {
      e.preventDefault();
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
        isActive ? 'font-bold text-black' : 'text-black hover:opacity-60'
      )}
    >
      {label}
    </Link>
  );
}
