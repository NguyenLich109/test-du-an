import Layout from '../components/Layout';
import Badge from '../components/Badge';
import { DataTable, MockDataNotice } from '../components/DataTable';

const MOCK_USERS = [
  { email: '[email protected]', name: 'Nguyễn Văn A', org: 'Công ty Demo ABC', status: 'active' },
  { email: '[email protected]', name: 'Trần Thị B', org: 'Công ty Demo ABC', status: 'active' },
  { email: '[email protected]', name: 'Lê Văn C', org: 'Công ty XYZ', status: 'locked' },
];

export default function UsersPage() {
  return (
    <Layout title="Quản lý User" subtitle="Danh sách người dùng theo từng tổ chức">
      <MockDataNotice endpointHint="GET /admin/users" />
      <DataTable columns={['Email', 'Họ tên', 'Tổ chức', 'Trạng thái', '']}>
        {MOCK_USERS.map((u) => (
          <tr key={u.email} className="border-b border-border last:border-0">
            <td className="px-5 py-3.5 text-ink">{u.email}</td>
            <td className="px-5 py-3.5 text-ink/70">{u.name}</td>
            <td className="px-5 py-3.5 text-ink/70">{u.org}</td>
            <td className="px-5 py-3.5">
              <Badge status={u.status}>{u.status === 'active' ? 'Active' : 'Locked'}</Badge>
            </td>
            <td className="px-5 py-3.5 text-right">
              <button className="text-brand-500 text-sm hover:underline">
                {u.status === 'active' ? 'Khoá tài khoản' : 'Mở khoá'}
              </button>
            </td>
          </tr>
        ))}
      </DataTable>
    </Layout>
  );
}
