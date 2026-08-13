import { verifySession } from '../../_shared/dashboard-auth';
import type { Env, PagesContext } from '../../_shared/types';

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

async function listPages(env: Env) {
  const { results } = await env.DB.prepare('SELECT DISTINCT page_slug FROM comments ORDER BY page_slug').all<{ page_slug: string }>();
  return jsonResponse({ pages: results.map((row) => row.page_slug) }, 200);
}

export async function onRequest(context: PagesContext) {
  const { request, env } = context;
  if (!(await verifySession(request, env))) {
    return jsonResponse({ error: 'unauthorized' }, 401);
  }

  if (request.method === 'GET') return listPages(env);
  return new Response('Not found', { status: 404 });
}
