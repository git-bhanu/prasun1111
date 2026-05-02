import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

import ArrowDownIcon from "@/components/icons/arrow-down.svg";
import ArrowUpIcon from "@/components/icons/arrow-up.svg";
import { cn } from "@/lib/utils";

type ArtworkTitleArrow = "up" | "down";
type ArtworkTitleAs = "h1" | "h2" | "h3" | "p";

export interface ArtworkTitleProps {
  title: string;
  href?: string | null;
  arrow?: ArtworkTitleArrow;
  showArrow?: boolean;
  as?: ArtworkTitleAs;
  className?: string;
  dataTinaField?: string;
}

const arrowIcons = {
  up: ArrowUpIcon,
  down: ArrowDownIcon,
} satisfies Record<ArtworkTitleArrow, ComponentType<SVGProps<SVGSVGElement>>>;

export function ArtworkTitle({
  title,
  href,
  arrow = "up",
  showArrow,
  as: Tag = "h2",
  className,
  dataTinaField,
}: ArtworkTitleProps) {
  const ArrowIcon = arrowIcons[arrow];
  const shouldShowArrow = showArrow ?? Boolean(href);
  const titleClassName = cn(
    "inline-block font-space-grotesk font-bold uppercase text-black",
    className,
  );
  const content = (
    <span>
      {title}
      {shouldShowArrow ? (
        <ArrowIcon
          className="ml-1 inline h-2.5 w-2.5 translate-y-[-0.30em] fill-current"
          aria-hidden="true"
        />
      ) : null}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        data-tina-field={dataTinaField}
        className={titleClassName}
      >
        {content}
      </Link>
    );
  }

  return (
    <Tag data-tina-field={dataTinaField} className={titleClassName}>
      {content}
    </Tag>
  );
}
