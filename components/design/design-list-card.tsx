'use client';

import { BlurUpImage } from '@/components/shared/blur-up-image';
import { cn } from '@/lib/utils';
import { type Components, TinaMarkdown } from 'tinacms/dist/rich-text';

function formatDesignDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    const day = d.getUTCDate();
    const suffix =
      day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
    const month = d.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' });
    const year = d.getUTCFullYear();
    return `${day}${suffix} ${month} ${year}`;
  } catch {
    return iso;
  }
}

export { formatDesignDate };

const richComponents: Components<object> = {
  p: (props) => <span className='block'>{props?.children}</span>,
  break: () => <br />,
  bold: (props) => <strong className='font-semibold'>{props?.children}</strong>,
  italic: (props) => <em className='italic font-sedan'>{props?.children}</em>,
};

export interface DesignCardData {
  title: string;
  image?: string | null;
  imageAlt?: string | null;
  cardImage?: string | null;
  cardImageAlt?: string | null;
  date?: string | null;
  category?: { title: string } | null;
  description?: any;
  accentColor?: string | null;
}

interface DesignListCardProps {
  design: DesignCardData;
  onClick: () => void;
  sizes?: string;
}

export function DesignListCard({ design, onClick, sizes }: DesignListCardProps) {
  const accentBg = design.accentColor ?? '#f5f5f5';

  return (
    <article
      className={cn(
        'group cursor-pointer overflow-hidden transition-colors duration-300',
        '[background-color:var(--card-accent)] md:bg-white md:hover:[background-color:var(--card-accent)]'
      )}
      style={{ '--card-accent': accentBg } as React.CSSProperties}
      onClick={onClick}
    >
      <div className='relative aspect-[16/9] w-full overflow-hidden bg-neutral-100 mt-6'>
        {(design.cardImage ?? design.image) ? (
          <BlurUpImage
            src={(design.cardImage ?? design.image)!}
            alt={design.cardImageAlt ?? design.imageAlt ?? design.title}
            fill
            sizes={sizes ?? '(max-width: 767px) 100vw, 33vw'}
            className='object-cover'
          />
        ) : (
          <div className='absolute inset-0 bg-neutral-100' />
        )}
      </div>

      <div className='px-4 py-4 md:p-6'>
        {(design.date || design.category) && (
          <p className='font-space-grotesk text-xs uppercase leading-tight tracking-wide text-black mt-2'>
            {design.date && <span>{formatDesignDate(design.date)}</span>}
            {design.date && design.category && ' · '}
            {design.category && <strong className='font-semibold text-black'>{design.category.title}</strong>}
          </p>
        )}

        <h3 className='mt-4 font-sedan text-[20px] leading-[1.1] text-black md:text-[28px]'>{design.title}</h3>

        {design.description && (
          <div className='mt-3 border-t border-black/8 pt-3 font-sedan text-sm italic leading-tight text-black line-clamp-3 md:text-base md:line-clamp-2'>
            <TinaMarkdown content={design.description} components={richComponents} />
          </div>
        )}
      </div>
    </article>
  );
}
