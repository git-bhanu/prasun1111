import type { CSSProperties, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export interface IconCircleProps extends HTMLAttributes<HTMLSpanElement> {
  size?: number | string;
  backgroundColor?: CSSProperties['backgroundColor'];
}

export function IconCircle({ size = 48, backgroundColor, className, style, children, ...props }: IconCircleProps) {
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full', className)}
      style={{ width: size, height: size, ...(backgroundColor ? { backgroundColor } : {}), ...style }}
      {...props}
    >
      {children}
    </span>
  );
}
