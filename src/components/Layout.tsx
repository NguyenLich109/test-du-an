import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function Layout({ title, subtitle, actions, children }: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { logout } = useAdminAuth();

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 bg-surface/90 backdrop-blur border-b border-border px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-ink">{title}</h1>
            {subtitle && <p className="text-sm text-ink/60 mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            {actions}
            <button
              onClick={logout}
              className="text-sm text-ink/60 hover:text-ink px-3 py-1.5 rounded-lg hover:bg-black/5 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
