/* Worker-wise table used by the F-4 return and the C-1 schedule. */
import type { ContributionRow } from '../../../logic/documents';
import { DOC_TD, DOC_TH } from './DocumentParts';

interface WorkerScheduleTableProps {
  rows: ContributionRow[];
  /** workers not listed in the sample data */
  moreWorkers: number;
  /** show the mobile number column (C-1 schedule) */
  showMobile?: boolean;
  /** totals row: [label, total contribution] */
  total?: [string, string];
}

export function WorkerScheduleTable({ rows, moreWorkers, showMobile = false, total }: WorkerScheduleTableProps) {
  const headers = ['Sr. No.', 'Name of Worker', 'CNIC No.', ...(showMobile ? ['Mobile No.'] : []), 'Employment Type', 'Wages (Rs.)', 'Days Worked', 'Contribution (Rs.)'];
  return (
    <div className="mt-3.5 overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse">
        <tbody>
          <tr>
            {headers.map((h) => (
              <th key={h} className={DOC_TH}>
                {h}
              </th>
            ))}
          </tr>
          {rows.map((r) => (
            <tr key={r.n}>
              <td className={DOC_TD}>{r.n}</td>
              <td className={`${DOC_TD} text-left`}>{r.name}</td>
              <td className={DOC_TD}>{r.cnic}</td>
              {showMobile ? <td className={DOC_TD}>{r.mob}</td> : null}
              <td className={DOC_TD}>{r.type}</td>
              <td className={DOC_TD}>{r.wage}</td>
              <td className={DOC_TD}>{r.days}</td>
              <td className={DOC_TD}>{r.amt}</td>
            </tr>
          ))}
          {moreWorkers > 0 ? (
            <tr>
              <td colSpan={headers.length} className={`${DOC_TD} italic`}>
                … {moreWorkers} more workers (full list in the contribution file)
              </td>
            </tr>
          ) : null}
          {total ? (
            <tr>
              <td colSpan={headers.length - 1} className={`${DOC_TD} text-right font-bold`}>
                {total[0]}
              </td>
              <td className={`${DOC_TD} font-bold`}>{total[1]}</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
