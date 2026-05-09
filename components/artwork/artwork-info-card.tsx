import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

import ArrowDownIcon from "@/components/icons/arrow-down.svg";
import ArrowUpIcon from "@/components/icons/arrow-up.svg";
import { SectionMasthead } from "@/components/shared/section-masthead";
import { cn } from "@/lib/utils";

type ArtworkInfoCardAs = "h1" | "h2" | "h3" | "p";
type ArtworkInfoCardArrow = "up" | "down";

const arrowIcons: Record<
  ArtworkInfoCardArrow,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  up: ArrowUpIcon,
  down: ArrowDownIcon,
};

interface Tag {
  id?: string | null;
  title: string;
  color?: string | null;
}

export interface ArtworkInfoCardProps {
  title: string;
  href?: string | null;
  as?: ArtworkInfoCardAs;
  arrow?: ArtworkInfoCardArrow;
  showArrow?: boolean;
  titleClassName?: string;
  titleTinaField?: string;
  tags?: Tag[];
  eyebrow?: string | null;
  eyebrowIndex?: string;
  eyebrowTinaField?: string;
  asCard?: boolean;
  className?: string;
}

export function ArtworkInfoCard({
  title,
  href,
  as: Tag = "h2",
  arrow = "up",
  showArrow,
  titleClassName,
  titleTinaField,
  tags,
  eyebrow,
  eyebrowIndex = "01",
  eyebrowTinaField,
  asCard = true,
  className,
}: ArtworkInfoCardProps) {
  const shouldShowArrow = showArrow ?? true;
  const ArrowIcon = arrowIcons[arrow];

  const titleContent = (
    <span>
      {title}
      {shouldShowArrow ? (
        <ArrowIcon
          className="ml-1 inline h-2.5 w-2.5 translate-y-[-0.20em] translate-x-[0.10em] fill-current"
          aria-hidden="true"
        />
      ) : null}
    </span>
  );

  const titleNode = href ? (
    <Link
      href={href}
      className={titleClassName}
      data-tina-field={titleTinaField}
    >
      {titleContent}
    </Link>
  ) : (
    <Tag className={titleClassName} data-tina-field={titleTinaField}>
      {titleContent}
    </Tag>
  );

  const inner = (
    <>
      {eyebrow && (
        <div className="mb-3" data-tina-field={eyebrowTinaField}>
          <SectionMasthead
            index={eyebrowIndex}
            title={eyebrow}
            size="sm"
            color="black"
          />
        </div>
      )}
      {titleNode}
      {tags && tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={tag.id ?? i}
              style={{ color: tag.color ?? "currentColor" }}
              className="rounded-[4px] bg-white px-3 py-1 font-space-grotesk text-[10px] font-medium uppercase"
            >
              {tag.title}
            </span>
          ))}
        </div>
      )}
    </>
  );

  if (asCard) {
    return (
      <div
        className={cn(
          "rounded-[8px] bg-[var(--surface-grey-1)] p-4",
          className,
        )}
      >
        {inner}
      </div>
    );
  }

  return <div className={cn(className)}>{inner}</div>;
}
