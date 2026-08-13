import { isAccessConfigured } from '../../_shared/cloudflare-access';
import { verifySession } from '../../_shared/dashboard-auth';
import type { PagesContext } from '../../_shared/types';

export async function onRequest(context: PagesContext) {
  if (context.request.method !== 'GET') return new Response('Not found', { status: 404 });
  const authenticated = await verifySession(context.request, context.env);
  const accessEnabled = isAccessConfigured(context.env);
  return new Response(JSON.stringify({ authenticated, accessEnabled }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
