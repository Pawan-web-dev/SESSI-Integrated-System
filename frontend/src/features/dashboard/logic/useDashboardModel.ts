/**
 * Employer dashboard: loads the employer's data from the server (RTK Query) and builds the view model `v`
 * that the section components render. Navigation inside the dashboard: `sel = "<Menu group>|<Item>"`.
 */
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { ROUTES } from '@/app/routes';
import { employerSignedOut } from '@/features/auth/authSlice';
import { errorMessage } from '@/services/api/errors';
import { openDocument } from '@/features/documents/documentViewerSlice';
import { employerDocumentUrl } from '@/services/api/files';
import { useGetIndustriesQuery } from '@/services/api/masterApi';
import type { Challan, Employee, EmployeeInput } from '@/services/api/types';
import type { Any, ViewEnv } from '@/types/view';
import { amountInWords as toWords, currentMonth, formatAmount, formatDate, formatDateTime, formatFileSize, monthLabel, parseApiDate } from '@/utils/format';
import { printDocument } from '@/utils/print';
import {
  useChangePasswordMutation, useCreateChangeRequestMutation, useCreateContributionMutation, useCreateEmployeeMutation, useDeleteEmployeeMutation,
  useGetChangeRequestsQuery, useGetContributionsQuery, useGetDocumentsQuery, useGetEmployeesQuery, useGetF4Query, useGetNotificationsQuery, useMarkAllNotificationsReadMutation, useMarkNotificationReadMutation,
  useGetProfileQuery, useGetReceiptQuery, usePayChallanMutation, usePreviewContributionQuery, useSetEmployeeStatusMutation, useUpdateEmployeeMutation,
} from '../employerApi';
import {
  busyChanged, changeRequestNoticeShown, changeRequestOpened, contributionSubmitted, employeeEditStarted, employeePanelOpened, f4Opened, f5Opened,
  groupToggled, messagesCleared, mobileMenuToggled, navigated, noticeShown, passwordChangedSet, receiptOpened, userMenuToggled, type EmployeePanel,
} from '../dashboardSlice';
import { draftsToInput, toDraft, type DependentDraft } from '@/features/dependents/dependentDraft';
import { companyView, f4View, receiptView } from './documents';
import { resizePhoto } from './photo';

/** Monthly minimum wage (PKR): contribution is charged on wages up to this amount (same as the server's CONTRIBUTION_WAGE_CEILING). */
const WAGE_CEILING = 37000;

/* ---------------------------------------------------------------- menu */
const MENU: [string, string[], string][] = [
  ['Dashboard', ['Overview', 'Contribution Summary'], 'MAIN MENU'],
  ['Company Profile', ['Business Information', 'Mandatory Documents', 'Contact & Location', 'Change Requests'], ''],
  ['Employee Management', ['Register Employee', 'Profile for Contribution'], ''],
  ['Monthly Contributions', ['Monthly Contribution', 'Create Contribution'], ''],
  ['Challans & Payments', ['Generate Challan', 'Payment History', 'F-4', 'F-5', 'Return History'], ''],
  ['Reports & Statements', ['Contribution Report', 'Employee Report', 'Statement of Account'], ''],
  ['Notifications', ['Inbox', 'Alerts'], 'ACCOUNT & SUPPORT'],
  ['Help & Support', ['FAQs', 'Raise a Ticket'], ''],
  ['Settings', ['Account Settings', 'Change Password', 'Notification Settings'], ''],
];
const ICONS: Record<string, string> = {
  Dashboard: 'M3 3v18h18M7 15l4-4 3 3 5-6',
  'Company Profile': 'M3 8h18v12H3zM9 8V5h6v3M3 13h18',
  'Employee Management': 'M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3.5 2.7-5.5 6-5.5s6 2 6 5.5M16 6a3 3 0 010 5.5M17.5 14.7c2 .6 3.5 2.4 3.5 5.3',
  'Monthly Contributions': 'M4 6h16v14H4zM4 11h16M8 3v4M16 3v4',
  'Challans & Payments': 'M3 6h18v12H3zM3 10h18M7 15h3',
  'Reports & Statements': 'M5 20V10M12 20V4M19 20v-7M3 20h18',
  Notifications: 'M6 17V11a6 6 0 0112 0v6l2 2H4zM10 21h4',
  'Help & Support': 'M12 21a9 9 0 100-18 9 9 0 000 18zM9.5 9.5a2.5 2.5 0 115 0c0 1.5-2.5 2-2.5 3.5M12 17h.01',
  Settings: 'M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6',
};
/** Screens that exist; any other menu item shows "coming soon". */
const BUILT = new Set([
  'Dashboard|Overview', 'Dashboard|Contribution Summary', 'Company Profile|Business Information', 'Company Profile|Mandatory Documents',
  'Company Profile|Contact & Location', 'Company Profile|Change Requests', 'Company Profile|New Change Request', 'Company Profile|Request Details',
  'Employee Management|Register Employee', 'Employee Management|Profile for Contribution', 'Monthly Contributions|Monthly Contribution',
  'Monthly Contributions|Create Contribution', 'Monthly Contributions|Submitted', 'Challans & Payments|Generate Challan', 'Challans & Payments|Payment History',
  'Challans & Payments|Receipt', 'Challans & Payments|F-4', 'Challans & Payments|F-5', 'Challans & Payments|F-5 Voucher', 'Challans & Payments|F-4 Form',
  'Challans & Payments|F-4 Declaration', 'Challans & Payments|C-1 Schedule', 'Notifications|Inbox', 'Settings|Change Password',
]);

/* ---------------------------------------------------------------- overview cards */
const CARD_STYLE: [string, string, string, string][] = [
  ['Active Employees', 'M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3.5 2.7-5.5 6-5.5s6 2 6 5.5M16 6a3 3 0 010 5.5M17.5 14.7c2 .6 3.5 2.4 3.5 5.3', '#067a35', '#e3f2e8'],
  ['Contractual', 'M7 3h8l4 4v14H7zM15 3v4h4M10 13h6M10 17h4', '#0b5fa8', '#e4f0fb'],
  ['Daily Wages', 'M3 7h18v10H3zM12 14a2 2 0 100-4 2 2 0 000 4zM6 10v.01M18 14v.01', '#b45309', '#fdf0dc'],
  ['Piece Rated', 'M12 3l8 4v10l-8 4-8-4V7zM4 7l8 4 8-4M12 11v10', '#6b3fa0', '#f0e9f9'],
  ['Permanent', 'M4 5h16v14H4zM9 11a2 2 0 100-4 2 2 0 000 4zM6 16c0-1.7 1.3-3 3-3s3 1.3 3 3M14 9h4M14 13h4', '#067a35', '#e3f2e8'],
  ['Others', 'M5 5h4v4H5zM15 5h4v4h-4zM5 15h4v4H5zM15 15h4v4h-4z', '#555555', '#eeeeee'],
  ['New Joined', 'M10 12a4 4 0 100-8 4 4 0 000 8zM3 21c0-4 3-6 7-6s7 2 7 6M19 8v6M16 11h6', '#0a7f86', '#dff3f4'],
  ['Inactive', 'M10 12a4 4 0 100-8 4 4 0 000 8zM3 21c0-4 3-6 7-6M16 15v6M20 15v6', '#c2570c', '#fde8d8'],
  ['Separated', 'M10 12a4 4 0 100-8 4 4 0 000 8zM3 21c0-4 3-6 7-6M16 14l6 6M22 14l-6 6', '#b00020', '#fdecea'],
];
const TYPE_COLORS: Record<string, string> = { Permanent: '#067a35', Contractual: '#0b5fa8', 'Daily Wages': '#b45309', 'Piece Rated': '#6b3fa0', Others: '#666666' };
const STATUS_COLOR: Record<string, string> = { Active: '#067a35', Inactive: '#c2570c', Separated: '#b00020' };
const CR_COLOR: Record<string, string> = { 'Pending Review': '#b45309', 'Under Review': '#0b5fa8', Approved: '#067a35', Rejected: '#b00020' };

/* ---------------------------------------------------------------- change requests: form label -> server field */
const CR_FIELDS: { label: string; field: string; doc: string; need: boolean; current: (p: Any) => string }[] = [
  { label: 'Employer Name', field: 'name', doc: 'Amended SECP certificate or registration letter', need: true, current: (p) => p.name },
  { label: 'Business Type', field: 'business_type', doc: 'SECP certificate showing the new business type', need: true, current: (p) => p.business_type },
  { label: 'Industry Classification', field: 'industry_code', doc: 'Proof of the change in principal business activity (amended SECP / NTN record). Needs approval by the Competent Authority; the Employer No. does not change', need: true, current: (p) => p.industry },
  { label: 'SECP Certificate No.', field: 'secp_no', doc: 'New SECP certificate', need: true, current: (p) => p.secp_no },
  { label: 'NTN', field: 'ntn', doc: 'NTN certificate', need: true, current: (p) => p.ntn },
  { label: 'SRB Registration No.', field: 'srb_no', doc: 'SRB registration certificate', need: true, current: (p) => p.srb_no },
  { label: 'Business Address', field: 'address', doc: 'Recent utility bill showing the new address', need: true, current: (p) => p.address },
  { label: 'District', field: 'district', doc: 'Recent utility bill showing the new address', need: true, current: (p) => p.district },
  { label: 'GPS Location', field: 'gps', doc: 'Optional: photo of the premises', need: false, current: (p) => p.gps },
  { label: 'Contact Person', field: 'contact_person', doc: 'Optional: authority letter', need: false, current: (p) => p.contact_person },
  { label: 'Designation', field: 'designation', doc: 'Optional', need: false, current: (p) => p.designation },
  { label: 'Mobile No.', field: 'contact_mobile', doc: 'Optional', need: false, current: (p) => p.contact_mobile },
  { label: 'Email Address', field: 'contact_email', doc: 'Optional', need: false, current: (p) => p.contact_email },
  { label: 'Office Phone', field: 'office_phone', doc: 'Optional', need: false, current: (p) => p.office_phone },
];

/* ---------------------------------------------------------------- helpers */
const PS = '--- Please Select ---';
const pick = (v: string | undefined) => (v && !v.startsWith('---') ? v : null);
/** "DD/MM/YYYY" -> "YYYY-MM-DD" (null if empty / invalid) */
function toIsoDate(value: string | undefined): string | null | 'invalid' {
  const v = (value || '').trim();
  if (!v) return null;
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(v);
  if (!m) return 'invalid';
  const d = new Date(+m[3], +m[2] - 1, +m[1]);
  return d.getMonth() === +m[2] - 1 ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : 'invalid';
}
/** "YYYY-MM-DD" -> "DD/MM/YYYY" */
const fromIsoDate = (v: string | null) => (v ? v.split('-').reverse().join('/') : '');
const slashDate = (v: string | null | undefined) => {
  const d = parseApiDate(v);
  return d ? `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}` : '-';
};
const amountInWords = (r: { total_in_words?: string }) => r.total_in_words || '';

/** Everything the dashboard sections need, plus loading / error state. */
export function useDashboardModel() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  /* ---------- server data ---------- */
  const profileQ = useGetProfileQuery();
  const employeesQ = useGetEmployeesQuery();
  const contributionsQ = useGetContributionsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();
  const notificationsQ = useGetNotificationsQuery(undefined, { pollingInterval: 60000, refetchOnFocus: true });
  const documentsQ = useGetDocumentsQuery();
  const changesQ = useGetChangeRequestsQuery();
  const industriesQ = useGetIndustriesQuery();
  const month = currentMonth();
  const contributions = useMemo(() => contributionsQ.data ?? [], [contributionsQ.data]);
  const thisMonthDone = contributions.some((c) => c.month === monthLabel(month));
  const hasActive = (employeesQ.data ?? []).some((e) => e.status === 'Active');
  // nothing to preview without active employees (the server answers 400), so do not ask
  const previewQ = usePreviewContributionQuery(month, { skip: thisMonthDone || !hasActive });

  /* ---------- screen state ---------- */
  // navigation, selected records and messages are in Redux (../dashboardSlice.ts); form drafts stay local
  const ui = useAppSelector((st) => st.dashboard);
  const { section: sel, openGroups: open, mobileMenuOpen: menuOpen, userMenuOpen: userMenu, notice: savedMsg, changeRequestNotice: crMsg } = ui;
  const { employeePanel: panel, editEmployeeId: editId, passwordChanged: pwDone, receiptChallan: rcptCh, f4ContributionId: f4Id } = ui;
  const { f5Challan: f5Ch, changeRequestId: viewCrId, submittedContribution: doneInfo, busy } = ui;
  const setSavedMsg = (msg: string) => dispatch(noticeShown(msg));
  const setCrMsg = (msg: string) => dispatch(changeRequestNoticeShown(msg));
  const setPanel = (value: EmployeePanel) => dispatch(employeePanelOpened(value));
  const setEditId = (id: number | null) => dispatch(employeeEditStarted(id));
  const setPwDone = (done: boolean) => dispatch(passwordChangedSet(done));
  const [form, setForm] = useState<Record<string, string>>({});
  const [deps, setDeps] = useState<DependentDraft[]>([]);
  const [formErr, setFormErr] = useState('');
  const [pw, setPw] = useState<Record<string, string>>({});
  const [pwErr, setPwErr] = useState('');
  const [crForm, setCrForm] = useState<{ label?: string; n?: string; r?: string; d?: string }>({});
  const [crErr, setCrErr] = useState('');

  const receiptQ = useGetReceiptQuery(rcptCh ?? '', { skip: !rcptCh });
  const f5ReceiptQ = useGetReceiptQuery(f5Ch ?? '', { skip: !f5Ch });
  const f4Q = useGetF4Query(f4Id ?? 0, { skip: f4Id === null });

  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const [setEmployeeStatus] = useSetEmployeeStatusMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [createContribution] = useCreateContributionMutation();
  const [payChallan] = usePayChallanMutation();
  const [createChangeRequest] = useCreateChangeRequestMutation();
  const [changePassword] = useChangePasswordMutation();

  const profile = profileQ.data;
  const employees = employeesQ.data ?? [];
  const changes = changesQ.data ?? [];
  const notifications = notificationsQ.data ?? [];
  const challans: Challan[] = contributions.map((c) => c.challan).filter((c): c is Challan => !!c);
  const unpaid = challans.filter((c) => c.status === 'unpaid');
  const latest = contributions[0];
  const focusChallan = unpaid[0] ?? challans[0];

  /* ---------- navigation ---------- */
  const go = (target: string) => {
    dispatch(navigated(target));
    window.scrollTo(0, 0);
  };
  const resetForms = () => {
    setForm({});
    setFormErr('');
    setPwErr('');
    setPw({});
    setCrForm({});
    setCrErr('');
    dispatch(messagesCleared());
  };
  const openReceipt = (challanNo: string) => {
    dispatch(receiptOpened(challanNo));
    go('Challans & Payments|Receipt');
  };
  const openF4 = (contributionId: number, page: string, print = false) => {
    dispatch(f4Opened(contributionId));
    go(page);
    if (print) setTimeout(() => printDocument(), 900);
  };
  const run = async (work: () => Promise<void>, onError: (msg: string) => void) => {
    if (busy) return;
    dispatch(busyChanged(true));
    try {
      await work();
    } catch (err) {
      onError(errorMessage(err));
    } finally {
      dispatch(busyChanged(false));
    }
  };

  /* ---------- employees ---------- */
  const editEmp = (e: Employee) => {
    setEditId(e.id);
    setFormErr('');
    setForm({
      ph: e.photo || '', fn: e.full_name, fa: e.father_name, gender: e.gender, cn: e.cnic, dob: fromIsoDate(e.date_of_birth), mb: e.mobile, ds: e.designation,
      sk: e.skill_level || '', et: e.employment_type, wt: e.wage_type || '', pf: e.payment_frequency || '', dj: fromIsoDate(e.date_joined),
      mw: e.monthly_wage != null ? String(e.monthly_wage) : '', ba: e.bank_account || '',
    });
    setDeps((e.dependents ?? []).map(toDraft));
    go('Employee Management|Register Employee');
  };
  const saveEmp = () => {
    const f = form;
    const bad = (v: string | undefined) => !v || !v.trim() || v.startsWith('---');
    const miss: string[] = [];
    if (bad(f.fn)) miss.push('Full Name');
    if (bad(f.fa)) miss.push('Father’s Name');
    if (bad(f.gender)) miss.push('Gender');
    if (bad(f.cn)) miss.push('CNIC No.');
    if (bad(f.mb)) miss.push('Mobile No.');
    if (bad(f.ds)) miss.push('Designation');
    if (bad(f.et)) miss.push('Employment Type');
    if (miss.length) return setFormErr('Please fill in: ' + miss.join(', ') + '.');
    const cnicDigits = f.cn.replace(/\D/g, '');
    if (employees.some((e) => e.cnic.replace(/\D/g, '') === cnicDigits && e.id !== editId)) return setFormErr('An employee with this CNIC is already registered.');
    const dob = toIsoDate(f.dob);
    const joined = toIsoDate(f.dj);
    if (dob === 'invalid' || joined === 'invalid') return setFormErr('Enter dates as DD/MM/YYYY, for example 12/03/1988.');
    const wage = (f.mw || '').replace(/[,\s]/g, '');
    if (wage && !/^\d+$/.test(wage)) return setFormErr('Monthly wages must be a whole number of rupees.');
    const dependents = draftsToInput(deps);
    if (typeof dependents === 'string') return setFormErr(dependents);
    const body: EmployeeInput = {
      full_name: f.fn.trim(), father_name: f.fa.trim(), gender: f.gender, cnic: f.cn.trim(), date_of_birth: dob, mobile: f.mb.trim(), designation: f.ds.trim(),
      skill_level: pick(f.sk), employment_type: f.et, wage_type: pick(f.wt), payment_frequency: pick(f.pf), date_joined: joined,
      monthly_wage: wage ? Number(wage) : null, bank_account: (f.ba || '').trim() || null, photo: f.ph || null, dependents,
    };
    void run(async () => {
      const saved = editId ? await updateEmployee({ id: editId, body }).unwrap() : await createEmployee(body).unwrap();
      setForm({});
      setDeps([]);
      setFormErr('');
      setEditId(null);
      const n = saved.dependents?.length ?? 0;
      const verb = n ? ' were' : ' was';
      setSavedMsg('Employee ' + saved.full_name + (n ? ' and ' + n + ' dependent(s)' : '') + verb + (editId ? ' updated.' : ' saved and added to the list below.'));
      go('Employee Management|Profile for Contribution');
    }, setFormErr);
  };
  const setStatus = (e: Employee, status: Employee['status']) =>
    run(async () => {
      await setEmployeeStatus({ id: e.id, status }).unwrap();
      setPanel(null);
      setSavedMsg('Status of ' + e.full_name + ' changed to ' + status + '.');
    }, setSavedMsg);
  const delEmp = (e: Employee) =>
    run(async () => {
      await deleteEmployee(e.id).unwrap();
      setPanel(null);
      setSavedMsg('Employee ' + e.full_name + ' was deleted.');
    }, (msg) => {
      setPanel(null);
      setSavedMsg(msg);
    });

  /* ---------- contributions and payments ---------- */
  const submitContribution = () =>
    run(async () => {
      const c = await createContribution({ month }).unwrap();
      dispatch(contributionSubmitted(c));
      go('Monthly Contributions|Submitted');
    }, (msg) => window.alert(msg));
  const pay = (challanNo: string) =>
    run(async () => {
      await payChallan(challanNo).unwrap();
      openReceipt(challanNo);
    }, (msg) => window.alert(msg));

  /* ---------- change requests ---------- */
  const crDef = CR_FIELDS.find((x) => x.label === crForm.label);
  const submitCr = () => {
    const p = profile;
    if (!p) return;
    if (!crDef) return setCrErr('Choose what you want to change.');
    let value = (crForm.n || '').trim();
    if (!value) return setCrErr('Enter the new value.');
    if (crDef.field === 'industry_code') {
      const ind = industriesQ.data?.find((i) => i.name === value);
      if (!ind) return setCrErr('Choose the new Industry Classification.');
      value = ind.code;
    }
    if (!crForm.r || crForm.r.trim().length < 10) return setCrErr('Give a reason (at least 10 characters).');
    if (crDef.need && !crForm.d) return setCrErr('Attach the supporting document: ' + crDef.doc + '.');
    void run(async () => {
      const r = await createChangeRequest({ field: crDef.field, new_value: value, reason: crForm.r!.trim(), document: crForm.d || null }).unwrap();
      setCrForm({});
      setCrErr('');
      setCrMsg('Change request ' + r.ref + ' was submitted. ESSI will review it and you will be notified.');
      go('Company Profile|Change Requests');
    }, setCrErr);
  };

  /* ---------- documents ---------- */
  const viewDocument = (documentId: number, name: string) => void dispatch(openDocument({ path: employerDocumentUrl(documentId), name }));

  /* ---------- password ---------- */
  const updatePw = () => {
    let err = '';
    if (!pw.cur) err = 'Enter your current password.';
    else if (!pw.nw || pw.nw.length < 8) err = 'New password must be at least 8 characters.';
    else if (!/[A-Z]/.test(pw.nw) || !/[0-9]/.test(pw.nw)) err = 'Use at least one capital letter and one number.';
    else if (pw.nw !== pw.cf) err = 'New password and confirmation do not match.';
    else if (pw.nw === pw.cur) err = 'New password must be different from the current password.';
    if (err) return setPwErr(err);
    void run(async () => {
      await changePassword({ current_password: pw.cur, new_password: pw.nw }).unwrap();
      setPwErr('');
      setPwDone(true);
      setPw({});
    }, setPwErr);
  };

  const logout = () => {
    dispatch(employerSignedOut('You have been logged out successfully.'));
    navigate(ROUTES.login);
  };

  /* ================================================================ view model */
  const v = useMemo(() => {
    const p = profile;
    const parts = sel.split('|');
    const groups = MENU.map(([name, subs, head]) => {
      const isOpen = !!open[name];
      return {
        ic: ICONS[name], icc: isOpen ? '#7be3a3' : '#067a35', name, head, hasHead: head !== '', isOpen, sign: isOpen ? '−' : '+',
        bg: isOpen ? '#0b4d24' : '#ffffff', fg: isOpen ? '#ffffff' : '#17321f',
        toggle: () => dispatch(groupToggled(name)),
        subs: subs.map((n) => {
          const on = sel === name + '|' + n;
          return { name: n, bg: on ? '#dff3e5' : 'transparent', fg: on ? '#067a35' : '#2d4a35', fw: on ? '700' : '400', pick: () => {
            resetForms();
            go(name + '|' + n);
          } };
        }),
      };
    });

    /* employees */
    const active = employees.filter((e) => e.status === 'Active');
    const countType = (t: string) => active.filter((e) => e.employment_type === t).length;
    const monthAgo = Date.now() - 30 * 86400000;
    const newJoined = employees.filter((e) => e.date_joined && new Date(e.date_joined).getTime() >= monthAgo).length;
    const cardValues: Record<string, number> = {
      'Active Employees': active.length, Contractual: countType('Contractual'), 'Daily Wages': countType('Daily Wages'), 'Piece Rated': countType('Piece Rated'),
      Permanent: countType('Permanent'), Others: countType('Others'), 'New Joined': newJoined,
      Inactive: employees.filter((e) => e.status === 'Inactive').length, Separated: employees.filter((e) => e.status === 'Separated').length,
    };
    const cards = CARD_STYLE.map(([name, ic, fg, bg]) => ({ name, val: cardValues[name], ic, fg, bg }));
    const empRows = employees.map((e, i) => ({
      n: String(i + 1), name: e.full_name, cnic: e.cnic, des: e.designation, type: e.employment_type, status: e.status, photo: e.photo || '',
      hasPh: !!e.photo, noPh: !e.photo, scol: STATUS_COLOR[e.status] || '#444444', col: STATUS_COLOR[e.status] || '#444444',
      mark: e.status === 'Active' ? '✓' : e.status === 'Inactive' ? '✗' : '-', canTg: e.status !== 'Separated', noTg: e.status === 'Separated',
      vw: () => setPanel({ mode: 'view', id: e.id }),
      ed: () => editEmp(e),
      dl: () => setPanel({ mode: 'del', id: e.id }),
      sp: () => setPanel({ mode: 'sep', id: e.id }),
      tg: () => void setStatus(e, e.status === 'Active' ? 'Inactive' : 'Active'),
    }));
    const pr = panel ? employees.find((x) => x.id === panel.id) : undefined;
    const pFields = pr
      ? ([['Father’s name', pr.father_name], ['Gender', pr.gender], ['Date of birth', fromIsoDate(pr.date_of_birth)], ['Mobile', pr.mobile], ['Designation', pr.designation],
          ['Skill level', pr.skill_level], ['Employment type', pr.employment_type], ['Wage type', pr.wage_type], ['Payment frequency', pr.payment_frequency],
          ['Date of joining', fromIsoDate(pr.date_joined)], ['Monthly wages', pr.monthly_wage != null ? formatAmount(pr.monthly_wage) : ''], ['Bank account', pr.bank_account], ['Status', pr.status]] as [string, string | null][])
          .map(([l, val]) => ({ l, v: val || '-' }))
      : [];
    const hf = (k: string) => (e: Any) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [k]: value }));
    };
    const hg = (g: string) => () => setForm((f) => ({ ...f, gender: g }));

    /* contributions & challans */
    const paidChallans = challans.filter((c) => c.status === 'paid');
    const chronological = contributions.slice(0, 6).reverse();
    const maxAmount = Math.max(1, ...chronological.map((c) => c.amount));
    const bars = chronological.map((c) => ({
      label: c.month.split(',')[0].slice(0, 3), val: formatAmount(c.amount), h: Math.round((c.amount / maxAmount) * 150), fill: c.challan?.status === 'paid' ? '#067a35' : '#f0b44c',
    }));
    const typeTotal = active.length;
    const typeBars = Object.keys(TYPE_COLORS)
      .map((t) => ({ name: t, val: countType(t), pct: typeTotal ? Math.round((countType(t) / typeTotal) * 100) : 0, color: TYPE_COLORS[t] }))
      .filter((t) => t.val > 0);
    const paidTotal = chronological.reduce((sum, c) => sum + (c.challan?.status === 'paid' ? c.challan.total_paid || 0 : 0), 0);
    const outstanding = unpaid.reduce((sum, c) => sum + c.payable_now, 0);
    const lastPaid = paidChallans.slice().sort((a, b) => (parseApiDate(b.paid_at)?.getTime() || 0) - (parseApiDate(a.paid_at)?.getTime() || 0))[0];
    const nextDue = unpaid.slice().sort((a, b) => a.due_date.localeCompare(b.due_date))[0];
    const csKpis = [
      { label: 'Contribution paid (last 6 months)', value: 'PKR ' + formatAmount(paidTotal), sub: paidChallans.length ? `${paidChallans.length} challan(s) paid` : 'No payments yet', fg: '#067a35' },
      { label: 'Outstanding', value: 'PKR ' + formatAmount(outstanding), sub: unpaid.length ? `${unpaid.length} unpaid challan(s), incl. service charges` : 'Nothing due', fg: unpaid.length ? '#b45309' : '#067a35' },
      { label: 'Last payment', value: lastPaid ? formatDate(lastPaid.paid_at) : '-', sub: lastPaid ? lastPaid.month : 'No payments yet', fg: '#0b5fa8' },
      { label: 'Next due date', value: nextDue ? formatDate(nextDue.due_date) : '-', sub: nextDue ? nextDue.month : thisMonthDone ? 'All submitted months are paid' : 'Create this month’s contribution', fg: '#6b3fa0' },
    ];
    const histRows = challans.map((c) => {
      const isPaid = c.status === 'paid';
      return {
        ch: c.challan_no, m: c.month, amt: formatAmount(isPaid ? c.total_paid : c.payable_now), due: formatDate(c.due_date), paidOn: isPaid ? formatDate(c.paid_at) : '—',
        status: isPaid ? 'Paid' : 'Unpaid', col: isPaid ? '#067a35' : '#b45309', hasBtn: true, act: isPaid ? 'View Receipt' : 'Pay Now',
        go: isPaid ? () => openReceipt(c.challan_no) : () => go('Challans & Payments|Generate Challan'),
      };
    });
    const mcRows = contributions.map((c) => ({
      a: c.month, b: String(c.workers), c: 'PKR ' + formatAmount(c.amount), d: c.status === 'approved' ? 'Approved' : c.status, e: c.challan?.status === 'paid' ? 'Paid' : 'Unpaid', f: c.challan?.challan_no || '-',
    }));
    const rows = latest ? [{ a: latest.month, b: String(latest.workers), c: 'PKR ' + formatAmount(latest.amount), d: 'Approved', e: latest.challan?.status === 'paid' ? 'Paid' : 'Unpaid' }] : [];
    const ccRows = (previewQ.data?.lines ?? []).map((l, i) => ({
      n: String(i + 1), name: l.worker_name, cnic: l.cnic, mob: l.mobile || '-', type: l.employment_type.toUpperCase(), wage: formatAmount(l.wage), days: String(l.days), amt: formatAmount(l.amount),
      // wage for the days worked, and the part of it on which contribution is charged (capped at the minimum wage)
      paid: formatAmount(Math.round((l.wage * l.days) / 30)),
      cwage: formatAmount(Math.round((Math.min(l.wage, WAGE_CEILING) * l.days) / 30)),
    }));
    const f4Contributions = contributions.filter((c) => c.challan?.status === 'paid');
    const f4Rows = f4Contributions.map((c, i) => ({
      n: String(i + 1), rc: c.challan!.receipt_no, m: c.month.toUpperCase(), emp: String(c.workers), amt: formatAmount(c.challan!.total_paid), mode: c.challan!.payment_channel || '-',
      pr: () => openF4(c.id, 'Challans & Payments|F-4 Form', true),
      decl: () => openF4(c.id, 'Challans & Payments|F-4 Declaration'),
      c1: () => openF4(c.id, 'Challans & Payments|C-1 Schedule'),
    }));
    const latePaid = paidChallans.filter((c) => (c.days_late || 0) > 0);
    const f5Rows = latePaid.map((c, i) => ({
      n: String(i + 1), rc: c.receipt_no, m: c.month.toUpperCase(), emp: String(contributions.find((x) => x.challan?.challan_no === c.challan_no)?.workers ?? '-'),
      amt: formatAmount(c.total_paid), mode: c.payment_channel || '-', pr: () => { dispatch(f5Opened(c.challan_no)); go('Challans & Payments|F-5 Voucher'); },
    }));
    const f5 = f5ReceiptQ.data;
    const lv = f5
      ? {
          month: f5.month, emp: String(f5.workers), voucher: f5.challan_no.replace(/\D/g, ''), due: slashDate(f5.due_date), paidOn: slashDate(f5.paid_at),
          contrib: formatAmount(f5.contribution), svc: formatAmount(f5.service_charges), days: String(f5.days_late), pct: String(Math.min(f5.days_late * 0.5, 50)),
          inc: formatAmount(f5.late_increase), total: formatAmount(f5.total_paid), words: amountInWords(f5), channel: f5.payment_channel, txn: f5.transaction_ref,
        }
      : { month: '', emp: '', voucher: '', due: '', paidOn: '', contrib: '', svc: '', days: '', pct: '', inc: '', total: '', words: '', channel: '', txn: '' };

    /* the challan shown on "Generate Challan" (oldest unpaid, else the latest) */
    const fc = focusChallan;
    const fcContribution = fc ? contributions.find((c) => c.challan?.challan_no === fc.challan_no) : undefined;
    const ch = fc
      ? {
          challanNo: fc.challan_no, voucher: fc.challan_no.replace(/\D/g, ''), month: fc.month, approvedOn: formatDate(fcContribution?.submitted_at), date: slashDate(fcContribution?.submitted_at),
          workers: String(fcContribution?.workers ?? '-'), contribution: formatAmount(fc.amount), svc: formatAmount(fc.service_charges),
          increase: formatAmount(fc.status === 'paid' ? fc.late_increase : fc.payable_now - fc.amount - fc.service_charges),
          total: formatAmount(fc.status === 'paid' ? fc.total_paid : fc.payable_now), due: formatDate(fc.due_date),
          words: toWords((fc.status === 'paid' ? fc.total_paid : fc.payable_now) || 0),
        }
      : { challanNo: '', voucher: '', month: '', approvedOn: '', date: '', workers: '', contribution: '', svc: '', increase: '', total: '', due: '', words: '' };
    const fcPaid = fc?.status === 'paid';

    /* tip on the overview */
    let tip = 'Everything is up to date.';
    let tipBtn = 'Payment History';
    let tipTarget = 'Challans & Payments|Payment History';
    if (!employees.length) {
      tip = 'Register your employees, then create your first monthly contribution.';
      tipBtn = 'Register Employee';
      tipTarget = 'Employee Management|Register Employee';
    } else if (unpaid.length) {
      tip = `${unpaid[0].month} contribution is approved. Pay challan ${unpaid[0].challan_no} before ${formatDate(unpaid[0].due_date)}.`;
      tipBtn = 'Pay Challan';
      tipTarget = 'Challans & Payments|Generate Challan';
    } else if (!thisMonthDone) {
      tip = `Submit your contribution for ${monthLabel(month)} before the end of the month.`;
      tipBtn = 'Create Contribution';
      tipTarget = 'Monthly Contributions|Create Contribution';
    }

    /* change requests */
    const crRows = changes.map((r) => ({
      ref: r.ref, label: r.label, oldVal: r.old_value || '-', newVal: r.new_value, status: r.status, col: CR_COLOR[r.status], submitted: formatDateTime(r.created_at),
      view: () => { dispatch(changeRequestOpened(r.id)); go('Company Profile|Request Details'); },
    }));
    const dr = changes.find((r) => r.id === viewCrId) || changes[0];
    const d = dr
      ? {
          ref: dr.ref, label: dr.label, oldVal: dr.old_value || '-', newVal: dr.new_value, reason: dr.reason, doc: dr.document || '-', status: dr.status, col: CR_COLOR[dr.status],
          submitted: formatDateTime(dr.created_at), by: dr.submitted_by, remarks: dr.remarks || '', hasRemarks: !!dr.remarks,
          events: dr.events.map((e) => ({ t: formatDateTime(e.created_at), text: e.text, who: e.actor })),
        }
      : {};

    const co = p
      ? {
          employer: p.name, btype: p.business_type, secp: p.secp_no, ntn: p.ntn, srb: p.srb_no, addr: p.address, province: p.province, district: p.district, gps: p.gps || '-',
          person: p.contact_person, desig: p.designation || '-', mobile: p.contact_mobile, email: p.contact_email, phone: p.office_phone || '-', industry: `${p.industry} (${p.industry_code})`,
        }
      : {};
    const docRows = (documentsQ.data ?? []).map((x) => ({
      name: x.label, req: x.required ? 'Required' : 'If applicable',
      file: x.file_name ? x.file_name + (x.size ? ` (${formatFileSize(x.size)})` : '') : '-', status: x.status, has: !!x.file_name,
      canView: x.has_file && x.id !== null, view: () => (x.id !== null ? viewDocument(x.id, `${x.label} – ${x.file_name}`) : undefined),
      col: x.status === 'Verified' ? '#067a35' : x.file_name ? '#0b5fa8' : '#666',
    }));
    const notifRows = notifications.map((n) => ({ text: `${n.subject}: ${n.body.replace(/^ESSI Sindh:\s*/, '')}`, time: formatDateTime(n.created_at), dot: n.read_at ? '#c5d6cb' : '#067a35', unread: !n.read_at, open: () => { if (!n.read_at) markRead(n.id); }, hasAct: false }));
    const unreadCount = notifications.filter((n) => !n.read_at).length;

    const fm = form;
    const crDefNow = CR_FIELDS.find((x) => x.label === crForm.label);
    const done = doneInfo;

    return {
      /* navigation & layout */
      groups, selGroup: parts[0], selName: parts[1], sbOpen: menuOpen ? 'open' : '', bdOn: menuOpen ? 'on' : '', toggleMenu: () => dispatch(mobileMenuToggled()),
      umToggle: () => dispatch(userMenuToggled()), umOpen: userMenu, logout, notifCount: unreadCount, goNotif: () => go('Notifications|Inbox'),
      goHome: () => go('Dashboard|Overview'), goCS: () => go('Dashboard|Contribution Summary'), goReg: () => { resetForms(); go('Employee Management|Register Employee'); },
      goProf: () => go('Employee Management|Profile for Contribution'), goMC: () => go('Monthly Contributions|Monthly Contribution'),
      goCC: () => go('Monthly Contributions|Create Contribution'), goDone: () => go('Monthly Contributions|Submitted'), goChallan: () => go('Challans & Payments|Generate Challan'),
      goHist: () => go('Challans & Payments|Payment History'), goF4: () => go('Challans & Payments|F-4'), goF5: () => go('Challans & Payments|F-5'),
      goCRF: () => { setCrForm({}); setCrErr(''); go('Company Profile|New Change Request'); }, goCRL: () => { setCrErr(''); go('Company Profile|Change Requests'); },
      isDash: sel === 'Dashboard|Overview', isCS: sel === 'Dashboard|Contribution Summary', isBI: sel === 'Company Profile|Business Information',
      isMD: sel === 'Company Profile|Mandatory Documents', isCL: sel === 'Company Profile|Contact & Location', isCRL: sel === 'Company Profile|Change Requests',
      isCRF: sel === 'Company Profile|New Change Request', isCRD: sel === 'Company Profile|Request Details', isReg: sel === 'Employee Management|Register Employee',
      isProf: sel === 'Employee Management|Profile for Contribution', isMC: sel === 'Monthly Contributions|Monthly Contribution', isCC: sel === 'Monthly Contributions|Create Contribution',
      isDone: sel === 'Monthly Contributions|Submitted', isChallan: sel === 'Challans & Payments|Generate Challan', isHist: sel === 'Challans & Payments|Payment History',
      isRcpt: sel === 'Challans & Payments|Receipt', isF4: sel === 'Challans & Payments|F-4', isF5: sel === 'Challans & Payments|F-5', isF5V: sel === 'Challans & Payments|F-5 Voucher',
      isF4Form: sel === 'Challans & Payments|F-4 Form', isF4Decl: sel === 'Challans & Payments|F-4 Declaration', isC1: sel === 'Challans & Payments|C-1 Schedule',
      isNotif: sel === 'Notifications|Inbox', isPW: sel === 'Settings|Change Password', notDash: !BUILT.has(sel),

      /* overview */
      cards, rows, noRows: rows.length === 0, tip, tipBtn, tipGo: () => go(tipTarget), currentMonthLabel: monthLabel(month), registeredOn: formatDate(p?.approved_at),

      /* contribution summary */
      bars, noBars: bars.length === 0, typeBars, noType: typeBars.length === 0, csKpis, paidCount: paidChallans.length, unpaidCount: unpaid.length,
      payCol: unpaid.length ? '#b45309' : '#067a35',

      /* company */
      co, docRows, ein: p?.ein_breakdown,

      /* employees */
      empRows, noEmp: empRows.length === 0, empNote: empRows.length ? `${empRows.length} employee(s) registered` : 'No employees registered yet.',
      pView: panel?.mode === 'view' && !!pr, pDel: panel?.mode === 'del' && !!pr, pSep: panel?.mode === 'sep' && !!pr, pName: pr?.full_name || '', pCnic: pr?.cnic || '',
      pFields, pDeps: pr?.dependents ?? [], pHasPh: !!pr?.photo, pPhoto: pr?.photo || '', closeP: () => setPanel(null),
      delOk: () => { if (pr) void delEmp(pr); }, sepOk: () => { if (pr) void setStatus(pr, 'Separated'); }, editFromPanel: () => { if (pr) editEmp(pr); },
      regTitle: editId ? 'EDIT EMPLOYEE' : 'EMPLOYEE REGISTRATION', saveLabel: busy ? 'Saving…' : editId ? 'Update Employee' : 'Save Employee',
      fv_fn: fm.fn || '', fv_fa: fm.fa || '', fv_cn: fm.cn || '', fv_dob: fm.dob || '', fv_mb: fm.mb || '', fv_ds: fm.ds || '', fv_dj: fm.dj || '', fv_mw: fm.mw || '',
      fv_ba: fm.ba || '', fv_sk: fm.sk || PS, fv_et: fm.et || PS, fv_wt: fm.wt || PS, fv_pf: fm.pf || PS, gcM: fm.gender === 'MALE', gcF: fm.gender === 'FEMALE', gcT: fm.gender === 'TRANSGENDER',
      in_fn: hf('fn'), in_fa: hf('fa'), in_cn: hf('cn'), in_dob: hf('dob'), in_mb: hf('mb'), in_ds: hf('ds'), in_dj: hf('dj'), in_mw: hf('mw'), in_ba: hf('ba'),
      in_sk: hf('sk'), in_et: hf('et'), in_wt: hf('wt'), in_pf: hf('pf'), gM: hg('MALE'), gF: hg('FEMALE'), gT: hg('TRANSGENDER'),
      hasFormPhoto: !!fm.ph, noFormPhoto: !fm.ph, formPhoto: fm.ph || '',
      in_photo: (ev: Any) => {
        const file = ev.target.files && ev.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) return setFormErr('Photo is larger than 5 MB.');
        resizePhoto(file, (url) => { setForm((f) => ({ ...f, ph: url })); setFormErr(''); }, setFormErr);
      },
      rmPhoto: () => setForm((f) => ({ ...f, ph: '' })), saveEmp,
      cancelEmp: () => { setForm({}); setDeps([]); setFormErr(''); setEditId(null); go('Employee Management|Profile for Contribution'); },
      resetEmpForm: () => { setForm({}); setDeps([]); setFormErr(''); },
      deps, setDeps,
      // fill the form from a scanned FRC (only the values that were found)
      applyFrc: (found: Partial<Record<'fn' | 'fa' | 'cn' | 'dob' | 'gender' | 'ph', string>>) => {
        setForm((cur) => ({ ...cur, ...Object.fromEntries(Object.entries(found).filter(([, val]) => val)) }));
        setFormErr('');
      },
      // bulk import (Excel / CSV / API): saves one employee at a time and reports what failed
      existingCnics: employees.map((e) => e.cnic.replace(/\D/g, '')),
      importEmployees: async (rows: EmployeeInput[]) => {
        dispatch(busyChanged(true));
        const failed: { name: string; message: string }[] = [];
        let created = 0;
        for (const body of rows) {
          try {
            await createEmployee(body).unwrap();
            created++;
          } catch (err) {
            failed.push({ name: body.full_name, message: errorMessage(err) });
          }
        }
        dispatch(busyChanged(false));
        if (created) setSavedMsg(created + ' employee(s) were imported and added to the list below.');
        return { created, failed };
      },
      openEmployeeList: () => go('Employee Management|Profile for Contribution'),
      setFormError: setFormErr,
      // duplicate check against the employees already registered (another record with the same CNIC)
      cnicState: (fm.cn || '').replace(/\D/g, '').length !== 13 ? 'idle'
        : employees.some((e) => e.cnic.replace(/\D/g, '') === (fm.cn || '').replace(/\D/g, '') && e.id !== editId) ? 'dup' : 'ok',
      formErr, hasErr: !!formErr, savedMsg, hasMsg: !!savedMsg,

      /* contributions */
      mcRows, noMC: mcRows.length === 0, ccRows, noCC: ccRows.length === 0, ccMonthLabel: monthLabel(month),
      ccNote: thisMonthDone ? `The contribution for ${monthLabel(month)} has already been submitted.` : previewQ.error ? errorMessage(previewQ.error) : '',
      ccTotal: previewQ.data ? formatAmount(previewQ.data.amount) : '0', canSubmitCC: !thisMonthDone && !!previewQ.data && !busy,
      submitContribution: () => void submitContribution(),
      done: done
        ? { month: done.month, ref: done.ref, at: formatDateTime(done.submitted_at), challan: done.challan?.challan_no || '-', total: formatAmount((done.challan?.amount || 0) + (done.challan?.service_charges || 0)) }
        : { month: '', ref: '', at: '', challan: '', total: '' },

      /* challans & payments */
      histRows, noHist: histRows.length === 0, hasChallan: !!fc, noChallan: !fc, ch, payStatus: fcPaid ? 'Paid' : 'Unpaid', isPaidNow: fcPaid, notPaidNow: !!fc && !fcPaid,
      goPay: () => { if (fc) void pay(fc.challan_no); }, goReceipt: () => { if (fc) openReceipt(fc.challan_no); }, paying: busy,
      f4Rows, noF4: f4Rows.length === 0, f5Rows, noF5: f5Rows.length === 0, lv, printDoc: printDocument,
      receipt: receiptView(receiptQ.data), f4Form: f4View(f4Q.data), company: companyView(p),

      /* notifications */
      notifRows, unreadCount, markAllRead: () => { markAllRead(); },

      /* change requests */
      crRows, noCr: crRows.length === 0, hasD: !!dr, d, crMsg, hasCrMsg: !!crMsg, crErr, hasCrErr: !!crErr,
      crCurrent: crDefNow && p ? crDefNow.current(p) || '-' : '-', crHint: crDefNow ? (crDefNow.need ? 'required: ' + crDefNow.doc : crDefNow.doc) : 'choose a field first',
      crIsIndustry: crDefNow?.field === 'industry_code', industryNames: (industriesQ.data ?? []).map((i) => i.name),
      in_crf: (e: Any) => { const label = e.target.value; setCrForm((f) => ({ ...f, label, n: '' })); },
      in_crn: (e: Any) => { const n = e.target.value; setCrForm((f) => ({ ...f, n })); },
      in_crr: (e: Any) => { const r = e.target.value; setCrForm((f) => ({ ...f, r })); },
      in_crd: (e: Any) => { const file = e.target.files && e.target.files[0]; setCrForm((f) => ({ ...f, d: file ? file.name : '' })); },
      submitCr,

      /* password */
      pwDone, pwForm: !pwDone, pwErr, hasPwErr: !!pwErr,
      in_pc: (e: Any) => { const val = e.target.value; setPw((x) => ({ ...x, cur: val })); },
      in_pn: (e: Any) => { const val = e.target.value; setPw((x) => ({ ...x, nw: val })); },
      in_pf2: (e: Any) => { const val = e.target.value; setPw((x) => ({ ...x, cf: val })); },
      updatePw, pwAgain: () => { setPwDone(false); setPwErr(''); setPw({}); },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, employees, contributions, changes, notifications, documentsQ.data, industriesQ.data, previewQ.data, previewQ.error, receiptQ.data, f4Q.data, f5ReceiptQ.data,
      sel, open, menuOpen, userMenu, form, deps, editId, formErr, savedMsg, panel, pw, pwErr, pwDone, crForm, crErr, crMsg, viewCrId, doneInfo, busy, thisMonthDone, month]);

  const env: ViewEnv = {
    coName: profile?.name || '', empNo: profile?.ein || '', person: profile?.contact_person || '', dir: profile?.directorate || '',
    empty: employees.length === 0 && contributions.length === 0, nav: (to) => navigate('/' + to),
  };

  const loading = profileQ.isLoading || employeesQ.isLoading || contributionsQ.isLoading;
  const error = profileQ.error || employeesQ.error || contributionsQ.error;
  return { v, env, loading, error: error ? errorMessage(error) : '' };
}
