import Layout from '../components/Layout';
import { DataTable, MockDataNotice } from '../components/DataTable';

const MOCK_ROLES = [
  { name: 'admin', permissions: 18, users: 4 },
  { name: 'hr_manager', permissions: 9, users: 12 },
  { name: 'sales_rep', permissions: 5, users: 47 },
];

export default function RolesPage() {
  return (
    <Layout
      title="Quản lý Role & Permission"
      subtitle="Định nghĩa vai trò và quyền hạn dùng chung giữa các app"
      actions={<button className="bg-ink text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">+ Tạo Role</button>}
    >
      <MockDataNotice endpointHint="GET /admin/roles" />
      <DataTable columns={['Role', 'Số quyền', 'Số user', '']}>
        {MOCK_ROLES.map((r) => (
          <tr key={r.name} className="border-b border-border last:border-0">
            <td className="px-5 py-3.5 font-key text-ink">{r.name}</td>
            <td className="px-5 py-3.5 text-ink/70">{r.permissions}</td>
            <td className="px-5 py-3.5 text-ink/70">{r.users}</td>
            <td className="px-5 py-3.5 text-right">
              <button className="text-brand-500 text-sm hover:underline">Sửa quyền</button>
            </td>
          </tr>
        ))}
      </DataTable>
    </Layout>
  );
}
