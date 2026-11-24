import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { PortalFooter } from '@/components/layout/PortalFooter';
import { PortalHeader } from '@/components/layout/PortalHeader';
import { PortalPage } from '@/components/layout/PortalPage';
import { Alert } from '@/components/ui/Alert';
import { endAdminSession, getAccounts, isAdminSignedIn } from '@/services/portal';
import { ADMIN_PAGES, type AdminPageKey } from '../components/adminPages';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminSignInCard } from '../components/AdminSignInCard';
import { CompanyDetailsModal } from '../components/CompanyDetailsModal';
import { ChallansView } from '../views/ChallansView';
import { ChangeRequestsView } from '../views/ChangeRequestsView';
import { CompaniesView } from '../views/CompaniesView';
import { OverviewView } from '../views/OverviewView';
import { RegistrationsView } from '../views/RegistrationsView';

/** ESSI admin workspace (#/admin): companies, document approvals, change requests and challans. */
export function AdminPage() {
  const [signedIn, setSignedIn] = useState(isAdminSignedIn);
  const [page, setPage] = useState<AdminPageKey>('overview');
  const [, setVersion] = useState(0);
  const [message, setMessage] = useState('');
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Admin Panel | ESSI Sindh';
  }, []);

  const refresh = useCallback(() => setVersion((n) => n + 1), []);
  const closeCompany = useCallback(() => setCompanyId(null), []);
  const signOut = (e?: MouseEvent) => {
    e?.preventDefault();
    endAdminSession();
    setSignedIn(false);
  };
  const select = (p: AdminPageKey) => {
    setPage(p);
    setMessage('');
  };

  const accounts = getAccounts();
  const viewProps = { accounts, refresh, notify: setMessage };
  const title = ADMIN_PAGES.find((p) => p.key === page)?.title;

  return (
    <PortalPage
      label="ESSI admin panel"
      modals={<CompanyDetailsModal company={accounts.find((a) => a.id === companyId) || null} onClose={closeCompany} />}
    >
      <PortalHeader subtitle="Admin Panel (Demo)">
        {signedIn ? (
          <>
            <span className="hn">Signed in as admin</span>
            <a href="#" onClick={signOut}>
              Log out
            </a>
          </>
        ) : (
          <Link to={ROUTES.login}>Employer login</Link>
        )}
      </PortalHeader>
      <div className="wrap">
        {signedIn ? (
          <div className="card p-[22px]">
            <div className="admin-shell">
              <AdminSidebar page={page} onSelect={select} />
              <main className="admin-main">
                <div className="admin-top">
                  <div>
                    <h1 className="text-[23px]">{title}</h1>
                    <p className="sub mt-[5px] mb-0">Manage employer registration, changes, Employer No. and monthly challans</p>
                  </div>
                  <div>
                    <span className="admin-pill">DEMO DATA</span>{' '}
                    <button type="button" className="btn ghost admin-action" onClick={() => signOut()}>
                      Log out
                    </button>
                  </div>
                </div>
                <Alert kind="success" message={message} />
                {page === 'overview' ? <OverviewView {...viewProps} onViewCompany={setCompanyId} /> : null}
                {page === 'companies' ? <CompaniesView {...viewProps} onViewCompany={setCompanyId} /> : null}
                {page === 'registrations' ? <RegistrationsView {...viewProps} /> : null}
                {page === 'changes' ? <ChangeRequestsView {...viewProps} /> : null}
                {page === 'challans' ? <ChallansView /> : null}
              </main>
            </div>
          </div>
        ) : (
          <AdminSignInCard hidden={false} onSignedIn={() => setSignedIn(true)} />
        )}
      </div>
      <PortalFooter />
    </PortalPage>
  );
}
