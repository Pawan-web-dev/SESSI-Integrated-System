import { useEffect, useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { endSession, getSessionAccount, setLoginFlash, type Account } from '@/services/portal';
import { sanitizeText } from '@/utils/format';
import { createDashboard } from '../logic/createDashboard';

/** Employer dashboard (#/dashboard). Requires a signed-in employer. */
export function DashboardPage() {
  const account = getSessionAccount();
  if (!account) return <Navigate to={ROUTES.login} replace />;
  return <EmployerDashboard key={account.id} account={account} />;
}

function EmployerDashboard({ account }: { account: Account }) {
  const navigate = useNavigate();

  // the dashboard component is built once per account
  const Dashboard = useMemo(() => {
    const company: Record<string, string> = {};
    (Object.keys(account.co) as (keyof Account['co'])[]).forEach((k) => (company[k] = sanitizeText(account.co[k])));
    return createDashboard({
      acc: String(account.id).replace(/[^a-z0-9]/gi, ''),
      coName: company.employer,
      empNo: account.employerNo,
      person: company.person || 'Employer',
      dir: sanitizeText(account.dir) || 'City Directorate',
      coBase: company,
      empty: account.variant === 'empty',
      onLogout: () => {
        endSession();
        setLoginFlash('You have been logged out successfully.');
        navigate(ROUTES.login);
      },
      nav: (to) => navigate('/' + to),
    });
  }, [account, navigate]);

  useEffect(() => {
    document.title = 'Dashboard – ' + account.co.employer + ' | ESSI Sindh';
    window.scrollTo(0, 0);
  }, [account]);

  return <Dashboard />;
}
