import { useState } from 'react';
import Layout from '../components/Layout';
import { MockDataNotice } from '../components/DataTable';

export default function SettingsPage() {
  const [accessTtl, setAccessTtl] = useState('900');
  const [refreshTtl, setRefreshTtl] = useState('2592000');
  const [minPasswordLength, setMinPasswordLength] = useState('8');

  return (
    <Layout title="Cài đặt chung" subtitle="Cấu hình mặc định áp dụng cho toàn hệ thống">
      <MockDataNotice endpointHint="PATCH /admin/settings" />
      <div className="bg-surface-raised border border-border rounded-2xl p-6 max-w-xl space-y-4">
        <FieldRow label="TTL Access Token (giây)" value={accessTtl} onChange={setAccessTtl} />
        <FieldRow label="TTL Refresh Token (giây)" value={refreshTtl} onChange={setRefreshTtl} />
        <FieldRow label="Độ dài mật khẩu tối thiểu" value={minPasswordLength} onChange={setMinPasswordLength} />
        <button className="bg-ink text-white text-sm px-4 py-2.5 rounded-lg hover:bg-brand-700 transition-colors">
          Lưu thay đổi
        </button>
      </div>
    </Layout>
  );
}

function FieldRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs text-ink/60 mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
    </div>
  );
}
