import { useState } from 'react';
import Layout from '../components/Layout';
import { MockDataNotice } from '../components/DataTable';

export default function MfaSettingsPage() {
  const [requireAllOrgs, setRequireAllOrgs] = useState(false);
  const [requireAdminRole, setRequireAdminRole] = useState(true);

  return (
    <Layout title="Cấu hình MFA" subtitle="Bắt buộc xác minh 2 lớp theo tổ chức hoặc theo vai trò">
      <MockDataNotice endpointHint="PATCH /admin/settings/mfa" />
      <div className="bg-surface-raised border border-border rounded-2xl p-6 max-w-xl space-y-5">
        <ToggleRow
          label="Bắt buộc MFA cho toàn bộ Organization"
          desc="Mọi user, không phân biệt vai trò, đều phải xác minh OTP khi đăng nhập"
          checked={requireAllOrgs}
          onChange={setRequireAllOrgs}
        />
        <ToggleRow
          label="Bắt buộc MFA cho vai trò Admin"
          desc="Chỉ áp dụng cho user có role admin ở bất kỳ app nào"
          checked={requireAdminRole}
          onChange={setRequireAdminRole}
        />
        <button className="bg-ink text-white text-sm px-4 py-2.5 rounded-lg hover:bg-brand-700 transition-colors">
          Lưu cấu hình
        </button>
      </div>
    </Layout>
  );
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-sm font-medium text-ink">{label}</div>
        <div className="text-xs text-ink/50 mt-0.5">{desc}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`shrink-0 w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-brand-500' : 'bg-black/15'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}
