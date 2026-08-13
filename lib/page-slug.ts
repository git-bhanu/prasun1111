export function pageSlugToUrl(pageSlug: string): string {
  const [category, ...rest] = pageSlug.split('/');
  const itemSlug = rest.join('/');
  switch (category) {
    case 'artworks':
      return `/artworks?artwork=${encodeURIComponent(itemSlug)}`;
    case 'installations':
      return `/installations?installation=${encodeURIComponent(itemSlug)}`;
    case 'design':
      return `/design?design=${encodeURIComponent(itemSlug)}`;
    case 'writings':
      return `/writings?writing=${encodeURIComponent(itemSlug)}`;
    case 'films':
      return '/films';
    default:
      return '/';
  }
}

function titleCase(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

export function pageSlugToLabel(pageSlug: string): string {
  const [category, ...rest] = pageSlug.split('/');
  const itemSlug = rest.join('/');
  const categoryLabel = category ? category[0].toUpperCase() + category.slice(1) : pageSlug;
  if (!itemSlug) return categoryLabel;
  return `${categoryLabel}: ${titleCase(itemSlug)}`;
}
