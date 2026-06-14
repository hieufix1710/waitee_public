'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const AUTH_KEY = 'hiu-auth';

interface AuthData {
  access_token: string;
  refresh_token: string;
  expired_at: number;
  user: {
    uid: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    phone?: string;
    verified_email: boolean;
  };
  provider: string;
}

interface AuthContextType {
  user: AuthData['user'] | null;
  isAuthenticated: boolean;
  login: (data: AuthData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthData['user'] | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) {
        const data = JSON.parse(raw) as AuthData;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (data?.user?.uid) setUser(data.user);
      }
    } catch { /* empty */ }
    setMounted(true);
  }, []);

  const login = (data: AuthData) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  if (!mounted) {
    return (
      <AuthContext.Provider value={{ user: null, isAuthenticated: false, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
