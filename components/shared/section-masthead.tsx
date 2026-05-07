import { cn } from "@/lib/utils";

type SectionMastheadProps = {
  title: string;
  index?: string | number;
  as?: "h1" | "h2" | "h3" | "p";
  size?: "sm" | "md" | "lg";
  color?: "white" | "black";
  mobileColor?: "white" | "black";
  className?: string;
  indexClassName?: string;
  titleClassName?: string;
};

const sizeClasses = {
  sm: {
    container: "w-fit items-center gap-2 rounded-[4px] border px-2.5 py-2 pb-1.5",
    index: "text-[8px] md:text-[10px] font-space-grotesk",
    title: "text-xs md:text-md",
  },
  md: {
    container: "w-full items-start gap-0.5 md:gap-1",
    index: "text-[1.35rem] sm:text-[1.65rem]",
    title: "text-[clamp(3.25rem,8vw,6rem)]",
  },
  lg: {
    container: "w-full items-start gap-0.5 md:gap-1",
    index: "text-[1.75rem] sm:text-[2rem]",
    title: "text-[clamp(3.75rem,10vw,7rem)]",
  },
} as const;

const colorTokens = {
  white: {
    border: "border-white/5",
    mdBorder: "md:border-white/5",
    text: "text-white",
    mdText: "md:text-white",
  },
  black: {
    border: "border-black/5",
    mdBorder: "md:border-black/5",
    text: "text-black",
    mdText: "md:text-black",
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
  color = "white",
  mobileColor,
  className,
  indexClassName,
  titleClassName,
}: SectionMastheadProps) {
  const mobile = mobileColor ?? color;

  return (
    <div
      className={cn(
        "flex",
        sizeClasses[size].container,
        size === "sm" && colorTokens[mobile].border,
        size === "sm" && mobileColor && colorTokens[color].mdBorder,
        className,
      )}
    >
      {index !== undefined ? (
        <span
          className={cn(
            "font-space-grotesk font-medium leading-none text-brand-orange -mt-2 -mr-1",
            sizeClasses[size].index,
            indexClassName,
          )}
        >
          {formatIndex(index)}
        </span>
      ) : null}
      <span
        className={cn(
          "font-space-grotesk font-normal uppercase",
          colorTokens[mobile].text,
          mobileColor && colorTokens[color].mdText,
          sizeClasses[size].title,
          titleClassName,
        )}
      >
        {title}
      </span>
    </div>
  );
}
