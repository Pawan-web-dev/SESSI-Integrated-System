/**
 * View models for the printable payment documents, built from server data:
 *  - Payment receipt        (Challans & Payments > Receipt)
 *  - F-4 return, F-4 declaration and C-1 schedule (from one F-4 record)
 */
import type { EmployerProfile, F4Return, Receipt } from '@/services/api/types';
import { formatAmount, formatDate } from '@/utils/format';

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
  channel: string;
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
  /** workers not listed (always 0 now: the server returns every line) */
  moreWorkers: number;
}

export interface CompanyView {
  name: string;
  empNo: string;
  directorate: string;
  address: string;
  ntn: string;
  industry: string;
  person: string;
  designation: string;
}

const EMPTY_RECEIPT: ReceiptView = {
  found: false, isPaid: false, receiptNo: '', challanNo: '', month: '', workers: '', contribution: '', serviceCharges: '', total: '', totalWords: '', paidOn: '', dueDate: '', billNo: '', transactionId: '', channel: '',
};
const EMPTY_F4: F4FormView = { found: false, receiptNo: '', month: '', workers: '', contribution: '', serviceCharges: '', total: '', totalWords: '', rows: [], moreWorkers: 0 };

export function receiptView(r: Receipt | undefined): ReceiptView {
  if (!r) return EMPTY_RECEIPT;
  return {
    found: true,
    isPaid: true,
    receiptNo: r.receipt_no,
    challanNo: r.challan_no,
    month: r.month,
    workers: String(r.workers),
    contribution: formatAmount(r.contribution),
    serviceCharges: formatAmount(r.service_charges),
    total: formatAmount(r.total_paid),
    totalWords: r.total_in_words,
    paidOn: formatDate(r.paid_at),
    dueDate: formatDate(r.due_date),
    billNo: '1009801' + r.challan_no.replace(/\D/g, ''),
    transactionId: r.transaction_ref,
    channel: r.payment_channel,
  };
}

export function f4View(f: F4Return | undefined): F4FormView {
  if (!f) return EMPTY_F4;
  return {
    found: true,
    receiptNo: f.receipt_no || '-',
    month: f.month.toUpperCase(),
    workers: String(f.workers),
    contribution: formatAmount(f.contribution),
    serviceCharges: formatAmount(f.service_charges),
    total: formatAmount(f.total),
    totalWords: f.total_in_words,
    rows: f.lines.map((l, i) => ({
      n: String(i + 1), name: l.worker_name, cnic: l.cnic, mob: l.mobile || '-', type: l.employment_type.toUpperCase(),
      wage: formatAmount(l.wage), days: String(l.days), amt: formatAmount(l.amount),
    })),
    moreWorkers: 0,
  };
}

export function companyView(p: EmployerProfile | undefined): CompanyView {
  return {
    name: p?.name || '',
    empNo: p?.ein || '',
    directorate: p?.directorate || '',
    address: p ? `${p.address}, ${p.district}` : '',
    ntn: p?.ntn || '',
    industry: p?.industry || '',
    person: p?.user_name || '',
    designation: p?.user_designation || '',
  };
}

/** Shape the documents part of the view model (used by Receipt, F-4, Declaration and C-1 sections). */
export interface DocumentsView {
  receipt: ReceiptView;
  f4Form: F4FormView;
  company: CompanyView;
}
