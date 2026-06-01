import { JsonLd } from '@/components/shared/json-ld';
import { buildMetadata } from '@/lib/seo';
import { buildCollectionPageSchema } from '@/lib/structured-data';
import client from '@/tina/client';
import type { Metadata } from 'next';
import WritingsClientPage from './client-page';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const pageResult = await (client.queries as any).writingPage({ relativePath: 'config.json' }, { fetchOptions: { next: { revalidate: 60 } } });
    return buildMetadata(pageResult.data?.writingPage?.seo, 'Writings');
  } catch {}
  return { title: 'Writings' };
}

export default async function WritingsPage() {
  const result = await client.queries.writingConnection({ first: 100, sort: 'date' }, { fetchOptions: { next: { revalidate: 60 } } });

  return (
    <>
      <JsonLd schema={buildCollectionPageSchema('/writings', 'Writings')} />
      <WritingsClientPage query={result.query} data={result.data} variables={result.variables} />
    </>
  );
}
