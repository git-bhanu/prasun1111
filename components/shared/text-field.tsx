'use client';

import { cn } from '@/lib/utils';

export interface TextFieldProps {
  as?: 'input' | 'textarea';
  type?: 'text' | 'email';
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  required?: boolean;
  error?: string | null;
}

export function TextField({ as = 'input', type = 'text', label, name, value, onChange, maxLength, required = false, error }: TextFieldProps) {
  const fieldClassName = cn(
    'w-full rounded-[8px] border border-black/15 bg-white px-4 py-3 font-space-grotesk text-[14px] text-black outline-none transition-colors focus:border-black',
    error && 'border-brand-orange'
  );

  return (
    <label className='flex flex-col gap-2' htmlFor={name}>
      <span className='font-space-grotesk text-[11px] uppercase tracking-[0.08em] text-black/60'>{label}</span>
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
      {error ? <span className='text-[12px] text-brand-orange'>{error}</span> : null}
    </label>
  );
}
