/*
 * Employer registration wizard – validation and step navigation.
 * Flow: create account -> verify mobile/email (codes sent by the server) -> 1 business info -> 2 documents
 *       (uploaded to the server) -> 3 contact & location -> 4 review -> submit.
 * All wizard state is in Redux (../registrationSlice.ts); the markup is in RegistrationView.tsx and ./steps/.
 */
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { config } from '@/config/env';
import { directorateFor } from '@/services/api/masterApi';
import type { Application, Directorate, Industry, RegistrationRequest } from '@/services/api/types';
import type { Any, ViewEnv } from '@/types/view';
import {
  errorShown, fieldChanged, numberChecked, sendCodes, stepChanged, stepCleared, submitApplication, uploadDocument, verifyCodes, wizardCleared,
  type FieldValue, type Step, type UploadedDoc,
} from '../registrationSlice';
import { RegistrationView } from './RegistrationView';

const FIELDS = ['an', 'ac', 'am', 'ae', 'ap', 'ap2', 'otpM', 'otpE', 'en', 'ba', 'bt', 'ind', 'dist', 'secp', 'ntn', 'srb', 'gps', 'pn', 'pd', 'pm', 'pe', 'ph', 'wk', 'st'];
const BOOLS = ['agree', 'decl'];
const DOCS: [string, string, boolean, string][] = [['secp', 'SECP Certificate', true, 'Required'], ['ntn', 'NTN', true, 'Required'], ['srb', 'SRB Registration', true, 'Required'], ['elec', 'Electricity Bill', true, 'Required'], ['gas', 'Gas Bill', false, 'If applicable'], ['deed', 'Partnership Deed', false, 'Where applicable'], ['cnic', 'Proprietor/Employer CNIC', true, 'Required'], ['bank', 'Bank Details', true, 'Required'], ['logo', 'Company Logo', false, 'Where applicable'], ['contact', 'Contact Numbers & Email Address', true, 'Required']];
const STEPS = [['Business Information', 'Provide your business details'], ['Document Upload', 'Upload mandatory documents'], ['Contact & Location', 'Add contact information'], ['Review & Submit', 'Verify and submit your registration']];
export const EIN_FORMAT_HINT = 'DDD-II-NNNNNN (Directorate-Industry-Serial), e.g. 100-91-000001';

/** DD/MM/YYYY (also D-M-YYYY) -> YYYY-MM-DD, or '' when it is not a real date. */
export function isoDate(value: unknown): string {
  const m = String(value || '').trim().match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (!m) return '';
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d || y < 1900) return '';
  return date.toISOString().slice(0, 10);
}

export interface RegistrationWizardProps {
  industries: Industry[];
  directorates: Directorate[];
  /** navigate to another portal page */
  nav: (to: string) => void;
  /** called after the server accepted the application */
  onSubmitted: (app: Application, cnic: string) => void;
}

type Fields = Record<string, FieldValue>;
const str = (f: Fields, k: string) => String(f[k] ?? '').trim();
const bad = (f: Fields, k: string) => !str(f, k);
const STEP_FIELDS: Record<number, string[]> = {
  1: ['en', 'ba', 'bt', 'ind', 'dist', 'secp', 'ntn', 'srb', 'gps'],
  3: ['pn', 'pd', 'pm', 'pe', 'ph', 'wk', 'st'],
};

/** The first problem on a step, or '' when the step is complete. */
export function validateStep(step: Step, f: Fields, docs: Record<string, UploadedDoc>, directorates: Directorate[]): string {
  if (step === 'acct') {
    const pw = String(f.ap ?? '');
    if (bad(f, 'an')) return 'Enter the full name of the authorized person.';
    if (str(f, 'ac').replace(/\D/g, '').length !== 13) return 'CNIC must have 13 digits, for example 42101-1234567-1.';
    if (!/^03\d{2}-?\d{7}$/.test(str(f, 'am'))) return 'Enter a valid mobile number, for example 0300-1234567.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(str(f, 'ae'))) return 'Enter a valid email address.';
    if (pw.length < 8 || !/[A-Z]/.test(pw) || !/[0-9]/.test(pw)) return 'Password needs at least 8 characters, one capital letter and one number.';
    if (pw !== f.ap2) return 'Passwords do not match.';
    if (!f.agree) return 'Please confirm that you are authorized to register this establishment.';
  }
  if (step === 'verify' && (!/^\d{6}$/.test(str(f, 'otpM')) || !/^\d{6}$/.test(str(f, 'otpE')))) {
    return 'Enter the 6-digit code from the SMS and the one from the e-mail.';
  }
  if (step === 1) {
    const labels: Record<string, string> = {
      en: 'Employer Name', ba: 'Business Address', bt: 'Business Type', ind: 'Industry Classification', secp: 'SECP Certificate No.',
      dist: 'District', ntn: 'NTN', gps: 'GPS Location', srb: 'SRB Registration No.',
    };
    const miss = Object.keys(labels).filter((k) => bad(f, k)).map((k) => labels[k]);
    if (miss.length) return 'Please fill in: ' + miss.join(', ') + '.';
    if (!directorateFor(directorates, str(f, 'dist'))) return 'There is no ESSI Directorate for that district yet. Choose another district or contact ESSI.';
  }
  if (step === 2) {
    const miss = DOCS.filter((d) => d[2] && !docs[d[0]]).map((d) => d[1]);
    if (miss.length) return 'Please upload: ' + miss.join(', ') + '.';
  }
  if (step === 3) {
    const labels: Record<string, string> = {
      pn: 'Contact person', pd: 'Designation', pm: 'Mobile number', pe: 'Email address', wk: 'Expected number of workers', st: 'Date operations started',
    };
    const miss = Object.keys(labels).filter((k) => bad(f, k)).map((k) => labels[k]);
    if (miss.length) return 'Please fill in: ' + miss.join(', ') + '.';
    if (!(Number(f.wk) >= 1)) return 'Expected number of workers must be at least 1.';
    const started = isoDate(f.st);
    if (!started) return 'Enter the date operations started as DD/MM/YYYY, e.g. 01/03/2020.';
    if (started > new Date().toISOString().slice(0, 10)) return 'The date operations started cannot be in the future.';
  }
  if (step === 4 && !f.decl) return 'Please accept the declaration to submit.';
  return '';
}

function requestBody(f: Fields, docs: Record<string, UploadedDoc>, contactToken: string): RegistrationRequest {
  const t = (k: string) => str(f, k);
  return {
    contact_token: contactToken, applicant_name: t('an'), cnic: t('ac'), mobile: t('am'), email: t('ae'), password: String(f.ap ?? ''),
    employer_name: t('en'), business_address: t('ba'), business_type: t('bt'), industry_code: t('ind'), district: t('dist'),
    secp_no: t('secp'), ntn: t('ntn'), srb_no: t('srb'), gps: t('gps'),
    documents: Object.fromEntries(Object.entries(docs).map(([k, d]) => [k, d.fileId])),
    contact_person: t('pn'), designation: t('pd'), contact_mobile: t('pm'), contact_email: t('pe'), office_phone: t('ph') || null,
    expected_workers: Number(f.wk), operations_started: isoDate(f.st) || t('st'), declaration_accepted: !!f.decl,
  };
}

const sizeLabel = (bytes: number) => (bytes >= 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(1) + ' MB' : Math.max(1, Math.round(bytes / 1024)) + ' KB');
const ACCEPTED = /\.(pdf|jpe?g|png)$/i;

export function RegistrationWizard({ industries, directorates, nav, onSubmitted }: RegistrationWizardProps) {
  const dispatch = useAppDispatch();
  const { step, fields: f, docs, uploading, checks, error, notice, busy, restored, contactToken } = useAppSelector((s) => s.registration);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const setF = (key: string, value: FieldValue) => dispatch(fieldChanged({ key, value }));

  const next = async () => {
    if (busy) return;
    const problem = validateStep(step, f, docs, directorates);
    if (problem) {
      dispatch(errorShown(problem));
      return;
    }
    if (step === 'acct') void dispatch(sendCodes(false));
    else if (step === 'verify') void dispatch(verifyCodes());
    else if (step === 4) {
      const cnic = str(f, 'ac');
      const result = await dispatch(submitApplication(requestBody(f, docs, contactToken)));
      if (submitApplication.fulfilled.match(result)) onSubmitted(result.payload, cnic);
    } else dispatch(stepChanged((step + 1) as Step));
  };

  const back = () => {
    if (step === 'verify') dispatch(stepChanged('acct'));
    else if (typeof step === 'number' && step > 1) dispatch(stepChanged((step - 1) as Step));
  };

  /** Format check only – ESSI verifies the numbers with SECP / FBR / SRB during the review. */
  const check = (key: string) => {
    const ok = str(f, key).replace(/\D/g, '').length >= 6;
    dispatch(numberChecked({ key, ok, msg: ok ? 'Format looks correct. ESSI verifies it during the review.' : 'This number looks too short. Check it and try again.' }));
  };

  /** Fill the GPS field from the device location. */
  const locate = () => {
    if (!navigator.geolocation) {
      dispatch(errorShown('This browser cannot share your location. Type the GPS coordinates instead.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setF('gps', `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`);
        dispatch(errorShown(''));
      },
      () => dispatch(errorShown('Location permission was refused. Allow location access in the browser, or type the coordinates.')),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const pick = (docType: string, e: Any) => {
    const input = e.target as HTMLInputElement;
    const file = input.files && input.files[0];
    input.value = ''; // lets the same file be chosen again after an error
    if (!file) return;
    if (!ACCEPTED.test(file.name)) {
      dispatch(errorShown(file.name + ': upload a PDF, JPG or PNG file.'));
      return;
    }
    if (file.size > config.maxUploadMb * 1024 * 1024) {
      dispatch(errorShown(`${file.name} is larger than ${config.maxUploadMb} MB.`));
      return;
    }
    void dispatch(uploadDocument({ docType, file }));
  };

  const dir = directorateFor(directorates, str(f, 'dist'));
  const industry = industries.find((i) => i.code === f.ind);
  const anyUploading = Object.keys(uploading).length > 0;
  const out: Any = {
    s_acct: step === 'acct', s_verify: step === 'verify', s_1: step === 1, s_2: step === 2, s_3: step === 3, s_4: step === 4, s_done: false,
    showSteps: typeof step === 'number', showNeed: step === 'acct' || step === 'verify', err: error, hasErr: !!error, busy: busy || anyUploading,
    restored, maxMb: config.maxUploadMb,
    next: () => void next(), back, reset: () => dispatch(stepCleared(STEP_FIELDS[step as number] ?? [])),
    resend: () => void dispatch(sendCodes(true)), resendMsg: notice,
    viewMap: locate,
    newApp: () => dispatch(wizardCleared()),
    appNo: '',
    directorate: dir ? `${dir.name} (code ${dir.code})` : f.dist ? 'No Directorate for this district' : 'Select a district first',
    industries, einHint: EIN_FORMAT_HINT,
  };
  FIELDS.forEach((k) => {
    out['v_' + k] = f[k] ?? '';
    out['h_' + k] = (e: Any) => setF(k, e.target.value);
  });
  BOOLS.forEach((k) => {
    out['v_' + k] = !!f[k];
    out['h_' + k] = (e: Any) => setF(k, e.target.checked);
  });
  ['ntn', 'secp', 'srb'].forEach((k) => {
    out['c_' + k] = checks[k]?.msg ?? '';
    out['cc_' + k] = checks[k]?.ok ? '#067a35' : '#b00020';
    out['chk_' + k] = () => check(k);
  });
  const cur = typeof step === 'number' ? step : 0;
  out.stepItems = STEPS.map((s, i) => {
    const n = i + 1;
    const done = n < cur;
    const now = n === cur;
    return {
      title: s[0], sub: s[1], mark: done ? '✓' : String(n), bd: done || now ? '#067a35' : '#9bb8a5', bg: done ? '#067a35' : '#ffffff',
      fg: done ? '#ffffff' : now ? '#067a35' : '#6b8576', tc: done || now ? '#0b4d24' : '#4d6654',
    };
  });
  out.docTiles = DOCS.map((d) => {
    const doc = docs[d[0]];
    const loading = !!uploading[d[0]];
    const has = !!doc && !loading;
    return {
      label: d[1] + (d[2] ? ' *' : ''),
      sub: loading ? 'Uploading…' : has ? `✓ ${doc.fileName} (${sizeLabel(doc.size)})` : d[3],
      sc: has ? '#067a35' : '#4d6654', bc: has ? '#067a35' : '#b9d6c4', bg: has ? '#e8f6ec' : '#f7faf8', ic: has ? '#067a35' : '#3d5a45',
      busy: loading,
      pick: (e: Any) => pick(d[0], e),
    };
  });
  const rows = [
    ['Applicant', f.an], ['CNIC', f.ac], ['Mobile (verified)', f.am], ['Email (verified)', f.ae], ['Employer name', f.en], ['Business type', f.bt],
    ['Industry classification', industry ? `${industry.name} (code ${industry.code})` : ''], ['Business address', f.ba], ['District / Province', (f.dist || '') + ', Sindh'],
    ['Directorate', dir ? `${dir.name} (code ${dir.code})` : ''], ['SECP certificate no.', f.secp], ['NTN', f.ntn], ['SRB registration no.', f.srb], ['GPS location', f.gps],
    ['Documents uploaded', DOCS.filter((d) => docs[d[0]]).map((d) => d[1]).join(', ') || 'None'],
    ['Contact person', (f.pn || '') + ', ' + (f.pd || '')], ['Contact mobile / email', (f.pm || '') + ' / ' + (f.pe || '')],
    ['Expected workers', f.wk], ['Operations started', f.st],
  ];
  out.summary = rows.map((r, i) => ({ l: r[0], v: String(r[1] || '-'), bg: i % 2 ? '#f7faf8' : '#ffffff' }));
  out.timeline = [];

  const env: ViewEnv = { coName: '', empNo: '', person: '', dir: '', empty: false, nav };
  return (
    <div className="workspace">
      <RegistrationView v={out} P={env} />
    </div>
  );
}
