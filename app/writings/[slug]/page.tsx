import client from '@/tina/client';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import WritingDetailClientPage from './client-page';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const result = await client.queries.writing({ relativePath: `${slug}.mdx` }, { fetchOptions: { next: { revalidate: 60 } } });
    const sections = result.data.writing.titleSections ?? [];
    const plainTitle = sections.map((s) => s?.text ?? '').join('');
    return { title: plainTitle || slug };
  } catch {
    return { title: slug };
  }
}

export default async function WritingDetailPage({ params }: Props) {
  const { slug } = await params;

  try {
    const result = await client.queries.writing({ relativePath: `${slug}.mdx` }, { fetchOptions: { next: { revalidate: 60 } } });

    return <WritingDetailClientPage query={result.query} data={result.data} variables={result.variables} />;
  } catch {
    notFound();
  }
}
