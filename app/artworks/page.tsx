import client from '@/tina/client';
import ArtworksClientPage from './client-page';

export default async function ArtworksPage() {
  const result = await client.queries.artworkConnection(
    { first: 100 },
    { fetchOptions: { next: { revalidate: 60 } } },
  );

  return (
    <ArtworksClientPage
      query={result.query}
      data={result.data}
      variables={result.variables}
    />
  );
}
