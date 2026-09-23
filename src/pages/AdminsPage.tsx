import Layout from '../components/Layout';
import Badge from '../components/Badge';
import { DataTable, MockDataNotice } from '../components/DataTable';

const MOCK_ADMINS = [
  { email: '[email protected]', role: 'Super Admin', status: 'active' },
  { email: '[email protected]', role: 'Org Admin', status: 'active' },
];

export default function AdminsPage() {
  return (
    <Layout
      title="Quản lý Admin vận hành"
      subtitle="Ai được phép truy cập Admin Panel này"
      actions={<button className="bg-ink text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">+ Mời admin</button>}
    >
      <MockDataNotice endpointHint="GET /admin/operators" />
      <DataTable columns={['Email admin', 'Vai trò', 'Trạng thái', '']}>
        {MOCK_ADMINS.map((a) => (
          <tr key={a.email} className="border-b border-border last:border-0">
            <td className="px-5 py-3.5 text-ink">{a.email}</td>
            <td className="px-5 py-3.5 text-ink/70">{a.role}</td>
            <td className="px-5 py-3.5">
              <Badge status={a.status}>Active</Badge>
            </td>
            <td className="px-5 py-3.5 text-right">
              <button className="text-accent-red text-sm hover:underline">Thu hồi quyền</button>
            </td>
          </tr>
        ))}
      </DataTable>
    </Layout>
  );
}
