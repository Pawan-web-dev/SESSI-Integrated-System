/* Building blocks of the Employee Registration screen. */
import { useRef, type ReactNode } from 'react';

export type UploadMethod = 'excel' | 'csv' | 'api' | 'manual';

const INPUT = 'py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white focus:outline-2 focus:outline-essi-teal';

const Icon = ({ d, size = 22, color = 'currentColor' }: { d: string; size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none">
    <path d={d} />
  </svg>
);

/** Section heading with an icon and a rule, e.g. "Employee Registration". */
export function SectionTitle({ icon, children, size = 22 }: { icon: string; children: ReactNode; size?: number }) {
  return (
    <div className="flex items-center gap-3 mb-3.5">
      <span className="w-[38px] h-[38px] rounded-[10px] bg-essi-mint flex items-center justify-center">
        <Icon d={icon} color="#067a35" />
      </span>
      <h2 className="m-0 font-bold text-essi-dark" style={{ fontSize: size }}>
        {children}
      </h2>
      <span className="flex-1 h-[2px] bg-essi-green opacity-70" />
    </div>
  );
}

export const ICONS = {
  people: 'M16 11a3 3 0 100-6 3 3 0 000 6zM8 11a3 3 0 100-6 3 3 0 000 6zM2 20c0-3 3-5 6-5s6 2 6 5M14 15c3 0 8 1 8 5',
  person: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6',
  upload: 'M7 18a4 4 0 01-.5-8A6 6 0 0118 8.5 4.5 4.5 0 0117.5 18M12 12v7M9 15l3-3 3 3',
  download: 'M12 4v11M8 11l4 4 4-4M5 20h14',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5L16 9.5',
  refresh: 'M20 11a8 8 0 00-14-4M4 4v4h4M4 13a8 8 0 0014 4M20 20v-4h-4',
  info: 'M12 8h.01M11 12h1v5h1M12 21a9 9 0 100-18 9 9 0 000 18z',
  calendar: 'M5 5h14v15H5zM5 10h14M9 3v4M15 3v4',
  check: 'M5 12l5 5 9-10',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  back: 'M19 12H5M11 6l-6 6 6 6',
};

const METHODS: { key: UploadMethod; label: string; icon: string; color: string; soon?: boolean }[] = [
  { key: 'excel', label: 'Excel', icon: 'M6 3h9l4 4v14H6zM9 12l4 5M13 12l-4 5', color: '#1d7a43', soon: true },
  { key: 'csv', label: 'CSV', icon: 'M7 3h8l4 4v14H7zM15 3v4h4M10 12h6M10 16h4', color: '#0b5fa8', soon: true },
  { key: 'api', label: 'API', icon: 'M7 18a4 4 0 01-.5-8A6 6 0 0118 8.5 4.5 4.5 0 0117.5 18M12 12v6M9 15h6', color: '#0b5fa8', soon: true },
  { key: 'manual', label: 'Manual Entry', icon: 'M3 7h18v10H3zM7 11h.01M11 11h.01M15 11h.01M7 14h10', color: '#0b4d24' },
];

/** The four "Choose Upload Method" cards. */
export function UploadMethodCards({ value, onChange }: { value: UploadMethod; onChange: (m: UploadMethod) => void }) {
  return (
    <fieldset className="border-0 p-0 m-0 mb-3">
      <legend className="font-bold text-[15px] text-essi-dark p-0 mb-2">Choose Upload Method</legend>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(190px,100%),1fr))] gap-3">
        {METHODS.map((m) => {
          const on = value === m.key;
          return (
            <label key={m.key} className={'relative flex flex-col items-center justify-center gap-1.5 min-h-[78px] rounded-[10px] cursor-pointer border border-solid ' + (on ? 'border-essi-green bg-essi-tint' : 'border-essi-line bg-white')}>
              <input type="radio" name="upload-method" checked={on} onChange={() => onChange(m.key)} className="absolute left-3.5 top-3.5 accent-[#067a35]" />
              <Icon d={m.icon} size={30} color={m.color} />
              <span className="font-semibold text-[14px]">{m.label}</span>
              {m.soon ? <span className="absolute right-2 top-2 text-[10px] font-bold rounded-full bg-[#fff4d6] text-[#8a5200] py-px px-2">Soon</span> : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

const TEMPLATE_HEADER = 'CNIC,Name,Father Name,Date of Birth,Gender,Date of Joining,Designation,Monthly Wages,Bank Account,Mobile Number';
const TEMPLATE_ROW = '42101-1234567-1,Ahmed Raza,Muhammad Raza,12/03/1988,MALE,01/02/2019,Production Supervisor,40000,0001-1234501,0300-1234567';

function downloadTemplate() {
  const blob = new Blob([TEMPLATE_HEADER + '\n' + TEMPLATE_ROW + '\n'], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'employee_template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/** Drop zone + sample template for bulk methods. Bulk import is not connected to the server yet. */
export function BulkUploadPanel({ method }: { method: Exclude<UploadMethod, 'manual'> }) {
  const label = method === 'excel' ? 'Excel' : method === 'csv' ? 'CSV' : 'API';
  const formats = method === 'excel' ? '.xlsx, .xls' : method === 'csv' ? '.csv' : '';
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-[10px] border border-solid border-essi-line bg-[#eef9f1] py-4 px-5 mb-4">
      <div className="flex items-center gap-4 flex-1 min-w-[260px]">
        <Icon d={ICONS.upload} size={44} color="#067a35" />
        <div>
          <div className="font-bold text-[16px]">{method === 'api' ? 'Connect via API' : 'Upload ' + label + ' File'}</div>
          {method === 'api' ? (
            <div className="text-[13px] text-ink-soft">Send employee records from your payroll or HR system.</div>
          ) : (
            <div className="text-[13px]">
              Drag &amp; drop your file here or <span className="font-semibold text-essi-green underline">Browse File</span>
              <div className="text-[11px] text-ink-muted">Supported formats: {formats} (Max size: 5MB)</div>
            </div>
          )}
          <div className="mt-1.5 text-[12px] text-[#8a5200]">Bulk {method === 'api' ? 'API access' : 'import'} is not available yet — use Manual Entry below to save employees.</div>
        </div>
      </div>
      {method !== 'api' ? (
        <button type="button" onClick={downloadTemplate} className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-lg border border-solid border-essi-green bg-white text-essi-green font-semibold text-[13px] cursor-pointer">
          <Icon d={ICONS.download} size={18} />
          Download Sample Template
        </button>
      ) : null}
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
}

/** Label on the left, control on the right (stacks on small screens). */
export function Field({ id, label, required = true, children }: FieldProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[130px_1fr] items-center gap-x-3 gap-y-1 text-[14px]">
      <label htmlFor={id} className="font-semibold text-[#1d2f24]">
        {label} {required ? <span className="text-danger">*</span> : null}
      </label>
      {children}
    </div>
  );
}

export const inputClass = INPUT;

/** Text box with a calendar button that opens the browser's date picker; keeps DD/MM/YYYY text. */
export function DateInput({ id, value, onText }: { id: string; value: string; onText: (text: string) => void }) {
  const native = useRef<HTMLInputElement>(null);
  const iso = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  return (
    <div className="relative">
      <input id={id} className={INPUT + ' pr-10'} placeholder="DD/MM/YYYY" value={value} onChange={(e) => onText(e.target.value)} inputMode="numeric" />
      <button
        type="button"
        aria-label="Open calendar"
        className="absolute right-1 top-1 w-9 h-9 flex items-center justify-center bg-transparent border-0 text-ink-muted cursor-pointer"
        onClick={() => {
          try {
            native.current?.showPicker();
          } catch {
            native.current?.focus();
          }
        }}
      >
        <Icon d={ICONS.calendar} size={18} />
      </button>
      <input
        ref={native}
        type="date"
        tabIndex={-1}
        aria-hidden="true"
        value={iso ? iso[3] + '-' + iso[2] + '-' + iso[1] : ''}
        onChange={(e) => {
          const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e.target.value);
          if (m) onText(m[3] + '/' + m[2] + '/' + m[1]);
        }}
        className="absolute right-0 bottom-0 w-px h-px opacity-0 pointer-events-none"
      />
    </div>
  );
}

/** Dependents box. NADRA lookup and FRC upload need an integration that does not exist yet. */
export function DependentsPanel() {
  return (
    <div className="rounded-[10px] border border-solid border-essi-line bg-[#f2f9f6] p-3.5 mt-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3">
          <Icon d={ICONS.people} size={30} color="#067a35" />
          <div>
            <div className="font-bold text-[15px]">Dependents Information</div>
            <div className="text-[12px] text-ink-soft">Names of Dependents will be fetched from NADRA and cannot be changed later.</div>
          </div>
        </div>
        <div className="flex gap-2.5">
          <button type="button" disabled title="NADRA integration is not connected yet" className="inline-flex items-center gap-2 min-h-[42px] px-4 rounded-lg border border-solid border-essi-green bg-white text-essi-green font-semibold text-[13px] opacity-60 cursor-not-allowed">
            <Icon d={ICONS.refresh} size={16} />
            Fetch from NADRA
          </button>
          <button type="button" disabled title="FRC upload is not connected yet" className="inline-flex items-center gap-2 min-h-[42px] px-4 rounded-lg border border-solid border-essi-green bg-white text-essi-green font-semibold text-[13px] opacity-60 cursor-not-allowed">
            <Icon d={ICONS.upload} size={16} />
            Upload FRC
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-solid border-essi-line bg-white">
        <table className="w-full border-collapse text-[13px] min-w-[480px]">
          <thead>
            <tr className="bg-[#f1f7f4] text-left">
              {['#', 'Name', 'Relationship', 'CNIC', 'Date of Birth'].map((h) => (
                <th key={h} className="py-2 px-3 font-semibold border-b border-solid border-essi-line">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="py-3 px-3 text-center text-ink-soft">
                <span className="inline-flex items-center gap-2">
                  <Icon d={ICONS.info} size={16} color="#0b5fa8" />
                  Dependents will be fetched automatically from NADRA once the integration is connected.
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Green / red / neutral banner under the form. */
export function DuplicateCheck({ state }: { state: 'idle' | 'ok' | 'dup' }) {
  const tone = state === 'dup' ? 'border-[#f3b9b3] bg-danger-bg text-danger' : 'border-essi-line bg-[#eef9f1] text-essi-dark';
  return (
    <div role="status" className={'flex items-center gap-3 rounded-lg border border-solid py-3 px-4 text-[14px] flex-1 min-w-[260px] ' + tone}>
      <span className={'w-6 h-6 rounded-full flex items-center justify-center text-white flex-none ' + (state === 'dup' ? 'bg-danger' : state === 'ok' ? 'bg-essi-green' : 'bg-[#9bb5a4]')}>
        <Icon d={state === 'dup' ? 'M7 7l10 10M17 7L7 17' : ICONS.check} size={14} color="#fff" />
      </span>
      <span>
        <b>Duplicate Check:</b>{' '}
        {state === 'ok' ? 'CNIC is unique and available for registration.' : state === 'dup' ? 'An employee with this CNIC is already registered.' : 'Enter a full CNIC to check it against registered employees.'}
      </span>
    </div>
  );
}
