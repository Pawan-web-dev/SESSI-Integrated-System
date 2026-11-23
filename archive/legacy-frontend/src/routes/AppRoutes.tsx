import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { WorkersPage } from '../features/workers/WorkersPage';
import CompanyProfilePage, { BusinessInfoPage, MandatoryDocumentsPage, ContactLocationPage, ChangeRequestsPage as CompanyChangeRequestsPage } from '../features/company-profile/pages/CompanyProfilePage';
import ContributionsPages, { MonthlyContributionPage, CreateContributionPage, SubmittedContributionsPage } from '../features/contributions/pages/ContributionsPages';
import PaymentsPage, { GenerateChallanPage, PaymentHistoryPage, F4Page, F5Page, ReturnHistoryPage } from '../features/payments/pages/PaymentsPage';
import ReportsPage, { ContributionReportPage, EmployeeReportPage, StatementOfAccountPage } from '../features/reports/pages/ReportsPage';
import NotificationsPage, { InboxPage, AlertsPage } from '../features/notifications/pages/NotificationsPage';
import SupportPage, { FAQsPage, RaiseTicketPage } from '../features/support/pages/SupportPage';
import SettingsPage, { AccountSettingsPage, ChangePasswordPage, NotificationSettingsPage } from '../features/settings/pages/SettingsPage';
import AdminPage, { RegistrationsPage, ApplicationsPage, ChangeRequestsAdminPage, UsersPage, SystemSettingsPage } from '../features/admin/pages/AdminPage';
import { useAppSelector } from '../app/hooks';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />;
};

const AdminRoute: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  return user?.role === 'admin' ? <Outlet /> : <Navigate to='/dashboard' />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<MainLayout />}>
          <Route path='dashboard' element={<DashboardPage />} />
          <Route path='employees' element={<WorkersPage />} />

          <Route path='company-profile' element={<CompanyProfilePage />}>
            <Route index element={<Navigate to='business' />} />
            <Route path='business' element={<BusinessInfoPage />} />
            <Route path='documents' element={<MandatoryDocumentsPage />} />
            <Route path='contact' element={<ContactLocationPage />} />
            <Route path='change-requests' element={<CompanyChangeRequestsPage />} />
          </Route>

          <Route path='contributions' element={<ContributionsPages />}>
            <Route index element={<Navigate to='monthly' />} />
            <Route path='monthly' element={<MonthlyContributionPage />} />
            <Route path='create' element={<CreateContributionPage />} />
            <Route path='submitted' element={<SubmittedContributionsPage />} />
          </Route>

          <Route path='payments' element={<PaymentsPage />}>
            <Route index element={<Navigate to='challan' />} />
            <Route path='challan' element={<GenerateChallanPage />} />
            <Route path='history' element={<PaymentHistoryPage />} />
            <Route path='f4' element={<F4Page />} />
            <Route path='f5' element={<F5Page />} />
            <Route path='return-history' element={<ReturnHistoryPage />} />
          </Route>

          <Route path='reports' element={<ReportsPage />}>
            <Route index element={<Navigate to='contribution' />} />
            <Route path='contribution' element={<ContributionReportPage />} />
            <Route path='employee' element={<EmployeeReportPage />} />
            <Route path='statement' element={<StatementOfAccountPage />} />
          </Route>

          <Route path='notifications' element={<NotificationsPage />}>
            <Route index element={<Navigate to='inbox' />} />
            <Route path='inbox' element={<InboxPage />} />
            <Route path='alerts' element={<AlertsPage />} />
          </Route>

          <Route path='support' element={<SupportPage />}>
            <Route index element={<Navigate to='faqs' />} />
            <Route path='faqs' element={<FAQsPage />} />
            <Route path='raise-ticket' element={<RaiseTicketPage />} />
          </Route>
          <Route path='settings' element={<SettingsPage />}>
            <Route index element={<Navigate to='account' />} />
            <Route path='account' element={<AccountSettingsPage />} />
            <Route path='password' element={<ChangePasswordPage />} />
            <Route path='notifications' element={<NotificationSettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminRoute />}>
          <Route path='admin' element={<AdminPage />}>
            <Route index element={<Navigate to='registrations' />} />
            <Route path='registrations' element={<RegistrationsPage />} />
            <Route path='applications' element={<ApplicationsPage />} />
            <Route path='change-requests' element={<ChangeRequestsAdminPage />} />
            <Route path='users' element={<UsersPage />} />
            <Route path='settings' element={<SystemSettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path='*' element={<Navigate to='/login' />} />
    </Routes>
  );
};
