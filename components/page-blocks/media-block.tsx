'use client';

import Image from 'next/image';
import { tinaField } from 'tinacms/dist/react';

import { cn } from '@/lib/utils';
import type { PageBlocksMedia } from '@/tina/__generated__/types';

export function MediaBlock({ block }: { block: PageBlocksMedia }) {
  if (!block.image) return null;

  const isFull = block.size !== 'contained';

  return (
    <div data-tina-field={tinaField(block, 'image')} className={cn('w-full overflow-hidden px-4 md:px-12', !isFull && 'mx-auto max-w-[1280px]')}>
      <Image src={block.image} alt={block.alt || ''} width={0} height={0} sizes='100vw' quality={90} className='h-auto w-full' />
    </div>
  );
}
