import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { PortalFooter } from '@/components/layout/PortalFooter';
import { PortalHeader } from '@/components/layout/PortalHeader';
import { PortalPage } from '@/components/layout/PortalPage';
import { getAccountById, getLastApplicationId, getStatus, completedStages, startSession, type Account } from '@/services/portal';

/** Refresh interval for the application status (ms). */
const REFRESH_MS = 3000;

const loadApplication = () => getAccountById(getLastApplicationId());

/** Horizontal stepper matching the design screenshot */
function ApplicationStatusStepper({ application }: { application: Account }) {
  const status = getStatus(application);
  const done = completedStages(application);
  const rejected = status === 'rejected';

  const steps = [
    {
      title: 'Application Submitted',
      sub: application.submitted || '14 Nov 2025, 03:45 PM',
      stepNum: 1,
    },
    {
      title: 'Under Review',
      sub: status === 'pending' ? 'Current Status' : '',
      stepNum: 2,
    },
    {
      title: 'Approved',
      sub: status === 'approved' ? (application.approved || 'Approved') : '',
      stepNum: 3,
    },
    {
      title: 'Registration Complete',
      sub: status === 'approved' ? 'Employer No. Issued' : '',
      stepNum: 4,
    },
  ];

  return (
    <div className="w-full my-6 py-4">
      <div className="relative flex items-start justify-between max-w-[850px] mx-auto px-2">
        {/* Connecting lines between nodes */}
        <div className="absolute top-5 left-[12%] right-[12%] h-[3px] bg-[#cbd5e1] -z-0">
          <div
            className="h-full bg-[#067a35] transition-all duration-500"
            style={{
              width: done >= 4 ? '100%' : done === 3 ? '66%' : done === 2 ? '33%' : '0%',
            }}
          />
        </div>

        {/* Step Nodes */}
        {steps.map((step) => {
          const stepNum = step.stepNum;
          const isDone = stepNum < done || (stepNum === 4 && status === 'approved');
          const isCurrent = stepNum === done && status === 'pending';
          const isRejected = rejected && stepNum === done;

          return (
            <div key={step.title} className="relative z-10 flex flex-col items-center flex-1 text-center">
              {/* Circle Icon */}
              {isDone ? (
                <div className="w-10 h-10 rounded-full bg-[#067a35] text-white flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              ) : isCurrent ? (
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#067a35] text-[#067a35] flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <polyline points="12 7 12 12 15 14" />
                  </svg>
                </div>
              ) : isRejected ? (
                <div className="w-10 h-10 rounded-full bg-[#fdecea] border-2 border-[#b00020] text-[#b00020] flex items-center justify-center shadow-sm">
                  <span className="font-bold text-base">!</span>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#e2e8f0] text-[#94a3b8] flex items-center justify-center">
                  <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}

              {/* Step Title & Subtitle */}
              <div className="mt-3 px-1">
                <div className={`text-[14px] md:text-[15px] font-bold leading-tight ${isCurrent || isDone ? 'text-[#10331d]' : 'text-[#64748b]'}`}>
                  {step.title}
                </div>
                {step.sub && (
                  <div className={`text-[12px] md:text-[13px] mt-1 ${isCurrent ? 'text-[#067a35] font-semibold' : 'text-[#64748b]'}`}>
                    {step.sub}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** "Application Submitted Successfully!" tracking page shown after registration (#/welcome). */
export function ApplicationSubmittedPage() {
  const navigate = useNavigate();
  const [application, setApplication] = useState(loadApplication);

  useEffect(() => {
    document.title = 'Application Submitted Successfully! | ESSI Sindh';
    const timer = setInterval(() => setApplication(loadApplication()), REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  if (!application) return <Navigate to={ROUTES.login} replace />;

  return (
    <PortalPage label="Application Submitted Successfully!">
      <PortalHeader subtitle="Employer Registration Portal" />
      <div className="wrap">
        <div className="card text-center p-6 md:p-10 max-w-[1000px] mx-auto rounded-2xl shadow-lg border border-[#cfe4d5]">
          {/* Top Checkmark Circle with Decorative Rays */}
          <div className="relative w-24 h-24 mx-auto mb-5 flex items-center justify-center">
            {/* Subtle Sunburst Rays */}
            <svg className="absolute inset-0 w-full h-full text-[#bbf7d0]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="50" y1="6" x2="50" y2="14" />
              <line x1="50" y1="86" x2="50" y2="94" />
              <line x1="6" y1="50" x2="14" y2="50" />
              <line x1="86" y1="50" x2="94" y2="50" />
              <line x1="19" y1="19" x2="25" y2="25" />
              <line x1="75" y1="75" x2="81" y2="81" />
              <line x1="19" y1="81" x2="25" y2="75" />
              <line x1="75" y1="25" x2="81" y2="19" />
            </svg>
            {/* Outer light green ring */}
            <div className="w-20 h-20 rounded-full bg-[#dff3e5] flex items-center justify-center">
              {/* Inner green circle with checkmark */}
              <div className="w-12 h-12 rounded-full bg-[#067a35] text-white flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          </div>

          {/* Heading & Subtitle */}
          <h1 id="w-h1" className="text-[26px] md:text-[32px] font-extrabold text-[#0b4d24] mb-3">
            Application Submitted Successfully!
          </h1>
          <p className="text-[15px] md:text-[16px] text-[#374151] max-w-[680px] mx-auto mb-8 leading-relaxed">
            Your registration application has been submitted and is currently under review by ESSI Sindh. You will be notified once it is approved.
          </p>

          {/* Application Reference & Submission Date Container */}
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-5 md:p-6 mb-8 max-w-[850px] mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
              {/* Application Reference Number */}
              <div className="flex items-center gap-4 flex-1 justify-start md:justify-center w-full md:w-auto px-4">
                <div className="w-12 h-12 rounded-xl bg-[#067a35] text-white flex items-center justify-center flex-none">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-[13px] md:text-[14px] text-[#4b5563] font-medium">
                    Application Reference Number
                  </div>
                  <div id="w-app" className="text-[20px] md:text-[22px] font-extrabold text-[#0b4d24] tracking-tight">
                    {application.appNo || 'ESSI-EMP-2025-10456'}
                  </div>
                </div>
              </div>

              {/* Vertical Divider Line */}
              <div className="hidden md:block w-px h-12 bg-[#cfe4d5] self-center" />

              {/* Submission Date */}
              <div className="flex items-center gap-4 flex-1 justify-start md:justify-center w-full md:w-auto px-4">
                <div className="w-12 h-12 rounded-xl bg-[#067a35] text-white flex items-center justify-center flex-none">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-[13px] md:text-[14px] text-[#4b5563] font-medium">
                    Submission Date
                  </div>
                  <div id="w-time" className="text-[18px] md:text-[20px] font-extrabold text-[#0b4d24] tracking-tight">
                    {application.submitted || '14 Nov 2025, 03:45 PM'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Application Status Section */}
          <div className="max-w-[850px] mx-auto text-left mb-8">
            <div className="flex items-center gap-2.5 text-[#0b4d24] font-bold text-[20px] mb-2">
              <svg className="w-6 h-6 text-[#067a35]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <h2>Application Status</h2>
            </div>
            <ApplicationStatusStepper application={application} />
          </div>

          {/* Note Box */}
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 md:p-5 max-w-[850px] mx-auto mb-8 flex items-start gap-3.5 text-left">
            <div className="w-7 h-7 rounded-full bg-[#067a35] text-white flex items-center justify-center font-bold text-[14px] flex-none mt-0.5">
              i
            </div>
            <div className="text-[14px] md:text-[15px] text-[#374151] leading-snug">
              <span className="font-bold text-[#0b4d24]">Note: </span>
              You can track your application status anytime from the portal using your reference number.
            </div>
          </div>

          {/* Go to Dashboard Button */}
          <div className="flex items-center justify-center gap-4 flex-wrap mt-4">
            <button
              onClick={() => {
                startSession(application);
                navigate(ROUTES.dashboard);
              }}
              className="inline-flex items-center gap-2.5 bg-[#0b4d24] hover:bg-[#08401e] text-white font-semibold px-8 py-3.5 rounded-xl text-[16px] shadow-sm transition-all cursor-pointer border-0"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 001-1h2a1 1 0 001 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l1.293 1.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
      <PortalFooter />
    </PortalPage>
  );
}
