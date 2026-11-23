import { completedStages, REVIEW_STAGES, type Account, type ApplicationStatus } from '@/services/portal';

/** table cell classes */
const CELL = 'p-2.5 border border-solid border-essi-line text-left';

interface RegistrationsTableProps {
  tab: ApplicationStatus;
  rows: Account[];
  onReview: (id: string) => void;
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
              {[a.appNo, a.co.employer, a.co.person, a.cnic, a.submitted].map((x, i) => (
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
                    <small>{'Step ' + (completedStages(a) + 1) + ' of 4: ' + REVIEW_STAGES[completedStages(a)][0]}</small>
                  </>
                ) : (
                  <>
                    {a.employerNo || '—'}
                    {tab === 'rejected' ? (
                      <>
                        <br />
                        <small>{a.reason || ''}</small>
                      </>
                    ) : null}
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
