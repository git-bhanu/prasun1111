import { buildMetadata, richTextToPlain } from '@/lib/seo';
import client from '@/tina/client';
import type { Metadata } from 'next';
import FilmsClientPage from './client-page';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const result = await (client.queries as any).filmsPage(
      { relativePath: 'config.json' },
      { fetchOptions: { next: { revalidate: 60 } } },
    );
    const filmsPage = result.data?.filmsPage;
    if (filmsPage?.seo?.metaTitle || filmsPage?.seo?.metaDescription || filmsPage?.seo?.ogImage) {
      return buildMetadata(filmsPage.seo, 'Films');
    }
    const film = filmsPage?.featuredFilm;
    if (film) {
      const plainTitle = richTextToPlain(film.title);
      return buildMetadata(film.seo, plainTitle || 'Films');
    }
  } catch {}
  return { title: 'Films' };
}

export default async function FilmsPage() {
  try {
    const result = await (client.queries as any).filmsPage(
      { relativePath: 'config.json' },
      { fetchOptions: { next: { revalidate: 60 } } },
    );

    return (
      <FilmsClientPage
        query={result.query}
        data={result.data}
        variables={result.variables}
      />
    );
  } catch {
    return (
      <div className='flex flex-1 items-center justify-center py-24'>
        <p className='font-space-grotesk text-sm uppercase tracking-widest text-white/40'>
          No film configured.
        </p>
      </div>
    );
  }
}
