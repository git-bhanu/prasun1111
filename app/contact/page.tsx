import client from '@/tina/client';
import ContactClientPage from './client-page';

export default async function ContactPage() {
  const result = await client.queries.page(
    { relativePath: 'contact.mdx' },
    {
      fetchOptions: {
        next: {
          revalidate: 60,
        },
      },
    }
  );

  return <ContactClientPage query={result.query} data={result.data} variables={result.variables} />;
}
