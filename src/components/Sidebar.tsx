import { NavLink } from 'react-router-dom';

const NAV_GROUPS = [
  {
    label: 'Tổng quan',
    items: [{ to: '/', label: 'Dashboard', end: true }],
  },
  {
    label: 'Tổ chức & Ứng dụng',
    items: [{ to: '/organizations', label: 'Organizations' }],
  },
  {
    label: 'Người dùng & Phân quyền',
    items: [
      { to: '/users', label: 'Quản lý User' },
      { to: '/roles', label: 'Role & Permission' },
    ],
  },
  {
    label: 'Bảo mật & Giám sát',
    items: [
      { to: '/audit-log', label: 'Audit Log' },
      { to: '/sessions', label: 'Active Sessions' },
      { to: '/mfa', label: 'Cấu hình MFA' },
    ],
  },
  {
    label: 'Hệ thống',
    items: [
      { to: '/settings', label: 'Cài đặt chung' },
      { to: '/admins', label: 'Quản lý Admin' },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-ink text-white flex flex-col">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="text-sm text-white/50">Company SSO</div>
        <div className="text-lg font-semibold">Admin Panel</div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="px-2 mb-1.5 text-[11px] uppercase tracking-wide text-white/40">{group.label}</div>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={'end' in item ? item.end : false}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive ? 'bg-brand-500 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
