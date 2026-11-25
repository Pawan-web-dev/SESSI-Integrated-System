/* Employee registration – Dependents Information box: FRC scan (offline OCR + face detection) and the family list. */
import { useState } from 'react';
import { resizePhoto } from '../../logic/photo';
import { ICONS } from './EmployeeRegistrationParts';

interface Dependent {
  name: string;
  relationship: string;
  cnic: string;
  dob: string;
  /** 200x200 JPEG data URL (read from the FRC, or added with the photo button) */
  photo?: string;
}

/** Fields of the employee form that a scanned FRC can fill. */
export type FrcFill = Partial<Record<'fn' | 'fa' | 'cn' | 'dob' | 'gender' | 'ph', string>>;

const Svg = ({ d, size = 16 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none">
    <path d={d} />
  </svg>
);

/** Demo dependents for a CNIC (used by the "Fetch from NADRA" demo, which is not connected to NADRA). */
function demoDependents(cnic: string): Dependent[] {
  const d = cnic.replace(/\D/g, '');
  const spouse = d.slice(0, 12) + String((+d[12] + 1) % 10);
  return [
    { name: 'Ayesha Bibi', relationship: 'Spouse', cnic: spouse.slice(0, 5) + '-' + spouse.slice(5, 12) + '-' + spouse.slice(12), dob: '09/08/1993' },
    { name: 'Ali Raza', relationship: 'Son', cnic: 'B-Form 42101-0000123-7', dob: '15/02/2016' },
    { name: 'Fatima Noor', relationship: 'Daughter', cnic: 'B-Form 42101-0000456-9', dob: '21/10/2019' },
  ];
}

const BTN = 'inline-flex items-center gap-2 min-h-[42px] px-4 rounded-lg border border-solid border-essi-green bg-white text-essi-green font-semibold text-[13px] cursor-pointer';
const TH = 'py-2 px-3 font-semibold border-b border-solid border-essi-line';
const TD = 'py-2 px-3 border-b border-solid border-essi-line';

/**
 * Upload FRC scans a Family Registration Certificate on this computer (no internet needed): it fills the employee
 * form (name, CNIC, father's name, date of birth, gender, photo) and lists the family members with their photos.
 * "Fetch from NADRA" is a demo. The dependents list is not saved with the employee yet (the backend has no field for it).
 */
export function DependentsPanel({ cnic, onApply }: { cnic: string; onApply: (found: FrcFill) => void }) {
  const [list, setList] = useState<Dependent[]>([]);
  const [source, setSource] = useState('');
  const [message, setMessage] = useState('');
  const [summary, setSummary] = useState('');
  const [scanning, setScanning] = useState<{ message: string; percent: number } | null>(null);
  const validCnic = cnic.replace(/\D/g, '').length === 13;

  const setPhoto = (index: number, photo: string | undefined) => setList((l) => l.map((d, i) => (i === index ? { ...d, photo } : d)));
  const pickPhoto = (index: number, file: File | undefined) => {
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) return setMessage('Dependent photo must be a JPG, PNG or WebP image.');
    if (file.size > 5 * 1024 * 1024) return setMessage('The photo is larger than 5 MB.');
    resizePhoto(file, (url) => { setPhoto(index, url); setMessage(''); }, setMessage);
  };

  const fetchNadra = () => {
    if (!validCnic) return setMessage('Enter the employee’s full 13-digit CNIC first.');
    setMessage('');
    setSummary('');
    setList(demoDependents(cnic));
    setSource('Fetched from NADRA (demo) · sample records only, not saved with the employee');
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
      setList(result.members.map((m) => ({ name: m.name || '—', relationship: m.relation, cnic: m.cnic || '—', dob: m.dob || '—', photo: m.photo })));
      setSource('Scanned from “' + file.name + '” on this computer · shown for checking, not saved with the employee');
      const filled = a ? [a.name && 'name', a.cnic && 'CNIC', a.fatherName && 'father’s name', a.dob && 'date of birth', a.gender && 'gender', a.photo && 'photo'].filter(Boolean).join(', ') : '';
      setSummary(
        (a ? 'Filled the employee form (' + filled + ') for ' + a.name + '. ' : '') +
          'Found ' + result.members.length + ' other family member(s)' + (result.photosFound ? ' and ' + result.photosFound + ' photo(s)' : '') + '. ' +
          (a && !a.gender ? 'Select the gender yourself. ' : '') + 'Please check everything against the certificate, small print can be misread.',
      );
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'The certificate could not be read.');
    } finally {
      setScanning(null);
    }
  };

  const clear = () => {
    setList([]);
    setSource('');
    setMessage('');
    setSummary('');
  };

  return (
    <div className="rounded-[10px] border border-solid border-essi-line bg-[#f2f9f6] p-3.5 mt-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3">
          <span className="text-essi-green">
            <Svg d={ICONS.people} size={30} />
          </span>
          <div>
            <div className="font-bold text-[15px]">Dependents Information</div>
            <div className="text-[12px] text-ink-soft">Upload the FRC to read the family details and photos. Nothing leaves this computer.</div>
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
          {list.length ? (
            <button type="button" className={BTN} onClick={clear} disabled={!!scanning}>
              Clear
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
          <div className="text-[11px] text-ink-muted mt-1.5">The first scan loads the reading engine and can take about 20 seconds.</div>
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
      {source ? <div className="mb-2 text-[12px] text-essi-dark font-semibold">{source}</div> : null}

      <div className="overflow-x-auto rounded-lg border border-solid border-essi-line bg-white">
        <table className="w-full border-collapse text-[13px] min-w-[560px]">
          <thead>
            <tr className="bg-[#f1f7f4] text-left">
              {['#', 'Photo', 'Name', 'Relationship', 'CNIC', 'Date of Birth'].map((h) => (
                <th key={h} className={TH}>
                  {h}
                </th>
              ))}
              <th className={TH}>
                <span className="sr-only">Remove</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {list.length ? (
              list.map((d, i) => (
                <tr key={d.name + d.cnic + i}>
                  <td className={TD}>{i + 1}</td>
                  <td className={TD}>
                    <div className="flex items-center gap-2">
                      {d.photo ? (
                        <img src={d.photo} alt={'Photo of ' + d.name} width="48" height="48" className="w-12 h-12 rounded-full object-cover border border-solid border-essi-green" />
                      ) : (
                        <svg width="48" height="48" viewBox="0 0 44 44" aria-hidden="true" className="rounded-full flex-none">
                          <rect width="44" height="44" fill="#d9d9d9" />
                          <circle cx="22" cy="17" r="8" fill="#fff" />
                          <path d="M6 44c0-10 7-14 16-14s16 4 16 14z" fill="#fff" />
                        </svg>
                      )}
                      <div className="flex flex-col items-start gap-0.5">
                        <label className="text-essi-green font-semibold underline cursor-pointer text-[12px]">
                          {d.photo ? 'Change' : 'Upload'}
                          <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => { pickPhoto(i, e.target.files?.[0]); e.target.value = ''; }} />
                        </label>
                        {d.photo ? (
                          <button type="button" onClick={() => setPhoto(i, undefined)} className="bg-transparent border-0 p-0 text-danger text-[12px] cursor-pointer">
                            Remove
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className={TD}>{d.name}</td>
                  <td className={TD}>{d.relationship}</td>
                  <td className={TD + ' whitespace-nowrap'}>{d.cnic}</td>
                  <td className={TD}>{d.dob}</td>
                  <td className={TD}>
                    <button type="button" aria-label={'Remove ' + d.name} title="Remove from list" onClick={() => setList((l) => l.filter((_, k) => k !== i))} className="bg-transparent border-0 text-danger text-[18px] cursor-pointer leading-none">
                      ×
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-3 px-3 text-center text-ink-soft">
                  <span className="inline-flex items-center gap-2">
                    <Svg d={ICONS.info} />
                    Click “Upload FRC” to scan a certificate. Family members and their photos will appear here.
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
