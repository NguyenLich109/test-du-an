import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { OrganizationsApi, ApplicationsApi, type Organization } from '../api/adminApi';

export default function DashboardPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [appCount, setAppCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const list = await OrganizationsApi.list();
      setOrgs(list);
      // Đếm tổng số application bằng cách gọi song song cho từng org
      // (backend chưa có endpoint đếm tổng, đây là cách gộp phía client cho MVP)
      const counts = await Promise.all(list.map((o) => ApplicationsApi.listByOrg(o._id).then((a) => a.length).catch(() => 0)));
      setAppCount(counts.reduce((a, b) => a + b, 0));
      setLoading(false);
    })();
  }, []);

  const activeOrgs = orgs.filter((o) => o.status === 'active').length;
  const suspendedOrgs = orgs.length - activeOrgs;

  return (
    <Layout title="Dashboard tổng quan" subtitle="Số liệu tổng hợp toàn hệ thống SSO">
      {loading ? (
        <p className="text-ink/50 text-sm">Đang tải số liệu...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Tổng số Organization" value={orgs.length} />
            <StatCard label="Tổng số Application" value={appCount ?? '—'} />
            <StatCard label="Organization đang Active" value={activeOrgs} />
            <StatCard label="Organization bị Suspended" value={suspendedOrgs} tone={suspendedOrgs > 0 ? 'warn' : 'default'} />
          </div>

          <div className="bg-surface-raised border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-ink">Organization gần đây</h2>
              <Link to="/organizations" className="text-sm text-brand-500 hover:underline">
                Xem tất cả →
              </Link>
            </div>
            <div className="space-y-2">
              {orgs.slice(0, 5).map((o) => (
                <Link
                  key={o._id}
                  to={`/organizations/${o._id}`}
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-black/[0.03] transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-ink">{o.name}</div>
                    <div className="text-xs text-ink/50 font-key">{o.orgKey}</div>
                  </div>
                  <span className="text-xs text-ink/40">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</span>
                </Link>
              ))}
              {orgs.length === 0 && <p className="text-sm text-ink/50 py-4">Chưa có Organization nào. Tạo mới ở trang Organizations.</p>}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
