'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  phone?: string | null;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER' | string;
  roleDisplayName?: string;
  permissions?: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  role: string | null;
  loading: boolean;
  login: (email: string, password: string, portal?: 'admin' | 'storefront') => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('glowseoul_user');
        return cached ? JSON.parse(cached) : null;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && data.authenticated && data.user) {
        setUser(data.user);
        try {
          localStorage.setItem('glowseoul_user', JSON.stringify(data.user));
        } catch {}
      } else {
        setUser(null);
        try {
          localStorage.removeItem('glowseoul_user');
        } catch {}
      }
    } catch {
      setUser(null);
      try {
        localStorage.removeItem('glowseoul_user');
      } catch {}
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string, portal: 'admin' | 'storefront' = 'storefront') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, portal }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Đăng nhập không thành công' };
      }

      setUser(data.user);
      try {
        localStorage.setItem('glowseoul_user', JSON.stringify(data.user));
      } catch {}
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Lỗi kết nối máy chủ' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      setUser(null);
      try {
        localStorage.removeItem('glowseoul_user');
      } catch {}
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
