import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function LoginPage() {
  const { login, loading, error } = useAdminAuth();
  const [key, setKey] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // const ok = await login(key);
    // if (ok) navigate('/', { replace: true });
    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-surface-raised border border-border rounded-2xl p-8">
        <div className="text-sm text-ink/50 mb-1">Company SSO</div>
        <h1 className="text-xl font-semibold text-ink mb-6">Đăng nhập Admin Panel</h1>

        <label className="block text-xs text-ink/60 mb-1.5">ADMIN_API_KEY</label>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Nhập admin key từ file .env backend"
          className="w-full border border-border rounded-lg px-3 py-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          autoFocus
        />

        {error && <div className="text-sm text-accent-red mb-4">{error}</div>}

        <button
          type="submit"
          disabled={loading || !key}
          className="w-full bg-ink text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-40 hover:bg-brand-700 transition-colors"
        >
          {loading ? 'Đang kiểm tra...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
}
