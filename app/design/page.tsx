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

      if (node?.image) {
        return {
          title: node.title,
          openGraph: {
            title: node.title,
            images: [{ url: node.image, alt: node.imageAlt ?? node.title }],
          },
          twitter: {
            card: 'summary_large_image',
            title: node.title,
            images: [node.image],
          },
        };
      }
    } catch {}
  }

  return {
    title: 'Design',
  };
}

export default async function DesignPage() {
  const result = await client.queries.designConnection({ first: 100 }, { fetchOptions: { next: { revalidate: 60 } } });

  return <DesignClientPage query={result.query} data={result.data} variables={result.variables} />;
}
