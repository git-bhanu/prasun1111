"use client";

import { SectionMasthead } from "@/components/shared/section-masthead";
import { useSiteSettings } from "@/components/site-settings-provider";

function BannerContent({ label, index }: { label: string; index: string }) {
  return (
    <span className="flex shrink-0 items-center gap-2 px-6">
      <span className="font-space-grotesk text-[12px] md:text-[16px] leading-none text-white">
        Selective Access Active, only the
      </span>
      <SectionMasthead
        size="sm"
        color="white"
        borderStrength="visible"
        title={label}
        index={index}
      />
      <span className="font-space-grotesk text-[12px] md:text-[16px] leading-none text-white">
        section is functional.
      </span>
      <span className="font-space-grotesk text-[12px] md:text-[16px] leading-none text-brand-orange">
        Additional pages will open soon.
      </span>
    </span>
  );
}

export function AnnouncementBanner() {
  const { showAnnouncementBanner, primaryLinks } = useSiteSettings();

  if (!showAnnouncementBanner) return null;

  const activeLink = primaryLinks[0];
  if (!activeLink) return null;

  return (
    <div className="w-full bg-brand-blue py-1.5">
      {/* mobile: marquee */}
      <div className="overflow-hidden md:hidden">
        <div className="flex w-max animate-marquee items-center">
          <BannerContent label={activeLink.label} index={activeLink.index} />
          <BannerContent label={activeLink.label} index={activeLink.index} />
        </div>
      </div>
      {/* desktop: centered static */}
      <div className="hidden items-center justify-center gap-2 md:flex">
        <BannerContent label={activeLink.label} index={activeLink.index} />
      </div>
    </div>
  );
}
