import { NextRequest, NextResponse } from 'next/server';
import client from '@/tina/client';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'missing slug' }, { status: 400 });

  try {
    const connection = await client.queries.artworkConnection(
      { first: 200 },
      { fetchOptions: { next: { revalidate: 60 } } },
    );

    const match = connection.data.artworkConnection.edges?.find((e) => {
      const node = e?.node;
      if (!node) return false;
      return (node.slug ?? node._sys.filename).toLowerCase() === slug.toLowerCase();
    })?.node;

    if (!match) return NextResponse.json({ error: 'not found' }, { status: 404 });

    const result = await client.queries.artwork(
      { relativePath: match._sys.relativePath },
      { fetchOptions: { next: { revalidate: 60 } } },
    );

    return NextResponse.json(result.data.artwork);
  } catch {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
}
