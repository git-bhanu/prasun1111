'use client';

import type { PageQuery, PageQueryVariables } from '@/tina/__generated__/types';
import { useTina } from 'tinacms/dist/react';

type ClientPageProps = {
  query: string;
  variables: PageQueryVariables;
  data: PageQuery;
};

export default function ClientPage(props: ClientPageProps) {
  useTina(props);

  return null;
}
