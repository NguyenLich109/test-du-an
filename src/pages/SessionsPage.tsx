import Layout from '../components/Layout';
import { DataTable, MockDataNotice } from '../components/DataTable';

const MOCK_SESSIONS = [
  { user: '[email protected]', device: 'Chrome trên Windows · 203.0.113.10', app: 'ERP', since: '2 giờ trước' },
  { user: '[email protected]', device: 'Safari trên iPhone · 198.51.100.7', app: 'HR Mobile', since: '30 phút trước' },
];

export default function SessionsPage() {
  return (
    <Layout title="Active Sessions" subtitle="Phiên đăng nhập đang hoạt động trên toàn hệ thống">
      <MockDataNotice endpointHint="GET /admin/sessions (đọc trực tiếp key sso:session:* trong Redis)" />
      <DataTable columns={['User', 'Thiết bị / IP', 'App', 'Đăng nhập lúc', '']}>
        {MOCK_SESSIONS.map((s, i) => (
          <tr key={i} className="border-b border-border last:border-0">
            <td className="px-5 py-3.5 text-ink">{s.user}</td>
            <td className="px-5 py-3.5 text-ink/70">{s.device}</td>
            <td className="px-5 py-3.5 text-ink/70">{s.app}</td>
            <td className="px-5 py-3.5 text-ink/50">{s.since}</td>
            <td className="px-5 py-3.5 text-right">
              <button className="text-accent-red text-sm hover:underline">Thu hồi session</button>
            </td>
          </tr>
        ))}
      </DataTable>
    </Layout>
  );
}
