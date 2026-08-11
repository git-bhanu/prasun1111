import { clearSessionCookie } from '../../_shared/dashboard-auth.js';

export async function onRequest(context) {
  if (context.request.method !== 'POST') return new Response('Not found', { status: 404 });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Set-Cookie': clearSessionCookie() },
  });
}
