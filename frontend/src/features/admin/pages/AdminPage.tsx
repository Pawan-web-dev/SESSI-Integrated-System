import { useCallback, useEffect, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { ROUTES } from '@/app/routes';
import { PortalFooter } from '@/components/layout/PortalFooter';
import { PortalHeader } from '@/components/layout/PortalHeader';
import { PortalPage } from '@/components/layout/PortalPage';
import { Alert } from '@/components/ui/Alert';
import { adminSignedOut } from '@/features/auth/authSlice';
import { errorMessage } from '@/services/api/errors';
import type { ApplicationStatus } from '@/services/api/types';
import { useGetApplicationsQuery } from '../adminApi';
import { applicationStatusChanged, messageShown, reviewClosed, reviewOpened, sectionChanged } from '../adminSlice';
import { AdminSignInCard } from '../components/AdminSignInCard';
import { ChangeRequestsReview } from '../components/ChangeRequestsReview';
import { RegistrationsTable } from '../components/RegistrationsTable';
import { ReviewApplicationModal } from '../components/ReviewApplicationModal';

const TABS: ApplicationStatus[] = ['pending', 'approved', 'rejected'];

/** ESSI admin panel (#/admin): registrations (approve = issue EIN) and change requests. */
export function AdminPage() {
  const dispatch = useAppDispatch();
  const admin = useAppSelector((s) => s.auth.admin);

  useEffect(() => {
    document.title = 'Admin Panel | ESSI Sindh';
  }, []);

  const signOut = (e: MouseEvent) => {
    e.preventDefault();
    dispatch(adminSignedOut());
  };

  return (
    <PortalPage label="ESSI admin panel">
      <PortalHeader subtitle="Admin Panel">
        <span id="ad-who" className="hn">
          {admin ? `Signed in as ${admin.name}` : ''}
        </span>
        {admin ? (
          <a href="#" id="ad-out" onClick={signOut}>
            Log out
          </a>
        ) : (
          <Link to={ROUTES.login} id="ad-back">
            Employer login
          </Link>
        )}
      </PortalHeader>
      <div className="wrap">{admin ? <AdminWorkspace /> : <AdminSignInCard />}</div>
      <PortalFooter />
    </PortalPage>
  );
}

function AdminWorkspace() {
  const dispatch = useAppDispatch();
  const { section, message, applicationStatus: tab, reviewId } = useAppSelector((s) => s.admin);
  const { data, error, isFetching } = useGetApplicationsQuery(tab, { pollingInterval: 30000, refetchOnFocus: true });
  const closeReview = useCallback(() => dispatch(reviewClosed()), [dispatch]);
  const setMessage = useCallback((msg: string) => dispatch(messageShown(msg)), [dispatch]);

  return (
    <div className="card" id="ad-panel">
      <div className="row">
        <h1>{section === 'registrations' ? 'Employer registrations' : 'Change requests'}</h1>
        <span className="flex gap-2">
          <button className={`btn ${section === 'registrations' ? '' : 'ghost'} min-h-[40px]`} onClick={() => dispatch(sectionChanged('registrations'))}>
            Registrations
          </button>
          <button className={`btn ${section === 'changes' ? '' : 'ghost'} min-h-[40px]`} onClick={() => dispatch(sectionChanged('changes'))}>
            Change requests
          </button>
        </span>
      </div>
      <Alert kind="success" id="ad-ok" message={message} />
      {section === 'changes' ? (
        <ChangeRequestsReview onMessage={setMessage} />
      ) : (
        <>
          <div id="ad-tabs" className="flex gap-2 flex-wrap my-4 mx-0">
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
        </>
      )}
    </div>
  );
}
