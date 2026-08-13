import { setCommentStatus } from '../../../_shared/comments';
import { verifySession } from '../../../_shared/dashboard-auth';
import type { PagesContext } from '../../../_shared/types';

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

interface PatchPayload {
  pinned?: unknown;
  status?: unknown;
}

export async function onRequest(context: PagesContext<{ id: string }>) {
  const { request, env, params } = context;
  if (!(await verifySession(request, env))) {
    return jsonResponse({ error: 'unauthorized' }, 401);
  }

  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return jsonResponse({ error: 'invalid id' }, 400);
  }

  if (request.method === 'DELETE') {
    await env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(id).run();
    return jsonResponse({ ok: true }, 200);
  }

  if (request.method === 'PATCH') {
    let payload: PatchPayload;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ error: 'invalid json' }, 400);
    }

    if (typeof payload.pinned === 'boolean') {
      if (payload.pinned) {
        const row = await env.DB.prepare('SELECT page_slug FROM comments WHERE id = ?').bind(id).first<{ page_slug: string }>();
        if (!row) return jsonResponse({ error: 'not found' }, 404);
        await env.DB.batch([
          env.DB.prepare('UPDATE comments SET is_pinned = 0 WHERE page_slug = ?').bind(row.page_slug),
          env.DB.prepare('UPDATE comments SET is_pinned = 1 WHERE id = ?').bind(id),
        ]);
      } else {
        await env.DB.prepare('UPDATE comments SET is_pinned = 0 WHERE id = ?').bind(id).run();
      }
      return jsonResponse({ ok: true }, 200);
    }

    if (payload.status !== 'approved' && payload.status !== 'rejected') {
      return jsonResponse({ error: 'invalid status' }, 400);
    }
    await setCommentStatus(env, id, payload.status);
    return jsonResponse({ ok: true }, 200);
  }

  return new Response('Not found', { status: 404 });
}
