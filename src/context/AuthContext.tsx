import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, setUnauthorizedHandler } from '../services/api';

export interface AuthUser {
  _id?: string;
  id?: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  initials: string;
  streak: number;
  longestStreak: number;
  totalHours: number;
  roadmapCompletion: number;
  todayHours: number;
  todayGoal: number;
  weeklyGoal: number;
  currentModule: string;
  xp?: number;
  level: number | string;
  learningGoal?: string;
  bio?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (updatedUser: AuthUser) => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('devtrack_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem('devtrack_token');
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // Wire 401 auto-logout handler once
  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem('devtrack_token');
    if (!storedToken) return;
    const res = await apiFetch<{ user: AuthUser }>('/auth/me');
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    }
  }, []);

  // Hydrate session on initial load
  useEffect(() => {
    async function hydrateUser() {
      const storedToken = localStorage.getItem('devtrack_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      const res = await apiFetch<{ user: AuthUser }>('/auth/me');
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        setToken(storedToken);
      } else {
        localStorage.removeItem('devtrack_token');
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    }

    hydrateUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiFetch<{ user: AuthUser; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.success && res.data) {
      const { user: authedUser, token: authToken } = res.data;
      localStorage.setItem('devtrack_token', authToken);
      setToken(authToken);
      setUser(authedUser);
      return { success: true };
    }

    return {
      success: false,
      error: res.error?.message || 'Login failed. Please check your credentials.',
    };
  };

  const signup = async (name: string, username: string, email: string, password: string) => {
    const res = await apiFetch<{ user: AuthUser; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, username, email, password }),
    });

    if (res.success && res.data) {
      const { user: newUser, token: authToken } = res.data;
      localStorage.setItem('devtrack_token', authToken);
      setToken(authToken);
      setUser(newUser);
      return { success: true };
    }

    return {
      success: false,
      error: res.error?.message || 'Registration failed. Please check your details.',
    };
  };

  const updateUser = useCallback((updatedUser: AuthUser) => {
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
