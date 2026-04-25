import Link from 'next/link';
import { notFound } from 'next/navigation';

const pageCopy = {
  about: {
    eyebrow: 'Studio',
    title: 'About',
    description: 'A minimal route placeholder so App Router navigations stay client-side and view transitions can run.',
  },
  artworks: {
    eyebrow: 'Collection',
    title: 'Artworks',
    description: 'Selected works will live here. This page currently exists to validate route-to-route transitions.',
  },
  installations: {
    eyebrow: 'Collection',
    title: 'Installations',
    description: 'Installation projects will live here. This page currently exists to validate route-to-route transitions.',
  },
  films: {
    eyebrow: 'Collection',
    title: 'Films',
    description: 'Film projects will live here. This page currently exists to validate route-to-route transitions.',
  },
  design: {
    eyebrow: 'Collection',
    title: 'Design',
    description: 'Design work will live here. This page currently exists to validate route-to-route transitions.',
  },
  writings: {
    eyebrow: 'Collection',
    title: 'Writings',
    description: 'Writing and notes will live here. This page currently exists to validate route-to-route transitions.',
  },
  shop: {
    eyebrow: 'Utility',
    title: 'Shop',
    description: 'Shop content is not built yet. This page currently exists to validate route-to-route transitions.',
  },
  cart: {
    eyebrow: 'Utility',
    title: 'Cart',
    description: 'Cart content is not built yet. This page currently exists to validate route-to-route transitions.',
  },
  contact: {
    eyebrow: 'Utility',
    title: 'Contact',
    description: 'Contact content is not built yet. This page currently exists to validate route-to-route transitions.',
  },
} as const;

type PageSlug = keyof typeof pageCopy;

type RouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return Object.keys(pageCopy).map((slug) => ({ slug }));
}

export default async function SectionPage({ params }: RouteProps) {
  const { slug } = await params;
  const page = pageCopy[slug as PageSlug];

  if (!page) {
    notFound();
  }

  return (
    <section className='mx-auto flex w-full max-w-5xl flex-1 px-8 py-16 sm:px-10 md:px-[58px]'>
      <div className='max-w-2xl space-y-6'>
        <p className='text-sm uppercase tracking-[0.24em] text-black/45'>{page.eyebrow}</p>
        <h1 className='font-space-grotesk text-5xl tracking-[-0.06em] text-black sm:text-6xl'>{page.title}</h1>
        <p className='text-lg leading-8 text-black/65'>{page.description}</p>
        <Link
          href='/'
          className='inline-flex items-center rounded-full border border-black/10 px-5 py-2 text-sm uppercase tracking-[0.18em] transition-colors hover:border-black hover:bg-black hover:text-white'
        >
          Back Home
        </Link>
      </div>
    </section>
  );
}
