import type { CSSProperties, ComponentType, SVGProps } from "react";

import { cn } from "@/lib/utils";

type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface SvgIconProps extends Omit<SVGProps<SVGSVGElement>, "color"> {
  icon: SvgComponent;
  size?: number | string;
  color?: CSSProperties["color"];
  label?: string;
}

export function SvgIcon({
  icon: Icon,
  size = 24,
  color = "#000",
  className,
  style,
  label,
  ...props
}: SvgIconProps) {
  return (
    <Icon
      width={size}
      height={size}
      className={cn("block shrink-0", className)}
      style={{ color, ...style }}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      {...props}
    />
  );
}
