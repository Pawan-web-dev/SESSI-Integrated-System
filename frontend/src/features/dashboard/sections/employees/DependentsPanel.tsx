/* Employee registration – Dependents Information box: FRC scan (offline OCR + face detection) and the editable family list. */
import { useEffect, useState } from 'react';
import { DependentsEditor } from '@/features/dependents/DependentsEditor';
import { genderOf, newKey, type DependentDraft } from '@/features/dependents/dependentDraft';
import { ICONS } from './EmployeeRegistrationParts';

/** Fields of the employee form that a scanned FRC can fill. */
export type FrcFill = Partial<Record<'fn' | 'fa' | 'cn' | 'dob' | 'gender' | 'ph', string>>;

const Svg = ({ d, size = 16 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none">
    <path d={d} />
  </svg>
);

/** Demo dependents for a CNIC (used by the "Fetch from NADRA" demo, which is not connected to NADRA). */
function demoDependents(cnic: string): DependentDraft[] {
  const d = cnic.replace(/\D/g, '');
  const spouse = d.slice(0, 12) + String((+d[12] + 1) % 10);
  return [
    { key: newKey(), name: 'Ayesha Bibi', relation: 'Spouse', cnic: spouse.slice(0, 5) + '-' + spouse.slice(5, 12) + '-' + spouse.slice(12), dob: '09/08/1993', gender: 'FEMALE', source: 'NADRA' },
    { key: newKey(), name: 'Ali Raza', relation: 'Son', cnic: '42101-0000123-7', dob: '15/02/2016', gender: 'MALE', source: 'NADRA' },
    { key: newKey(), name: 'Fatima Noor', relation: 'Daughter', cnic: '42101-0000456-9', dob: '21/10/2019', gender: 'FEMALE', source: 'NADRA' },
  ];
}

const BTN = 'inline-flex items-center gap-2 min-h-[42px] px-4 rounded-lg border border-solid border-essi-green bg-white text-essi-green font-semibold text-[13px] cursor-pointer';

/**
 * Upload FRC scans a Family Registration Certificate on this computer (no internet needed): it fills the employee
 * form (name, CNIC, father's name, date of birth, gender, photo) and lists the family members with their photos.
 * Every value stays editable, rows can be added by hand, and the list is saved with the employee.
 * "Fetch from NADRA" is a demo with sample records.
 */
export function DependentsPanel({
  cnic,
  rows,
  onRowsChange,
  onApply,
}: {
  cnic: string;
  rows: DependentDraft[];
  onRowsChange: (rows: DependentDraft[]) => void;
  onApply: (found: FrcFill) => void;
}) {
  const [message, setMessage] = useState('');
  const [summary, setSummary] = useState('');
  const [scanning, setScanning] = useState<{ message: string; percent: number } | null>(null);
  const validCnic = cnic.replace(/\D/g, '').length === 13;

  // start the OCR engine in the background as soon as the form opens, so "Upload FRC" does not wait for it
  useEffect(() => {
    const start = () => void import('../../frc/scanFrc').then((m) => m.warmUpScanner()).catch(() => undefined);
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(start);
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(start, 1500);
    return () => window.clearTimeout(t);
  }, []);

  const fetchNadra = () => {
    if (!validCnic) return setMessage('Enter the employee’s full 13-digit CNIC first.');
    setMessage('');
    setSummary('Sample records from the NADRA demo (not connected to NADRA). Check and correct them before saving.');
    onRowsChange(demoDependents(cnic));
  };

  const scan = async (file: File | undefined) => {
    if (!file) return;
    if (!/\.(pdf|jpe?g|png|webp)$/i.test(file.name)) return setMessage('Choose the FRC as a PDF, JPG or PNG file.');
    if (file.size > 15 * 1024 * 1024) return setMessage('The FRC file is larger than 15 MB.');
    setMessage('');
    setSummary('');
    setScanning({ message: 'Starting…', percent: 0 });
    try {
      const { scanFrc } = await import('../../frc/scanFrc');
      const result = await scanFrc(file, (m, percent) => setScanning({ message: m, percent }));
      const a = result.applicant;
      if (a) onApply({ fn: a.name, fa: a.fatherName, cn: a.cnic, dob: a.dob, gender: a.gender, ph: a.photo });
      // keep rows the user typed in by hand; replace earlier scan / demo rows with this certificate's family
      const manual = rows.filter((r) => r.source === 'Manual' && (r.name.trim() || r.cnic.trim()));
      const scanned: DependentDraft[] = result.members.map((m) => {
        const relation = m.relation === 'Family member' ? '' : m.relation;
        const values = { name: m.name, relation, cnic: m.cnic, dob: m.dob };
        const missing = (['name', 'relation', 'cnic', 'dob'] as const).filter((f) => !values[f]);
        return { key: newKey(), ...values, gender: genderOf(relation), photo: m.photo, source: 'FRC', missing: [...missing] };
      });
      onRowsChange([...scanned, ...manual]);
      const filled = a ? [a.name && 'name', a.cnic && 'CNIC', a.fatherName && 'father’s name', a.dob && 'date of birth', a.gender && 'gender', a.photo && 'photo'].filter(Boolean).join(', ') : '';
      const gaps = scanned.reduce((n, r) => n + (r.missing?.length ?? 0), 0);
      setSummary(
        'Read in ' + result.seconds + ' s. ' +
          (a ? 'Filled the employee form (' + filled + ') for ' + (a.name || 'the applicant') + '. ' : '') +
          'Found ' + scanned.length + ' family member(s)' + (result.photosFound ? ' and ' + result.photosFound + ' photo(s)' : '') + '. ' +
          (gaps ? gaps + ' value(s) could not be read and are highlighted. ' : '') +
          (a && !a.gender ? 'Select the gender yourself. ' : '') +
          'Check every value against the certificate and correct anything misread before saving.',
      );
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'The certificate could not be read.');
    } finally {
      setScanning(null);
    }
  };

  return (
    <div className="rounded-[10px] border border-solid border-essi-line bg-[#f2f9f6] p-3.5 mt-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3">
          <span className="text-essi-green">
            <Svg d={ICONS.people} size={30} />
          </span>
          <div>
            <div className="font-bold text-[15px]">
              Dependents Information {rows.length ? <span className="font-normal text-ink-soft">({rows.length})</span> : null}
            </div>
            <div className="text-[12px] text-ink-soft">
              Upload the FRC to read the family details and photos (nothing leaves this computer), or add them by hand. Dependents are saved with the employee.
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button type="button" className={BTN} onClick={fetchNadra} disabled={!!scanning}>
            <Svg d={ICONS.refresh} />
            Fetch from NADRA
          </button>
          <label className={BTN + (scanning ? ' opacity-60 pointer-events-none' : '')}>
            <Svg d={ICONS.upload} />
            Upload FRC
            <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" disabled={!!scanning} onChange={(e) => { void scan(e.target.files?.[0]); e.target.value = ''; }} />
          </label>
          {rows.length ? (
            <button type="button" className={BTN} onClick={() => { onRowsChange([]); setSummary(''); setMessage(''); }} disabled={!!scanning}>
              Clear all
            </button>
          ) : null}
        </div>
      </div>

      {scanning ? (
        <div role="status" className="mb-2.5 rounded-lg border border-solid border-essi-line bg-white py-2.5 px-3.5">
          <div className="flex justify-between text-[13px] mb-1.5">
            <span className="font-semibold text-essi-dark">{scanning.message}</span>
            <span>{scanning.percent}%</span>
          </div>
          <div className="h-2 rounded bg-essi-mint overflow-hidden">
            <div className="h-full bg-essi-green transition-[width] duration-300" style={{ width: scanning.percent + '%' }} />
          </div>
        </div>
      ) : null}
      {message ? (
        <div role="alert" className="mb-2.5 text-danger text-[13px] bg-danger-bg border border-solid border-[#f3b9b3] rounded-lg py-2 px-3">
          {message}
        </div>
      ) : null}
      {summary ? (
        <div role="status" className="mb-2.5 text-essi-dark text-[13px] bg-[#eef9f1] border border-solid border-essi-line rounded-lg py-2 px-3">
          {summary}
        </div>
      ) : null}

      <DependentsEditor rows={rows} onChange={onRowsChange} disabled={!!scanning} />
    </div>
  );
}
