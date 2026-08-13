import { notifyNewComment } from '../../_shared/telegram';
import type { CommentRow, Env, PagesContext } from '../../_shared/types';

const COMMENTABLE_CATEGORIES = ['artworks', 'installations', 'films', 'design', 'writings'];

function isValidPageSlug(pageSlug: string | null): pageSlug is string {
  if (typeof pageSlug !== 'string' || pageSlug.length < 1 || pageSlug.length > 200) return false;
  const slashIndex = pageSlug.indexOf('/');
  const category = slashIndex === -1 ? pageSlug : pageSlug.slice(0, slashIndex);
  const itemSlug = slashIndex === -1 ? '' : pageSlug.slice(slashIndex + 1);
  if (!COMMENTABLE_CATEGORIES.includes(category)) return false;
  if (category !== 'films' && itemSlug.length < 1) return false;
  return true;
}

function isValidEmail(email: string) {
  if (email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const URL_PATTERN = /(https?:\/\/|www\.|\b[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.[a-z]{2,}\b)/i;

function containsUrl(text: string) {
  return URL_PATTERN.test(text);
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function verifyTurnstile(token: string, secret: string, remoteIp: string | null) {
  if (!token) return false;
  const form = new URLSearchParams();
  form.set('secret', secret);
  form.set('response', token);
  if (remoteIp) form.set('remoteip', remoteIp);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });
  if (!res.ok) return false;
  const result = (await res.json()) as { success: boolean };
  return result.success === true;
}

const PAGE_SIZE = 4;

async function listComments(url: URL, env: Env) {
  const pageSlug = url.searchParams.get('page');
  if (!isValidPageSlug(pageSlug)) {
    return jsonResponse({ error: 'invalid page' }, 400);
  }

  const pageNum = Math.max(1, Math.min(100000, Number.parseInt(url.searchParams.get('pageNum') ?? '', 10) || 1));

  const pinned = await env.DB.prepare(
    'SELECT id, page_slug, parent_id, author_name, body, is_author_reply, is_pinned, likes_count, created_at FROM comments WHERE page_slug = ? AND status = ? AND is_pinned = 1'
  )
    .bind(pageSlug, 'approved')
    .first<CommentRow>();

  let pinnedReplies: CommentRow[] = [];
  if (pinned) {
    const { results } = await env.DB.prepare(
      'SELECT id, page_slug, parent_id, author_name, body, is_author_reply, is_pinned, likes_count, created_at FROM comments WHERE status = ? AND parent_id = ? ORDER BY created_at ASC'
    )
      .bind('approved', pinned.id)
      .all<CommentRow>();
    pinnedReplies = results;
  }

  const nonPinnedCountRow = await env.DB.prepare(
    'SELECT COUNT(*) as count FROM comments WHERE page_slug = ? AND status = ? AND parent_id IS NULL AND is_pinned = 0'
  )
    .bind(pageSlug, 'approved')
    .first<{ count: number }>();
  const nonPinnedCount = nonPinnedCountRow?.count ?? 0;

  // Pinned comment fills one of the PAGE_SIZE slots on page 1 only, so the
  // remaining non-pinned rows fetched (and their offset) shift by one slot.
  const pinnedSlot = pinned ? 1 : 0;
  const nonPinnedLimit = pageNum === 1 ? PAGE_SIZE - pinnedSlot : PAGE_SIZE;
  const nonPinnedOffset = pageNum === 1 ? 0 : PAGE_SIZE - pinnedSlot + (pageNum - 2) * PAGE_SIZE;
  const total = nonPinnedCount + pinnedSlot;

  const { results: topLevel } = await env.DB.prepare(
    'SELECT id, page_slug, parent_id, author_name, body, is_author_reply, is_pinned, likes_count, created_at FROM comments WHERE page_slug = ? AND status = ? AND parent_id IS NULL AND is_pinned = 0 ORDER BY created_at ASC LIMIT ? OFFSET ?'
  )
    .bind(pageSlug, 'approved', nonPinnedLimit, nonPinnedOffset)
    .all<CommentRow>();

  let replies: CommentRow[] = [];
  const topLevelIds = topLevel.map((c) => c.id);
  if (topLevelIds.length > 0) {
    const placeholders = topLevelIds.map(() => '?').join(',');
    const { results } = await env.DB.prepare(
      `SELECT id, page_slug, parent_id, author_name, body, is_author_reply, is_pinned, likes_count, created_at FROM comments WHERE status = ? AND parent_id IN (${placeholders}) ORDER BY created_at ASC`
    )
      .bind('approved', ...topLevelIds)
      .all<CommentRow>();
    replies = results;
  }

  return jsonResponse(
    {
      pinned: pinned && pageNum === 1 ? { ...pinned, replies: pinnedReplies } : null,
      comments: [...topLevel, ...replies],
      pagination: { page: pageNum, pageSize: PAGE_SIZE, total, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) },
    },
    200
  );
}

interface SubmitCommentPayload {
  page_slug?: unknown;
  author_name?: unknown;
  author_email?: unknown;
  body?: unknown;
  parent_id?: unknown;
  turnstileToken?: unknown;
}

async function submitComment(request: Request, env: Env, origin: string, waitUntil: (promise: Promise<unknown>) => void) {
  let payload: SubmitCommentPayload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'invalid json' }, 400);
  }

  const pageSlug = typeof payload.page_slug === 'string' ? payload.page_slug : '';
  const authorName = typeof payload.author_name === 'string' ? payload.author_name.trim() : '';
  const authorEmail = typeof payload.author_email === 'string' ? payload.author_email.trim() : '';
  const body = typeof payload.body === 'string' ? payload.body.trim() : '';
  const parentId = Number.isInteger(payload.parent_id) ? (payload.parent_id as number) : null;
  const turnstileToken = typeof payload.turnstileToken === 'string' ? payload.turnstileToken : '';

  if (!isValidPageSlug(pageSlug)) {
    return jsonResponse({ error: 'invalid page' }, 400);
  }
  if (authorName.length < 1 || authorName.length > 80) {
    return jsonResponse({ error: 'Enter a name between 1 and 80 characters.' }, 400);
  }
  if (containsUrl(authorName)) {
    return jsonResponse({ error: 'Links are not allowed in the name field.' }, 400);
  }
  if (authorEmail.length > 0 && !isValidEmail(authorEmail)) {
    return jsonResponse({ error: 'invalid author_email' }, 400);
  }
  if (body.length < 1 || body.length > 1000) {
    return jsonResponse({ error: 'Comment must be between 1 and 1000 characters.' }, 400);
  }
  if (containsUrl(body)) {
    return jsonResponse({ error: 'Links are not allowed in comments.' }, 400);
  }

  const remoteIp = request.headers.get('CF-Connecting-IP');
  const verified = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, remoteIp);
  if (!verified) {
    return jsonResponse({ error: 'turnstile verification failed' }, 403);
  }

  const insert = await env.DB.prepare(
    "INSERT INTO comments (page_slug, parent_id, author_name, author_email, body, status, is_author_reply) VALUES (?, ?, ?, ?, ?, 'approved', 0) RETURNING id, page_slug, parent_id, author_name, body, is_author_reply, created_at"
  )
    .bind(pageSlug, parentId, authorName, authorEmail.length > 0 ? authorEmail : null, body)
    .first<{ id: number; page_slug: string; author_name: string; body: string; created_at: string }>();

  if (insert) {
    waitUntil(notifyNewComment(env, origin, insert));
  }

  return jsonResponse(insert, 201);
}

export async function onRequest(context: PagesContext) {
  const { request, env, waitUntil } = context;
  const url = new URL(request.url);

  if (request.method === 'GET') return listComments(url, env);
  if (request.method === 'POST') return submitComment(request, env, url.origin, waitUntil);

  return new Response('Not found', { status: 404 });
}
