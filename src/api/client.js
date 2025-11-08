// frontend_next/src/api/client.js

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn(
    'NEXT_PUBLIC_API_URL no está definido. Crea .env.local con NEXT_PUBLIC_API_URL y reinicia "npm run dev".'
  );
}

/** =========================
 *  TOKEN EN MEMORIA + LOCALSTORAGE
 *  ========================= */
let accessToken = '';
let refreshPromise = null;

// Hidratar desde localStorage cuando se ejecute en el navegador
try {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('access_token');
    if (saved) accessToken = saved;
  }
} catch { /* noop */ }

export function setAccessToken(t) {
  accessToken = t || '';
  try {
    if (typeof window !== 'undefined') {
      if (t) localStorage.setItem('access_token', t);
      else localStorage.removeItem('access_token');
    }
  } catch { /* noop */ }
}

export function clearAccessToken() { setAccessToken(''); }
export function getAccessToken() { return accessToken; }

/** =========================
 *  LOW-LEVEL FETCH
 *  ========================= */
async function raw(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    credentials: 'include', // para que viaje la cookie httpOnly del refresh
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(headers || {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return res;
}

/** =========================
 *  REFRESH TOKEN (cookie httpOnly)
 *  ========================= */
async function ensureRefreshed() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const r = await raw('/auth/refresh', { method: 'POST' });
      if (!r.ok) {
        clearAccessToken();
        throw new Error(await r.text());
      }
      const data = await r.json().catch(() => ({}));
      const newAccess = data?.accessToken || '';
      setAccessToken(newAccess);
      return newAccess;
    })().finally(() => (refreshPromise = null));
  }
  return refreshPromise;
}

/** =========================
 *  API ALTO NIVEL (auto-refresh en 401)
 *  ========================= */
export async function api(path, opts = {}) {
  let res = await raw(path, opts);

  if (res.status === 401) {
    // Intentar refrescar el access token una única vez
    try {
      await ensureRefreshed();
    } catch (e) {
      // 401 sin refresh posible
      const txt = await res.text().catch(() => '');
      clearAccessToken();
      throw new Error(`HTTP 401 (no refresh): ${txt || (e?.message || '')}`);
    }
    // Reintentar la petición con el nuevo access token
    res = await raw(path, opts);
  }

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(txt || `HTTP ${res.status}`);
  }

  // Puede que no haya body (204)
  try {
    return await res.json();
  } catch {
    return {};
  }
}
