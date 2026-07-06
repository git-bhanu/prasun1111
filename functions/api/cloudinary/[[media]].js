async function sha1Hex(message) {
  const data = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function checkAuth(clientID, token) {
  if (!clientID || !token) return false;
  try {
    const res = await fetch(
      `https://identity.tinajs.io/v2/apps/${clientID}/currentUser`,
      { headers: { 'Content-Type': 'application/json', authorization: token } },
    );
    if (!res.ok) return false;
    const user = await res.json();
    return Boolean(user?.verified);
  } catch {
    return false;
  }
}

function basicAuth(apiKey, apiSecret) {
  return `Basic ${btoa(`${apiKey}:${apiSecret}`)}`;
}

function toTinaFile(file) {
  const parts = file.public_id.split('/');
  const filename = parts[parts.length - 1];
  const directory = parts.slice(0, -1).join('/') || '/';
  const base = file.secure_url;
  function transform(url, t) {
    const p = url.split('/image/upload/');
    return p.length === 2 ? `${p[0]}/image/upload/${t}/${p[1]}` : url;
  }
  return {
    id: file.public_id,
    filename,
    directory,
    src: base,
    thumbnails: {
      '75x75': transform(base, 'w_75,h_75,c_fit,q_auto'),
      '400x400': transform(base, 'w_400,h_400,c_fit,q_auto'),
      '1000x1000': transform(base, 'w_1000,h_1000,c_fit,q_auto'),
    },
    type: 'file',
  };
}

async function listMedia(url, cloudName, apiKey, apiSecret) {
  const directory = url.searchParams.get('directory') || '""';
  const limit = parseInt(url.searchParams.get('limit') || '500', 10);
  const offset = url.searchParams.get('offset');
  const filesOnly = url.searchParams.get('filesOnly') === 'true';

  const useRoot = !directory || directory === '/' || directory === '""';
  const expression = useRoot ? 'folder=""' : `folder="${directory}"`;

  const searchBody = { expression, max_results: limit };
  if (offset) searchBody.next_cursor = offset;

  const auth = basicAuth(apiKey, apiSecret);
  const searchRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
    {
      method: 'POST',
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      body: JSON.stringify(searchBody),
    },
  );

  if (!searchRes.ok) {
    const err = await searchRes.text();
    return new Response(JSON.stringify({ e: err }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const searchData = await searchRes.json();
  const files = (searchData.resources || []).map(toTinaFile);

  if (filesOnly) {
    return new Response(
      JSON.stringify({ items: files, offset: searchData.next_cursor }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  }

  const folderUrl = useRoot
    ? `https://api.cloudinary.com/v1_1/${cloudName}/folders`
    : `https://api.cloudinary.com/v1_1/${cloudName}/folders/${directory}`;

  let folders = [];
  try {
    const folderRes = await fetch(folderUrl, { headers: { Authorization: auth } });
    if (folderRes.ok) {
      const folderData = await folderRes.json();
      folders = (folderData.folders || []).map((f) => ({
        id: f.path,
        type: 'dir',
        filename: f.name,
        directory: f.path.includes('/') ? f.path.substring(0, f.path.lastIndexOf('/')) : '/',
      }));
    }
  } catch {}

  return new Response(
    JSON.stringify({ items: [...folders, ...files], offset: searchData.next_cursor }),
    { headers: { 'Content-Type': 'application/json' } },
  );
}

async function uploadMedia(request, cloudName, apiKey, apiSecret) {
  const formData = await request.formData();
  const file = formData.get('file');
  const directory = String(formData.get('directory') || '').replace(/^\//, '');

  const timestamp = Math.floor(Date.now() / 1000);
  const params = { overwrite: 'false', timestamp: String(timestamp), use_filename: 'true' };
  if (directory) params.folder = directory;

  const paramsStr = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  const signature = await sha1Hex(paramsStr + apiSecret);

  const upload = new FormData();
  upload.set('file', file);
  upload.set('api_key', apiKey);
  upload.set('timestamp', String(timestamp));
  upload.set('signature', signature);
  upload.set('use_filename', 'true');
  upload.set('overwrite', 'false');
  if (directory) upload.set('folder', directory);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: upload,
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function deleteMedia(publicId, cloudName, apiKey, apiSecret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { public_id: publicId, timestamp: String(timestamp) };
  const paramsStr = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  const signature = await sha1Hex(paramsStr + apiSecret);

  const form = new FormData();
  form.set('public_id', publicId);
  form.set('api_key', apiKey);
  form.set('timestamp', String(timestamp));
  form.set('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: 'POST',
    body: form,
  });

  const data = await res.json();
  return new Response(
    JSON.stringify({ err: data.result !== 'ok' ? data.result : null, public_id: publicId }),
    { headers: { 'Content-Type': 'application/json' } },
  );
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (env.NODE_ENV !== 'development') {
    const clientID = url.searchParams.get('clientID');
    const token = request.headers.get('authorization');
    const authorized = await checkAuth(clientID, token);
    if (!authorized) {
      return new Response(JSON.stringify({ message: 'sorry this user is unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = env;

  const method = request.method;
  const pathname = url.pathname;
  const mediaPrefix = '/api/cloudinary/media/';
  const publicId = pathname.startsWith(mediaPrefix)
    ? decodeURIComponent(pathname.slice(mediaPrefix.length))
    : null;

  if (method === 'GET') return listMedia(url, cloudName, apiKey, apiSecret);
  if (method === 'POST') return uploadMedia(request, cloudName, apiKey, apiSecret);
  if (method === 'DELETE' && publicId) return deleteMedia(publicId, cloudName, apiKey, apiSecret);

  return new Response('Not found', { status: 404 });
}
