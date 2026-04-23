import Link from "next/link";
import { spaceGrotesk } from "@/app/fonts";

type MenuLinkProps = {
  index: string;
  label: string;
  href: string;
};

export function MenuLink({ index, label, href }: MenuLinkProps) {
  return (
    <Link
      href={href}
      className={
        spaceGrotesk.className +
        " group flex items-start gap-[10px] whitespace-nowrap uppercase"
      }
    >
      <span className="pt-[4px] text-[12px] font-normal leading-none tracking-[-0.04em] text-black md:text-[15px]">
        ({index})
      </span>
      <span className="text-[22px] font-normal leading-none tracking-[-0.05em] text-black/12 transition-colors duration-150 group-hover:text-black/38 sm:text-[28px] md:text-[40px]">
        {label}
      </span>
    </Link>
  );
}
