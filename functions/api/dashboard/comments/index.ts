import { verifySession } from '../../../_shared/dashboard-auth';
import type { Env, PagesContext } from '../../../_shared/types';

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

async function listAllComments(url: URL, env: Env) {
  const pageSlug = url.searchParams.get('page');
  const status = url.searchParams.get('status');

  let query = 'SELECT id, page_slug, parent_id, author_name, author_email, body, status, is_author_reply, is_pinned, created_at FROM comments WHERE 1=1';
  const params: string[] = [];
  if (pageSlug) {
    query += ' AND page_slug LIKE ?';
    params.push(`${pageSlug}%`);
  }
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  query += ' ORDER BY created_at DESC';

  const { results } = await env.DB.prepare(query)
    .bind(...params)
    .all();
  return jsonResponse({ comments: results }, 200);
}

interface AuthorReplyPayload {
  page_slug?: unknown;
  author_name?: unknown;
  body?: unknown;
  parent_id?: unknown;
}

async function createAuthorReply(request: Request, env: Env) {
  let payload: AuthorReplyPayload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'invalid json' }, 400);
  }

  const pageSlug = typeof payload.page_slug === 'string' ? payload.page_slug : '';
  const authorName = typeof payload.author_name === 'string' ? payload.author_name.trim() : '';
  const body = typeof payload.body === 'string' ? payload.body.trim() : '';
  const parentId = Number.isInteger(payload.parent_id) ? (payload.parent_id as number) : null;

  if (pageSlug.length < 1 || authorName.length < 1 || authorName.length > 80 || body.length < 1 || body.length > 1000) {
    return jsonResponse({ error: 'invalid payload' }, 400);
  }

  const insert = await env.DB.prepare(
    "INSERT INTO comments (page_slug, parent_id, author_name, body, status, is_author_reply) VALUES (?, ?, ?, ?, 'approved', 1) RETURNING id, page_slug, parent_id, author_name, body, status, is_author_reply, created_at"
  )
    .bind(pageSlug, parentId, authorName, body)
    .first();

  return jsonResponse(insert, 201);
}

export async function onRequest(context: PagesContext) {
  const { request, env } = context;
  if (!(await verifySession(request, env))) {
    return jsonResponse({ error: 'unauthorized' }, 401);
  }

  const url = new URL(request.url);
  if (request.method === 'GET') return listAllComments(url, env);
  if (request.method === 'POST') return createAuthorReply(request, env);
  return new Response('Not found', { status: 404 });
}
