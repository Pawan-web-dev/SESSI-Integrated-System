/*
 * Employer registration wizard – state, validation and step navigation (ported from the design).
 * Flow: create account -> verify mobile/email -> 1 business info -> 2 documents -> 3 contact -> 4 review.
 * The markup is in RegistrationView.tsx and ./steps/.
 */
import React from 'react';
import { directorateForDistrict, EIN_FORMAT_HINT, findIndustry, industryOptions, STORAGE_KEYS } from '@/services/portal';
import type { Any, ViewEnv } from '@/types/view';
import { RegistrationView } from './RegistrationView';

const FIELDS = ['an', 'ac', 'am', 'ae', 'ap', 'ap2', 'otpM', 'otpE', 'en', 'ba', 'bt', 'ind', 'dist', 'secp', 'ntn', 'srb', 'gps', 'pn', 'pd', 'pm', 'pe', 'ph', 'wk', 'st'];
const BOOLS = ['agree', 'decl'];
const DOCS: [string, string, boolean, string][] = [['secp', 'SECP Certificate', true, 'Required'], ['ntn', 'NTN', true, 'Required'], ['srb', 'SRB Registration', true, 'Required'], ['elec', 'Electricity Bill', true, 'Required'], ['gas', 'Gas Bill', false, 'If applicable'], ['deed', 'Partnership Deed', false, 'Where applicable'], ['cnic', 'Proprietor/Employer CNIC', true, 'Required'], ['bank', 'Bank Details', true, 'Required'], ['logo', 'Company Logo', false, 'Where applicable'], ['contact', 'Contact Numbers & Email Address', true, 'Required']];
const STEPS = [['Business Information', 'Provide your business details'], ['Document Upload', 'Upload mandatory documents'], ['Contact & Location', 'Add contact information'], ['Review & Submit', 'Verify and submit your registration']];
const DRAFT_KEY = STORAGE_KEYS.registrationDraft;
const ACCOUNTS_KEY = STORAGE_KEYS.accounts;

export interface RegistrationWizardProps {
  /** navigate to another portal page */
  nav: (to: string) => void;
  /** called with the form values when the application is submitted */
  onRegistered: (f: Record<string, Any>) => void;
}

export class RegistrationWizard extends React.Component<RegistrationWizardProps, Any> {
  state: Any = {};
  componentDidMount() {
    try {
      const r = window.localStorage.getItem(DRAFT_KEY);
      if (r) {
        const d = JSON.parse(r);
        if (d.step >= 1 && d.step <= 4) {
          this.setState({ f: d.f || {}, docs: d.docs || {}, step: d.step, restored: true });
        }
      }
    } catch {
      /* ignore */
    }
  }
  setF(k: string, v: Any) { const st = this.state || {}; this.setState({ f: Object.assign({}, st.f || {}, { [k]: v }) }); }
  saveDraft(step: Any) {
    const st = this.state || {}; const f = Object.assign({}, st.f || {}); delete f.ap; delete f.ap2; delete f.otpM; delete f.otpE;
    try { window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ f: f, docs: st.docs || {}, step: step })); } catch { /* ignore */ }
  }
  check(k: string) {
    const st = this.state || {}; const v = String((st.f || {})[k] || '').trim();
    const src = ({ ntn: 'FBR', secp: 'SECP', srb: 'SRB' } as Record<string, string>)[k];
    const ok = v.replace(/\D/g, '').length >= 6;
    this.setState({ chk: Object.assign({}, st.chk || {}, { [k]: ok ? 'Matched in ' + src + ' records (demo check).' : 'Number not found. Check it and try again.' }), chkOk: Object.assign({}, st.chkOk || {}, { [k]: ok }) });
  }
  validate(step: Any) {
    const st = this.state || {}; const f = st.f || {}; const docs = st.docs || {}; const bad = (v: Any) => !v || !String(v).trim();
    if (step === 'acct') {
      if (bad(f.an)) { return 'Enter the full name of the authorized person.'; }
      if (String(f.ac || '').replace(/\D/g, '').length !== 13) { return 'CNIC must have 13 digits, for example 42101-1234567-1.'; }
      if (!/^03\d{2}-?\d{7}$/.test(String(f.am || '').trim())) { return 'Enter a valid mobile number, for example 0300-1234567.'; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(f.ae || '').trim())) { return 'Enter a valid email address.'; }
      if (!f.ap || f.ap.length < 8 || !/[A-Z]/.test(f.ap) || !/[0-9]/.test(f.ap)) { return 'Password needs at least 8 characters, one capital letter and one number.'; }
      if (f.ap !== f.ap2) { return 'Passwords do not match.'; }
      if (!f.agree) { return 'Please confirm that you are authorized to register this establishment.'; }
      try { const acc = JSON.parse(window.localStorage.getItem(ACCOUNTS_KEY) || '[]'); const cd = String(f.ac).replace(/\D/g, ''); const em = String(f.ae).trim().toLowerCase(); if (acc.some((a: Any) => String(a.cnic).replace(/\D/g, '') === cd || String(a.email).toLowerCase() === em)) { return 'An account with this CNIC or email already exists. Please log in instead.'; } } catch { /* ignore */ }
    }
    if (step === 'verify') { if (String(f.otpM || '').trim() !== '123456' || String(f.otpE || '').trim() !== '654321') { return 'The codes do not match. Demo codes: SMS 123456, email 654321.'; } }
    if (step === 1) {
      const miss: string[] = []; [['en', 'Employer Name'], ['ba', 'Business Address'], ['bt', 'Business Type'], ['ind', 'Industry Classification'], ['secp', 'SECP Certificate No.'], ['dist', 'District'], ['ntn', 'NTN'], ['gps', 'GPS Location'], ['srb', 'SRB Registration No.']].forEach((p) => { if (bad(f[p[0]])) { miss.push(p[1]); } });
      if (miss.length) { return 'Please fill in: ' + miss.join(', ') + '.'; }
    }
    if (step === 2) { const miss = DOCS.filter((d) => d[2] && !docs[d[0]]).map((d) => d[1]); if (miss.length) { return 'Please upload: ' + miss.join(', ') + '.'; } }
    if (step === 3) {
      const miss: string[] = []; [['pn', 'Contact person'], ['pd', 'Designation'], ['pm', 'Mobile number'], ['pe', 'Email address'], ['wk', 'Expected number of workers'], ['st', 'Date operations started']].forEach((p) => { if (bad(f[p[0]])) { miss.push(p[1]); } });
      if (miss.length) { return 'Please fill in: ' + miss.join(', ') + '.'; }
    }
    if (step === 4) { if (!f.decl) { return 'Please accept the declaration to submit.'; } }
    return '';
  }
  go(step: Any) { this.setState({ step: step, err: '', restored: false }); if (typeof step === 'number') { this.saveDraft(step); } }
  next() {
    const st = this.state || {}; const step = st.step || 'acct'; const e = this.validate(step);
    if (e) { this.setState({ err: e }); return; }
    if (step === 'acct') { this.go('verify'); }
    else if (step === 'verify') { const f = st.f || {}; this.setState({ f: Object.assign({}, f, { pn: f.pn || f.an, pm: f.pm || f.am, pe: f.pe || f.ae }) }); this.go(1); }
    else if (step === 4) { try { window.localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ } this.setState({ step: 'done', err: '', appNo: 'REG-2026-' + String(10000 + (Date.now() % 90000)) }); this.props.onRegistered(st.f || {}); }
    else { this.go(step + 1); }
  }
  back() { const st = this.state || {}; const step = st.step || 'acct'; if (step === 'verify') { this.go('acct'); } else if (typeof step === 'number' && step > 1) { this.go(step - 1); } }
  reset() {
    const st = this.state || {}; const step = st.step; const f = Object.assign({}, st.f || {});
    const keys = step === 1 ? ['en', 'ba', 'bt', 'ind', 'dist', 'secp', 'ntn', 'srb', 'gps'] : (step === 3 ? ['pn', 'pd', 'pm', 'pe', 'ph', 'wk', 'st'] : []);
    keys.forEach((k) => { delete f[k]; });
    this.setState({ f: f, docs: step === 2 ? {} : (st.docs || {}), chk: step === 1 ? {} : (st.chk || {}), err: '' });
  }
  renderVals() {
    const st = this.state || {}; const step = st.step || 'acct'; const f = st.f || {}; const docs = st.docs || {}; const chk = st.chk || {}; const chkOk = st.chkOk || {};
    const out: Any = { s_acct: step === 'acct', s_verify: step === 'verify', s_1: step === 1, s_2: step === 2, s_3: step === 3, s_4: step === 4, s_done: step === 'done', showSteps: typeof step === 'number', showNeed: step === 'acct' || step === 'verify', err: st.err || '', hasErr: !!st.err,
      next: () => this.next(), back: () => this.back(), reset: () => this.reset(), resend: () => this.setState({ resendMsg: 'New codes sent (demo).' }), resendMsg: st.resendMsg || '',
      viewMap: () => this.setF('gps', '24.8441° N, 67.2038° E (demo location)'), newApp: () => this.setState({ step: 'acct', f: {}, docs: {}, chk: {}, err: '' }),
      sampleDocs: () => { const d: Any = {}; DOCS.forEach((x) => { if (x[2]) { d[x[0]] = 'sample_' + x[0] + '.pdf'; } }); this.setState({ docs: Object.assign({}, st.docs || {}, d), err: '' }); },
      appNo: st.appNo || 'REG-2026-00000', directorate: directorateForDistrict(f.dist) ? directorateForDistrict(f.dist)!.name + ' (code ' + directorateForDistrict(f.dist)!.code + ')' : (f.dist ? 'Directorate assigned by district' : 'Select a district first'),
      industries: industryOptions(), einHint: EIN_FORMAT_HINT };
    FIELDS.forEach((k) => { out['v_' + k] = f[k] || ''; out['h_' + k] = (e: Any) => this.setF(k, e.target.value); });
    BOOLS.forEach((k) => { out['v_' + k] = !!f[k]; out['h_' + k] = (e: Any) => this.setF(k, e.target.checked); });
    ['ntn', 'secp', 'srb'].forEach((k) => { out['c_' + k] = chk[k] || ''; out['cc_' + k] = chkOk[k] ? '#067a35' : '#b00020'; out['chk_' + k] = () => this.check(k); });
    const cur = typeof step === 'number' ? step : (step === 'done' ? 5 : 0);
    out.stepItems = STEPS.map((s, i) => { const n = i + 1; const done = n < cur; const now = n === cur; return { title: s[0], sub: s[1], mark: done ? '✓' : String(n), bd: (done || now) ? '#067a35' : '#9bb8a5', bg: done ? '#067a35' : '#ffffff', fg: done ? '#ffffff' : (now ? '#067a35' : '#6b8576'), tc: (done || now) ? '#0b4d24' : '#4d6654' }; });
    out.docTiles = DOCS.map((d) => { const has = !!docs[d[0]]; return { label: d[1] + (d[2] ? ' *' : ''), sub: has ? '✓ ' + docs[d[0]] : d[3], sc: has ? '#067a35' : '#4d6654', bc: has ? '#067a35' : '#b9d6c4', bg: has ? '#e8f6ec' : '#f7faf8', ic: has ? '#067a35' : '#3d5a45',
      pick: (e: Any) => { const file = e.target.files && e.target.files[0]; if (!file) { return; } if (file.size > 5 * 1024 * 1024) { this.setState({ err: file.name + ' is larger than 5 MB.' }); return; } this.setState({ docs: Object.assign({}, (this.state || {}).docs || {}, { [d[0]]: file.name }), err: '' }); } }; });
    const rows = [['Applicant', f.an], ['CNIC', f.ac], ['Mobile (verified)', f.am], ['Email (verified)', f.ae], ['Employer name', f.en], ['Business type', f.bt], ['Industry classification', findIndustry(f.ind) ? findIndustry(f.ind)!.name + ' (code ' + f.ind + ')' : ''], ['Business address', f.ba], ['District / Province', (f.dist || '') + ', Sindh'], ['Directorate', directorateForDistrict(f.dist) ? directorateForDistrict(f.dist)!.name + ' (code ' + directorateForDistrict(f.dist)!.code + ')' : ''], ['SECP certificate no.', f.secp], ['NTN', f.ntn], ['SRB registration no.', f.srb], ['GPS location', f.gps], ['Documents uploaded', Object.keys(docs).length + ' file(s)'], ['Contact person', (f.pn || '') + ', ' + (f.pd || '')], ['Contact mobile / email', (f.pm || '') + ' / ' + (f.pe || '')], ['Expected workers', f.wk], ['Operations started', f.st]];
    out.summary = rows.map((r, i) => ({ l: r[0], v: r[1] || '-', bg: i % 2 ? '#f7faf8' : '#ffffff' }));
    out.timeline = [{ title: 'Application received', sub: 'Done. You can track it with your application number.', mark: '✓', bg: '#067a35', fg: '#ffffff' }, { title: 'Document verification', sub: 'An ESSI officer checks your documents (about 2 working days, sample).', mark: '2', bg: '#e4f0fb', fg: '#0b5fa8' }, { title: 'Inspection, if needed', sub: 'Your directorate may visit the establishment.', mark: '3', bg: '#eeeeee', fg: '#555555' }, { title: 'Approval', sub: 'You receive your registration number and certificate by SMS and email.', mark: '4', bg: '#eeeeee', fg: '#555555' }, { title: 'First login', sub: 'Sign in, change your password, then add your employees.', mark: '5', bg: '#eeeeee', fg: '#555555' }];
    return out;
  }
  render() {
    const env: ViewEnv = { coName: '', empNo: '', person: '', dir: '', empty: false, nav: this.props.nav };
    return (
      <div className="workspace">
        <RegistrationView v={this.renderVals()} P={env} />
      </div>
    );
  }
}
