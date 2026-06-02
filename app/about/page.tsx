import { buildMetadata } from '@/lib/seo';
import client from '@/tina/client';
import type { Metadata } from 'next';
import AboutClientPage from './client-page';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const result = await client.queries.page(
      { relativePath: 'about.mdx' },
      { fetchOptions: { next: { revalidate: 60 } } },
    );
    return buildMetadata(result.data.page.seo, 'About');
  } catch {
    return { title: 'About' };
  }
}

export default async function AboutPage() {
  const result = await client.queries.page(
    { relativePath: 'about.mdx' },
    { fetchOptions: { next: { revalidate: 60 } } },
  );

  return <AboutClientPage query={result.query} data={result.data} variables={result.variables} />;
}
