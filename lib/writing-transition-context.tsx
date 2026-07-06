'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';

type ContextType = {
  activeSlug: string | null;
  setActiveSlug: (slug: string | null) => void;
};

const WritingTransitionContext = createContext<ContextType>({
  activeSlug: null,
  setActiveSlug: () => {},
});

export function WritingTransitionProvider({ children }: { children: ReactNode }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  return (
    <WritingTransitionContext.Provider value={{ activeSlug, setActiveSlug }}>
      {children}
    </WritingTransitionContext.Provider>
  );
}

export function useWritingTransition() {
  return useContext(WritingTransitionContext);
}
