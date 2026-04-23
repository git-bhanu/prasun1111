import 'server-only';

import { createClient } from 'tinacms/dist/client';

import { queries } from '@/tina/__generated__/types';

const branch = process.env.NEXT_PUBLIC_TINA_BRANCH || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || process.env.HEAD || 'main';
const clientId = process.env.NEXT_PUBLIC_TINA_CLIENT_ID;

function getTinaUrl() {
  if (process.env.TINA_LOCAL === 'true') {
    return 'http://127.0.0.1:4001/graphql';
  }

  if (!clientId) {
    throw new Error('NEXT_PUBLIC_TINA_CLIENT_ID is required for production Tina builds.');
  }

  return `https://content.tinajs.io/2.2/content/${clientId}/github/${encodeURIComponent(branch)}`;
}

const client = createClient({
  url: getTinaUrl(),
  token: process.env.TINA_TOKEN,
  queries,
});

export default client;
