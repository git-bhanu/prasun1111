import { cn } from "@/lib/utils";

type SectionMastheadProps = {
  title: string;
  index?: string | number;
  as?: "h1" | "h2" | "h3" | "p";
  size?: "sm" | "md" | "lg";
  color?: "white" | "black";
  mobileColor?: "white" | "black";
  borderStrength?: "subtle" | "visible";
  className?: string;
  indexClassName?: string;
  titleClassName?: string;
};

const sizeClasses = {
  sm: {
    container:
      "w-fit items-center gap-2 rounded-[4px] border px-2.5 py-2 pb-1.5",
    index: "text-[8px] md:text-[10px] font-space-grotesk",
    title: "text-xs md:text-md",
  },
  md: {
    container:
      "w-fit items-center gap-2 rounded-[4px] border px-2.5 py-2 pb-1.5",
    index: "text-[14px] font-space-grotesk",
    title: "text-[24px]",
  },
  lg: {
    container: "w-full items-start gap-0.5 md:gap-1",
    index: "text-[1.75rem] sm:text-[2rem]",
    title: "text-[clamp(3.75rem,10vw,7rem)]",
  },
} as const;

const colorTokens = {
  white: {
    subtle: "border-white/5",
    visible: "border-white/25",
    mdBorder: "md:border-white/5",
    text: "text-white",
    mdText: "md:text-white",
  },
  black: {
    subtle: "border-black/5",
    visible: "border-black/25",
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
  borderStrength = "subtle",
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
        (size === "sm" || size === "md") && colorTokens[mobile][borderStrength],
        (size === "sm" || size === "md") && mobileColor && colorTokens[color].mdBorder,
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
