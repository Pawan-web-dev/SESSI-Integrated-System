import { useEffect, useRef, useState } from 'react';
import { CURRENT_PERIOD, MONTH_NAMES, type Challan } from '@/services/portal';
import { ALL_DATES, daysIn, describeFilter, pad, type DateFilter } from './dateFilter';

interface ChallanDatePickerProps {
  value: DateFilter;
  onChange: (f: DateFilter) => void;
  /** all challans, used to mark due dates on the calendar */
  challans: Challan[];
}

/** Button + popup with typed day / month / year fields and a calendar. */
export function ChallanDatePicker({ value, onChange, challans }: ChallanDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateFilter>(value);
  const [error, setError] = useState('');
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const toggle = () => {
    if (!open) {
      setDraft(value);
      setError('');
    }
    setOpen(!open);
  };

  const gridYear = +draft.year >= 1900 ? +draft.year : CURRENT_PERIOD.year;
  const gridMonth = draft.month ? +draft.month : CURRENT_PERIOD.month;
  const firstWeekday = new Date(gridYear, gridMonth - 1, 1).getDay();
  const dueDays = new Set(challans.filter((c) => c.dueDate.startsWith(gridYear + '-' + pad(gridMonth))).map((c) => +c.dueDate.slice(8)));

  const step = (delta: number) => {
    let y = gridYear;
    let m = gridMonth + delta;
    if (m < 1) [m, y] = [12, y - 1];
    if (m > 12) [m, y] = [1, y + 1];
    setDraft({ day: '', month: String(m), year: String(y) });
  };

  const apply = () => {
    const { day, month, year } = draft;
    if (year && (year.length !== 4 || +year < 1900 || +year > 2100)) return setError('Enter a valid 4-digit year (e.g. 2026).');
    if (day && !month) return setError('Select a month for the day you entered.');
    if (day && !year) return setError('Enter the year for the day you entered.');
    if (day && (+day < 1 || +day > daysIn(+year, +month))) return setError('That month only has ' + daysIn(+year, +month) + ' days.');
    onChange(draft);
    setOpen(false);
  };

  const digits = (s: string) => s.replace(/\D/g, '');

  return (
    <div ref={root} className="relative">
      <button type="button" className="inp flex items-center gap-2 cursor-pointer text-left min-w-[190px] bg-white" aria-haspopup="true" aria-expanded={open} onClick={toggle}>
        <span aria-hidden="true">📅</span>
        <span className="flex-1">{describeFilter(value)}</span>
        <span aria-hidden="true">▾</span>
      </button>
      {open ? (
        <div className="admin-pop">
          <div className="grid grid-cols-[70px_1fr_90px] gap-2 mb-2.5">
            <label className="text-[12px] text-ink-soft">
              Day
              <input className="inp text-center" inputMode="numeric" maxLength={2} placeholder="DD" value={draft.day} onChange={(e) => setDraft({ ...draft, day: digits(e.target.value) })} onKeyDown={(e) => e.key === 'Enter' && apply()} />
            </label>
            <label className="text-[12px] text-ink-soft">
              Month
              <select className="inp" value={draft.month} onChange={(e) => setDraft({ ...draft, month: e.target.value })}>
                <option value="">All months</option>
                {MONTH_NAMES.map((n, i) => (
                  <option key={n} value={i + 1}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[12px] text-ink-soft">
              Year
              <input className="inp text-center" inputMode="numeric" maxLength={4} placeholder="YYYY" value={draft.year} onChange={(e) => setDraft({ ...draft, year: digits(e.target.value) })} onKeyDown={(e) => e.key === 'Enter' && apply()} />
            </label>
          </div>
          <div className="flex items-center justify-between mt-1 mb-1.5">
            <button type="button" className="btn ghost py-0.5 px-2.5 min-h-0" aria-label="Previous month" onClick={() => step(-1)}>
              ‹
            </button>
            <b className="text-essi-dark">
              {MONTH_NAMES[gridMonth - 1]} {gridYear}
            </b>
            <button type="button" className="btn ghost py-0.5 px-2.5 min-h-0" aria-label="Next month" onClick={() => step(1)}>
              ›
            </button>
          </div>
          <div className="admin-cal">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((w) => (
              <div key={w} className="wd">
                {w}
              </div>
            ))}
            {Array.from({ length: firstWeekday }, (_, i) => (
              <div key={'b' + i} />
            ))}
            {Array.from({ length: daysIn(gridYear, gridMonth) }, (_, i) => {
              const d = i + 1;
              const selected = +draft.day === d && +draft.month === gridMonth && +draft.year === gridYear;
              return (
                <button key={d} type="button" className={selected ? 'sel' : ''} onClick={() => setDraft({ day: String(d), month: String(gridMonth), year: String(gridYear) })}>
                  {d}
                  {dueDays.has(d) ? <i /> : null}
                </button>
              );
            })}
          </div>
          <p className="admin-muted text-[11px] mt-2 mb-0">Type the day, month and year, or pick from the calendar. Leave day empty for a whole month, and month empty for a whole year. • = challan due.</p>
          {error ? (
            <div className="err on mt-2" role="alert">
              {error}
            </div>
          ) : null}
          <div className="flex justify-between gap-2 mt-3">
            <button
              type="button"
              className="btn ghost admin-action"
              onClick={() => {
                onChange(ALL_DATES);
                setOpen(false);
              }}
            >
              All dates
            </button>
            <button type="button" className="btn admin-action" onClick={apply}>
              Apply
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

