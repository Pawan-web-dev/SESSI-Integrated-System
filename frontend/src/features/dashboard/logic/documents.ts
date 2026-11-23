/**
 * View model for the printable payment documents:
 *  - Payment receipt   (Challans & Payments > Receipt)   – opened from "Pay Now", "View Receipt", Payment History
 *  - F-4 return form   (Challans & Payments > F-4 Form)  – opened from the print icon in the F-4 list
 */
import { printDocument } from '@/utils/print';

/** Service charges added to every challan (PKR). */
export const SERVICE_CHARGES = 40;
/** Monthly contribution per worker shown on the F-4 return (6% of the PKR 37,000 minimum wage). */
export const CONTRIBUTION_RATE_TEXT = '6% of wages (minimum wage PKR 37,000)';

export interface HistoryRow {
  ch: string;
  m: string;
  amt: string;
  due: string;
  paidOn: string;
  status: string;
}
export interface F4Row {
  rc: string;
  m: string;
  emp: string;
  amt: string;
}
export interface ContributionRow {
  n: string;
  name: string;
  cnic: string;
  mob: string;
  type: string;
  wage: string;
  days: string;
  amt: string;
}

export interface ReceiptView {
  found: boolean;
  isPaid: boolean;
  receiptNo: string;
  challanNo: string;
  month: string;
  workers: string;
  contribution: string;
  serviceCharges: string;
  total: string;
  totalWords: string;
  paidOn: string;
  dueDate: string;
  billNo: string;
  transactionId: string;
}

export interface F4FormView {
  found: boolean;
  receiptNo: string;
  month: string;
  workers: string;
  contribution: string;
  serviceCharges: string;
  total: string;
  totalWords: string;
  rows: ContributionRow[];
  /** workers not listed in the sample schedule */
  moreWorkers: number;
}

interface BuildInput {
  st: { rcptCh?: string; f4Id?: string };
  sel: string;
  paid: boolean;
  hist: HistoryRow[];
  f4Rows: F4Row[];
  ccRows: ContributionRow[];
  f4Map: Record<string, [string, number]>;
  words: (n: number) => string;
  fmt: (n: number) => string;
  coName: string;
  empNo: string;
  dir: string;
  co: Record<string, string>;
  openReceipt: (challanNo: string) => void;
  payNow: () => void;
  goHist: () => void;
  goF4: () => void;
}

const toNumber = (s: string) => Number(String(s).replace(/[^0-9.]/g, '')) || 0;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** "18-Nov-2026" -> "20261118" */
const toYmd = (d: string) => {
  const [day, mon, year] = d.split('-');
  const m = MONTHS.indexOf(mon) + 1;
  return m > 0 ? year + String(m).padStart(2, '0') + day.padStart(2, '0') : d.replace(/\D/g, '');
};

export function buildDocuments(x: BuildInput) {
  /* ---------- receipt ---------- */
  const latest = x.hist[0];
  const row = x.hist.find((h) => h.ch === x.st.rcptCh) || latest;
  let receipt: ReceiptView = {
    found: false, isPaid: false, receiptNo: '', challanNo: '', month: '', workers: '', contribution: '', serviceCharges: '', total: '', totalWords: '', paidOn: '', dueDate: '', billNo: '', transactionId: '',
  };
  if (row) {
    const total = toNumber(row.amt);
    const [receiptNo, workers] = x.f4Map[row.m] || ['RCP-' + row.ch.slice(3), 0];
    const paidDigits = toYmd(row.paidOn);
    receipt = {
      found: true,
      isPaid: row.status === 'Paid',
      receiptNo,
      challanNo: row.ch,
      month: row.m,
      workers: String(workers || '-'),
      contribution: x.fmt(total - SERVICE_CHARGES),
      serviceCharges: x.fmt(SERVICE_CHARGES),
      total: x.fmt(total),
      totalWords: x.words(total),
      paidOn: row.paidOn,
      dueDate: row.due,
      billNo: '1009801' + row.ch.replace(/\D/g, '').slice(-8),
      transactionId: '1L-' + paidDigits + '-' + row.ch.replace(/\D/g, '').slice(-6) + ' (sample)',
    };
  }

  /* ---------- F-4 return ---------- */
  const f4 = x.f4Rows.find((r) => r.rc === x.st.f4Id) || x.f4Rows[0];
  let f4Form: F4FormView = { found: false, receiptNo: '', month: '', workers: '', contribution: '', serviceCharges: '', total: '', totalWords: '', rows: [], moreWorkers: 0 };
  if (f4) {
    const total = toNumber(f4.amt);
    const workers = toNumber(f4.emp);
    f4Form = {
      found: true,
      receiptNo: f4.rc,
      month: f4.m,
      workers: f4.emp,
      contribution: x.fmt(total - SERVICE_CHARGES),
      serviceCharges: x.fmt(SERVICE_CHARGES),
      total: x.fmt(total),
      totalWords: x.words(total),
      rows: x.ccRows,
      moreWorkers: Math.max(0, workers - x.ccRows.length),
    };
  }

  return {
    isRcpt: x.sel === 'Challans & Payments|Receipt',
    isF4Form: x.sel === 'Challans & Payments|F-4 Form',
    isF4Decl: x.sel === 'Challans & Payments|F-4 Declaration',
    isC1: x.sel === 'Challans & Payments|C-1 Schedule',
    receipt,
    f4Form,
    company: {
      name: x.coName,
      empNo: x.empNo,
      directorate: x.dir,
      address: x.co.addr || '',
      ntn: x.co.ntn || '',
      industry: x.co.industry || '',
      person: x.co.person || '',
      designation: x.co.desig || '',
    },
    goPay: x.payNow,
    goReceipt: () => (latest ? x.openReceipt(latest.ch) : undefined),
    goHist: x.goHist,
    goF4: x.goF4,
    printDoc: printDocument,
  };
}

export type DocumentsView = ReturnType<typeof buildDocuments>;
