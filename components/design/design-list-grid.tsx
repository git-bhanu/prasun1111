'use client';

import { SectionReveal } from '@/components/shared/section-reveal';
import { type DesignCardData, DesignListCard } from './design-list-card';

export interface DesignListItem {
  id: string;
  slug?: string | null;
  _sys: { filename: string };
  data: DesignCardData;
}

interface DesignListGridProps {
  items: DesignListItem[];
  onItemClick: (slug: string) => void;
}

function itemSlug(item: DesignListItem) {
  return (item.slug ?? item._sys.filename).toLowerCase();
}

export function DesignListGrid({ items, onItemClick }: DesignListGridProps) {
  if (items.length === 0) return null;

  return (
    <SectionReveal>
      <div className='grid grid-cols-1 gap-y-[30px] px-4 pb-16 sm:px-10 md:grid-cols-3 md:gap-x-[40px] md:gap-y-[70px] md:px-[58px] md:pb-24'>
        {items.map((item) => (
          <DesignListCard key={item.id} design={item.data} onClick={() => onItemClick(itemSlug(item))} sizes='(max-width: 767px) 100vw, 33vw' />
        ))}
      </div>
    </SectionReveal>
  );
}
