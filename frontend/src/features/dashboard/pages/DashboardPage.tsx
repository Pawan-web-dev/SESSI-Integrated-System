import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { ROUTES } from '@/app/routes';
import { DashboardView } from '../DashboardView';
import { useDashboardModel } from '../logic/useDashboardModel';

/** Employer dashboard (#/dashboard). Requires a signed-in employer. */
export function DashboardPage() {
  const signedIn = useAppSelector((s) => !!s.auth.employer);
  if (!signedIn) return <Navigate to={ROUTES.login} replace />;
  return <EmployerDashboard />;
}

function EmployerDashboard() {
  const { v, env, loading, error } = useDashboardModel();

  useEffect(() => {
    if (env.coName) document.title = 'Dashboard – ' + env.coName + ' | ESSI Sindh';
    window.scrollTo(0, 0);
  }, [env.coName]);

  if (loading || error) {
    return (
      <div className="workspace">
        <div className="mx-auto mt-16 max-w-[520px] rounded-xl border border-solid border-essi-line bg-white p-6 text-center text-[15px]">
          {loading ? (
            'Loading your dashboard…'
          ) : (
            <>
              <p className="mt-0 text-danger">{error}</p>
              <button className="min-h-[44px] cursor-pointer rounded-lg border-0 bg-essi-dark px-5 font-semibold text-white" onClick={() => window.location.reload()}>
                Try again
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="workspace">
      <DashboardView v={v} P={env} />
    </div>
  );
}
