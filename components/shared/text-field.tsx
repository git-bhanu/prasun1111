'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface TextFieldProps {
  as?: 'input' | 'textarea';
  type?: 'text' | 'email';
  label: string;
  labelRight?: ReactNode;
  name: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  required?: boolean;
  error?: string | null;
  dark?: boolean;
}

export function TextField({
  as = 'input',
  type = 'text',
  label,
  labelRight,
  name,
  value,
  onChange,
  maxLength,
  required = false,
  error,
  dark = false,
}: TextFieldProps) {
  const fieldClassName = cn(
    'w-full rounded-[8px] border-[0.5px] p-2 md:p-3 font-space-grotesk text-[16px] font-normal leading-none tracking-normal outline-none transition-colors md:text-[20px]',
    dark ? 'border-white/15 bg-white/5 text-white focus:border-white/40' : 'border-black/15 bg-white text-black focus:border-black',
    as === 'input' && 'h-[50px] md:h-[74px]',
    as === 'textarea' && 'min-h-[50px] md:min-h-[74px]',
    error && 'border-brand-orange'
  );

  return (
    <label className='flex flex-col gap-2' htmlFor={name}>
      <span className='flex items-baseline justify-between'>
        <span className='font-space-grotesk text-[12px] font-bold uppercase leading-none tracking-normal text-[#D9D9D9]'>{label}</span>
        {labelRight ? (
          <span className={cn('font-space-grotesk text-[11px] uppercase tracking-[0.08em]', dark ? 'text-white/30' : 'text-black/30')}>{labelRight}</span>
        ) : null}
      </span>
      {as === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          maxLength={maxLength}
          required={required}
          rows={4}
          onChange={(e) => onChange(e.target.value)}
          className={fieldClassName}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          maxLength={maxLength}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className={fieldClassName}
        />
      )}
      <span className='block h-[16px] text-[12px] leading-[16px] text-brand-orange'>{error ?? ''}</span>
    </label>
  );
}
