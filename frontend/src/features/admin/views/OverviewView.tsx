import { getChangeRequests, getStatus, isChangeRequestOpen } from '@/services/portal';
import type { AdminViewProps } from './viewTypes';
import { CompaniesTable } from './CompaniesTable';

/** Admin dashboard: headline numbers and the latest companies. */
export function OverviewView({ accounts, onViewCompany }: AdminViewProps & { onViewCompany: (id: string) => void }) {
  const all = accounts.filter((a) => a.appNo || a.employerNo);
  const kpis: [string, number][] = [
    ['Total registered companies', all.length],
    ['Approved / enrolled', all.filter((a) => getStatus(a) === 'approved').length],
    ['Awaiting documents', all.filter((a) => getStatus(a) === 'pending').length],
    ['Pending change requests', getChangeRequests().filter(isChangeRequestOpen).length],
  ];
  return (
    <>
      <div className="admin-kpis">
        {kpis.map(([label, n]) => (
          <div key={label} className="admin-kpi">
            <small>{label}</small>
            <strong>{n}</strong>
          </div>
        ))}
      </div>
      <h3 className="mt-[18px] mb-2.5">Recently registered companies</h3>
      <CompaniesTable companies={all.slice(0, 5)} empty="No company records found." onView={onViewCompany} />
    </>
  );
}
