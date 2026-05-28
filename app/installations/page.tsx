import client from '@/tina/client';
import type { Metadata } from 'next';
import InstallationsClientPage from './client-page';

export const metadata: Metadata = {
  title: 'Installations',
};

export default async function InstallationsPage() {
  const result = await client.queries.installationConnection({ first: 100 }, { fetchOptions: { next: { revalidate: 60 } } });

  let quoteBreaks = [];
  try {
    const pageResult = await (client.queries as any).installationsPage({ relativePath: 'config.json' }, { fetchOptions: { next: { revalidate: 60 } } });
    quoteBreaks = pageResult.data?.installationsPage?.quoteBreaks ?? [];
  } catch {}

  return <InstallationsClientPage query={result.query} data={result.data} variables={result.variables} quoteBreaks={quoteBreaks} />;
}
