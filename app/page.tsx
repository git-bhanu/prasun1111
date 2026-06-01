import { JsonLd } from '@/components/shared/json-ld';
import { buildMetadata } from '@/lib/seo';
import { buildHomepageGraph } from '@/lib/structured-data';
import { normalizeSiteSettings } from '@/lib/site-settings';
import client from '@/tina/client';
import type { Metadata } from 'next';
import ClientPage from './client-page';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const result = await client.queries.page(
      { relativePath: 'home.mdx' },
      { fetchOptions: { next: { revalidate: 60 } } },
    );
    return buildMetadata(result.data.page.seo, 'Prasun1111');
  } catch {
    return {};
  }
}

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

  let sameAs: string[] = [];
  try {
    const globalResult = await client.queries.global(
      { relativePath: 'site.json' },
      { fetchOptions: { next: { revalidate: 60 } } },
    );
    sameAs = normalizeSiteSettings(globalResult.data.global).sameAs;
  } catch {}

  return (
    <>
      <JsonLd schema={buildHomepageGraph(sameAs)} />
      <ClientPage query={result.query} data={result.data} variables={result.variables} />
    </>
  );
}
