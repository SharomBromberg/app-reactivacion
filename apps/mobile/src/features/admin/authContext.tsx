import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { setUnauthorizedHandler } from '@/lib/api';
import { clearSession, loadSession, saveSession } from '@/lib/auth/tokenStorage';
import { login as apiLogin } from './api';
import type { AdminSession as AdminIdentity } from './types';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AdminAuthContextValue = {
  status: AuthStatus;
  admin: AdminIdentity | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [admin, setAdmin] = useState<AdminIdentity | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadSession().then((session) => {
      if (cancelled) return;
      setAdmin(session?.admin ?? null);
      setStatus(session ? 'authenticated' : 'unauthenticated');
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setAdmin(null);
    setStatus('unauthenticated');
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      // Token inválido/expirado detectado en cualquier llamada a /admin/*.
      void logout();
    });

    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiLogin(email, password);
    await saveSession({ accessToken: response.accessToken, admin: response.admin });
    setAdmin(response.admin);
    setStatus('authenticated');
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({ status, admin, login, logout }),
    [status, admin, login, logout],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth debe usarse dentro de AdminAuthProvider');
  }
  return ctx;
}
