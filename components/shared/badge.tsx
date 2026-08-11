import { cn } from '@/lib/utils';

export interface BadgeProps {
  variant: 'author' | 'pending';
  label: string;
}

const badgeStyles: Record<BadgeProps['variant'], string> = {
  author: 'bg-brand-blue text-white',
  pending: 'bg-brand-orange text-white',
};

export function Badge({ variant, label }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 font-space-grotesk text-[10px] uppercase tracking-[0.08em]', badgeStyles[variant])}>
      {label}
    </span>
  );
}
