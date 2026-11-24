import { getStatus, type Account } from '@/services/portal';
import { AdminTable, StatusPill } from '../components/AdminTable';

interface CompaniesTableProps {
  companies: Account[];
  empty: string;
  onView: (id: string) => void;
}

/** Table of companies (used by the dashboard and the enrolled-companies view). */
export function CompaniesTable({ companies, empty, onView }: CompaniesTableProps) {
  return (
    <AdminTable
      headers={['Company / Application', 'Employer No.', 'District', 'Contact person', 'Status', 'Date', 'Action']}
      rowKeys={companies.map((a) => a.id)}
      empty={empty}
      rows={companies.map((a) => {
        const status = getStatus(a);
        return [
          <>
            <b>{a.co.employer}</b>
            <br />
            <small className="admin-muted">{a.appNo || '—'}</small>
          </>,
          a.employerNo || 'Not assigned',
          a.co.district || '—',
          a.co.person || '—',
          <StatusPill tone={status === 'pending' ? 'pending' : status === 'rejected' ? 'rejected' : undefined}>{status}</StatusPill>,
          a.approved || a.submitted || '—',
          <button type="button" className="btn ghost admin-action" onClick={() => onView(a.id)}>
            View
          </button>,
        ];
      })}
    />
  );
}
