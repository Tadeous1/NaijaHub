import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { api, type User } from '../services/api';

type AuthContextValue = { user: User | null; loading: boolean; signIn: (email: string, password: string) => Promise<User>; register: (name: string, email: string, password: string) => Promise<User>; signOut: () => Promise<void> };
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.me().then(({ user }) => setUser(user)).catch(() => setUser(null)).finally(() => setLoading(false)); }, []);
  const value = useMemo<AuthContextValue>(() => ({
    user, loading,
    signIn: async (email, password) => { const result = await api.login({ email, password }); setUser(result.user); return result.user; },
    register: async (name, email, password) => { const result = await api.register({ name, email, password }); setUser(result.user); return result.user; },
    signOut: async () => { await api.logout(); setUser(null); },
  }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value; }
