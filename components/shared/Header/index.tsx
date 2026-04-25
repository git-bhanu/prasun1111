"use client";

import { Icon, IconCircle } from "@/components/icons";
import { cn } from "@/lib/utils";
import animationData from "@/public/uploads/assets/1111.json";
import Lottie from "lottie-react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as motion from "motion/react-client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MenuLink } from "./menu-link";

const primaryLinks = [
  { index: "01", label: "ARTWORKS", href: "/artworks" },
  { index: "02", label: "INSTALLATIONS", href: "/installations" },
  { index: "03", label: "FILMS", href: "/films" },
  { index: "04", label: "DESIGN", href: "/design" },
  { index: "05", label: "WRITINGS", href: "/writings" },
];

const utilityLinks = [
  { label: "SHOP", href: "/shop" },
  { label: "CART", href: "/cart" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

export default function Header() {
  const [menuExpanded, setMenuExpanded] = useState(false);

  return (
    <header className="p-4 md:px-[58px] md:py-9">
      <div className="font-s flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-4 md:flex-row md:items-center md:gap-x-6 md:gap-y-0">
          <motion.div
            className="hidden min-w-0 flex-[1_1_0%] overflow-hidden md:block"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.08,
            }}
          >
            <div className="flex min-w-0 items-center gap-x-10 lg:gap-x-14">
              {primaryLinks.slice(0, 2).map((link) => (
                <MenuLink key={link.label} {...link} />
              ))}
            </div>
          </motion.div>

          <CenterMenu
            menuExpanded={menuExpanded}
            onToggle={() => setMenuExpanded((current) => !current)}
          />

          <motion.div
            className="hidden min-w-0 flex-[1_1_0%] overflow-hidden md:block"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.08,
            }}
          >
            <div className="flex min-w-0 items-center justify-end gap-x-10 lg:gap-x-14">
              {primaryLinks.slice(2).map((link) => (
                <MenuLink key={link.label} {...link} />
              ))}
            </div>
          </motion.div>

          <MobilePrimaryNav menuExpanded={menuExpanded} />
        </div>

        <CenterMenuPanel
          menuExpanded={menuExpanded}
          onNavigate={() => setMenuExpanded(false)}
        />
      </div>
    </header>
  );
}

function MobilePrimaryNav({ menuExpanded }: { menuExpanded: boolean }) {
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

    const targetLeft = Math.max(
      0,
      activeItem.offsetLeft -
        scrollContainer.clientWidth / 2 +
        activeItem.clientWidth / 2,
    );

    scrollContainer.scrollTo({
      left: targetLeft,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [pathname, reduceMotion]);

  return (
    <motion.nav
      className={cn(
        "min-w-0 overflow-hidden md:hidden",
        menuExpanded && "hidden",
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Primary navigation"
    >
      <motion.ul
        ref={scrollContainerRef}
        layoutScroll
        className="flex snap-x snap-mandatory gap-x-8 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-3"
      >
        {primaryLinks.map((link) => (
          <motion.li
            key={link.href}
            layout
            ref={(element) => {
              itemRefs.current[link.href] = element;
            }}
            className="shrink-0 snap-center"
          >
            <MenuLink {...link} />
          </motion.li>
        ))}
      </motion.ul>
    </motion.nav>
  );
}

function CenterMenu({
  menuExpanded,
  onToggle,
}: {
  menuExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="w-full shrink-0 grow-0 md:w-[354px] md:max-w-[354px] md:basis-[354px]">
      <motion.div
        className="flex w-full items-center justify-between rounded-[12px] bg-surface-grey px-5 py-3 md:h-20"
        initial={{ opacity: 0, y: 0, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      >
        <Link
          href={"/"}
          role="img"
          aria-label="Prasun 1111 logo animation"
          className="inline-flex h-[50px] shrink-0 items-center cursor-pointer"
        >
          <Image
            src="/uploads/11-logo.svg"
            width={80}
            height={30}
            priority
            alt="Prasun 1111 Logo"
            className="h-auto w-20 shrink-0"
          />
          <div className="h-full shrink-0 overflow-hidden w-[50px]">
            <Lottie
              animationData={animationData}
              autoplay
              loop
              className="h-full w-full"
            />
          </div>
        </Link>
        <motion.button
          layout
          type="button"
          aria-label={menuExpanded ? "Close menu" : "Open menu"}
          aria-expanded={menuExpanded}
          aria-controls="center-menu-panel"
          onClick={onToggle}
          className={cn(
            "flex size-[38px] items-center justify-center rounded-full cursor-pointer",
            menuExpanded
              ? "bg-brand-orange text-brand-white"
              : "bg-brand-white text-brand-black",
          )}
        >
          <IconCircle
            size={35}
            className={menuExpanded ? "bg-brand-orange" : "bg-brand-white"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuExpanded ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-flex"
                >
                  <Icon name="pinchInZoom" size={24} color="#fff" />
                </motion.span>
              ) : (
                <motion.span
                  key="hamburger"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-flex"
                >
                  <Icon name="hamburger" size={24} />
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
  onNavigate,
}: {
  menuExpanded: boolean;
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
          id="center-menu-panel"
          key="center-menu-panel"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex min-h-[calc(100dvh-6rem)] flex-col rounded-[12px] bg-white px-5 py-6 md:min-h-[calc(100vh-9.5rem)] md:px-0 md:py-4"
        >
          <MenuMeta />

          <div className="flex flex-1 items-center justify-center">
            <nav aria-label="Expanded menu" className="w-full">
              <ul className="flex flex-col items-center gap-y-5">
                {utilityLinks.map((link) => (
                  <li key={link.href}>
                    <UtilityMenuLink
                      href={link.href}
                      label={link.label}
                      onNavigate={onNavigate}
                    />
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <MenuFooter />
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}

function MenuMeta() {
  const [timeLabel, setTimeLabel] = useState(() => formatIstTime(new Date()));

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimeLabel(formatIstTime(new Date()));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex items-center justify-center gap-x-4 text-center text-[10px] uppercase tracking-[-0.04em] text-black md:gap-x-5 md:text-[12px]">
      <span>EST. 1991</span>
      <span className="text-black/50">|</span>
      <span>{timeLabel}</span>
    </div>
  );
}

function MenuFooter() {
  return (
    <div className="mt-auto flex items-center justify-center gap-x-4 pt-8 text-center text-[10px] uppercase tracking-[-0.04em] text-black md:gap-x-5 md:pt-0 md:text-[12px]">
      <span>ISSUE 11.11</span>
      <span className="text-black/50">|</span>
      <span>GURUGRAM, HARYANA - 122022.</span>
    </div>
  );
}

function UtilityMenuLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "font-space-grotesk text-center text-[24px] uppercase leading-none tracking-[-0.05em] transition-opacity duration-150 md:text-[32px]",
        isActive ? "font-bold text-black" : "text-black hover:opacity-60",
      )}
    >
      {label}
    </Link>
  );
}

function formatIstTime(date: Date) {
  return `${new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date)} (IST)`;
}
