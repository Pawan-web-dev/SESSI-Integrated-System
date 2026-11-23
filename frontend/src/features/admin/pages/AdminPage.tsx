import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { PortalFooter } from '@/components/layout/PortalFooter';
import { PortalHeader } from '@/components/layout/PortalHeader';
import { PortalPage } from '@/components/layout/PortalPage';
import { Alert } from '@/components/ui/Alert';
import { endAdminSession, getAccounts, getStatus, isAdminSignedIn, getEinRegistry, type ApplicationStatus } from '@/services/portal';
import { AdminSignInCard } from '../components/AdminSignInCard';
import { RegistrationsTable } from '../components/RegistrationsTable';
import { ReviewApplicationModal } from '../components/ReviewApplicationModal';

const TABS: ApplicationStatus[] = ['pending', 'approved', 'rejected'];

/** ESSI admin panel (#/admin): review, approve and reject employer registrations. */
export function AdminPage() {
  const [signedIn, setSignedIn] = useState(isAdminSignedIn);
  const [, setVersion] = useState(0);
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState<ApplicationStatus>('pending');
  const [reviewId, setReviewId] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Admin Panel | ESSI Sindh';
  }, []);

  const signOut = (e: MouseEvent) => {
    e.preventDefault();
    endAdminSession();
    setSignedIn(false);
  };

  const applications = getAccounts().filter((a) => a.appNo);
  const counts: Record<ApplicationStatus, number> = { pending: 0, approved: 0, rejected: 0 };
  applications.forEach((a) => counts[getStatus(a)]++);
  const rows = applications.filter((a) => getStatus(a) === tab);
  const closeReview = useCallback(() => setReviewId(null), []);

  return (
    <PortalPage
      label="ESSI admin panel"
      modals={
        <ReviewApplicationModal
          applicationId={reviewId}
          onClose={closeReview}
          onChanged={(msg, switchTo) => {
            if (switchTo) {
              setReviewId(null);
              setTab(switchTo);
            }
            if (msg) setMessage(msg);
            setVersion((n) => n + 1);
          }}
        />
      }
    >
      <PortalHeader subtitle="Admin Panel (Demo)">
        <span id="ad-who" className="hn">
          {signedIn ? 'Signed in as admin' : ''}
        </span>
        <a href="#" id="ad-out" style={{ display: signedIn ? undefined : 'none' }} onClick={signOut}>
          Log out
        </a>
        <Link to={ROUTES.login} id="ad-back" style={{ display: signedIn ? 'none' : undefined }}>
          Employer login
        </Link>
      </PortalHeader>
      <div className="wrap">
        <AdminSignInCard hidden={signedIn} onSignedIn={() => setSignedIn(true)} />
        <div className="card" id="ad-panel" style={{ display: signedIn ? undefined : 'none' }}>
          <div className="row">
            <h1>Employer registrations</h1>
            <span className="text-[14px] text-ink-soft">
              Employer Nos. issued: <b id="ad-next">{getEinRegistry().length}</b> · format <b>DDD-II-NNNNNN</b>
            </span>
          </div>
          <Alert kind="success" id="ad-ok" message={message} />
          <div id="ad-tabs" className="flex gap-2 flex-wrap my-4 mx-0">
            {TABS.map((k) => (
              <button key={k} className={`btn ${k === tab ? '' : 'ghost'} min-h-[40px]`} onClick={() => setTab(k)}>
                {k.charAt(0).toUpperCase() + k.slice(1) + ' (' + counts[k] + ')'}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <RegistrationsTable tab={tab} rows={rows} onReview={setReviewId} />
          </div>
        </div>
      </div>
      <PortalFooter />
    </PortalPage>
  );
}
