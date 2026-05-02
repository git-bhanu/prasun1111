import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const iconCircleClassName = 'inline-flex shrink-0 items-center justify-center rounded-full';
const iconCircleButtonClassName =
  'inline-flex h-12 w-12 md:h-16 md:w-16 cursor-pointer items-center justify-center rounded-full bg-neutral-100 text-black transition hover:scale-105 hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:h-11 md:w-11 md:bg-white md:shadow-[0_16px_45px_rgba(0,0,0,0.22)] md:focus-visible:outline-white';

export interface IconCircleProps extends HTMLAttributes<HTMLSpanElement> {
  size?: number | string;
  backgroundColor?: CSSProperties['backgroundColor'];
}

export interface IconCircleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function IconCircle({ size = 48, backgroundColor, className, style, children, ...props }: IconCircleProps) {
  return (
    <span
      className={cn(iconCircleClassName, className)}
      style={{ width: size, height: size, ...(backgroundColor ? { backgroundColor } : {}), ...style }}
      {...props}
    >
      {children}
    </span>
  );
}

export function IconCircleButton({ className, type = 'button', children, ...props }: IconCircleButtonProps) {
  return (
    <button type={type} className={cn(iconCircleButtonClassName, className)} {...props}>
      {children}
    </button>
  );
}
