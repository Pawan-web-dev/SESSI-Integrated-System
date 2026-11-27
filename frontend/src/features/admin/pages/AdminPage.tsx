import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { ROUTES } from '@/app/routes';
import logo from '@/assets/images/essi-logo.png';
import { PortalFooter } from '@/components/layout/PortalFooter';
import { PortalHeader } from '@/components/layout/PortalHeader';
import { PortalPage } from '@/components/layout/PortalPage';
import { Alert } from '@/components/ui/Alert';
import { adminSignedOut } from '@/features/auth/authSlice';
import { errorMessage } from '@/services/api/errors';
import type { ApplicationStatus } from '@/services/api/types';
import { useGetAdminDashboardQuery, useGetApplicationsQuery } from '../adminApi';
import { applicationStatusChanged, messageShown, reviewClosed, reviewOpened, sectionChanged, type AdminSection } from '../adminSlice';
import { AdminSignInCard } from '../components/AdminSignInCard';
import { ChangeRequestsReview } from '../components/ChangeRequestsReview';
import { RegistrationsTable } from '../components/RegistrationsTable';
import { ReviewApplicationModal } from '../components/ReviewApplicationModal';
import { Icon, ICON, Panel } from '../components/ui';
import { DashboardView } from '../views/DashboardView';
import { EmployersView } from '../views/EmployersView';
import { PartnersView } from '../views/PartnersView';
import { WorkersView } from '../views/WorkersView';

const TABS: ApplicationStatus[] = ['pending', 'approved', 'rejected'];

const NAV: { key: AdminSection; label: string; icon: string; group: string; subtitle: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: ICON.dashboard, group: 'Overview', subtitle: 'Establishments, workforce and collections at a glance' },
  { key: 'employers', label: 'Establishments', icon: ICON.building, group: 'Records', subtitle: 'Registered companies and their employees' },
  { key: 'workers', label: 'Employees & Dependents', icon: ICON.family, group: 'Records', subtitle: 'Find any worker and manage their family members' },
  { key: 'registrations', label: 'Registrations', icon: ICON.file, group: 'Review', subtitle: 'Approve new establishments and issue the EIN' },
  { key: 'changes', label: 'Change Requests', icon: ICON.swap, group: 'Review', subtitle: 'Requests to change registered details' },
  { key: 'partners', label: 'Partner Access', icon: ICON.key, group: 'Hospitals & Pharmacies', subtitle: 'Eligibility check and API keys for pharmacy and hospital (HMIS) systems' },
];

/** ESSI admin panel (#/admin): sign-in, then the workspace with a sidebar. */
export function AdminPage() {
  const admin = useAppSelector((s) => s.auth.admin);

  useEffect(() => {
    document.title = 'Admin Panel | ESSI Sindh';
  }, []);

  if (admin) return <AdminWorkspace name={admin.name} />;
  return (
    <PortalPage label="ESSI admin panel">
      <PortalHeader subtitle="Admin Panel">
        <Link to={ROUTES.login} id="ad-back">
          Employer login
        </Link>
      </PortalHeader>
      <div className="wrap">
        <AdminSignInCard />
      </div>
      <PortalFooter />
    </PortalPage>
  );
}

function AdminWorkspace({ name }: { name: string }) {
  const dispatch = useAppDispatch();
  const section = useAppSelector((s) => s.admin.section);
  const [menuOpen, setMenuOpen] = useState(false);
  const [today] = useState(() => new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
  const { data: stats } = useGetAdminDashboardQuery(undefined, { pollingInterval: 60000 });
  const badges: Partial<Record<AdminSection, number>> = { registrations: stats?.pending_applications, changes: stats?.pending_change_requests };
  const current = NAV.find((n) => n.key === section) ?? NAV[0];

  const signOut = (e: MouseEvent) => {
    e.preventDefault();
    dispatch(adminSignedOut());
  };
  const pick = (key: AdminSection) => {
    dispatch(sectionChanged(key));
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const groups = [...new Set(NAV.map((n) => n.group))];
  const sidebar = (
    <nav aria-label="Admin menu" className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-5 border-0 border-b border-solid border-white/10">
        <img src={logo} alt="" className="w-10 h-10 bg-white rounded-full p-0.5" />
        <div className="leading-tight">
          <div className="font-bold text-[15px]">ESSI Sindh</div>
          <div className="text-[12px] text-white/70">Admin Panel</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-3">
        {groups.map((g) => (
          <div key={g} className="mb-2">
            <div className="px-5 pt-3 pb-1.5 text-[11px] uppercase tracking-[.1em] text-white/50">{g}</div>
            {NAV.filter((n) => n.group === g).map((n) => {
              const on = n.key === section;
              const badge = badges[n.key];
              return (
                <button
                  key={n.key}
                  type="button"
                  onClick={() => pick(n.key)}
                  aria-current={on ? 'page' : undefined}
                  className={
                    'flex items-center gap-3 w-[calc(100%-16px)] mx-2 min-h-[44px] px-3 rounded-lg border-0 text-left text-[14px] cursor-pointer transition-colors ' +
                    (on ? 'bg-white text-essi-dark font-semibold' : 'bg-transparent text-white/85 hover:bg-white/10')
                  }
                >
                  <Icon d={n.icon} size={18} />
                  <span className="flex-1">{n.label}</span>
                  {badge ? <span className={'min-w-[22px] h-[22px] px-1.5 rounded-full text-[12px] font-bold flex items-center justify-center ' + (on ? 'bg-essi-green text-white' : 'bg-[#f5b301] text-[#3b2a00]')}>{badge}</span> : null}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="px-5 py-4 border-0 border-t border-solid border-white/10 text-[13px]">
        <div className="text-white/60 text-[12px]">Signed in as</div>
        <div className="font-semibold truncate">{name}</div>
        <a href="#" onClick={signOut} className="mt-2 inline-flex items-center gap-2 text-white/85 hover:text-white no-underline">
          <Icon d={ICON.logout} size={16} /> Log out
        </a>
      </div>
    </nav>
  );

  return (
    <div className="portal min-h-screen bg-[#f3f6f4] text-[#17321f]">
      {/* desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-[260px] bg-[#0b4d24] text-white z-30">{sidebar}</aside>
      {/* mobile sidebar */}
      {menuOpen ? (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-[270px] max-w-[85vw] bg-[#0b4d24] text-white shadow-xl">{sidebar}</aside>
        </div>
      ) : null}

      <div className="lg:pl-[260px] min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 bg-white border-0 border-b border-solid border-[#e3ece6] px-4 sm:px-6 py-3 flex items-center gap-3">
          <button type="button" className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-essi-line bg-white text-essi-dark cursor-pointer" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Icon d={ICON.menu} size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="!text-[20px] !m-0 truncate">{current.label}</h1>
            <div className="text-[13px] text-ink-muted truncate">{current.subtitle}</div>
          </div>
          <span className="hidden sm:inline text-[13px] text-ink-muted">{today}</span>
        </header>
        <main className="flex-1 p-4 sm:p-6 max-w-[1400px] w-full mx-auto box-border">
          {section === 'dashboard' ? <DashboardView /> : null}
          {section === 'employers' ? <EmployersView /> : null}
          {section === 'workers' ? <WorkersView /> : null}
          {section === 'registrations' ? <RegistrationsSection /> : null}
          {section === 'changes' ? <ChangesSection /> : null}
          {section === 'partners' ? <PartnersView /> : null}
        </main>
      </div>
    </div>
  );
}

function RegistrationsSection() {
  const dispatch = useAppDispatch();
  const { message, applicationStatus: tab, reviewId } = useAppSelector((s) => s.admin);
  const { data, error, isFetching } = useGetApplicationsQuery(tab, { pollingInterval: 30000, refetchOnFocus: true });
  const closeReview = useCallback(() => dispatch(reviewClosed()), [dispatch]);
  const setMessage = useCallback((msg: string) => dispatch(messageShown(msg)), [dispatch]);

  return (
    <Panel>
      <Alert kind="success" id="ad-ok" message={message} />
      <div id="ad-tabs" className="flex gap-2 flex-wrap mb-4">
        {TABS.map((k) => (
          <button key={k} className={`btn ${k === tab ? '' : 'ghost'} min-h-[40px]`} onClick={() => dispatch(applicationStatusChanged(k))}>
            {k.charAt(0).toUpperCase() + k.slice(1) + ' (' + (data?.counts[k] ?? 0) + ')'}
          </button>
        ))}
      </div>
      <Alert kind="error" message={error ? errorMessage(error) : ''} />
      <div className="overflow-x-auto">
        {data || !isFetching ? <RegistrationsTable tab={tab} rows={data?.items ?? []} onReview={(id) => dispatch(reviewOpened(id))} /> : <p className="text-ink-muted">Loading…</p>}
      </div>
      <ReviewApplicationModal
        applicationId={reviewId}
        onClose={closeReview}
        onChanged={(msg, switchTo) => {
          if (switchTo) dispatch(reviewClosed({ message: msg, switchTo }));
          else if (msg) setMessage(msg);
        }}
      />
    </Panel>
  );
}

function ChangesSection() {
  const dispatch = useAppDispatch();
  const message = useAppSelector((s) => s.admin.message);
  const setMessage = useCallback((msg: string) => dispatch(messageShown(msg)), [dispatch]);
  return (
    <Panel>
      <Alert kind="success" message={message} />
      <ChangeRequestsReview onMessage={setMessage} />
    </Panel>
  );
}
