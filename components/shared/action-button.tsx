"use client";

import * as motion from "motion/react-client";
import Link from "next/link";

import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/lib/utils";

export type ActionButtonVariant = "solid" | "ghost";
export type ActionButtonColor = "black" | "orange" | "blue" | "white";

const buttonHover = {
  y: -1,
  scale: 1.01,
  boxShadow: "0 18px 40px rgba(0, 0, 0, 0.18)",
};

const buttonTap = {
  y: 0,
  scale: 0.99,
};

const buttonTransition = {
  type: "spring",
  stiffness: 420,
  damping: 28,
  mass: 0.7,
} as const;

const solidColors: Record<ActionButtonColor, { button: string; icon: string }> =
  {
    black: {
      button: "bg-black text-white hover:bg-black/95",
      icon: "text-white",
    },
    orange: {
      button: "bg-brand-orange text-white hover:bg-brand-orange/95",
      icon: "text-white",
    },
    blue: {
      button: "bg-brand-blue text-white hover:bg-brand-blue/95",
      icon: "text-white",
    },
    white: {
      button: "bg-white text-black hover:bg-white/95",
      icon: "text-black",
    },
  };

const ghostColors: Record<
  ActionButtonColor,
  { text: string; icon: string; circle: string }
> = {
  black: {
    text: "text-black",
    icon: "text-black",
    circle: "group-hover:bg-black group-hover:text-white",
  },
  orange: {
    text: "text-brand-orange",
    icon: "text-brand-orange",
    circle: "group-hover:bg-brand-orange group-hover:text-white",
  },
  blue: {
    text: "text-brand-blue",
    icon: "text-brand-blue",
    circle: "group-hover:bg-brand-blue group-hover:text-white",
  },
  white: {
    text: "text-white",
    icon: "text-white",
    circle: "group-hover:bg-white group-hover:text-black",
  },
};

export interface ActionButtonProps {
  variant?: ActionButtonVariant;
  color?: ActionButtonColor;
  icon?: IconName;
  iconPosition?: "left" | "right";
  label?: string | null;
  subLabel?: string | null;
  href?: string | null;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
  dataTinaField?: string;
}

export function ActionButton({
  variant = "solid",
  color = "black",
  icon,
  iconPosition = "left",
  label,
  subLabel,
  href,
  fullWidth = false,
  onClick,
  className,
  dataTinaField,
}: ActionButtonProps) {
  if (!label) return null;

  if (variant === "ghost") {
    const g = ghostColors[color];

    const renderGhostIcon = () => {
      if (!icon) return null;
      return (
        <span
          className={cn(
            "inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
            g.icon,
            g.circle,
          )}
          aria-hidden="true"
        >
          <Icon name={icon} size={16} color="currentColor" />
        </span>
      );
    };

    const ghostContent = (
      <>
        {iconPosition === "left" ? renderGhostIcon() : null}
        <span
          className={cn(
            "font-space-grotesk text-[11px] uppercase leading-none tracking-[0.18em] cursor-pointer",
            g.text,
          )}
        >
          {label}
        </span>
        {iconPosition === "right" ? renderGhostIcon() : null}
      </>
    );

    const ghostClassName = cn(
      "group inline-flex self-start items-center gap-2",
      className,
    );

    if (href) {
      return (
        <Link
          href={href}
          className={ghostClassName}
          data-tina-field={dataTinaField}
        >
          {ghostContent}
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={onClick}
        className={ghostClassName}
        data-tina-field={dataTinaField}
      >
        {ghostContent}
      </button>
    );
  }

  // --- solid variant (original behaviour) ---

  const renderIcon = () => {
    if (!icon) return null;
    return (
      <span
        className={cn(
          "inline-flex size-[15px] md:size-[18px] shrink-0 items-center justify-center",
          solidColors[color].icon,
        )}
        aria-hidden="true"
      >
        <Icon name={icon} size={24} color="currentColor" />
      </span>
    );
  };

  const content = (
    <>
      {iconPosition === "left" ? renderIcon() : null}
      <span>{label}</span>
      {subLabel ? (
        <span className="inline-flex items-center gap-2 text-[10px] md:text-[14px]">
          <span className="size-1 rounded-full bg-current" aria-hidden="true" />
          {subLabel}
        </span>
      ) : null}
      {iconPosition === "right" ? renderIcon() : null}
    </>
  );

  const solidClassName = cn(
    "inline-flex cursor-pointer items-center justify-center gap-3 md:gap-2 rounded-[10px] font-space-grotesk text-[14px] leading-none uppercase transition-colors md:rounded-[8px] py-[16px] px-[32px] md:text-[20px]",
    fullWidth ? "w-full" : "w-full md:w-auto",
    solidColors[color].button,
    className,
  );
  const motionClassName = cn(
    "inline-flex transform-gpu rounded-[10px] md:rounded-[8px]",
    fullWidth ? "w-full" : "w-full md:w-auto",
  );

  if (href) {
    return (
      <motion.span
        className={motionClassName}
        whileHover={buttonHover}
        whileTap={buttonTap}
        transition={buttonTransition}
      >
        <Link
          href={href}
          className={solidClassName}
          data-tina-field={dataTinaField}
        >
          {content}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={solidClassName}
      data-tina-field={dataTinaField}
      whileHover={buttonHover}
      whileTap={buttonTap}
      transition={buttonTransition}
    >
      {content}
    </motion.button>
  );
}
