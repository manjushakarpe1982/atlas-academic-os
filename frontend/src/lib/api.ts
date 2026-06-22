export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const getToken  = () => typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
export const getUser   = () => { try { const r = localStorage.getItem('user'); return r ? JSON.parse(r) : null; } catch { return null; } };
export const saveAuth  = (token: string, user: object) => { localStorage.setItem('access_token', token); localStorage.setItem('user', JSON.stringify(user)); };
export const clearAuth = () => {
  // Clear all localStorage
  localStorage.clear();

  // Clear all sessionStorage
  sessionStorage.clear();

  // Clear all cookies
  document.cookie.split(';').forEach((c) => {
    const name = c.trim().split('=')[0];
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
  });
};

export const logout = () => {
  clearAuth();
  window.location.href = '/auth/login';
};

export async function api<T = unknown>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body != null ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || `Error ${res.status}`);
  return data as T;
}
