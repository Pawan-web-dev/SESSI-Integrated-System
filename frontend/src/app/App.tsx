import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DocumentViewer } from '@/components/shared/DocumentViewer';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { useAppSelector } from './hooks';
import { ROUTES } from './routes';

// Larger pages are loaded on demand so the login page opens quickly.
const RegisterPage = lazy(() => import('@/features/registration/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const ApplicationSubmittedPage = lazy(() => import('@/features/registration/pages/ApplicationSubmittedPage').then((m) => ({ default: m.ApplicationSubmittedPage })));
const InboxPage = lazy(() => import('@/features/inbox/pages/InboxPage').then((m) => ({ default: m.InboxPage })));
const AdminPage = lazy(() => import('@/features/admin/pages/AdminPage').then((m) => ({ default: m.AdminPage })));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));

/** Application routes. A signed-in employer opening "/" goes straight to the dashboard. */
export default function App() {
  const signedIn = useAppSelector((s) => !!s.auth.employer);
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path={ROUTES.home} element={signedIn ? <Navigate to={ROUTES.dashboard} replace /> : <LoginPage />} />
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
        <Route path={ROUTES.applicationSubmitted} element={<ApplicationSubmittedPage />} />
        <Route path={ROUTES.inbox} element={<InboxPage />} />
        <Route path={ROUTES.admin} element={<AdminPage />} />
        <Route path={ROUTES.dashboard} element={<DashboardPage />} />
        <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
      </Routes>
      {/* uploaded documents open here, over any page */}
      <DocumentViewer />
    </Suspense>
  );
}
