'use client';

import * as motion from 'motion/react-client';
import Link from 'next/link';

import { Icon, type IconName } from '@/components/icons';
import { cn } from '@/lib/utils';

type ActionButtonColor = 'black' | 'orange' | 'white';

const buttonHover = {
  y: -1,
  scale: 1.01,
  boxShadow: '0 18px 40px rgba(0, 0, 0, 0.18)',
};

const buttonTap = {
  y: 0,
  scale: 0.99,
};

const buttonTransition = {
  type: 'spring',
  stiffness: 420,
  damping: 28,
  mass: 0.7,
} as const;

export interface ActionButtonProps {
  color?: ActionButtonColor;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  label?: string | null;
  subLabel?: string | null;
  href?: string | null;
  fullWidth?: boolean;
  className?: string;
  dataTinaField?: string;
}

const colorClassNames: Record<ActionButtonColor, { button: string; icon: string }> = {
  black: {
    button: 'bg-black text-white hover:bg-black/95',
    icon: 'text-white',
  },
  orange: {
    button: 'bg-brand-orange text-white hover:bg-brand-orange/95',
    icon: 'text-white',
  },
  white: {
    button: 'bg-white text-black hover:bg-white/95',
    icon: 'text-black',
  },
};

export function ActionButton({
  color = 'black',
  icon,
  iconPosition = 'left',
  label,
  subLabel,
  href,
  fullWidth = false,
  className,
  dataTinaField,
}: ActionButtonProps) {
  if (!label) {
    return null;
  }

  const renderIcon = () => {
    if (!icon) {
      return null;
    }

    return (
      <span className={cn('inline-flex size-[15px] md:size-[18px] shrink-0 items-center justify-center', colorClassNames[color].icon)} aria-hidden='true'>
        <Icon name={icon} size={24} color='currentColor' />
      </span>
    );
  };

  const content = (
    <>
      {iconPosition === 'left' ? renderIcon() : null}
      <span>{label}</span>
      {subLabel ? (
        <span className='inline-flex items-center gap-2 text-[10px] md:text-[14px]'>
          <span className='size-1 rounded-full bg-current' aria-hidden='true' />
          {subLabel}
        </span>
      ) : null}
      {iconPosition === 'right' ? renderIcon() : null}
    </>
  );

  const buttonClassName = cn(
    'inline-flex items-center justify-center gap-3 md:gap-2 rounded-[10px] font-space-grotesk text-[14px] leading-none uppercase transition-colors md:rounded-[8px] py-[16px] px-[32px] md:text-[20px]',
    fullWidth ? 'w-full' : 'w-full md:w-auto',
    colorClassNames[color].button,
    className
  );
  const motionClassName = cn('inline-flex transform-gpu rounded-[10px] md:rounded-[8px]', fullWidth ? 'w-full' : 'w-full md:w-auto');

  if (href) {
    return (
      <motion.span className={motionClassName} whileHover={buttonHover} whileTap={buttonTap} transition={buttonTransition}>
        <Link href={href} className={buttonClassName} data-tina-field={dataTinaField}>
          {content}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.span className={buttonClassName} data-tina-field={dataTinaField} whileHover={buttonHover} whileTap={buttonTap} transition={buttonTransition}>
      {content}
    </motion.span>
  );
}
