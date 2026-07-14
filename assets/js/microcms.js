const MICROCMS_SERVICE_DOMAIN = 'k5y651526p';
const MICROCMS_API_KEY = 'tY6t5jduK7vwqh6ugD2LUOICKJ9XJkrVFfe3';

const BASE_URL = `https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1`;

// エンドポイント名の不一致に備え、候補を順に試して最初に成功したものを使う
const ENDPOINT_CANDIDATES = ['blog', 'blogs', 'articles', 'news'];
let resolvedEndpoint = null;

async function apiGet(path, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000); // 10秒でタイムアウト
  try {
    const res = await fetch(`${BASE_URL}/${path}${qs ? `?${qs}` : ''}`, {
      headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY },
      signal: controller.signal,
    });
    if (!res.ok) {
      const err = new Error(`microCMS error: ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function resolveEndpoint() {
  if (resolvedEndpoint) return resolvedEndpoint;
  let lastError = null;
  for (const ep of ENDPOINT_CANDIDATES) {
    try {
      await apiGet(ep, { limit: 1, fields: 'id' });
      resolvedEndpoint = ep;
      return ep;
    } catch (e) {
      lastError = e;
      // 404 = エンドポイント名違い → 次の候補へ。それ以外（401等）は即時エラー
      if (e.status && e.status !== 404) throw e;
    }
  }
  throw lastError || new Error('microCMS: no endpoint found');
}

async function fetchPosts({ limit = 10, offset = 0, fields = '' } = {}) {
  const ep = await resolveEndpoint();
  const params = { limit, offset };
  if (fields) params.fields = fields;
  return apiGet(ep, params);
}

async function fetchPost(slug) {
  const ep = await resolveEndpoint();
  return apiGet(`${ep}/${slug}`);
}
