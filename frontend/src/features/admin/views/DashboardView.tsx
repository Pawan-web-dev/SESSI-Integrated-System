/** Admin dashboard: headline figures, last 6 months, workforce mix and the largest establishments. */
import { useAppDispatch } from '@/app/hooks';
import { Alert } from '@/components/ui/Alert';
import { errorMessage } from '@/services/api/errors';
import { formatAmount } from '@/utils/format';
import { useGetAdminDashboardQuery } from '../adminApi';
import { employerOpened, sectionChanged } from '../adminSlice';
import { Empty, ICON, LINK, Panel, StatCard } from '../components/ui';

const n = (v: number) => v.toLocaleString('en-PK');

function HBars({ rows, color }: { rows: { label: string; value: number }[]; color: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  const total = rows.reduce((s, r) => s + r.value, 0) || 1;
  return rows.length ? (
    <div className="flex flex-col gap-3">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex justify-between text-[13px] mb-1">
            <span className="font-semibold capitalize">{r.label.toLowerCase()}</span>
            <span className="text-ink-muted">
              {n(r.value)} · {Math.round((r.value / total) * 100)}%
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-[#eef3ef] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: (r.value / max) * 100 + '%', background: color }} />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <Empty>No data yet.</Empty>
  );
}

function TrendChart({ data }: { data: { month: string; registrations: number; employees: number }[] }) {
  const max = Math.max(1, ...data.flatMap((d) => [d.registrations, d.employees]));
  return (
    <div>
      <div className="flex gap-4 text-[12px] mb-3">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#067a35]" /> Establishment registrations
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#2fae9f]" /> Employees added
        </span>
      </div>
      <div className="grid grid-cols-6 gap-2 items-end h-[180px] border-0 border-b border-solid border-[#e3ece6]">
        {data.map((d) => (
          <div key={d.month} className="flex items-end justify-center gap-1 h-full" title={`${d.month}: ${d.registrations} registration(s), ${d.employees} employee(s)`}>
            {[
              [d.registrations, '#067a35'],
              [d.employees, '#2fae9f'],
            ].map(([v, c], i) => (
              <div key={i} className="w-[38%] max-w-[26px] flex flex-col items-center justify-end h-full">
                <span className="text-[11px] text-ink-muted mb-0.5">{v as number}</span>
                <div className="w-full rounded-t" style={{ height: Math.max(2, ((v as number) / max) * 150), background: c as string }} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-2 mt-1.5">
        {data.map((d) => (
          <div key={d.month} className="text-center text-[11px] text-ink-muted">
            {d.month.split(' ')[0]}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardView() {
  const dispatch = useAppDispatch();
  const { data: d, error, isLoading } = useGetAdminDashboardQuery(undefined, { pollingInterval: 60000, refetchOnFocus: true });
  if (error) return <Alert kind="error" message={errorMessage(error)} />;
  if (isLoading || !d) return <p className="text-ink-muted">Loading…</p>;
  const go = (s: Parameters<typeof sectionChanged>[0]) => () => dispatch(sectionChanged(s));

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(230px,100%),1fr))] gap-4">
        <StatCard label="Registered companies" value={n(d.employers.approved)} hint={`${n(d.employers_total)} on record`} icon={ICON.building} onClick={go('employers')} />
        <StatCard label="Total employees" value={n(d.employees_total)} hint={`${n(d.employees.Active)} active`} icon={ICON.people} tone="blue" onClick={go('workers')} />
        <StatCard label="Dependents" value={n(d.dependents_total)} hint="family members on record" icon={ICON.family} tone="purple" onClick={go('workers')} />
        <StatCard label="Pending applications" value={n(d.pending_applications)} hint="awaiting review" icon={ICON.file} tone="amber" onClick={go('registrations')} />
        <StatCard label="Change requests" value={n(d.pending_change_requests)} hint="pending review" icon={ICON.swap} tone="teal" onClick={go('changes')} />
        <StatCard label="Collected (PKR)" value={formatAmount(d.collected_total)} hint={`${n(d.contributions_this_month)} return(s) this month`} icon={ICON.money} />
        <StatCard label="Outstanding (PKR)" value={formatAmount(d.outstanding_total)} hint={`${n(d.unpaid_challans)} unpaid challan(s)`} icon={ICON.clock} tone="red" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-5">
        <Panel title="Last 6 months">
          <TrendChart data={d.trend} />
        </Panel>
        <Panel title="Establishments by status">
          <HBars rows={(['approved', 'pending', 'rejected', 'closed'] as const).map((k) => ({ label: k, value: d.employers[k] })).filter((r) => r.value)} color="#067a35" />
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Panel title="Active employees by type">
          <HBars rows={d.employees_by_type} color="#2b4c9a" />
        </Panel>
        <Panel title="Employees by gender">
          <HBars rows={d.employees_by_gender} color="#6b3fa0" />
        </Panel>
        <Panel title="Largest establishments" action={<button className={LINK + ' text-[13px]'} onClick={go('employers')}>View all</button>}>
          {d.top_employers.length ? (
            <ol className="m-0 p-0 list-none flex flex-col gap-2.5">
              {d.top_employers.map((t, i) => (
                <li key={t.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-essi-mint text-essi-dark text-[12px] font-bold flex items-center justify-center flex-none">{i + 1}</span>
                  <button className={LINK + ' text-left flex-1 min-w-0 truncate'} onClick={() => dispatch(employerOpened(t.id))}>
                    {t.name}
                  </button>
                  <span className="text-[13px] text-ink-muted whitespace-nowrap">{n(t.employees)} active</span>
                </li>
              ))}
            </ol>
          ) : (
            <Empty>No employees registered yet.</Empty>
          )}
        </Panel>
      </div>
    </div>
  );
}
