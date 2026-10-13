const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    stack?: string;
  };
}

// Callback to call when a 401 is received — set by AuthContext
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(cb: () => void) {
  onUnauthorized = cb;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('devtrack_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    // Auto-logout on expired/invalid token
    if (response.status === 401) {
      localStorage.removeItem('devtrack_token');
      if (onUnauthorized) onUnauthorized();
      return {
        success: false,
        error: { message: 'Session expired. Please log in again.' },
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: {
          message: data.error?.message || data.message || `Request failed with status ${response.status}`,
        },
      };
    }

    return data;
  } catch (err: any) {
    return {
      success: false,
      error: {
        message: err.message || 'Network error. Please check backend connection.',
      },
    };
  }
}

// ── Typed API helpers ─────────────────────────────────────────────────────────

export const roadmapApi = {
  get: () => apiFetch('/roadmaps'),
  patchTopic: (topicId: string, complete: boolean) =>
    apiFetch(`/roadmaps/topics/${topicId}`, {
      method: 'PATCH',
      body: JSON.stringify({ complete }),
    }),
};

export const logsApi = {
  getAll: () => apiFetch('/daily-logs'),
  getStats: () => apiFetch('/daily-logs/stats'),
  create: (payload: object) =>
    apiFetch('/daily-logs', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: string, payload: object) =>
    apiFetch(`/daily-logs/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id: string) =>
    apiFetch(`/daily-logs/${id}`, { method: 'DELETE' }),
};

export const gamificationApi = {
  get: () => apiFetch('/gamification'),
  getGoals: () => apiFetch('/goals'),
  getBadges: () => apiFetch('/badges'),
};

export const usersApi = {
  getMe: () => apiFetch('/users/me'),
  updateProfile: (payload: {
    name?: string;
    username?: string;
    avatarUrl?: string;
    bio?: string;
    learningGoal?: string;
    todayGoal?: number;
    weeklyGoal?: number;
  }) =>
    apiFetch('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  changePassword: (payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) =>
    apiFetch('/users/me/password', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
};

export const aiApi = {
  chat: (
    message: string,
    history?: Array<{ role: 'user' | 'assistant'; content: string }>
  ) =>
    apiFetch<{ message: string }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    }),
};


