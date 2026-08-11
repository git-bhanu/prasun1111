import { clearSessionCookie } from '../../_shared/dashboard-auth';
import type { PagesContext } from '../../_shared/types';

export async function onRequest(context: PagesContext) {
  if (context.request.method !== 'POST') return new Response('Not found', { status: 404 });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Set-Cookie': clearSessionCookie() },
  });
}
