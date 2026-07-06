import type { QuoteBreak } from '@/components/artwork';
import { JsonLd } from '@/components/shared/json-ld';
import { buildMetadata } from '@/lib/seo';
import { buildCollectionPageSchema } from '@/lib/structured-data';
import client from '@/tina/client';
import type { Metadata } from 'next';
import ArtworksClientPage from './client-page';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const pageResult = await (client.queries as any).artworksPage({ relativePath: 'config.json' }, { fetchOptions: { next: { revalidate: 60 } } });
    return buildMetadata(pageResult.data?.artworksPage?.seo, 'Artworks');
  } catch {}
  return { title: 'Artworks' };
}

export default async function ArtworksPage() {
  const result = await client.queries.artworkConnection({ first: 100 }, { fetchOptions: { next: { revalidate: 60 } } });

  let quoteBreaks: QuoteBreak[] = [];
  try {
    const pageResult = await (client.queries as any).artworksPage({ relativePath: 'config.json' }, { fetchOptions: { next: { revalidate: 60 } } });
    quoteBreaks = pageResult.data?.artworksPage?.quoteBreaks ?? [];
  } catch {}

  const collectionSchema = buildCollectionPageSchema('/artworks', 'Artworks');

  return (
    <>
      <JsonLd schema={collectionSchema} />
      <ArtworksClientPage query={result.query} data={result.data} variables={result.variables} quoteBreaks={quoteBreaks} />
    </>
  );
}
