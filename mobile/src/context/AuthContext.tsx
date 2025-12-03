import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getProfile, login as apiLogin, register as apiRegister } from '../lib/api';
import { Profile } from '../types';

const TOKEN_KEY = 'surgitrack_token';

interface AuthContextValue {
  token: string | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function saveToken(token: string) {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }
}

async function loadToken() {
  let token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (!token) {
    token = await AsyncStorage.getItem(TOKEN_KEY);
  }
  return token;
}

async function clearToken() {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await loadToken();
      if (stored) {
        setToken(stored);
        try {
          const user = await getProfile(stored);
          setProfile(user);
        } catch (err) {
          console.warn('Failed to load profile', err);
          await clearToken();
          setToken(null);
        }
      }
      setLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    await saveToken(res.access_token);
    setToken(res.access_token);
    const user = await getProfile(res.access_token);
    setProfile(user);
  }, []);

  const register = useCallback(async (email: string, password: string, fullName?: string) => {
    await apiRegister({ email, password, full_name: fullName });
    await signIn(email, password);
  }, [signIn]);

  const signOut = useCallback(async () => {
    await clearToken();
    setToken(null);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, profile, loading, signIn, signOut, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
