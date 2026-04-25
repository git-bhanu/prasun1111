import 'react';

declare module 'react' {
  interface ViewTransitionProps {
    children?: React.ReactNode;
    name?: string;
    default?: 'auto' | 'none' | string | Record<string, 'auto' | 'none' | string>;
    enter?: 'auto' | 'none' | string | Record<string, 'auto' | 'none' | string>;
    exit?: 'auto' | 'none' | string | Record<string, 'auto' | 'none' | string>;
    update?: 'auto' | 'none' | string | Record<string, 'auto' | 'none' | string>;
    share?: 'auto' | 'none' | string | Record<string, 'auto' | 'none' | string>;
  }

  const unstable_ViewTransition: (props: ViewTransitionProps) => React.ReactElement | null;
}
