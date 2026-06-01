import type { QuoteBreak } from '@/components/artwork';
import { buildMetadata } from '@/lib/seo';
import client from '@/tina/client';
import type { Metadata } from 'next';
import ArtworksClientPage from './client-page';

type Props = { searchParams: Promise<{ artwork?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { artwork: slug } = await searchParams;

  if (slug) {
    try {
      const connection = await client.queries.artworkConnection({ first: 200 }, { fetchOptions: { next: { revalidate: 60 } } });
      const node = connection.data.artworkConnection.edges?.find((e) => {
        const n = e?.node;
        return n && (n.slug ?? n._sys.filename).toLowerCase() === slug.toLowerCase();
      })?.node;

      if (node) {
        const meta = buildMetadata(node.seo, node.title);
        if (!node.seo?.ogImage && node.coverImage) {
          meta.openGraph = { title: node.title, images: [{ url: node.coverImage, alt: node.coverImageAlt ?? node.title }] };
          meta.twitter = { card: 'summary_large_image', title: node.title, images: [node.coverImage] };
        }
        return meta;
      }
    } catch {}
  }

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

  return <ArtworksClientPage query={result.query} data={result.data} variables={result.variables} quoteBreaks={quoteBreaks} />;
}
