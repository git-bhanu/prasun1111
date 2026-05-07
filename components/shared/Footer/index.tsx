'use client';

import { useSiteSettings } from '@/components/site-settings-provider';
import { type SiteNavigationLink, type SiteSettings, formatSiteTime } from '@/lib/site-settings';
import animationData from '@/public/uploads/assets/1111.json';
import Lottie from 'lottie-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { tinaField } from 'tinacms/dist/react';

import { cn } from '@/lib/utils';

export default function Footer() {
  const { brand, footerLinks, meta } = useSiteSettings();

  return (
    <footer className='bg-surface-grey text-black'>
      <div className='px-4 py-8 md:px-[58px] md:py-14'>
        <div className='flex flex-col gap-10 xl:flex-row xl:items-start xl:justify-between xl:gap-12'>
          <div className='min-w-0 flex-1'>
            <FooterWordmark brand={brand} />
          </div>

          <div className='flex w-full shrink-0 flex-col gap-6 xl:w-[25%] md:px-16'>
            <FooterMeta meta={meta} />
            <FooterNav links={footerLinks} />
            <FooterIssue meta={meta} />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterWordmark({ brand }: { brand: SiteSettings['brand'] }) {
  return (
    <Link href='/' aria-label={brand.homeAriaLabel} className='block w-full'>
      <div className='flex aspect-[2327/700] w-full items-stretch gap-[20px] overflow-hidden'>
        <div className='flex w-[calc(70.78%_-_10px)] shrink-0 items-stretch'>
          <Image src={brand.logo} alt={brand.logoAlt} width={80} height={34} priority className='h-full w-auto object-contain' />
        </div>

        <div className='h-full w-[calc(29.22%_-_10px)] shrink-0 overflow-hidden'>
          <Lottie
            animationData={animationData}
            autoplay
            loop
            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
            className='h-full w-full brightness-0'
          />
        </div>
      </div>
    </Link>
  );
}

function FooterMeta({ meta }: { meta: SiteSettings['meta'] }) {
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
    <div className='font-space-grotesk flex items-center gap-x-3 text-[10px] uppercase tracking-[-0.04em] md:justify-start md:text-[11px]'>
      <span>{meta.establishedLabel}</span>
      <span className='text-black/50'>|</span>
      <span>{timeLabel}</span>
    </div>
  );
}

function FooterNav({ links }: { links: SiteNavigationLink[] }) {
  return (
    <nav aria-label='Footer navigation'>
      <ul className='flex flex-col gap-4'>
        {links.map((link) => (
          <li key={link.href}>
            <FooterNavLink {...link} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FooterNavLink({
  index,
  label,
  href,
  source,
}: {
  index: string;
  label: string;
  href: string;
  source: SiteNavigationLink['source'];
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      data-tina-field={tinaField(source, 'label')}
      className='group flex items-start gap-4 uppercase font-space-grotesk'
    >
      <span className='pt-1 text-[9px] leading-none tracking-[-0.04em] text-black'>{index}</span>
      <span
        className={cn(
          'text-sm leading-none tracking-[-0.05em] transition-opacity duration-150 md:text-sm',
          isActive ? 'font-bold text-black' : 'text-black group-hover:opacity-60'
        )}
      >
        {label}
      </span>
    </Link>
  );
}

function FooterIssue({ meta }: { meta: SiteSettings['meta'] }) {
  return (
    <div className='text-[10px] uppercase md:text-[11px] font-space-grotesk'>
      <div className='flex items-center gap-x-3 md:justify-start'>
        <span>{meta.issueLabel}</span>
        <span className='text-black/50'>|</span>
        <span>{meta.location}</span>
      </div>
    </div>
  );
}
