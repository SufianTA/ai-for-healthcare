const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status}`);
  }
  return res.json();
}

export async function apiPost<T>(path: string, body: any, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(`POST ${path} failed: ${res.status} ${message}`);
  }
  return res.json();
}

export type Task = {
  id: number;
  name: string;
  slug: string;
  category?: string;
  description?: string;
};

export type TaskStandard = {
  id: number;
  level: string;
  target_time_seconds: number;
  max_minor_errors: number;
  max_major_errors: number;
  consecutive_required: number;
  objective_criteria?: Record<string, unknown>;
};

export type ErrorType = {
  id: number;
  name: string;
  description?: string;
  severity: 'minor' | 'major' | 'critical';
};

export type AttemptResponse = {
  id: number;
  task_id: number;
  standard_id: number;
  started_at: string;
  ended_at: string;
  time_seconds: number;
  score: number;
  proficiency: boolean;
  errors: ErrorType[];
};

export type UserSummary = {
  proficient_tasks: number;
  total_tasks: number;
  task_details: {
    task_id: number;
    task_name: string;
    best_time_seconds: number | null;
    best_score: number | null;
  }[];
};

export type Profile = {
  id: number;
  email: string;
  full_name?: string | null;
  created_at: string;
};

export type TokenResponse = { access_token: string; token_type: string };

export async function login(email: string, password: string): Promise<TokenResponse> {
  const form = new URLSearchParams();
  form.set('username', email);
  form.set('password', password);

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Login failed: ${text}`);
  }
  return res.json();
}

export async function register(payload: {
  email: string;
  password: string;
  full_name?: string;
}): Promise<Profile> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Registration failed: ${text}`);
  }
  return res.json();
}

export async function getProfile(token: string): Promise<Profile> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Profile fetch failed: ${text}`);
  }
  return res.json();
}

export type LeaderboardEntry = {
  user_id: number;
  user_email: string;
  task_id: number;
  task_name: string;
  score: number;
  time_seconds: number;
};
