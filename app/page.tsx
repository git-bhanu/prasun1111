import client from '@/tina/__generated__/client';
import ClientPage from './client-page';

export default async function Home() {
  const result = await client.queries.page(
    { relativePath: 'home.mdx' },
    {
      fetchOptions: {
        next: {
          revalidate: 60,
        },
      },
    }
  );

  return <ClientPage query={result.query} data={result.data} variables={result.variables} />;
}
