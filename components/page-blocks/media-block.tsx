'use client';

import { BlurUpImage } from '@/components/shared/blur-up-image';
import { cn } from '@/lib/utils';
import type { PageBlocksMedia } from '@/tina/__generated__/types';
import { tinaField } from 'tinacms/dist/react';

export function MediaBlock({ block }: { block: PageBlocksMedia }) {
  if (!block.image) return null;

  const isFull = block.size !== 'contained';

  return (
    <div data-tina-field={tinaField(block, 'image')} className={cn('w-full overflow-hidden px-4 md:px-12', !isFull && 'mx-auto max-w-[1280px]')}>
      <BlurUpImage src={block.image} alt={block.alt || ''} width={0} height={0} sizes='100vw' className='h-auto w-full' />
    </div>
  );
}
