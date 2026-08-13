import { verifySession } from '../../../_shared/dashboard-auth';
import type { Env, PagesContext } from '../../../_shared/types';

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

const PAGE_SIZE = 20;

async function listAllComments(url: URL, env: Env) {
  const pageSlug = url.searchParams.get('page');
  const status = url.searchParams.get('status');
  const sort = url.searchParams.get('sort');
  const pageNum = Math.max(1, Number.parseInt(url.searchParams.get('pageNum') ?? '', 10) || 1);

  let whereClause = ' WHERE 1=1';
  const params: string[] = [];
  if (pageSlug) {
    whereClause += ' AND page_slug LIKE ?';
    params.push(`${pageSlug}%`);
  }
  if (status) {
    whereClause += ' AND status = ?';
    params.push(status);
  }

  const countRow = await env.DB.prepare(`SELECT COUNT(*) as count FROM comments${whereClause}`)
    .bind(...params)
    .first<{ count: number }>();
  const total = countRow?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const orderClause = sort === 'liked' ? ' ORDER BY likes_count DESC, created_at DESC' : ' ORDER BY created_at DESC';
  const query = `SELECT id, page_slug, parent_id, author_name, author_email, body, status, is_author_reply, is_pinned, likes_count, created_at FROM comments${whereClause}${orderClause} LIMIT ? OFFSET ?`;

  const { results } = await env.DB.prepare(query)
    .bind(...params, PAGE_SIZE, (pageNum - 1) * PAGE_SIZE)
    .all();
  return jsonResponse({ comments: results, pagination: { page: pageNum, pageSize: PAGE_SIZE, total, totalPages } }, 200);
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

  if (pageSlug.length < 1 || authorName.length < 1 || body.length < 1 || body.length > 1000) {
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
