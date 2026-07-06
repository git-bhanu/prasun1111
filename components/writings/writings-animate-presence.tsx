'use client';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function WritingsAnimatePresence({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        key={pathname}
        style={{ display: 'contents' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
