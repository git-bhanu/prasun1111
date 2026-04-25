import Link from 'next/link';

type MenuLinkProps = {
  index: string;
  label: string;
  href: string;
};

export function MenuLink({ index, label, href }: MenuLinkProps) {
  return (
    <Link
      href={href}
      className={`font-space-grotesk font-normal
         group flex items-start gap-[10px] whitespace-nowrap uppercase`}
    >
      <span
        className={`pt-[4px] text-[12px] font-normal leading-none tracking-[-0.04em] text-black md:text-[15px]
group-hover:text-brand-orange transition-all duration-100`}
      >
        ({index})
      </span>
      <span className='relative block text-[22px] leading-none tracking-[-0.05em] sm:text-[28px] md:text-[40px]'>
        <span className='invisible font-bold'>{label}</span>
        <span
          className={`absolute inset-0 font-normal text-black/12
transition-all duration-100 group-hover:font-bold group-hover:text-black`}
        >
          {label}
        </span>
      </span>
    </Link>
  );
}
