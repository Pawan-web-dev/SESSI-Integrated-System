/** Read-only list of an employee's saved dependents (cards with photo, relationship, family-member number, CNIC and date of birth). */
import type { Dependent } from '@/services/api/types';
import { workerNoDigits } from '@/utils/format';

const date = (iso: string | null) => (iso ? iso.split('-').reverse().join('/') : '—');

export function DependentsList({ items, title = 'Dependents' }: { items: Dependent[]; title?: string }) {
  return (
    <div className="mt-4">
      <div className="font-bold text-[14px] text-essi-dark mb-2">
        {title} <span className="font-normal text-ink-muted">({items.length})</span>
      </div>
      {items.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(250px,100%),1fr))] gap-2.5">
          {items.map((d) => (
            <div key={d.id} className="flex gap-3 items-center rounded-lg border border-solid border-essi-line bg-[#fafdfb] p-2.5">
              {d.photo ? (
                <img src={d.photo} alt={'Photo of ' + d.name} width="48" height="48" className="w-12 h-12 rounded-full object-cover border border-solid border-essi-green flex-none" />
              ) : (
                <span aria-hidden="true" className="w-12 h-12 rounded-full bg-essi-mint text-essi-dark font-bold flex items-center justify-center flex-none">
                  {d.name.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <div className="font-semibold text-[14px] truncate">{d.name}</div>
                <div className="text-[12px] text-essi-green font-semibold">{d.relation}</div>
                {d.worker_no ? <div className="text-[12px] font-mono text-essi-dark" title={d.worker_no}>{workerNoDigits(d.worker_no)}</div> : null}
                <div className="text-[12px] text-ink-muted">
                  {d.cnic || 'No CNIC'} · DOB {date(d.date_of_birth)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[13px] text-ink-muted m-0">No dependents saved. Click Edit to add them (or upload the FRC).</p>
      )}
    </div>
  );
}
