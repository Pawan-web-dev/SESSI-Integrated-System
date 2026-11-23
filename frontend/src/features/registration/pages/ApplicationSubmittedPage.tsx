import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { PortalFooter } from '@/components/layout/PortalFooter';
import { PortalHeader } from '@/components/layout/PortalHeader';
import { PortalPage } from '@/components/layout/PortalPage';
import { ApplicationTimeline } from '@/components/shared/ApplicationTimeline';
import { getAccountById, getLastApplicationId, getStatus } from '@/services/portal';

/** Refresh interval for the application status (ms). */
const REFRESH_MS = 3000;

const STATUS_VIEW = {
  pending: { label: 'Pending approval', bg: '#fff4d6', fg: '#8a5200', heading: 'Application submitted — waiting for approval' },
  approved: { label: 'Approved', bg: '#dff3e5', fg: '#0b4d24', heading: 'Application approved' },
  rejected: { label: 'Rejected', bg: '#fdecea', fg: '#b00020', heading: 'Application not approved' },
} as const;

const loadApplication = () => getAccountById(getLastApplicationId());

/** "Application submitted" page shown after registration (#/welcome). Updates itself every few seconds. */
export function ApplicationSubmittedPage() {
  const [application, setApplication] = useState(loadApplication);

  useEffect(() => {
    document.title = 'Application submitted | ESSI Sindh';
    const timer = setInterval(() => setApplication(loadApplication()), REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  if (!application) return <Navigate to={ROUTES.login} replace />;

  const status = getStatus(application);
  const view = STATUS_VIEW[status];
  const employerNo = status === 'approved' ? application.employerNo : status === 'rejected' ? 'Not assigned' : 'Assigned after approval';

  return (
    <PortalPage label="Application submitted">
      <PortalHeader subtitle="Employer Registration Portal" />
      <div className="wrap">
        <div className="card text-center">
          <div className="big bg-[#fff4d6]">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9"></circle>
              <path d="M12 7v5l3 2"></path>
            </svg>
          </div>
          <h1 id="w-h1" className="[font-size:clamp(22px,3vw,30px)]">
            {view.heading}
          </h1>
          <p className="mt-2.5 mx-auto mb-0 max-w-[620px] text-[16px] text-[#25324a]">
            Thank you, <b id="w-name">{application.co.employer}</b>. ESSI will verify your documents. Once approved, you receive your <b>Employer No.</b> by SMS and email and can log in with the password you created.
          </p>
          <div className="kv">
            <div>Application No.</div>
            <div id="w-app">{application.appNo}</div>
            <div>Status</div>
            <div>
              <span className="tag" id="w-status" style={{ background: view.bg, color: view.fg }}>
                {view.label}
              </span>
            </div>
            <div>Submitted</div>
            <div id="w-time">{application.submitted}</div>
            <div>Employer No.</div>
            <div id="w-emp">{employerNo}</div>
          </div>
          <div className="text-left max-w-[560px] mt-5.5 mx-auto mb-0">
            <h2 className="text-[18px] mt-0 mx-0 mb-1 text-[#10331d]">Track your application</h2>
            <p className="text-[13px] text-ink-muted mt-0 mx-0 mb-1.5">This list updates automatically. Every update is also sent to you by SMS and email (see the demo inbox).</p>
            <div id="w-track">
              <ApplicationTimeline application={application} />
            </div>
          </div>
          <p className="text-[14px] text-ink-soft mt-4.5 mx-auto mb-0 max-w-[560px]">Keep your Application No. — you can track the status from the login page at any time.</p>
          <div className="mt-5 flex gap-3 justify-center flex-wrap">
            <Link className="btn no-underline" to={ROUTES.login}>
              Back to login
            </Link>
            <Link className="btn ghost no-underline" to={ROUTES.inbox}>
              Demo SMS / email inbox
            </Link>
            <Link className="btn ghost no-underline" to={ROUTES.admin}>
              Open admin panel (demo)
            </Link>
          </div>
        </div>
      </div>
      <PortalFooter />
    </PortalPage>
  );
}
