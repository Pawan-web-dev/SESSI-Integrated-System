/* Company Profile – breakdown of the Employer Identification Number (EIN), as returned by the server. */
import type { EinBreakdown } from '@/services/api/types';

export function EmployerNumberCard({ info }: { info: EinBreakdown | undefined }) {
  if (!info) return null;

  const segments = [
    { label: 'Directorate Code', code: info.directorate_code, meaning: info.directorate || '-' },
    { label: 'Industry Classification Code', code: info.industry_code, meaning: info.industry || '-' },
    { label: 'Establishment Serial No.', code: info.serial, meaning: 'Sequential within Directorate + Industry' },
    { label: 'Branch / Sub-unit', code: info.branch || '—', meaning: info.branch ? 'Branch identifier' : 'Head office (no branch)' },
  ];

  return (
    <div className="mt-3.5 overflow-hidden rounded-[10px] border border-solid border-essi-line bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-0 border-b border-solid border-b-essi-line px-4 py-3.5">
        <div className="text-[16px] font-bold text-essi-dark">Employer Identification Number</div>
        <div className="rounded-lg bg-essi-pale px-3 py-1 font-mono text-[18px] font-bold tracking-[.05em] text-essi-dark">{info.ein}</div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))]">
        {segments.map((s) => (
          <div key={s.label} className="border-0 border-b border-solid border-b-essi-mint px-4 py-3">
            <div className="text-[12px] text-ink-muted">{s.label}</div>
            <div className="mt-0.75 font-mono text-[16px] font-bold text-ink">{s.code}</div>
            <div className="text-[13px] text-ink-soft">{s.meaning}</div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2.5 text-[12px] text-ink-muted">
        Permanent number issued under the Sindh Employees&apos; Social Security Act, 2016. It is never re-issued, also after closure, transfer, merger or change of ownership, and appears on all contribution returns (F-4), arrears (F-5), receipts and notices.
      </div>
    </div>
  );
}
