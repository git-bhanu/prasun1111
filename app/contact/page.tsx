import { buildMetadata } from '@/lib/seo';
import client from '@/tina/client';
import type { Metadata } from 'next';
import ContactClientPage from './client-page';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const result = await client.queries.page(
      { relativePath: 'contact.mdx' },
      { fetchOptions: { next: { revalidate: 60 } } },
    );
    return buildMetadata(result.data.page.seo, 'Contact');
  } catch {
    return { title: 'Contact' };
  }
}

export default async function ContactPage() {
  const result = await client.queries.page(
    { relativePath: 'contact.mdx' },
    { fetchOptions: { next: { revalidate: 60 } } },
  );

  return <ContactClientPage query={result.query} data={result.data} variables={result.variables} />;
}
