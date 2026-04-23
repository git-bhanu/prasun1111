"use client";

import { spaceGrotesk } from "@/app/fonts";
import animationData from "@/public/uploads/assets/1111.json";
import Lottie from "lottie-react";
import { Menu, X } from "lucide-react";
import * as motion from "motion/react-client";
import Image from "next/image";
import { useState } from "react";
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
  return (
    <header className="px-8 py-9 sm:px-10 md:px-[58px] md:py-9">
      <div
        className={
          spaceGrotesk.className +
          " grid grid-cols-[1fr_auto_1fr] items-center gap-x-6"
        }
      >
        <div className="flex min-w-0 items-center gap-x-10 lg:gap-x-14">
          {primaryLinks.slice(0, 2).map((link) => (
            <MenuLink key={link.label} {...link} />
          ))}
        </div>

        <CenterMenu />

        <div className="flex min-w-0 items-center justify-end gap-x-10 lg:gap-x-14">
          {primaryLinks.slice(2).map((link) => (
            <MenuLink key={link.label} {...link} />
          ))}
        </div>
      </div>
    </header>
  );
}

function CenterMenu() {
  const [menuExpanded, setMenuExpanded] = useState(false);
  return (
    <motion.div
      className="shrink-0"
      initial={{ opacity: 0, y: -5, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
    >
      <div className="flex items-center justify-between rounded-[12px] bg-surface-grey px-5 py-3 md:h-20 md:w-[354px]">
        <div
          role="img"
          aria-label="Prasun 1111 logo animation"
          className="h-[50px] shrink-0 flex"
        >
          <Image
            src="/uploads/11-logo.svg"
            width={80}
            height={30}
            priority
            alt="Prasun 1111 Logo"
          />
          <Lottie
            animationData={animationData}
            autoplay
            loop
            className="h-full w-full"
          />
        </div>
        <button
          type="button"
          aria-label={menuExpanded ? "Close menu" : "Open menu"}
          onClick={() => setMenuExpanded((current) => !current)}
          className={
            menuExpanded
              ? "flex size-[38px] items-center justify-center rounded-full bg-header-button-active text-brand-white transition-colors"
              : "flex size-[38px] items-center justify-center rounded-full bg-brand-white text-brand-black transition-colors"
          }
        >
          {menuExpanded ? (
            <X className="size-4" strokeWidth={2} />
          ) : (
            <Menu className="size-4" strokeWidth={2} />
          )}
        </button>
      </div>
    </motion.div>
  );
}
