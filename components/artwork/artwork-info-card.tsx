import { ArtworkTabs, ArtworkTitle } from "@/components/artwork";
import { SectionMasthead } from "@/components/shared/section-masthead";
import { cn } from "@/lib/utils";

type ArtworkInfoCardAs = "h1" | "h2" | "h3" | "p";
type ArtworkInfoCardArrow = "up" | "down";

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
  tagsTinaField?: string;
  tabClassName?: string;
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
  tagsTinaField,
  tabClassName,
  asCard = true,
  className,
}: ArtworkInfoCardProps) {
  const tagItems = tags?.map((tag) => ({
    value: tag.title,
    color: tag.color ?? 'orange',
  })) ?? [];

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
      <ArtworkTitle
        title={title}
        href={href}
        arrow={arrow}
        showArrow={showArrow}
        as={Tag}
        className={titleClassName}
        dataTinaField={titleTinaField}
      />
      {tagItems.length > 0 && (
        <div className="mt-3" data-tina-field={tagsTinaField}>
          <ArtworkTabs
            items={tagItems}
            className="bg-transparent p-0"
            listClassName="flex-row flex-wrap gap-2"
            tabClassName={cn("min-h-0 flex-none", tabClassName)}
          />
        </div>
      )}
    </>
  );

  if (asCard) {
    return (
      <div
        className={cn("mt-7 rounded-[4px] bg-surface-grey-1 p-2", className)}
      >
        {inner}
      </div>
    );
  }

  return <div className={cn(className)}>{inner}</div>;
}
