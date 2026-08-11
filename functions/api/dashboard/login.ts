import { createSessionCookie } from '../../_shared/dashboard-auth';
import type { PagesContext } from '../../_shared/types';

interface LoginPayload {
  password?: unknown;
}

export async function onRequest(context: PagesContext) {
  const { request, env } = context;
  if (request.method !== 'POST') return new Response('Not found', { status: 404 });

  let payload: LoginPayload;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid json' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const password = typeof payload.password === 'string' ? payload.password : '';
  if (!env.ADMIN_PASSWORD || password !== env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: 'invalid password' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const cookie = await createSessionCookie(env);
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookie } });
}
