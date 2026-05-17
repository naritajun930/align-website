const MICROCMS_SERVICE_DOMAIN = 'k5y651526p';
const MICROCMS_API_KEY = 'tY6t5jduK7vwqh6ugD2LUOICKJ9XJkrVFfe3';

const BASE_URL = `https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1`;

async function fetchPosts({ limit = 10, offset = 0, fields = '' } = {}) {
  const params = new URLSearchParams({ limit, offset });
  if (fields) params.set('fields', fields);

  const res = await fetch(`${BASE_URL}/blog?${params}`, {
    headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY },
  });
  if (!res.ok) throw new Error(`microCMS error: ${res.status}`);
  return res.json();
}

async function fetchPost(slug) {
  const res = await fetch(`${BASE_URL}/blog/${slug}`, {
    headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY },
  });
  if (!res.ok) throw new Error(`microCMS error: ${res.status}`);
  return res.json();
}
