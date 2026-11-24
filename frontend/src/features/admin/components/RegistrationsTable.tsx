import { completedStages, REVIEW_STAGES, type Account, type ApplicationStatus } from '@/services/portal';
import { AdminTable } from './AdminTable';

interface RegistrationsTableProps {
  tab: ApplicationStatus;
  rows: Account[];
  onReview: (id: string) => void;
}

/** Table of applications for the selected tab (pending / approved / rejected). */
export function RegistrationsTable({ tab, rows, onReview }: RegistrationsTableProps) {
  return (
    <AdminTable
      headers={['Application No.', 'Company', 'Applicant', 'CNIC', 'Submitted', tab === 'pending' ? 'Stage' : tab === 'approved' ? 'Employer No.' : 'Reason', 'Action']}
      rowKeys={rows.map((a) => a.id)}
      empty={'No ' + tab + ' applications.'}
      rows={rows.map((a) => [
        a.appNo, a.co.employer, a.co.person, a.cnic, a.submitted,
        tab === 'pending' ? 'Step ' + (completedStages(a) + 1) + ' of 4: ' + REVIEW_STAGES[completedStages(a)][0] : tab === 'approved' ? a.employerNo || '—' : a.reason || '—',
        <button key="act" type="button" className="btn admin-action" onClick={() => onReview(a.id)}>
          {tab === 'pending' ? 'Review documents' : 'View'}
        </button>,
      ])}
    />
  );
}
