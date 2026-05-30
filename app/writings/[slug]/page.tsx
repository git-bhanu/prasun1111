import type { WritingConnectionQuery } from '@/tina/__generated__/types';
import client from '@/tina/client';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import WritingDetailClientPage from './client-page';

type Props = { params: Promise<{ slug: string }> };

type WritingNode = NonNullable<NonNullable<WritingConnectionQuery['writingConnection']['edges']>[number]>['node'];

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

    return <WritingDetailClientPage query={result.query} data={result.data} variables={result.variables} otherWritings={otherWritings} />;
  } catch {
    notFound();
  }
}
