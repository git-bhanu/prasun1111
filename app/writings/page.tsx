import client from '@/tina/client';
import type { Metadata } from 'next';
import WritingsClientPage from './client-page';

export const metadata: Metadata = {
  title: 'Writings',
};

export default async function WritingsPage() {
  const result = await client.queries.writingConnection({ first: 100, sort: 'date' }, { fetchOptions: { next: { revalidate: 60 } } });

  return <WritingsClientPage query={result.query} data={result.data} variables={result.variables} />;
}
