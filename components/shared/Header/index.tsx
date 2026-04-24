"use client";

import { spaceGrotesk } from "@/app/fonts";
import { Icon, IconCircle } from "@/components/icons";
import animationData from "@/public/uploads/assets/1111.json";
import Lottie from "lottie-react";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "motion/react";
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
      <div className={spaceGrotesk.className + " flex items-center gap-x-6"}>
        <div className="min-w-0 flex-[1_1_0%] overflow-hidden">
          <div className="flex min-w-0 items-center gap-x-10 lg:gap-x-14">
            {primaryLinks.slice(0, 2).map((link) => (
              <MenuLink key={link.label} {...link} />
            ))}
          </div>
        </div>

        <CenterMenu />

        <div className="min-w-0 flex-[1_1_0%] overflow-hidden">
          <div className="flex min-w-0 items-center justify-end gap-x-10 lg:gap-x-14">
            {primaryLinks.slice(2).map((link) => (
              <MenuLink key={link.label} {...link} />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function CenterMenu() {
  const [menuExpanded, setMenuExpanded] = useState(false);
  return (
    <div
      className="shrink-0 grow-0"
      style={{ flexBasis: 354, width: 354, maxWidth: 354 }}
    >
      <motion.div
        className="flex w-full items-center justify-between rounded-[12px] bg-surface-grey px-5 py-3 md:h-20"
        initial={{ opacity: 0, y: -5, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      >
        <div
          role="img"
          aria-label="Prasun 1111 logo animation"
          className="flex h-[50px] min-w-0 flex-1 items-center"
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
        </div>
        <motion.button
          layout
          type="button"
          aria-label={menuExpanded ? "Close menu" : "Open menu"}
          onClick={() => setMenuExpanded((current) => !current)}
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
