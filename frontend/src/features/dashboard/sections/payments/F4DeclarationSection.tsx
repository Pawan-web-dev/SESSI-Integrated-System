/* Employer dashboard – Challans & Payments > F-4 > Declaration (employer's declaration for the monthly return, printable). */
import { ActionButton, BackIcon, PrintIcon } from '@/components/ui/ActionButton';
import type { ViewProps } from '@/types/view';
import type { DocumentsView } from '../../logic/documents';
import { DOC_LABEL, DOC_VALUE, DocumentHeader, DocumentSheet, DocumentTitleRow } from './documents/DocumentParts';

export function F4DeclarationSection({ v }: ViewProps) {
  const { f4Form: f, company } = v as DocumentsView;

  if (!f.found) {
    return (
      <div className="mt-4 rounded-[10px] border border-solid border-essi-line bg-white p-5 text-[14px] text-ink-muted">
        No F-4 return yet, so there is nothing to declare.
        <div className="mt-4">
          <ActionButton onClick={v.goHome} icon={<BackIcon />}>
            Back to Dashboard
          </ActionButton>
        </div>
      </div>
    );
  }

  const facts: [string, string][] = [
    ['Employer Identification No.', company.empNo],
    ['Name of Establishment', company.name.toUpperCase()],
    ['Industry Classification', company.industry || '-'],
    ['Directorate', company.directorate],
    ['Contribution month', f.month],
    ['Number of workers declared', f.workers],
    ['Contribution paid under section 20(1)', 'Rs. ' + f.contribution],
    ['Receipt No.', f.receiptNo],
  ];

  return (
    <div className="mt-4">
      <DocumentSheet>
        <DocumentHeader directorate={company.directorate} />
        <DocumentTitleRow
          left={
            <>
              Form: <b>F-4</b>
            </>
          }
          title="DECLARATION BY EMPLOYER – MONTHLY RETURN OF CONTRIBUTIONS"
          right={
            <>
              Month: <b>{f.month}</b>
            </>
          }
        />

        <table className="w-full border-collapse">
          <tbody>
            {facts.map(([label, value]) => (
              <tr key={label}>
                <td className={DOC_LABEL}>{label}</td>
                <td className={DOC_VALUE}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-5 text-[15px] leading-[1.6]">
          <p className="m-0">
            I, <b>{company.person || '________________'}</b>
            {company.designation ? ', ' + company.designation : ''}, on behalf of <b>{company.name}</b> (Employer No. <b>{company.empNo}</b>), do hereby solemnly declare that:
          </p>
          <ol className="mb-0 mt-2.5 pl-6">
            <li>the particulars of workers, wages and contributions given in Form F-4 for the month of {f.month} are true, correct and complete;</li>
            <li>all {f.workers} workers employed in the establishment during that month have been included, and no worker in covered employment has been left out;</li>
            <li>contributions of Rs. {f.contribution} (with service charges Rs. {f.serviceCharges}, total Rs. {f.total}) have been paid vide receipt No. {f.receiptNo};</li>
            <li>the records of wages and attendance are kept at the establishment and will be produced to officers of the Institution on demand.</li>
          </ol>
          <p className="mb-0 mt-2.5">I understand that a false declaration is an offence under the Sindh Employees&apos; Social Security Act, 2016.</p>
        </div>

        <div className="mt-12 flex flex-wrap justify-between gap-6 text-[14px]">
          <div className="min-w-[220px] border-0 border-t border-solid border-ink-print pt-1.5 text-center">
            Signature of Employer / Authorized Person
            <br />
            {company.person}
          </div>
          <div className="min-w-[160px] border-0 border-t border-solid border-ink-print pt-1.5 text-center">Date</div>
          <div className="min-w-[160px] border-0 border-t border-solid border-ink-print pt-1.5 text-center">Company Stamp</div>
        </div>
      </DocumentSheet>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <ActionButton variant="primary" onClick={v.printDoc} icon={<PrintIcon />}>
          Print Declaration
        </ActionButton>
        <ActionButton onClick={v.goF4}>F-4 List</ActionButton>
        <ActionButton onClick={v.goHome} icon={<BackIcon />}>
          Back to Dashboard
        </ActionButton>
      </div>
    </div>
  );
}
