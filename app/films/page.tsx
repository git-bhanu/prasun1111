import { JsonLd } from '@/components/shared/json-ld';
import { buildMetadata, richTextToPlain } from '@/lib/seo';
import { buildCollectionPageSchema, buildVideoObjectSchema } from '@/lib/structured-data';
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

    const film = result.data?.filmsPage?.featuredFilm;
    const filmTitle = film ? richTextToPlain(film.title) : '';
    const filmSynopsis = film ? richTextToPlain(film.synopsis) : '';

    const collectionSchema = buildCollectionPageSchema('/films', 'Films');
    const videoSchema = film
      ? buildVideoObjectSchema({
          name: filmTitle || 'Film',
          description: filmSynopsis || undefined,
          thumbnailUrl: film.seo?.ogImage ?? film.heroImage,
          year: film.year,
          duration: film.filmDuration,
          youtubeUrl: film.youtubeUrl,
        })
      : null;

    return (
      <>
        <JsonLd schema={collectionSchema} />
        {videoSchema && <JsonLd schema={videoSchema} />}
        <FilmsClientPage
          query={result.query}
          data={result.data}
          variables={result.variables}
        />
      </>
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
