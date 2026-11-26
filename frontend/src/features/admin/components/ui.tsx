/** Small building blocks shared by the admin workspace screens (cards, badges, icons, search box). */
import type { ReactNode } from 'react';

export const ICON = {
  dashboard: 'M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z',
  building: 'M4 21V5l8-3 8 3v16M9 21v-4h6v4M8 8h2M14 8h2M8 12h2M14 12h2',
  people: 'M16 11a3 3 0 100-6 3 3 0 000 6zM8 11a3 3 0 100-6 3 3 0 000 6zM2 20c0-3 3-5 6-5s6 2 6 5M14 15c3 0 8 1 8 5',
  family: 'M7 8a3 3 0 100-6 3 3 0 000 6zM17 8a3 3 0 100-6 3 3 0 000 6zM12 14a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM2 21c0-4 2-8 5-8s4 2 4 2M22 21c0-4-2-8-5-8s-4 2-4 2M8 22c0-3 2-5 4-5s4 2 4 5',
  file: 'M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h6',
  swap: 'M4 7h13l-3-3M20 17H7l3 3',
  money: 'M3 6h18v12H3zM12 15a3 3 0 100-6 3 3 0 000 6zM6 9v.01M18 15v.01',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM21 21l-5-5',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M18 6L6 18',
  logout: 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10',
  back: 'M19 12H5M11 6l-6 6 6 6',
  chevron: 'M9 6l6 6-6 6',
  check: 'M5 12l5 5 9-10',
};

export function Icon({ d, size = 18, className = '' }: { d: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={'flex-none ' + className}>
      <path d={d} />
    </svg>
  );
}

export function Panel({ title, action, children, className = '' }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={'bg-white rounded-xl border border-solid border-[#e3ece6] shadow-[0_1px_3px_rgba(16,51,29,.06)] ' + className}>
      {title ? (
        <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3 border-0 border-b border-solid border-[#eef3ef]">
          <h2 className="m-0 text-[15px] font-bold text-[#10331d]">{title}</h2>
          {action}
        </div>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatCard({ label, value, hint, icon, tone = 'green', onClick }: { label: string; value: ReactNode; hint?: ReactNode; icon: string; tone?: 'green' | 'blue' | 'amber' | 'red' | 'purple' | 'teal'; onClick?: () => void }) {
  const tones: Record<string, string> = {
    green: 'bg-[#e6f4ea] text-[#067a35]',
    blue: 'bg-[#e8eefc] text-[#2b4c9a]',
    amber: 'bg-[#fff3e0] text-[#b45309]',
    red: 'bg-[#fdecea] text-[#b00020]',
    purple: 'bg-[#f1e9fb] text-[#6b3fa0]',
    teal: 'bg-[#e0f5f2] text-[#1d8a7d]',
  };
  const body = (
    <>
      <span className={'w-11 h-11 rounded-xl flex items-center justify-center ' + tones[tone]}>
        <Icon d={icon} size={22} />
      </span>
      <span className="min-w-0 text-left">
        <span className="block text-[12px] font-semibold uppercase tracking-wide text-ink-muted">{label}</span>
        <span className="block text-[24px] font-bold text-[#10331d] leading-tight">{value}</span>
        {hint ? <span className="block text-[12px] text-ink-muted">{hint}</span> : null}
      </span>
    </>
  );
  const cls = 'flex items-center gap-3.5 bg-white rounded-xl border border-solid border-[#e3ece6] shadow-[0_1px_3px_rgba(16,51,29,.06)] p-4 w-full';
  return onClick ? (
    <button type="button" onClick={onClick} className={cls + ' cursor-pointer hover:border-essi-green transition-colors'}>
      {body}
    </button>
  ) : (
    <div className={cls}>{body}</div>
  );
}

const BADGE: Record<string, string> = {
  approved: 'bg-[#e6f4ea] text-[#1d6b3a]',
  active: 'bg-[#e6f4ea] text-[#1d6b3a]',
  pending: 'bg-[#fff3e0] text-[#8a5300]',
  inactive: 'bg-[#f1f1f1] text-[#555]',
  rejected: 'bg-[#fdecea] text-[#9b1c1c]',
  separated: 'bg-[#fdecea] text-[#9b1c1c]',
  closed: 'bg-[#f1f1f1] text-[#555]',
};

export function Badge({ status }: { status: string }) {
  return <span className={'inline-block rounded-full px-2.5 py-0.5 text-[12px] font-semibold capitalize whitespace-nowrap ' + (BADGE[status.toLowerCase()] || 'bg-[#eef] text-[#335]')}>{status}</span>;
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="relative flex-1 min-w-[220px] max-w-[460px]">
      <span className="sr-only">{placeholder}</span>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">
        <Icon d={ICON.search} size={16} />
      </span>
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full min-h-[42px] pl-9 pr-3 border border-solid border-essi-input rounded-lg text-[14px] bg-white box-border" />
    </label>
  );
}

export function FilterSelect({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: [string, string][]; label: string }) {
  return (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className="min-h-[42px] px-3 border border-solid border-essi-input rounded-lg text-[14px] bg-white">
      {options.map(([v, l]) => (
        <option key={v} value={v}>
          {l}
        </option>
      ))}
    </select>
  );
}

export function Avatar({ photo, name, size = 36 }: { photo?: string | null; name: string; size?: number }) {
  return photo ? (
    <img src={photo} alt="" width={size} height={size} style={{ width: size, height: size }} className="rounded-full object-cover border border-solid border-essi-line flex-none" />
  ) : (
    <span aria-hidden="true" style={{ width: size, height: size }} className="rounded-full bg-essi-mint text-essi-dark font-bold text-[13px] flex items-center justify-center flex-none">
      {name
        .split(' ')
        .slice(0, 2)
        .map((w) => w.charAt(0).toUpperCase())
        .join('')}
    </span>
  );
}

export const TABLE = 'w-full border-collapse text-[14px]';
export const TH = 'text-left text-[12px] font-semibold uppercase tracking-wide text-ink-muted py-2.5 px-3 border-0 border-b border-solid border-[#e3ece6] bg-[#f7faf8] whitespace-nowrap';
export const TD = 'py-2.5 px-3 border-0 border-b border-solid border-[#eef3ef] align-middle';
export const BTN = 'inline-flex items-center justify-center gap-2 min-h-[40px] px-4 rounded-lg border-0 bg-essi-dark text-white font-semibold text-[14px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed';
export const BTN_GHOST = 'inline-flex items-center justify-center gap-2 min-h-[40px] px-4 rounded-lg border border-solid border-essi-green bg-white text-essi-green font-semibold text-[14px] cursor-pointer disabled:opacity-60';
export const LINK = 'bg-transparent border-0 p-0 text-essi-green font-semibold cursor-pointer hover:underline text-[14px]';

export function BackButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 bg-transparent border-0 p-0 mb-3 text-essi-green font-semibold cursor-pointer text-[14px]">
      <Icon d={ICON.back} size={16} /> {children}
    </button>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="py-10 text-center text-ink-muted text-[14px]">{children}</div>;
}
