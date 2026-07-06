import { JsonLd } from '@/components/shared/json-ld';
import { buildMetadata } from '@/lib/seo';
import { buildCollectionPageSchema } from '@/lib/structured-data';
import client from '@/tina/client';
import type { Metadata } from 'next';
import InstallationsClientPage from './client-page';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const pageResult = await (client.queries as any).installationsPage({ relativePath: 'config.json' }, { fetchOptions: { next: { revalidate: 60 } } });
    return buildMetadata(pageResult.data?.installationsPage?.seo, 'Installations');
  } catch {}
  return { title: 'Installations' };
}

export default async function InstallationsPage() {
  const result = await client.queries.installationConnection({ first: 100 }, { fetchOptions: { next: { revalidate: 60 } } });

  let quoteBreaks = [];
  try {
    const pageResult = await (client.queries as any).installationsPage({ relativePath: 'config.json' }, { fetchOptions: { next: { revalidate: 60 } } });
    quoteBreaks = pageResult.data?.installationsPage?.quoteBreaks ?? [];
  } catch {}

  const collectionSchema = buildCollectionPageSchema('/installations', 'Installations');

  return (
    <>
      <JsonLd schema={collectionSchema} />
      <InstallationsClientPage query={result.query} data={result.data} variables={result.variables} quoteBreaks={quoteBreaks} />
    </>
  );
}
