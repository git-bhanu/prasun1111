'use client';

import type { ReactNode } from 'react';
import { unstable_ViewTransition as ViewTransition } from 'react';

type ViewTransitionProviderProps = {
  children: ReactNode;
};

export function ViewTransitionProvider({ children }: ViewTransitionProviderProps) {
  return <ViewTransition default='page-transition'>{children}</ViewTransition>;
}
