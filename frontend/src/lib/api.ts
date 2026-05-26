'use client';

/**
 * Tiny fetch wrapper for talking to the Atlas backend.
 * Automatically attaches the Supabase access token and handles JSON.
 */

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('atlas_access_token');
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  [
    'atlas_access_token',
    'atlas_refresh_token',
    'atlas_user_id',
    'atlas_full_name',
    'atlas_email',
    'atlas_onboarding_completed',
  ].forEach((k) => localStorage.removeItem(k));
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface ApiOptions {
  method?: string;
  body?: unknown;
  auth?: boolean; // attach bearer token (default true)
}

export async function api<T = unknown>(
  path: string,
  { method = 'GET', body, auth = true }: ApiOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      'Cannot reach the server. Make sure the backend is running.',
      0,
    );
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const detail =
      (data && (data.detail || data.message)) || 'Something went wrong.';
    throw new ApiError(detail, res.status);
  }

  return data as T;
}
