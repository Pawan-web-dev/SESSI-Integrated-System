import { Modal } from '@/components/ui/Modal';
import { describeEin, type Account } from '@/services/portal';

/** Read-only summary of an enrolled company. */
export function CompanyDetailsModal({ company, onClose }: { company: Account | null; onClose: () => void }) {
  const ein = company ? describeEin(company.employerNo) : null;
  const rows: [string, string][] = company
    ? [
        ['Company', company.co.employer], ['Employer No. (EIN)', company.employerNo || 'Not assigned'],
        ['Directorate / Industry', ein ? ein.directorate + ' · ' + ein.industry : company.dir], ['Business type', company.co.btype], ['NTN', company.co.ntn || '—'],
        ['Address', company.co.addr + ', ' + company.co.district], ['Contact person', company.co.person + ' (' + company.co.desig + ')'], ['Email', company.email || '—'], ['Mobile', company.mobile || '—'],
      ]
    : [];
  return (
    <Modal open={!!company} onClose={onClose} labelledBy="cd-t" boxClassName="max-w-[560px]">
      <h1 id="cd-t" className="text-[20px]">
        Company details
      </h1>
      <div className="kv grid-cols-[170px_1fr] max-w-none mt-3 mx-0 mb-0">
        {rows.map(([label, value]) => [<div key={label + 'l'}>{label}</div>, <div key={label + 'v'}>{value}</div>])}
      </div>
      <div className="row justify-end mt-4">
        <button type="button" className="btn" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}
