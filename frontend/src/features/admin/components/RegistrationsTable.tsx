import type { ApplicationStatus, ApplicationSummary } from '@/services/api/types';
import { formatDateTime } from '@/utils/format';

/** table cell classes */
const CELL = 'p-2.5 border border-solid border-essi-line text-left';
const NEXT_STEP = ['Under Review', 'Approved', 'Registration Complete'];

interface RegistrationsTableProps {
  tab: ApplicationStatus;
  rows: ApplicationSummary[];
  onReview: (id: number) => void;
}

/** Table of applications for the selected tab (pending / approved / rejected). */
export function RegistrationsTable({ tab, rows, onReview }: RegistrationsTableProps) {
  const headers = ['Application No.', 'Company', 'Applicant', 'CNIC', 'Submitted', tab === 'pending' ? 'Action' : 'Employer No.'];
  return (
    <table id="ad-tbl" className="w-full border-collapse text-[14px]">
      <tbody>
        <tr className="bg-[#e8f2ec]">
          {headers.map((h) => (
            <th key={h} className={CELL}>
              {h}
            </th>
          ))}
        </tr>
        {rows.length ? (
          rows.map((a) => (
            <tr key={a.id}>
              {[a.app_no, a.employer_name, a.applicant, a.cnic, formatDateTime(a.submitted_at)].map((x, i) => (
                <td key={i} className={CELL}>
                  {x}
                </td>
              ))}
              <td className={CELL}>
                {tab === 'pending' ? (
                  <>
                    <button className="btn min-h-[38px] py-0 px-4" onClick={() => onReview(a.id)}>
                      Review
                    </button>
                    <br />
                    <small>{'Step ' + (Math.min(a.stage, 3) + 1) + ' of 4: ' + NEXT_STEP[Math.min(a.stage, 3) - 1]}</small>
                  </>
                ) : (
                  <>
                    {a.employer_no || '—'}
                    {tab === 'rejected' ? (
                      <>
                        <br />
                        <small>{a.rejection_reason || ''}</small>
                      </>
                    ) : null}
                    {' '}
                    <button className="link" onClick={() => onReview(a.id)}>
                      View
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className={`${CELL} text-ink-muted p-4.5`}>
              {'No ' + tab + ' applications.'}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
