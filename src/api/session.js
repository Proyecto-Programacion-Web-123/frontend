const KEY = 'auth_user';

export function saveUser(user) {
  try { localStorage.setItem(KEY, JSON.stringify(user || null)); } catch {}
}

export function loadUser() {
  try {
    const s = localStorage.getItem(KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export function clearUser() {
  try { localStorage.removeItem(KEY); } catch {}
}
