"use client";

import animationData from "@/public/uploads/assets/1111.json";
import Lottie from "lottie-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const primaryLinks = [
  { index: "01", label: "ARTWORKS", href: "/artworks" },
  { index: "02", label: "INSTALLATIONS", href: "/installations" },
  { index: "03", label: "FILMS", href: "/films" },
  { index: "04", label: "DESIGN", href: "/design" },
  { index: "05", label: "WRITINGS", href: "/writings" },
  { index: "06", label: "SHOP", href: "/shop" },
  { index: "07", label: "CART", href: "/cart" },
  { index: "08", label: "ABOUT", href: "/about" },
  { index: "09", label: "CONTACT", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="mt-12 bg-surface-grey text-black md:mt-20">
      <div className="px-4 py-8 md:px-[58px] md:py-14">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-start xl:justify-between xl:gap-12">
          <div className="min-w-0 flex-1">
            <FooterWordmark />
          </div>

          <div className="flex w-full shrink-0 flex-col gap-6 xl:w-[25%] md:px-16">
            <FooterMeta />
            <FooterNav />
            <FooterIssue />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterWordmark() {
  return (
    <Link href="/" aria-label="Prasun 1111 home" className="block w-full">
      <div className="grid aspect-[114/30] w-full grid-cols-[80fr_34fr] items-stretch gap-[10px] overflow-hidden">
        <div className="relative min-w-0">
          <Image
            src="/uploads/11-logo.svg"
            alt="Prasun logo"
            fill
            priority
            className="object-fill object-left-bottom"
          />
        </div>

        <div className="relative min-w-0 overflow-hidden">
          <Lottie
            animationData={animationData}
            autoplay
            loop
            rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
            className="absolute left-1/2 top-1/2 h-[172%] w-[172%] -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </div>
    </Link>
  );
}

function FooterMeta() {
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
    <div className="flex items-center gap-x-3 text-[10px] uppercase tracking-[-0.04em] md:justify-start md:text-[11px]">
      <span>EST. 1991</span>
      <span className="text-black/50">|</span>
      <span>{timeLabel}</span>
    </div>
  );
}

function FooterNav() {
  return (
    <nav aria-label="Footer navigation">
      <ul className="flex flex-col gap-4">
        {primaryLinks.map((link) => (
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
}: {
  index: string;
  label: string;
  href: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className="group flex items-start gap-4 uppercase font-space-grotesk"
    >
      <span className="pt-1 text-[9px] leading-none tracking-[-0.04em] text-black">
        {index}
      </span>
      <span
        className={cn(
          "text-sm leading-none tracking-[-0.05em] transition-opacity duration-150 md:text-sm",
          isActive
            ? "font-bold text-black"
            : "text-black group-hover:opacity-60",
        )}
      >
        {label}
      </span>
    </Link>
  );
}

function FooterIssue() {
  return (
    <div className="text-[10px] uppercase tracking-[-0.04em] md:text-[11px]">
      <div className="flex items-center gap-x-3 md:justify-start">
        <span>ISSUE 11.11</span>
        <span className="text-black/50">|</span>
        <span>GURUGRAM, HARYANA - 122022.</span>
      </div>
    </div>
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
