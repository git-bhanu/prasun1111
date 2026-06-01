import { JsonLd } from '@/components/shared/json-ld';
import { buildMetadata, richTextToPlain } from '@/lib/seo';
import { buildCollectionPageSchema, buildCreativeWorkSchema } from '@/lib/structured-data';
import client from '@/tina/client';
import type { Metadata } from 'next';
import DesignClientPage from './client-page';

type Props = { searchParams: Promise<{ design?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { design: slug } = await searchParams;

  if (slug) {
    try {
      const connection = await client.queries.designConnection({ first: 200 }, { fetchOptions: { next: { revalidate: 60 } } });
      const node = connection.data.designConnection.edges?.find((e) => {
        const n = e?.node;
        return n && (n.slug ?? n._sys.filename).toLowerCase() === slug.toLowerCase();
      })?.node;

      if (node) {
        const plainTitle = richTextToPlain(node.title);
        const meta = buildMetadata(node.seo, plainTitle);
        if (!node.seo?.ogImage && node.image) {
          meta.openGraph = { title: plainTitle, images: [{ url: node.image, alt: node.imageAlt ?? plainTitle }] };
          meta.twitter = { card: 'summary_large_image', title: plainTitle, images: [node.image] };
        }
        return meta;
      }
    } catch {}
  }

  try {
    const pageResult = await (client.queries as any).designPage({ relativePath: 'config.json' }, { fetchOptions: { next: { revalidate: 60 } } });
    return buildMetadata(pageResult.data?.designPage?.seo, 'Design');
  } catch {}
  return { title: 'Design' };
}

export default async function DesignPage({ searchParams }: Props) {
  const { design: slug } = await searchParams;
  const result = await client.queries.designConnection({ first: 100 }, { fetchOptions: { next: { revalidate: 60 } } });

  const collectionSchema = buildCollectionPageSchema('/design', 'Design');

  let itemSchema = null;
  if (slug) {
    const node = result.data.designConnection.edges?.find((e) => {
      const n = e?.node;
      return n && (n.slug ?? n._sys.filename).toLowerCase() === slug.toLowerCase();
    })?.node;
    if (node) {
      itemSchema = buildCreativeWorkSchema({
        slug: node.slug ?? node._sys.filename,
        name: richTextToPlain(node.title),
        image: node.seo?.ogImage ?? node.image,
        collection: 'design',
        param: 'design',
      });
    }
  }

  return (
    <>
      <JsonLd schema={collectionSchema} />
      {itemSchema && <JsonLd schema={itemSchema} />}
      <DesignClientPage query={result.query} data={result.data} variables={result.variables} />
    </>
  );
}
