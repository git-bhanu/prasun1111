'use client';

import * as motion from 'motion/react-client';
import { useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

type SectionRevealProps = {
  children: ReactNode;
};

export function SectionReveal({ children }: SectionRevealProps) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
