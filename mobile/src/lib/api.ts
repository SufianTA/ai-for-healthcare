import Constants from 'expo-constants';
import {
  AttemptCreatePayload,
  AttemptResponse,
  ErrorType,
  LeaderboardEntry,
  Profile,
  Task,
  TaskStandard,
  UserSummary,
} from '../types';

const API_BASE =
  Constants.expoConfig?.extra?.apiBase || process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return res.json();
}

export async function login(email: string, password: string) {
  const form = new FormData();
  form.append('username', email);
  form.append('password', password);

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: form,
  });
  return handleResponse<{ access_token: string; token_type: string }>(res);
}

export async function register(payload: { email: string; password: string; full_name?: string }) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Profile>(res);
}

export async function getProfile(token: string) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<Profile>(res);
}

export async function getTasks(token: string) {
  const res = await fetch(`${API_BASE}/tasks/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<Task[]>(res);
}

export async function getTaskBySlug(slug: string, token: string) {
  const res = await fetch(`${API_BASE}/tasks/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<Task>(res);
}

export async function getStandards(taskId: number, token: string) {
  const res = await fetch(`${API_BASE}/tasks/${taskId}/standards`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<TaskStandard[]>(res);
}

export async function getErrorTypes(token: string) {
  const res = await fetch(`${API_BASE}/error-types/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<ErrorType[]>(res);
}

export async function createAttempt(payload: AttemptCreatePayload, token: string) {
  const res = await fetch(`${API_BASE}/attempts/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<AttemptResponse>(res);
}

export async function getSummary(token: string) {
  const res = await fetch(`${API_BASE}/attempts/me/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<UserSummary>(res);
}

export async function getLeaderboard(token: string) {
  const res = await fetch(`${API_BASE}/leaderboard/global`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<LeaderboardEntry[]>(res);
}
