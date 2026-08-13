'use client';

import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { useEffect, useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import { pageSlugToLabel } from '@/lib/page-slug';
import { cn } from '@/lib/utils';

export interface PageComboboxProps {
  value: string;
  onChange: (pageSlug: string) => void;
}

export function PageCombobox({ value, onChange }: PageComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [pages, setPages] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/dashboard/pages')
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => setPages(payload?.pages ?? []))
      .catch(() => setPages([]));
  }, []);

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter((slug) => pageSlugToLabel(slug).toLowerCase().includes(q) || slug.toLowerCase().includes(q));
  }, [pages, query]);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type='button'
          className='flex h-9 w-56 items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30'
        >
          <span className={cn('truncate', !value && 'text-muted-foreground')}>{value ? pageSlugToLabel(value) : 'All pages (search)'}</span>
          <ChevronDownIcon className='size-4 shrink-0 opacity-50' />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align='start'
          sideOffset={4}
          className='z-50 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95'
        >
          <div className='p-1'>
            <Input placeholder='Search pages…' value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
          </div>
          <div className='max-h-64 overflow-y-auto'>
            <button
              type='button'
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
              className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground'
            >
              <CheckIcon className={cn('size-4 shrink-0', value ? 'invisible' : '')} />
              All pages
            </button>
            {options.map((slug) => (
              <button
                key={slug}
                type='button'
                onClick={() => {
                  onChange(slug);
                  setOpen(false);
                }}
                className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground'
              >
                <CheckIcon className={cn('size-4 shrink-0', value === slug ? '' : 'invisible')} />
                <span className='truncate'>{pageSlugToLabel(slug)}</span>
              </button>
            ))}
            {options.length === 0 ? <div className='px-2 py-1.5 text-sm text-muted-foreground'>No pages found</div> : null}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
