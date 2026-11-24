import { useMemo, useState } from 'react';
import { CURRENT_PERIOD, formatDueDate, formatMoney, getChallans, type ChallanStatus } from '@/services/portal';
import { AdminTable, StatusPill } from '../components/AdminTable';
import { ChallanDatePicker } from '../components/ChallanDatePicker';
import { describeFilter, matchesDateFilter, type DateFilter } from '../components/dateFilter';

const INITIAL_FILTER: DateFilter = { day: '', month: String(CURRENT_PERIOD.month), year: String(CURRENT_PERIOD.year) };

/** Challan register with search, payment-status filter and a date / month / year filter. */
export function ChallansView() {
  const all = useMemo(() => getChallans(), []);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'' | ChallanStatus>('');
  const [date, setDate] = useState<DateFilter>(INITIAL_FILTER);

  const q = query.trim().toLowerCase();
  const items = all
    .filter((c) => (!q || [c.company, c.id, c.employerNo].join(' ').toLowerCase().includes(q)) && matchesDateFilter(c, date) && (!status || c.status === status))
    .sort((a, b) => b.year * 12 + b.month - (a.year * 12 + a.month) || (a.id < b.id ? -1 : 1));
  const total = items.reduce((n, c) => n + c.amount, 0);
  const unpaid = items.filter((c) => c.status === 'Unpaid').reduce((n, c) => n + c.amount, 0);

  return (
    <>
      <div className="admin-detail">
        <b>{date.day ? 'Challans due on ' + describeFilter(date) : 'Billing period: ' + describeFilter(date).toLowerCase().replace('all dates', 'all periods')}</b>
        <p className="admin-muted mt-1.5 mb-0">Challan register · Demo records only. Amounts are sample values and must be connected to the verified contribution rules before production.</p>
      </div>
      <div className="admin-filter">
        <input className="inp min-w-[260px]" aria-label="Search challans" placeholder="Search company / Employer No. / challan number" value={query} onChange={(e) => setQuery(e.target.value)} />
        <ChallanDatePicker value={date} onChange={setDate} challans={all} />
        <select className="inp" aria-label="Payment status" value={status} onChange={(e) => setStatus(e.target.value as '' | ChallanStatus)}>
          <option value="">All payment statuses</option>
          <option>Paid</option>
          <option>Unpaid</option>
        </select>
      </div>
      <p className="admin-muted mt-0 mb-2.5">
        <b>{items.length}</b> challan(s) · Total {formatMoney(total)} · Unpaid {formatMoney(unpaid)}
      </p>
      <AdminTable
        headers={['Challan No.', 'Company', 'Employer No.', 'Contribution month', 'Workers', 'Declared wages', 'Amount due', 'Due date', 'Payment status']}
        rowKeys={items.map((c) => c.id + c.companyId)}
        empty="No challans match the selected filters."
        rows={items.map((c) => [
          <span className="whitespace-nowrap">{c.id}</span>, c.company, <span className="whitespace-nowrap">{c.employerNo || '—'}</span>, new Date(c.year, c.month - 1).toLocaleString('en-GB', { month: 'long', year: 'numeric' }),
          c.workers, formatMoney(c.wages), <b>{formatMoney(c.amount)}</b>, <span className="whitespace-nowrap">{formatDueDate(c.dueDate)}</span>,
          <StatusPill tone={c.status === 'Unpaid' ? 'pending' : undefined}>{c.status}</StatusPill>,
        ])}
      />
    </>
  );
}
