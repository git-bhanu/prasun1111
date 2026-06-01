const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prasun1111.com';
const ARTIST_NAME = 'Prasun Mazumdar';
const SITE_NAME = 'Prasun1111';

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function buildWebSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    inLanguage: 'en',
  };
}

export function buildPersonSchema(sameAs: string[]) {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: ARTIST_NAME,
    url: `${SITE_URL}/`,
    jobTitle: 'Artist',
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export function buildHomepageGraph(sameAs: string[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [buildWebSiteSchema(), buildPersonSchema(sameAs)],
  };
}

export function buildCollectionPageSchema(path: string, name: string, description?: string | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}${path}/#collectionpage`,
    name,
    url: `${SITE_URL}${path}`,
    ...(description && { description }),
    author: { '@id': PERSON_ID },
  };
}

type ArticleInput = {
  slug: string;
  headline: string;
  datePublished?: string | null;
  image?: string | null;
  description?: string | null;
};

export function buildArticleSchema(input: ArticleInput) {
  const url = `${SITE_URL}/writings/${input.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}/#article`,
    headline: input.headline,
    url,
    inLanguage: 'en',
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    ...(input.datePublished && {
      datePublished: input.datePublished.slice(0, 10),
      dateModified: input.datePublished.slice(0, 10),
    }),
    ...(input.image && { image: input.image }),
    ...(input.description && { description: input.description }),
  };
}

export function buildBreadcrumbSchema(items: { name: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

type VideoInput = {
  name: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  year?: string | null;
  duration?: string | null;
  youtubeUrl?: string | null;
};

export function buildVideoObjectSchema(input: VideoInput) {
  const youtubeId = input.youtubeUrl ? extractYouTubeId(input.youtubeUrl) : null;
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': `${SITE_URL}/films/#video`,
    name: input.name,
    url: `${SITE_URL}/films`,
    ...(input.description && { description: input.description }),
    ...(input.thumbnailUrl && { thumbnailUrl: input.thumbnailUrl }),
    uploadDate: input.year ? `${input.year}-01-01` : undefined,
    ...(input.duration && { duration: parseDuration(input.duration) }),
    ...(youtubeId && { embedUrl: `https://www.youtube.com/embed/${youtubeId}` }),
    creator: { '@id': PERSON_ID },
  };
}

type VisualArtworkInput = {
  slug: string;
  name: string;
  image?: string | null;
  description?: string | null;
};

export function buildVisualArtworkSchema(input: VisualArtworkInput) {
  const url = `${SITE_URL}/artworks?artwork=${encodeURIComponent(input.slug)}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    '@id': `${url}/#artwork`,
    name: input.name,
    url,
    creator: { '@id': PERSON_ID },
    ...(input.image && { image: input.image }),
    ...(input.description && { description: input.description }),
  };
}

type CreativeWorkInput = {
  slug: string;
  name: string;
  image?: string | null;
  description?: string | null;
  collection: string;
  param: string;
};

export function buildCreativeWorkSchema(input: CreativeWorkInput) {
  const url = `${SITE_URL}/${input.collection}?${input.param}=${encodeURIComponent(input.slug)}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${url}/#work`,
    name: input.name,
    url,
    creator: { '@id': PERSON_ID },
    ...(input.image && { image: input.image }),
    ...(input.description && { description: input.description }),
  };
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
  return match?.[1] ?? null;
}

function parseDuration(raw: string): string {
  const normalized = raw.toUpperCase().replace(/\s+/g, '');
  const minMatch = normalized.match(/(\d+)MIN/);
  const secMatch = normalized.match(/(\d+)SEC/);
  const hours = 0;
  const minutes = minMatch ? parseInt(minMatch[1], 10) : 0;
  const seconds = secMatch ? parseInt(secMatch[1], 10) : 0;
  if (!minutes && !seconds) return 'PT0S';
  return `PT${hours > 0 ? `${hours}H` : ''}${minutes > 0 ? `${minutes}M` : ''}${seconds > 0 ? `${seconds}S` : ''}`;
}
