import { cn } from "@/lib/utils";

type SectionMastheadProps = {
  title: string;
  index?: string | number;
  as?: "h1" | "h2" | "h3" | "p";
  size?: "sm" | "md" | "lg";
  className?: string;
  indexClassName?: string;
  titleClassName?: string;
};

const sizeClasses = {
  sm: {
    index: "text-[8px] md:text-[10px] font-space-grotesk",
    title: "text-xs md:text-md",
  },
  md: {
    index: "text-[1.35rem] sm:text-[1.65rem]",
    title: "text-[clamp(3.25rem,8vw,6rem)]",
  },
  lg: {
    index: "text-[1.75rem] sm:text-[2rem]",
    title: "text-[clamp(3.75rem,10vw,7rem)]",
  },
} as const;

function formatIndex(index: string | number) {
  if (typeof index === "number") {
    return `(${String(index).padStart(2, "0")})`;
  }

  return index.startsWith("(") ? index : `(${index})`;
}

export function SectionMasthead({
  title,
  index,
  size = "lg",
  className,
  indexClassName,
  titleClassName,
}: SectionMastheadProps) {
  return (
    <div className={cn("flex w-full items-start gap-0.5 md:gap-1", className)}>
      {index !== undefined ? (
        <span
          className={cn(
            "font-space-grotesk font-medium leading-none text-brand-orange -mt-4",
            sizeClasses[size].index,
            indexClassName,
          )}
        >
          {formatIndex(index)}
        </span>
      ) : null}
      <span
        className={cn(
          "font-space-grotesk font-normal uppercase text-white",
          sizeClasses[size].title,
          titleClassName,
        )}
      >
        {title}
      </span>
    </div>
  );
}
