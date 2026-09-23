# SSO Admin Panel

Admin Panel quản trị hệ thống SSO — React 19.2 + Vite 8 + TypeScript 6 + Tailwind CSS v4.

## Cài đặt

```bash
npm install
cp .env.example .env
# chỉnh VITE_API_BASE_URL trỏ tới sso-backend đang chạy (mặc định http://localhost:4000)
npm run dev
```

Mở `http://localhost:5173`, đăng nhập bằng `ADMIN_API_KEY` (giá trị trong file `.env` của `sso-backend`).

## Trạng thái từng màn hình (14 màn theo danh sách nhóm B)

Đã **nối dữ liệu thật** với `sso-backend` (Organizations/Applications API):

| Màn hình | API đang dùng |
|---|---|
| Dashboard tổng quan | `GET /admin/organizations` + `GET /admin/organizations/:id/applications` (tổng hợp phía client) |
| Danh sách Organization | `GET/POST /admin/organizations` |
| Chi tiết Organization | `GET /admin/organizations` (lọc theo id) + `PATCH /admin/organizations/:id/status` |
| Tạo Organization mới | `POST /admin/organizations` |
| Danh sách Application (trong Chi tiết Organization) | `GET /admin/organizations/:id/applications` |
| Tạo Application mới | `POST /admin/organizations/:id/applications` |
| Chi tiết Application (thu hồi) | `PATCH /admin/applications/:id/revoke` |

Đang **hiển thị dữ liệu mẫu** (backend chưa có endpoint tương ứng — mỗi trang có banner ghi rõ endpoint cần bổ sung):

| Màn hình | Endpoint cần bổ sung ở backend |
|---|---|
| Quản lý User | `GET/PATCH /admin/users` |
| Role & Permission | `GET/POST /admin/roles` |
| Audit Log | `GET /admin/audit-log` (nên ghi log vào MongoDB hoặc Elasticsearch riêng) |
| Active Sessions | `GET /admin/sessions` (đọc key `sso:session:*` trong Redis) |
| Cấu hình MFA | `PATCH /admin/settings/mfa` |
| Cài đặt chung | `GET/PATCH /admin/settings` |
| Quản lý Admin vận hành | `GET/POST /admin/operators` |

## Công nghệ & phiên bản

- **React 19.2** — Actions, `useOptimistic`, cải tiến Suspense
- **Vite 8** — build tool, dev server HMR
- **TypeScript 6.0**
- **Tailwind CSS v4** — cấu hình theo kiểu CSS-first (`@theme` trong `src/index.css`), không cần `tailwind.config.js`
- **React Router 7**

## Thiết kế

Bảng màu riêng (đặt trong `@theme` ở `src/index.css`), đồng bộ với tông tím `#534AB7` / teal `#0F6E56` đã dùng xuyên suốt các sơ đồ kiến trúc trước đó, trên nền trung tính ấm `#FAF9F6` thay vì trắng thuần. Các giá trị dạng khóa (`APP_KEY`, `ORG_KEY`, IP...) dùng font monospace (`JetBrains Mono`) để phân biệt rõ với text thường.

## Cấu trúc thư mục

```
src/
  api/adminApi.ts           API client gọi sso-backend
  context/AdminAuthContext.tsx  Quản lý đăng nhập bằng ADMIN_API_KEY
  components/                Sidebar, Layout, Badge, Modal, DataTable, StatCard
  pages/                      14 trang tương ứng danh sách màn hình Admin Panel
```

## Lưu ý khi build production

Cơ chế xác thực admin hiện dùng 1 `ADMIN_API_KEY` tĩnh (phù hợp MVP/nội bộ). Trước khi đưa ra ngoài, nên thay bằng:
- Đăng nhập admin qua chính luồng SSO (email/password + MFA bắt buộc), phân quyền theo role thay vì 1 key dùng chung.
- Route `/admin/*` ở backend nên giới hạn theo IP nội bộ hoặc VPN.
