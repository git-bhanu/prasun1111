import { Menu, X } from 'lucide-react';
import Image from 'next/image';

type PrasunLogoProps = {
  expanded: boolean;
  onToggle: () => void;
};

export function PrasunLogo({ expanded, onToggle }: PrasunLogoProps) {
  return (
    <div className='flex items-center justify-between rounded-[14px] bg-[#f3f2ee] px-5 py-3 md:h-14 md:w-[354px]'>
      <Image src='/uploads/11-logo.svg' alt='Prasun 1111 logo' width={79} height={35} priority className='h-[35px] w-[79px] shrink-0' />

      <button
        type='button'
        aria-label={expanded ? 'Close menu' : 'Open menu'}
        onClick={onToggle}
        className={
          expanded
            ? 'flex size-[38px] items-center justify-center rounded-full bg-[#ff6a00] text-white transition-colors'
            : 'flex size-[38px] items-center justify-center rounded-full bg-white text-black transition-colors'
        }
      >
        {expanded ? <X className='size-4' strokeWidth={2} /> : <Menu className='size-4' strokeWidth={2} />}
      </button>
    </div>
  );
}
