'use client';

import { BlurUpImage } from '@/components/shared/blur-up-image';
import { tinaField } from 'tinacms/dist/react';

import { ActionButton } from '@/components/shared/action-button';
import { ANNOUNCEMENT_OVERLAY_EVENT } from '@/components/shared/announcement-overlay';
import { SectionMasthead } from '@/components/shared/section-masthead';
import { cn } from '@/lib/utils';
import type { PageBlocksMovieList } from '@/tina/__generated__/types';

type MovieListBlockProps = {
  block: PageBlocksMovieList;
};

type MovieListItem = NonNullable<NonNullable<PageBlocksMovieList['movies']>[number]>;

export function MovieListBlock({ block }: MovieListBlockProps) {
  const movies = block.movies?.filter((movie): movie is MovieListItem => Boolean(movie?.title && movie.desktopImage)) ?? [];

  if (movies.length === 0) {
    return null;
  }

  return (
    <section className='bg-white px-4 py-8 md:px-8 md:py-11'>
      <div className='flex w-full flex-col gap-8 md:gap-10'>
        {movies.map((movie, index) => (
          <MovieCard key={`${movie.title}-${index}`} movie={movie} priority={index === 0} />
        ))}
      </div>
    </section>
  );
}

function MovieCard({ movie, priority }: { movie: MovieListItem; priority: boolean }) {
  const eyebrowIndex = movie.eyebrowIndex || '03';
  const desktopImageAlt = movie.desktopImageAlt || movie.title;
  const mobileImage = movie.mobileImage || movie.desktopImage;
  const mobileImageAlt = movie.mobileImageAlt || movie.desktopImageAlt || movie.title;

  return (
    <article>
      <div className='mx-auto md:hidden'>
        {movie.eyebrow ? (
          <div data-tina-field={tinaField(movie, 'eyebrow')}>
            <SectionMasthead
              index={eyebrowIndex}
              title={movie.eyebrow}
              size='sm'
              mobileColor='black'
            />
          </div>
        ) : null}

        <MovieTitle movie={movie} className='mt-5 text-black' />

        <div
          className='relative mt-8 aspect-video overflow-hidden bg-neutral-100'
          data-tina-field={tinaField(movie, movie.mobileImage ? 'mobileImage' : 'desktopImage')}
        >
          <BlurUpImage src={mobileImage} alt={mobileImageAlt} fill sizes='(max-width: 767px) calc(100vw - 32px), 0vw' className='object-cover' priority={priority} />
        </div>

        <MovieActions movie={movie} className='mt-8 flex-col gap-1.5' fullWidth />
      </div>

      <div
        className='relative isolate hidden aspect-video overflow-hidden rounded-[8px] bg-neutral-100 md:block'
        data-tina-field={tinaField(movie, 'desktopImage')}
      >
        <BlurUpImage src={movie.desktopImage} alt={desktopImageAlt} fill sizes='calc(100vw - 64px)' className='object-cover' priority={priority} />
        <div className='absolute inset-0 bg-black/[0.08]' />

        <div className='absolute left-1/2 top-1/2 z-10 flex w-full max-w-[850px] -translate-x-1/2 -translate-y-1/2 flex-col items-center px-8 text-center text-white'>
          {movie.eyebrow ? (
            <div className='mb-9' data-tina-field={tinaField(movie, 'eyebrow')}>
              <SectionMasthead index={eyebrowIndex} title={movie.eyebrow} size='sm' />
            </div>
          ) : null}

          <MovieTitle movie={movie} />

          <MovieActions movie={movie} className='mt-14 gap-3' readMoreFirst />
        </div>
      </div>
    </article>
  );
}

function MovieTitle({ movie, className }: { movie: MovieListItem; className?: string }) {
  return (
    <h2 className={cn('font-sedan text-[24px] leading-[1.08] md:text-[64px] md:leading-[0.96]', className)}>
      <span data-tina-field={tinaField(movie, 'title')}>{movie.title}</span>
      {(movie.italicTitle || movie.titleSuffix) && <br />}
      {movie.italicTitle ? (
        <em className='italic' data-tina-field={tinaField(movie, 'italicTitle')}>
          {movie.italicTitle}
        </em>
      ) : null}
      {movie.italicTitle && movie.titleSuffix ? ' ' : null}
      {movie.titleSuffix ? <span data-tina-field={tinaField(movie, 'titleSuffix')}>{movie.titleSuffix}</span> : null}
    </h2>
  );
}

function MovieActions({
  movie,
  className,
  fullWidth = false,
  readMoreFirst = false,
}: {
  movie: MovieListItem;
  className?: string;
  fullWidth?: boolean;
  readMoreFirst?: boolean;
}) {
  const watchFilmButton = (
    <ActionButton
      color='orange'
      icon='playCircle'
      label={movie.watchFilmLabel}
      subLabel={movie.filmDuration}
      href={movie.watchFilmHref}
      target="_blank"
      fullWidth={fullWidth}
      dataTinaField={tinaField(movie, 'watchFilmLabel')}
    />
  );
  const readMoreButton = (
    <ActionButton
      color='black'
      icon='error'
      label={movie.readMoreLabel}
      onClick={() => window.dispatchEvent(new Event(ANNOUNCEMENT_OVERLAY_EVENT))}
      fullWidth={fullWidth}
      dataTinaField={tinaField(movie, 'readMoreLabel')}
    />
  );

  return (
    <div className={cn('flex', className)}>
      {readMoreFirst ? readMoreButton : watchFilmButton}
      {readMoreFirst ? watchFilmButton : readMoreButton}
    </div>
  );
}
