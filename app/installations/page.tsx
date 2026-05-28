import client from '@/tina/client';
import type { Metadata } from 'next';
import InstallationsClientPage from './client-page';

export const metadata: Metadata = {
  title: 'Installations',
};

export default async function InstallationsPage() {
  const result = await client.queries.installationConnection({ first: 100 }, { fetchOptions: { next: { revalidate: 60 } } });

  return <InstallationsClientPage query={result.query} data={result.data} variables={result.variables} />;
}
