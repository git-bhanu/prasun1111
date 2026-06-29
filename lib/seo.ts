import type { Metadata } from 'next';

export function richTextToPlain(content: unknown): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (typeof content !== 'object') return '';
  const node = content as { text?: string; value?: string; children?: unknown[] };
  if (node.text) return node.text;
  if (node.value) return node.value;
  if (Array.isArray(node.children)) return node.children.map(richTextToPlain).join('');
  return '';
}

type SeoInput = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
} | null | undefined;

export function buildMetadata(seo: SeoInput, fallbackTitle: string): Metadata {
  const title = seo?.metaTitle ? { absolute: seo.metaTitle } : fallbackTitle;
  const description = seo?.metaDescription ?? undefined;

  const meta: Metadata = { title };
  if (description) meta.description = description;

  if (seo?.ogImage) {
    meta.openGraph = {
      title: seo.metaTitle ?? fallbackTitle,
      ...(description && { description }),
      images: [{ url: seo.ogImage }],
    };
    meta.twitter = {
      card: 'summary_large_image',
      title: seo.metaTitle ?? fallbackTitle,
      ...(description && { description }),
      images: [seo.ogImage],
    };
  }

  return meta;
}
