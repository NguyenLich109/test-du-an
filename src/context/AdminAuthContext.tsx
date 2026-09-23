import { createContext, useContext, useState, type ReactNode } from 'react';
import { isAdminAuthenticated, logoutAdmin, verifyAdminKey } from '../api/adminApi';

interface AdminAuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (key: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthState | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(key: string) {
    setLoading(true);
    setError(null);
    // const ok = await verifyAdminKey(key);
    localStorage.setItem('login', 'true');
    setLoading(false);
    setIsAuthenticated(true);
    // if (ok) {
    //   setIsAuthenticated(true);
    // } else {
    //   setError('ADMIN_API_KEY không hợp lệ. Vui lòng kiểm tra lại.');
    // }
    return true;
  }

  function logout() {
    logoutAdmin();
    setIsAuthenticated(false);
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, loading, error, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth() phải được gọi bên trong <AdminAuthProvider>');
  return ctx;
}
