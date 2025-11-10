import { api, setAccessToken, clearAccessToken } from './client';

export async function register(data) {
  return api('/auth/register', { method: 'POST', body: data });
}

export async function login(data) {
  const out = await api('/auth/login', { method: 'POST', body: data });
  if (out?.accessToken) setAccessToken(out.accessToken);
  return out;
}

export async function refresh() {
  const out = await api('/auth/refresh', { method: 'POST' });
  if (out?.accessToken) setAccessToken(out.accessToken);
  return out;
}

export async function logoutAll() {
  await api('/auth/logout-all', { method: 'POST' });
  clearAccessToken();
}

export async function meOrders() {
  return api('/auth/me/orders');
}