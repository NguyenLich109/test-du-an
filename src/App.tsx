import { Routes, Route, Navigate, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import OrganizationsPage from './pages/OrganizationsPage';
import OrganizationDetailPage from './pages/OrganizationDetailPage';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import AuditLogPage from './pages/AuditLogPage';
import SessionsPage from './pages/SessionsPage';
import MfaSettingsPage from './pages/MfaSettingsPage';
import SettingsPage from './pages/SettingsPage';
import AdminsPage from './pages/AdminsPage';

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const router = createBrowserRouter(
    createRoutesFromElements(
      <AdminAuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<RequireAuth><DashboardPage /></RequireAuth>} />
          <Route path="/organizations" element={<RequireAuth><OrganizationsPage /></RequireAuth>} />
          <Route path="/organizations/:orgId" element={<RequireAuth><OrganizationDetailPage /></RequireAuth>} />
          <Route path="/users" element={<RequireAuth><UsersPage /></RequireAuth>} />
          <Route path="/roles" element={<RequireAuth><RolesPage /></RequireAuth>} />
          <Route path="/audit-log" element={<RequireAuth><AuditLogPage /></RequireAuth>} />
          <Route path="/sessions" element={<RequireAuth><SessionsPage /></RequireAuth>} />
          <Route path="/mfa" element={<RequireAuth><MfaSettingsPage /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
          <Route path="/admins" element={<RequireAuth><AdminsPage /></RequireAuth>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminAuthProvider>
    )
  )

export default function App() {
  return (
    <AdminAuthProvider>
      <RouterProvider router={router} />
    </AdminAuthProvider>
  );
}