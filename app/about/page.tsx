import client from '@/tina/client';

import AboutClientPage from './client-page';

export default async function AboutPage() {
  const result = await client.queries.page(
    { relativePath: 'about.mdx' },
    {
      fetchOptions: {
        next: {
          revalidate: 60,
        },
      },
    }
  );

  return <AboutClientPage query={result.query} data={result.data} variables={result.variables} />;
}
