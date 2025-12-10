'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Profile, TokenResponse } from '../lib/api';
import { getProfile, login as apiLogin, register as apiRegister } from '../lib/api';

type AuthContextValue = {
  token: string | null;
  user: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function persistToken(value: string | null) {
  if (typeof window === 'undefined') return;
  if (value) {
    window.localStorage.setItem('surgitrack_token', value);
  } else {
    window.localStorage.removeItem('surgitrack_token');
  }
}

async function fetchProfile(token: string) {
  try {
    const me = await getProfile(token);
    return me;
  } catch (err) {
    console.error('Failed to load profile', err);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('surgitrack_token') : null;
    if (saved) {
      setToken(saved);
      fetchProfile(saved).then((profile) => {
        if (profile) {
          setUser(profile);
        } else {
          // Token is stale or invalid; clear it so UI stops firing 401s.
          persistToken(null);
          setToken(null);
          setUser(null);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    setToken(null);
    setUser(null);
    persistToken(null);
  };

  const login = async (email: string, password: string) => {
    const response: TokenResponse = await apiLogin(email, password);
    setToken(response.access_token);
    persistToken(response.access_token);
    const profile = await fetchProfile(response.access_token);
    if (profile) {
      setUser(profile);
    } else {
      // If profile cannot be fetched, clear token to avoid confusing 401 loops.
      logout();
      throw new Error('Login succeeded but profile could not be loaded. Please try again.');
    }
  };

  const register = async (email: string, password: string, fullName?: string) => {
    await apiRegister({ email, password, full_name: fullName });
    await login(email, password);
  };

  const value: AuthContextValue = { token, user, loading, login, logout, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
