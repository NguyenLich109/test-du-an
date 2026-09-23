import Layout from '../components/Layout';
import Badge from '../components/Badge';
import { DataTable, MockDataNotice } from '../components/DataTable';

const MOCK_LOGS = [
  { time: '15/09/2026 09:14', user: '[email protected]', app: 'ERP', ip: '203.0.113.10', result: 'active' },
  { time: '15/09/2026 09:10', user: '[email protected]', app: 'HR', ip: '203.0.113.42', result: 'active' },
  { time: '15/09/2026 08:57', user: '[email protected]', app: 'CRM', ip: '198.51.100.7', result: 'revoked' },
  { time: '15/09/2026 08:40', user: '[email protected]', app: 'ERP', ip: '203.0.113.10', result: 'active' },
];

export default function AuditLogPage() {
  return (
    <Layout title="Audit Log" subtitle="Lịch sử đăng nhập và các sự kiện xác thực trong hệ thống">
      <MockDataNotice endpointHint="GET /admin/audit-log" />
      <DataTable columns={['Thời gian', 'User', 'App', 'IP', 'Kết quả']}>
        {MOCK_LOGS.map((l, i) => (
          <tr key={i} className="border-b border-border last:border-0">
            <td className="px-5 py-3.5 text-ink/70">{l.time}</td>
            <td className="px-5 py-3.5 text-ink">{l.user}</td>
            <td className="px-5 py-3.5 text-ink/70">{l.app}</td>
            <td className="px-5 py-3.5 font-key text-xs text-ink/60">{l.ip}</td>
            <td className="px-5 py-3.5">
              <Badge status={l.result}>{l.result === 'active' ? 'Thành công' : 'Thất bại'}</Badge>
            </td>
          </tr>
        ))}
      </DataTable>
    </Layout>
  );
}
