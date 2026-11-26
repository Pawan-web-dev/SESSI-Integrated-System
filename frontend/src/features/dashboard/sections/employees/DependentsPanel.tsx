/* Employee registration – Dependents Information box: FRC scan (offline OCR + face detection) and the editable family list. */
import { useEffect, useState } from 'react';
import { DependentsEditor } from '@/features/dependents/DependentsEditor';
import { genderOf, newKey, type DependentDraft } from '@/features/dependents/dependentDraft';
import { ICONS } from './EmployeeRegistrationParts';
import type { FrcScan } from '../../frc/scanFrc';
import { relationToWorker } from '../../frc/frcRelations';

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
  /** a finished scan waiting for the user to say which person on the certificate is the worker */
  const [picking, setPicking] = useState<{ scan: FrcScan; selected: number | null } | null>(null);
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
    setPicking(null);
    try {
      const { scanFrc } = await import('../../frc/scanFrc');
      const result = await scanFrc(file, (m, percent) => setScanning({ message: m, percent }));
      // the user says who on the certificate is the worker; pre-select the person whose CNIC is already typed in
      // the form, but only when exactly one person has it
      const typed = cnic.replace(/\D/g, '');
      const matches = typed.length === 13 ? result.people.flatMap((p, i) => (p.cnic.replace(/\D/g, '') === typed ? [i] : [])) : [];
      setPicking({ scan: result, selected: matches.length === 1 ? matches[0] : null });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'The certificate could not be read.');
    } finally {
      setScanning(null);
    }
  };

  /** The chosen person fills the employee form; everyone else becomes a dependent, related to the worker. */
  const applyWorker = (scan: FrcScan, index: number) => {
    const w = scan.people[index];
    onApply({ fn: w.name, fa: w.fatherName, cn: w.cnic, dob: w.dob, gender: w.gender, ph: w.photo });
    // keep rows the user typed in by hand; replace earlier scan / demo rows with this certificate's family
    const manual = rows.filter((r) => r.source === 'Manual' && (r.name.trim() || r.cnic.trim()));
    const scanned: DependentDraft[] = scan.people
      .filter((_, i) => i !== index)
      .map((p) => {
        const relation = relationToWorker(p.relation, p.gender, w.relation);
        const values = { name: p.name, relation, cnic: p.cnic, dob: p.dob };
        const missing = (['name', 'relation', 'cnic', 'dob'] as const).filter((f) => !values[f]);
        return { key: newKey(), ...values, gender: p.gender || genderOf(relation), photo: p.photo, source: 'FRC', missing: [...missing] };
      });
    onRowsChange([...scanned, ...manual]);
    setPicking(null);
    const filled = [w.name && 'name', w.cnic && 'CNIC', w.fatherName && 'father’s name', w.dob && 'date of birth', w.gender && 'gender', w.photo && 'photo'].filter(Boolean).join(', ');
    const gaps = scanned.reduce((n, r) => n + (r.missing?.length ?? 0), 0);
    setSummary(
      'Read in ' + scan.seconds + ' s. Filled the employee form (' + filled + ') for ' + (w.name || 'the worker') + '. ' +
        'Added ' + scanned.length + ' dependent(s)' + (scan.photosFound ? ' with ' + scan.photosFound + ' photo(s) found' : '') + '. ' +
        (gaps ? gaps + ' value(s) could not be read and are highlighted. ' : '') +
        (!w.gender ? 'Select the gender yourself. ' : '') +
        'Check every value against the certificate, correct anything misread and fill in what is missing, then click Save.',
    );
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
          <div className="text-[11px] text-ink-muted mt-1.5">
            The certificate is read three times so that as many details as possible are found. When it finishes, every value below can be checked and edited.
          </div>
        </div>
      ) : null}
      {message ? (
        <div role="alert" className="mb-2.5 text-danger text-[13px] bg-danger-bg border border-solid border-[#f3b9b3] rounded-lg py-2 px-3">
          {message}
        </div>
      ) : null}
      {picking ? (
        <div role="group" aria-labelledby="frc-worker-title" className="mb-2.5 rounded-lg border-2 border-solid border-essi-green bg-white p-3.5">
          <div id="frc-worker-title" className="font-bold text-[15px] text-essi-dark">Who is the worker?</div>
          <div className="text-[12px] text-ink-soft mb-2.5">
            Found {picking.scan.people.length} people on this certificate. Select the person you are registering as the worker; everyone else is
            added as their dependent.
          </div>
          <div className="grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">
            {picking.scan.people.map((p, i) => {
              const on = picking.selected === i;
              return (
                <label
                  key={i}
                  className={
                    'flex items-center gap-3 rounded-lg border border-solid p-2.5 cursor-pointer ' +
                    (on ? 'border-essi-green bg-[#eef9f1] ring-2 ring-essi-green' : 'border-essi-line bg-white hover:border-essi-green')
                  }
                >
                  <input type="radio" name="frc-worker" className="accent-essi-green" checked={on} onChange={() => setPicking({ ...picking, selected: i })} />
                  {p.photo ? (
                    <img src={p.photo} alt="" className="w-12 h-12 rounded-md object-cover flex-none" />
                  ) : (
                    <span className="w-12 h-12 rounded-md bg-essi-mint flex-none" aria-hidden="true" />
                  )}
                  <span className="min-w-0 text-[12px] leading-snug">
                    <span className="block font-semibold text-[13px] text-ink truncate">{p.name || 'Name not read'}</span>
                    <span className="block text-ink-soft">
                      {p.relation === 'Self' ? 'FRC applicant' : p.relation || 'Relation not read'}
                    </span>
                    <span className="block text-ink-muted">
                      {p.cnic || 'CNIC not read'} · {p.dob || 'DOB not read'}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2.5 mt-3">
            <button
              type="button"
              className="inline-flex items-center min-h-[42px] px-4 rounded-lg border-0 bg-essi-green text-white font-semibold text-[13px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={picking.selected === null}
              onClick={() => picking.selected !== null && applyWorker(picking.scan, picking.selected)}
            >
              {picking.selected === null ? 'Select the worker' : 'Make ' + (picking.scan.people[picking.selected].name || 'this person') + ' the worker'}
            </button>
            <button type="button" className={BTN} onClick={() => setPicking(null)}>
              Cancel
            </button>
          </div>
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
