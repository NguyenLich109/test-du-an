import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { DataTable, EmptyState } from '../components/DataTable';
import { OrganizationsApi, ApiError, type Organization } from '../api/adminApi';

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  async function reload() {
    setLoading(true);
    setOrgs(await OrganizationsApi.list());
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

  return (
    <Layout
      title="Danh sách Organization"
      subtitle={`${orgs.length} tổ chức đang sử dụng hệ thống SSO`}
      actions={
        <button
          onClick={() => setShowCreate(true)}
          className="bg-ink text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
        >
          + Tạo Organization
        </button>
      }
    >
      {loading ? (
        <p className="text-sm text-ink/50">Đang tải...</p>
      ) : (
        <DataTable columns={['Tên tổ chức', 'ORG_KEY', 'Gói dịch vụ', 'Trạng thái', 'Ngày tạo', '']}>
          {orgs.map((o) => (
            <tr key={o._id} className="border-b border-border last:border-0 hover:bg-black/[0.015]">
              <td className="px-5 py-3.5 font-medium text-ink">{o.name}</td>
              <td className="px-5 py-3.5 font-key text-xs text-ink/60">{o.orgKey}</td>
              <td className="px-5 py-3.5 text-ink/70">{o.plan}</td>
              <td className="px-5 py-3.5">
                <Badge status={o.status}>{o.status === 'active' ? 'Active' : 'Suspended'}</Badge>
              </td>
              <td className="px-5 py-3.5 text-ink/50">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</td>
              <td className="px-5 py-3.5 text-right">
                <Link to={`/organizations/${o._id}`} className="text-brand-500 text-sm hover:underline">
                  Chi tiết →
                </Link>
              </td>
            </tr>
          ))}
          {orgs.length === 0 && (
            <tr>
              <td colSpan={6}>
                <EmptyState message="Chưa có Organization nào. Bấm “+ Tạo Organization” để bắt đầu." />
              </td>
            </tr>
          )}
        </DataTable>
      )}

      {showCreate && (
        <CreateOrganizationModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            reload();
          }}
        />
      )}
    </Layout>
  );
}

function CreateOrganizationModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState('');
  const [plan, setPlan] = useState('standard');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await OrganizationsApi.create({ name, plan });
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Tạo Organization thất bại');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title="Tạo Organization mới" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-ink/60 mb-1.5">Tên tổ chức</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="VD: Công ty Demo ABC"
          />
        </div>
        <div>
          <label className="block text-xs text-ink/60 mb-1.5">Gói dịch vụ (plan)</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="standard">Standard</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
        {error && <p className="text-sm text-accent-red">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-40 hover:bg-brand-700 transition-colors"
        >
          {submitting ? 'Đang tạo...' : 'Tạo mới'}
        </button>
      </form>
    </Modal>
  );
}
