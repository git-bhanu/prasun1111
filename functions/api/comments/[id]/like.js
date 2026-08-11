function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

export async function onRequest(context) {
  const { request, env, params } = context;
  if (request.method !== 'POST') return new Response('Not found', { status: 404 });

  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return jsonResponse({ error: 'invalid id' }, 400);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'invalid json' }, 400);
  }

  if (typeof payload.liked !== 'boolean') {
    return jsonResponse({ error: 'invalid payload' }, 400);
  }

  const delta = payload.liked ? 1 : -1;
  const row = await env.DB.prepare("UPDATE comments SET likes_count = MAX(0, likes_count + ?) WHERE id = ? AND status = 'approved' RETURNING likes_count")
    .bind(delta, id)
    .first();

  if (!row) return jsonResponse({ error: 'not found' }, 404);

  return jsonResponse({ likes_count: row.likes_count }, 200);
}
