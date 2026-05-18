import { cn } from "@/lib/utils";

export type ArtworkTabColor = "orange" | "blue";

export interface ArtworkTabItem {
  value: string;
  color?: ArtworkTabColor | string;
}

export interface ArtworkTabsProps {
  items: ArtworkTabItem[];
  ariaLabel?: string;
  className?: string;
  listClassName?: string;
  tabClassName?: string;
}

const colorClassNames = {
  orange: "text-brand-orange",
  blue: "text-brand-blue",
} satisfies Record<ArtworkTabColor, string>;

export function ArtworkTabs({
  items,
  ariaLabel = "Artwork categories",
  className,
  listClassName,
  tabClassName,
}: ArtworkTabsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn("w-full bg-white", className)}>
      <ul
        aria-label={ariaLabel}
        className={cn(
          "flex flex-col flex-wrap gap-2 md:flex-row md:gap-2",
          listClassName,
        )}
      >
        {items.map((item) => {
          const isSemanticColor = item.color === 'orange' || item.color === 'blue';
          return (
            <li
              key={item.value}
              className={cn(
                "flex min-w-0 flex-1 items-center justify-center whitespace-normal break-words rounded-[4px] bg-white px-3 py-1 text-center font-space-grotesk text-[10px] uppercase",
                isSemanticColor ? colorClassNames[item.color as ArtworkTabColor] : colorClassNames['orange'],
                tabClassName,
              )}
              style={!isSemanticColor && item.color ? { color: item.color } : undefined}
            >
              {item.value}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
