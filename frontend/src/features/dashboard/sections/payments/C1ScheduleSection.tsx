/* Employer dashboard – Challans & Payments > F-4 > C-1 (worker-wise schedule of wages and contributions, printable). */
import { ActionButton, BackIcon, PrintIcon } from '@/components/ui/ActionButton';
import type { ViewProps } from '@/types/view';
import type { DocumentsView } from '../../logic/documents';
import { DOC_LABEL, DOC_VALUE, DocumentHeader, DocumentSheet, DocumentTitleRow } from './documents/DocumentParts';
import { WorkerScheduleTable } from './documents/WorkerScheduleTable';

export function C1ScheduleSection({ v }: ViewProps) {
  const { f4Form: f, company } = v as DocumentsView;

  if (!f.found) {
    return (
      <div className="mt-4 rounded-[10px] border border-solid border-essi-line bg-white p-5 text-[14px] text-ink-muted">
        No contribution has been paid yet, so there is no worker-wise schedule.
        <div className="mt-4">
          <ActionButton onClick={v.goHome} icon={<BackIcon />}>
            Back to Dashboard
          </ActionButton>
        </div>
      </div>
    );
  }

  const header: [string, string][] = [
    ['Employer Identification No.', company.empNo],
    ['Name of Establishment', company.name.toUpperCase()],
    ['Contribution month', f.month],
    ['Receipt No.', f.receiptNo],
  ];

  return (
    <div className="mt-4">
      <DocumentSheet>
        <DocumentHeader directorate={company.directorate} />
        <DocumentTitleRow
          left={
            <>
              Schedule: <b>C-1</b>
            </>
          }
          title="WORKER-WISE SCHEDULE OF WAGES AND CONTRIBUTIONS (ANNEXURE TO F-4)"
          right={
            <>
              Month: <b>{f.month}</b>
            </>
          }
        />

        <table className="w-full border-collapse">
          <tbody>
            {header.map(([label, value]) => (
              <tr key={label}>
                <td className={DOC_LABEL}>{label}</td>
                <td className={DOC_VALUE}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <WorkerScheduleTable rows={f.rows} moreWorkers={f.moreWorkers} showMobile total={['Total contribution for ' + f.workers + ' workers (Rs.)', f.contribution]} />

        <div className="mt-10 flex flex-wrap justify-between gap-6 text-[14px]">
          <div className="min-w-[220px] border-0 border-t border-solid border-ink-print pt-1.5 text-center">Signature of Employer / Authorized Person</div>
          <div className="min-w-[160px] border-0 border-t border-solid border-ink-print pt-1.5 text-center">Company Stamp</div>
        </div>
      </DocumentSheet>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <ActionButton variant="primary" onClick={v.printDoc} icon={<PrintIcon />}>
          Print C-1
        </ActionButton>
        <ActionButton onClick={v.goF4}>F-4 List</ActionButton>
        <ActionButton onClick={v.goHome} icon={<BackIcon />}>
          Back to Dashboard
        </ActionButton>
      </div>
    </div>
  );
}
