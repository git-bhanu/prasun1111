"use client";

import { BlurUpImage } from "@/components/shared/blur-up-image";
import { useState } from "react";
import ArrowUpIcon from "@/components/icons/arrow-up.svg";
import { ActionButton } from "@/components/shared/action-button";
import {
  SiFacebook,
  SiGmail,
  SiInstagram,
  SiLinkedin,
  SiWhatsapp,
  SiYoutube,
} from "react-icons/si";
import { tinaField } from "tinacms/dist/react";
import { type Components, TinaMarkdown } from "tinacms/dist/rich-text";

import { cn } from "@/lib/utils";
import type {
  PageBlocksContact,
  PageBlocksContactSocialLinks,
  PageBlocksContactVentures,
} from "@/tina/__generated__/types";

const headingComponents: Components<{}> = {
  p: (props) => <span className="block">{props?.children}</span>,
  break: () => <br />,
  italic: (props) => <em className="italic font-sedan">{props?.children}</em>,
};

const platformIcons = {
  gmail: { Icon: SiGmail, defaultColor: "#EA4335" },
  instagram: { Icon: SiInstagram, defaultColor: "#E1306C" },
  linkedin: { Icon: SiLinkedin, defaultColor: "#0077B5" },
  facebook: { Icon: SiFacebook, defaultColor: "#1877F2" },
  whatsapp: { Icon: SiWhatsapp, defaultColor: "#25D366" },
  youtube: { Icon: SiYoutube, defaultColor: "#FF0000" },
} as const;

type PlatformKey = keyof typeof platformIcons;

export function ContactBlock({ block }: { block: PageBlocksContact }) {
  const ventures = (block.ventures?.filter(Boolean) ??
    []) as PageBlocksContactVentures[];
  const socialLinks = (block.socialLinks?.filter(Boolean) ??
    []) as PageBlocksContactSocialLinks[];
  const [hoveredVenture, setHoveredVenture] = useState<number | null>(null);
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);

  return (
    <section className="w-full px-4 py-6 md:px-[58px] md:py-30">
      <div className="mx-auto">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8 lg:gap-16">
          <div className="flex flex-col justify-center md:w-[75%]">
            <p className=" mb-6 md:mb-12 font-space-grotesk text-[10px] md:text-[24px] uppercase ">
              CONTACT
            </p>
            {block.heading ? (
              <h1
                className="mb-6 font-sedan text-[24px] leading-none md:text-[80px]"
                data-tina-field={tinaField(block, "heading")}
              >
                <TinaMarkdown
                  content={block.heading}
                  components={headingComponents}
                />
              </h1>
            ) : null}
            {block.body ? (
              <div
                className="font-sedan mb-10 text-[16px] md:text-[36px] leading-tight"
                data-tina-field={tinaField(block, "body")}
              >
                <TinaMarkdown content={block.body} />
              </div>
            ) : null}
            <div className="flex flex-col gap-3 sm:flex-row">
              <ActionButton
                variant="solid"
                color="black"
                icon="addCall"
                label={block.reachOutLabel ?? "REACH OUT"}
                href={block.reachOutHref ?? "#"}
                target="_blank"
                dataTinaField={tinaField(block, "reachOutHref")}
              />
              <ActionButton
                variant="solid"
                color="outlined"
                icon="forwardToInbox"
                label={block.mailLabel ?? "MAIL ME"}
                href={block.mailHref ?? "#"}
                dataTinaField={tinaField(block, "mailHref")}
              />
            </div>
          </div>

          <div>
            {ventures.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {ventures.map((venture, i) => (
                  <VentureCard
                    key={i}
                    venture={venture}
                    isHovered={hoveredVenture === i}
                    onMouseEnter={() => setHoveredVenture(i)}
                    onMouseLeave={() => setHoveredVenture(null)}
                  />
                ))}
              </div>
            ) : null}
            {socialLinks.length > 0 ? (
              <div
                className={cn(
                  "grid gap-4 grid-cols-3 md:grid-cols-6",
                  ventures.length > 0 && "mt-4",
                )}
              >
                {socialLinks.map((link, i) => (
                  <SocialCell
                    key={i}
                    link={link}
                    isHovered={hoveredSocial === i}
                    onMouseEnter={() => setHoveredSocial(i)}
                    onMouseLeave={() => setHoveredSocial(null)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function VentureCard({
  venture,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: {
  venture: PageBlocksContactVentures;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const bgColor =
    isHovered && venture.hoverColor ? venture.hoverColor : "#f9f9f9";

  const content = (
    <>
      <div
        className="relative flex size-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-black md:size-[88px]"
        data-tina-field={venture.logo ? tinaField(venture, "logo") : undefined}
      >
        {venture.logo ? (
          <BlurUpImage
            src={venture.logo}
            alt={venture.title ?? ""}
            fill
            sizes="88px"
            className="object-contain p-3"
          />
        ) : null}
      </div>
      {venture.era ? (
        <p
          className="font-space-grotesk text-[10px] uppercase mt-2"
          data-tina-field={tinaField(venture, "era")}
        >
          {venture.era}
        </p>
      ) : null}
      {venture.title ? (
        <p
          className="flex items-center gap-1 font-space-grotesk text-[14px] font-bold uppercase leading-none"
          data-tina-field={tinaField(venture, "title")}
        >
          {venture.title}
          {venture.href ? (
            <ArrowUpIcon
              width={6}
              height={6}
              className="translate-y-[-0.10em]"
              aria-hidden="true"
            />
          ) : null}
        </p>
      ) : null}
      {venture.websiteLabel ? (
        <p
          className="font-space-grotesk text-[10px] underline underline-offset-2"
          data-tina-field={tinaField(venture, "websiteLabel")}
        >
          {venture.websiteLabel}
        </p>
      ) : null}
    </>
  );

  const sharedClass =
    "flex flex-col items-center justify-center gap-3 px-4 h-[284px] md:h-[480px] transition-colors duration-200 rounded-[8px]";

  if (venture.href) {
    return (
      <a
        href={venture.href}
        target="_blank"
        rel="noopener noreferrer"
        className={sharedClass}
        style={{ backgroundColor: bgColor }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        data-tina-field={tinaField(venture, "href")}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className={sharedClass}
      style={{ backgroundColor: bgColor }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {content}
    </div>
  );
}

function SocialCell({
  link,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: {
  link: PageBlocksContactSocialLinks;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const platformKey = (link.platform?.toLowerCase() ?? "") as PlatformKey;
  const iconData = platformIcons[platformKey];
  const hoverColor = link.hoverColor ?? iconData?.defaultColor ?? "#000000";
  const iconColor = isHovered ? hoverColor : "#000000";

  const icon = iconData ? (
    <iconData.Icon
      size={22}
      style={{ color: iconColor, transition: "color 0.15s ease" }}
    />
  ) : null;

  const cellClass =
    "flex items-center justify-center py-7 bg-[#f9f9f9] aspect-[1/1] rounded-[4px]";

  if (link.href) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cellClass}
        data-tina-field={tinaField(link, "href")}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label={link.platform ?? "social link"}
      >
        {icon}
      </a>
    );
  }

  return (
    <div
      className={cellClass}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {icon}
    </div>
  );
}
