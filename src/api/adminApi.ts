const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function getAdminKey(): string | null {
  return sessionStorage.getItem('sso_admin_key');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const adminKey = getAdminKey();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(adminKey ? { 'x-admin-key': adminKey } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(res.status, data.error || 'unknown_error', data.error_description || 'Đã có lỗi xảy ra');
  }
  return data as T;
}

// ---------- Types khớp với Mongoose models ở backend ----------
export interface Organization {
  _id: string;
  name: string;
  orgKey: string;
  status: 'active' | 'suspended';
  plan: string;
  createdAt: string;
}

export interface Application {
  _id: string;
  name: string;
  appKey: string;
  organization: string;
  redirectUris: string[];
  allowedScopes: string[];
  platformType: 'web' | 'spa' | 'mobile' | 'desktop' | 'server';
  status: 'active' | 'revoked';
  createdAt: string;
  appSecret?: string; // chỉ có trong response tạo mới, KHÔNG bao giờ trả lại sau đó
}

// ---------- Xác thực Admin (bằng ADMIN_API_KEY của backend) ----------
export async function verifyAdminKey(key: string): Promise<boolean> {
  const prevKey = getAdminKey();
  sessionStorage.setItem('sso_admin_key', key);
  try {
    await request('/admin/organizations');
    return true;
  } catch {
    if (prevKey) sessionStorage.setItem('sso_admin_key', prevKey);
    else sessionStorage.removeItem('sso_admin_key');
    return false;
  }
}

export function logoutAdmin() {
  sessionStorage.removeItem('sso_admin_key');
}

export function isAdminAuthenticated(): boolean {
  return !!getAdminKey();
}

// ---------- Organizations ----------
export const OrganizationsApi = {
  list: () => request<Organization[]>('/admin/organizations'),
  create: (data: { name: string; plan?: string }) =>
    request<Organization>('/admin/organizations', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (orgId: string, status: 'active' | 'suspended') =>
    request<Organization>(`/admin/organizations/${orgId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// ---------- Applications ----------
export const ApplicationsApi = {
  listByOrg: (orgId: string) => request<Application[]>(`/admin/organizations/${orgId}/applications`),
  create: (
    orgId: string,
    data: { name: string; redirectUris: string[]; platformType: Application['platformType']; allowedScopes?: string[] }
  ) =>
    request<Application>(`/admin/organizations/${orgId}/applications`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  revoke: (appId: string) => request<Application>(`/admin/applications/${appId}/revoke`, { method: 'PATCH' }),
};
