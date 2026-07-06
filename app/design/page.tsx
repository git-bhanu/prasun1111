import { JsonLd } from '@/components/shared/json-ld';
import { buildMetadata } from '@/lib/seo';
import { buildCollectionPageSchema } from '@/lib/structured-data';
import client from '@/tina/client';
import type { Metadata } from 'next';
import DesignClientPage from './client-page';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const pageResult = await (client.queries as any).designPage({ relativePath: 'config.json' }, { fetchOptions: { next: { revalidate: 60 } } });
    return buildMetadata(pageResult.data?.designPage?.seo, 'Design');
  } catch {}
  return { title: 'Design' };
}

export default async function DesignPage() {
  const result = await client.queries.designConnection({ first: 100 }, { fetchOptions: { next: { revalidate: 60 } } });

  const collectionSchema = buildCollectionPageSchema('/design', 'Design');

  return (
    <>
      <JsonLd schema={collectionSchema} />
      <DesignClientPage query={result.query} data={result.data} variables={result.variables} />
    </>
  );
}
