import { JsonLd } from '@/components/shared/json-ld';
import { buildMetadata } from '@/lib/seo';
import { buildArticleSchema, buildBreadcrumbSchema } from '@/lib/structured-data';
import type { WritingConnectionQuery } from '@/tina/__generated__/types';
import client from '@/tina/client';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import WritingDetailClientPage from './client-page';

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const result = await client.queries.writingConnection({ first: 1000 });
    return (result.data.writingConnection.edges ?? [])
      .map((e) => e?.node?._sys.filename)
      .filter((f): f is string => f != null)
      .map((filename) => ({ slug: filename }));
  } catch {
    return [];
  }
}

type Props = { params: Promise<{ slug: string }> };

type WritingNode = NonNullable<NonNullable<WritingConnectionQuery['writingConnection']['edges']>[number]>['node'];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const result = await client.queries.writing({ relativePath: `${slug}.mdx` }, { fetchOptions: { next: { revalidate: 60 } } });
    const writing = result.data.writing;
    const sections = writing.titleSections ?? [];
    const plainTitle = sections.map((s) => s?.text ?? '').join('') || slug;
    return buildMetadata(writing.seo, plainTitle);
  } catch {
    return { title: slug };
  }
}

export default async function WritingDetailPage({ params }: Props) {
  const { slug } = await params;

  try {
    const [result, allResult] = await Promise.all([
      client.queries.writing({ relativePath: `${slug}.mdx` }, { fetchOptions: { next: { revalidate: 60 } } }),
      client.queries.writingConnection({ first: 100, sort: 'date' }, { fetchOptions: { next: { revalidate: 60 } } }),
    ]);

    const otherWritings = (allResult.data.writingConnection.edges ?? [])
      .map((e) => e?.node)
      .filter((n): n is NonNullable<WritingNode> => n != null && n._sys.filename !== slug)
      .sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, 4);

    const writing = result.data.writing;
    const sections = writing.titleSections ?? [];
    const plainTitle = sections.map((s) => s?.text ?? '').join('') || slug;
    const seoDescription = writing.seo?.metaDescription ?? undefined;

    const articleSchema = buildArticleSchema({
      slug,
      headline: plainTitle,
      datePublished: writing.date,
      image: writing.seo?.ogImage ?? writing.heroImage,
      description: seoDescription,
    });
    const breadcrumbSchema = buildBreadcrumbSchema([
      { name: 'Writings', url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prasun1111.com'}/writings` },
      { name: plainTitle },
    ]);

    return (
      <>
        <JsonLd schema={articleSchema} />
        <JsonLd schema={breadcrumbSchema} />
        <WritingDetailClientPage query={result.query} data={result.data} variables={result.variables} otherWritings={otherWritings} />
      </>
    );
  } catch {
    notFound();
  }
}
