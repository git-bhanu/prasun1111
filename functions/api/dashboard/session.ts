import { verifySession } from '../../_shared/dashboard-auth';
import type { PagesContext } from '../../_shared/types';

export async function onRequest(context: PagesContext) {
  if (context.request.method !== 'GET') return new Response('Not found', { status: 404 });
  const authenticated = await verifySession(context.request, context.env);
  return new Response(JSON.stringify({ authenticated }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
