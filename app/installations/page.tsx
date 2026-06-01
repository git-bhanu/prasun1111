import { JsonLd } from '@/components/shared/json-ld';
import { buildMetadata } from '@/lib/seo';
import { buildCollectionPageSchema, buildCreativeWorkSchema } from '@/lib/structured-data';
import client from '@/tina/client';
import type { Metadata } from 'next';
import InstallationsClientPage from './client-page';

type Props = { searchParams: Promise<{ installation?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { installation: slug } = await searchParams;

  if (slug) {
    try {
      const connection = await client.queries.installationConnection({ first: 200 }, { fetchOptions: { next: { revalidate: 60 } } });
      const node = connection.data.installationConnection.edges?.find((e) => {
        const n = e?.node;
        return n && (n.slug ?? n._sys.filename).toLowerCase() === slug.toLowerCase();
      })?.node;

      if (node) {
        const meta = buildMetadata(node.seo, node.title);
        if (!node.seo?.ogImage && node.image) {
          meta.openGraph = { title: node.title, images: [{ url: node.image, alt: node.imageAlt ?? node.title }] };
          meta.twitter = { card: 'summary_large_image', title: node.title, images: [node.image] };
        }
        return meta;
      }
    } catch {}
  }

  try {
    const pageResult = await (client.queries as any).installationsPage({ relativePath: 'config.json' }, { fetchOptions: { next: { revalidate: 60 } } });
    return buildMetadata(pageResult.data?.installationsPage?.seo, 'Installations');
  } catch {}
  return { title: 'Installations' };
}

export default async function InstallationsPage({ searchParams }: Props) {
  const { installation: slug } = await searchParams;
  const result = await client.queries.installationConnection({ first: 100 }, { fetchOptions: { next: { revalidate: 60 } } });

  let quoteBreaks = [];
  try {
    const pageResult = await (client.queries as any).installationsPage({ relativePath: 'config.json' }, { fetchOptions: { next: { revalidate: 60 } } });
    quoteBreaks = pageResult.data?.installationsPage?.quoteBreaks ?? [];
  } catch {}

  const collectionSchema = buildCollectionPageSchema('/installations', 'Installations');

  let itemSchema = null;
  if (slug) {
    const node = result.data.installationConnection.edges?.find((e) => {
      const n = e?.node;
      return n && (n.slug ?? n._sys.filename).toLowerCase() === slug.toLowerCase();
    })?.node;
    if (node) {
      itemSchema = buildCreativeWorkSchema({
        slug: node.slug ?? node._sys.filename,
        name: node.title,
        image: node.seo?.ogImage ?? node.image,
        collection: 'installations',
        param: 'installation',
      });
    }
  }

  return (
    <>
      <JsonLd schema={collectionSchema} />
      {itemSchema && <JsonLd schema={itemSchema} />}
      <InstallationsClientPage query={result.query} data={result.data} variables={result.variables} quoteBreaks={quoteBreaks} />
    </>
  );
}
