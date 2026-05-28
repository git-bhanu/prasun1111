import client from '@/tina/client';
import ClientPage from './client-page';

export default async function Home() {
  let result;
  try {
    result = await client.queries.page(
      { relativePath: 'home.mdx' },
      {
        fetchOptions: {
          next: {
            revalidate: 60,
          },
        },
      }
    );
  } catch (err) {
    console.error('[Home] Failed to fetch page data — likely a broken content reference:', err);
    return (
      <div className='flex min-h-screen items-center justify-center p-8 font-space-grotesk text-sm text-black/50'>
        Page content temporarily unavailable.
      </div>
    );
  }

  return <ClientPage query={result.query} data={result.data} variables={result.variables} />;
}
