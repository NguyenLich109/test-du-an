import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { DataTable, EmptyState } from '../components/DataTable';
import {
  OrganizationsApi,
  ApplicationsApi,
  ApiError,
  type Organization,
  type Application,
} from '../api/adminApi';

const PLATFORM_LABEL: Record<string, string> = {
  web: 'Web (SSR)',
  spa: 'Web (SPA)',
  mobile: 'Mobile',
  desktop: 'Desktop (Windows)',
  server: 'Server-to-server',
};

export default function OrganizationDetailPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const [org, setOrg] = useState<Organization | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateApp, setShowCreateApp] = useState(false);
  const [newSecret, setNewSecret] = useState<{ appKey: string; appSecret: string; name: string } | null>(null);

  async function reload() {
    if (!orgId) return;
    setLoading(true);
    const [allOrgs, appList] = await Promise.all([OrganizationsApi.list(), ApplicationsApi.listByOrg(orgId)]);
    setOrg(allOrgs.find((o) => o._id === orgId) || null);
    setApps(appList);
    setLoading(false);
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  async function toggleOrgStatus() {
    if (!org) return;
    const nextStatus = org.status === 'active' ? 'suspended' : 'active';
    const updated = await OrganizationsApi.updateStatus(org._id, nextStatus);
    setOrg(updated);
  }

  async function handleRevoke(appId: string) {
    if (!confirm('Thu hồi quyền truy cập của ứng dụng này? Token đã cấp sẽ không còn hiệu lực khi hết hạn.')) return;
    await ApplicationsApi.revoke(appId);
    reload();
  }

  if (loading) {
    return (
      <Layout title="Chi tiết Organization">
        <p className="text-sm text-ink/50">Đang tải...</p>
      </Layout>
    );
  }

  if (!org) {
    return (
      <Layout title="Không tìm thấy Organization">
        <p className="text-sm text-ink/50">
          Organization này không tồn tại. <Link to="/organizations" className="text-brand-500 hover:underline">Quay lại danh sách</Link>
        </p>
      </Layout>
    );
  }

  return (
    <Layout
      title={org.name}
      subtitle="Chi tiết Organization"
      actions={
        <button
          onClick={toggleOrgStatus}
          className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
            org.status === 'active'
              ? 'border-accent-red text-accent-red hover:bg-accent-red-bg'
              : 'border-accent-teal text-accent-teal hover:bg-accent-teal-bg'
          }`}
        >
          {org.status === 'active' ? 'Tạm ngưng Organization' : 'Kích hoạt lại Organization'}
        </button>
      }
    >
      <div className="grid grid-cols-4 gap-4 mb-8">
        <InfoCell label="ORG_KEY" value={org.orgKey} mono />
        <InfoCell label="Trạng thái" value={<Badge status={org.status}>{org.status === 'active' ? 'Active' : 'Suspended'}</Badge>} />
        <InfoCell label="Gói dịch vụ" value={org.plan} />
        <InfoCell label="Số Application" value={String(apps.length)} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-ink">Applications (ERP / HR / CRM...)</h2>
        <button
          onClick={() => setShowCreateApp(true)}
          className="bg-ink text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
        >
          + Tạo Application
        </button>
      </div>

      <DataTable columns={['Tên app', 'APP_KEY', 'Platform', 'Trạng thái', '']}>
        {apps.map((a) => (
          <tr key={a._id} className="border-b border-border last:border-0 hover:bg-black/[0.015]">
            <td className="px-5 py-3.5 font-medium text-ink">{a.name}</td>
            <td className="px-5 py-3.5 font-key text-xs text-ink/60">{a.appKey}</td>
            <td className="px-5 py-3.5 text-ink/70">{PLATFORM_LABEL[a.platformType] || a.platformType}</td>
            <td className="px-5 py-3.5">
              <Badge status={a.status}>{a.status === 'active' ? 'Active' : 'Revoked'}</Badge>
            </td>
            <td className="px-5 py-3.5 text-right">
              {a.status === 'active' && (
                <button onClick={() => handleRevoke(a._id)} className="text-accent-red text-sm hover:underline">
                  Thu hồi
                </button>
              )}
            </td>
          </tr>
        ))}
        {apps.length === 0 && (
          <tr>
            <td colSpan={5}>
              <EmptyState message="Tổ chức này chưa có Application nào." />
            </td>
          </tr>
        )}
      </DataTable>

      {showCreateApp && (
        <CreateApplicationModal
          orgId={org._id}
          onClose={() => setShowCreateApp(false)}
          onCreated={(app) => {
            setShowCreateApp(false);
            setNewSecret({ appKey: app.appKey, appSecret: app.appSecret || '', name: app.name });
            reload();
          }}
        />
      )}

      {newSecret && <ShowSecretModal data={newSecret} onClose={() => setNewSecret(null)} />}
    </Layout>
  );
}

function InfoCell({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="bg-surface-raised border border-border rounded-2xl p-4">
      <div className="text-xs text-ink/50 mb-1">{label}</div>
      <div className={`text-sm text-ink ${mono ? 'font-key' : 'font-medium'}`}>{value}</div>
    </div>
  );
}

function CreateApplicationModal({
  orgId,
  onClose,
  onCreated,
}: {
  orgId: string;
  onClose: () => void;
  onCreated: (app: Application) => void;
}) {
  const [name, setName] = useState('');
  const [platformType, setPlatformType] = useState<Application['platformType']>('web');
  const [redirectUri, setRedirectUri] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const app = await ApplicationsApi.create(orgId, {
        name,
        platformType,
        redirectUris: redirectUri.split(',').map((s) => s.trim()).filter(Boolean),
      });
      onCreated(app);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Tạo Application thất bại');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title="Tạo Application mới" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-ink/60 mb-1.5">Tên ứng dụng</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="VD: ERP, HR, CRM"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-xs text-ink/60 mb-1.5">Platform</label>
          <select
            value={platformType}
            onChange={(e) => setPlatformType(e.target.value as Application['platformType'])}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="web">Web (Server-side)</option>
            <option value="spa">Web (SPA)</option>
            <option value="mobile">Mobile (React Native)</option>
            <option value="desktop">Desktop (Windows)</option>
            <option value="server">Server-to-server</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-ink/60 mb-1.5">
            Redirect URIs {platformType === 'desktop' && <span className="text-ink/40">(không kèm cổng, VD: http://127.0.0.1/callback)</span>}
          </label>
          <input
            value={redirectUri}
            onChange={(e) => setRedirectUri(e.target.value)}
            required
            placeholder="https://erp.company.com/callback (nhiều URI cách nhau bởi dấu phẩy)"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        {error && <p className="text-sm text-accent-red">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-40 hover:bg-brand-700 transition-colors"
        >
          {submitting ? 'Đang tạo...' : 'Tạo & sinh APP_KEY'}
        </button>
      </form>
    </Modal>
  );
}

function ShowSecretModal({ data, onClose }: { data: { appKey: string; appSecret: string; name: string }; onClose: () => void }) {
  return (
    <Modal title={`Đã tạo "${data.name}" thành công`} onClose={onClose}>
      <div className="space-y-4">
        <div className="px-4 py-3 rounded-xl bg-accent-amber-bg text-accent-amber text-sm">
          <b>APP_SECRET chỉ hiển thị 1 lần duy nhất.</b> Hãy sao chép và lưu lại ngay bây giờ.
        </div>
        <div>
          <div className="text-xs text-ink/50 mb-1">APP_KEY</div>
          <div className="font-key text-sm bg-black/5 rounded-lg px-3 py-2 break-all">{data.appKey}</div>
        </div>
        <div>
          <div className="text-xs text-ink/50 mb-1">APP_SECRET</div>
          <div className="font-key text-sm bg-black/5 rounded-lg px-3 py-2 break-all">{data.appSecret}</div>
        </div>
        <button onClick={onClose} className="w-full bg-ink text-white rounded-lg py-2.5 text-sm font-medium hover:bg-brand-700 transition-colors">
          Đã lưu lại, đóng cửa sổ
        </button>
      </div>
    </Modal>
  );
}
