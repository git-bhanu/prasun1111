import 'server-only';

import { createClient } from 'tinacms/dist/client';

import { queries } from '@/tina/__generated__/types';

const branch = process.env.NEXT_PUBLIC_TINA_BRANCH || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || process.env.HEAD || 'main';
const clientId = process.env.NEXT_PUBLIC_TINA_CLIENT_ID;
const isLocalTina = process.env.TINA_LOCAL === 'true';
const localTinaUrl = process.env.TINA_LOCAL_URL || 'http://localhost:4001/graphql';

function getHostedTinaUrl() {
  if (!clientId) {
    throw new Error('NEXT_PUBLIC_TINA_CLIENT_ID is required for Tina content fetching.');
  }

  return `https://content.tinajs.io/2.2/content/${clientId}/github/${encodeURIComponent(branch)}`;
}

function getTinaUrl() {
  if (isLocalTina) {
    return localTinaUrl;
  }

  return getHostedTinaUrl();
}

function isLocalConnectionError(error: unknown) {
  return (
    error instanceof Error &&
    'cause' in error &&
    typeof error.cause === 'object' &&
    error.cause !== null &&
    'code' in error.cause &&
    error.cause.code === 'ECONNREFUSED'
  );
}

const client = createClient({
  url: getTinaUrl(),
  token: process.env.TINA_TOKEN,
  queries,
});

if (isLocalTina) {
  const hostedClient = createClient({
    url: getHostedTinaUrl(),
    token: process.env.TINA_TOKEN,
    queries,
  });
  const originalRequest = client.request.bind(client);

  client.request = async (args, options) => {
    try {
      return await originalRequest(args, options);
    } catch (error) {
      if (isLocalConnectionError(error)) {
        return hostedClient.request(
          {
            ...args,
            url: hostedClient.apiUrl,
          },
          options
        );
      }

      throw error;
    }
  };
}

export default client;
