/** Shapes returned by the SESSI backend (backend/app/schemas). Dates are ISO strings. */

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface TokenResponse {
  access_token: string;
  token_type: string;
  name: string;
  employer_no: string | null;
  role: string | null;
}

export interface Message {
  message: string;
}

/* ---------- master data ---------- */
export interface Directorate {
  code: string;
  name: string;
  districts: string[];
}
export interface Industry {
  code: string;
  name: string;
  approval_required: boolean;
}

/* ---------- registration ---------- */
export interface StageInfo {
  title: string;
  description: string;
  state: 'done' | 'current' | 'stopped' | 'waiting';
}
export interface ApplicationEventInfo {
  code: string;
  label: string;
  note: string | null;
  at: string;
}
export interface Application {
  app_no: string;
  status: ApplicationStatus;
  stage: number;
  employer_name: string;
  employer_no: string | null;
  submitted_at: string;
  rejection_reason: string | null;
  stages: StageInfo[];
  events: ApplicationEventInfo[];
}
export interface ApplicationSummary {
  id: number;
  app_no: string;
  status: ApplicationStatus;
  stage: number;
  employer_name: string;
  applicant: string;
  cnic: string;
  submitted_at: string;
  employer_no: string | null;
  rejection_reason: string | null;
}
export interface ApplicationList {
  counts: Record<ApplicationStatus, number>;
  items: ApplicationSummary[];
}
export interface ApplicationDetail extends Application {
  id: number;
  business_type: string;
  industry: string;
  industry_code: string;
  address: string;
  district: string;
  directorate: string;
  directorate_code: string;
  secp_no: string;
  ntn: string;
  srb_no: string;
  applicant: string;
  designation: string | null;
  cnic: string;
  mobile: string;
  email: string;
  expected_workers: number | null;
  documents: ApplicationDocument[];
  employer_no_on_approval: string;
}
/** A document uploaded with a registration application (also the employer's "Mandatory Documents"). */
export interface ApplicationDocument {
  /** null for a document type that was not uploaded */
  id: number | null;
  doc_type: string;
  label: string;
  required: boolean;
  file_name: string | null;
  has_file: boolean;
  content_type: string | null;
  size: number | null;
  uploaded_at: string | null;
  /** employer view only: Verified | Uploaded | Not provided */
  status: string | null;
}
/** Answer to POST /registrations/documents */
export interface UploadedDocument {
  file_id: string;
  file_name: string;
  content_type: string;
  size: number;
}
export interface RegistrationRequest {
  contact_token: string;
  applicant_name: string;
  cnic: string;
  mobile: string;
  email: string;
  password: string;
  employer_name: string;
  business_address: string;
  business_type: string;
  industry_code: string;
  district: string;
  secp_no: string;
  ntn: string;
  srb_no: string;
  gps: string;
  documents: Record<string, string>;
  contact_person: string;
  designation: string;
  contact_mobile: string;
  contact_email: string;
  office_phone: string | null;
  expected_workers: number;
  operations_started: string;
  declaration_accepted: boolean;
}

/* ---------- employer ---------- */
export interface EinBreakdown {
  ein: string;
  directorate_code: string;
  directorate: string | null;
  industry_code: string;
  industry: string | null;
  serial: string;
  branch: string | null;
}
export interface EmployerProfile {
  id: number;
  ein: string;
  ein_breakdown: EinBreakdown;
  status: string;
  name: string;
  business_type: string;
  industry_code: string;
  industry: string;
  directorate_code: string;
  directorate: string;
  secp_no: string;
  ntn: string;
  srb_no: string;
  address: string;
  district: string;
  province: string;
  gps: string | null;
  contact_person: string;
  designation: string | null;
  contact_mobile: string;
  contact_email: string;
  office_phone: string | null;
  approved_at: string | null;
  user_name: string;
  user_designation: string | null;
}
export interface EmployeeInput {
  full_name: string;
  father_name: string;
  gender: string;
  cnic: string;
  date_of_birth: string | null;
  mobile: string;
  designation: string;
  skill_level: string | null;
  employment_type: string;
  wage_type: string | null;
  payment_frequency: string | null;
  date_joined: string | null;
  monthly_wage: number | null;
  bank_account: string | null;
  /** 200x200 JPEG data URL */
  photo: string | null;
  /** family members; leave out to keep the saved list, [] removes all */
  dependents?: DependentInput[];
}
export type DependentSource = 'FRC' | 'Manual' | 'NADRA';
/** A family member of an employee (read from the FRC or typed in). */
export interface DependentInput {
  /** set for a dependent that is already saved */
  id?: number | null;
  name: string;
  relation: string;
  /** CNIC or B-Form number */
  cnic: string | null;
  date_of_birth: string | null;
  gender: string | null;
  photo: string | null;
  source: DependentSource;
}
export interface Dependent extends DependentInput {
  id: number;
}
export interface Employee extends Omit<EmployeeInput, 'dependents'> {
  id: number;
  status: 'Active' | 'Inactive' | 'Separated';
  dependents: Dependent[];
}

/* ---------- admin panel ---------- */
export interface LabelValue {
  label: string;
  value: number;
}
export interface AdminDashboard {
  employers: Record<'approved' | 'pending' | 'rejected' | 'closed', number>;
  employers_total: number;
  pending_applications: number;
  employees: Record<'Active' | 'Inactive' | 'Separated', number>;
  employees_total: number;
  dependents_total: number;
  pending_change_requests: number;
  contributions_this_month: number;
  collected_total: number;
  outstanding_total: number;
  unpaid_challans: number;
  employees_by_type: LabelValue[];
  employees_by_gender: LabelValue[];
  trend: { month: string; registrations: number; employees: number }[];
  top_employers: { id: number; name: string; ein: string | null; employees: number }[];
}
export interface AdminEmployer {
  id: number;
  ein: string | null;
  name: string;
  status: 'approved' | 'pending' | 'rejected' | 'closed';
  business_type: string;
  industry: string;
  district: string;
  contact_person: string;
  contact_mobile: string;
  contact_email: string;
  approved_at: string | null;
  created_at: string;
  employees: number;
  active_employees: number;
}
export interface AdminWorker {
  id: number;
  full_name: string;
  father_name: string;
  cnic: string;
  gender: string;
  mobile: string;
  designation: string;
  employment_type: string;
  status: Employee['status'];
  photo: string | null;
  employer_id: number;
  employer_name: string;
  employer_ein: string | null;
  /** number of dependents */
  dependents: number;
}
export interface AdminEmployerDetail extends AdminEmployer {
  address: string;
  directorate: string;
  secp_no: string;
  ntn: string;
  srb_no: string;
  designation: string | null;
  office_phone: string | null;
  employees_list: AdminWorker[];
}
export interface AdminWorkerDetail extends AdminWorker {
  date_of_birth: string | null;
  skill_level: string | null;
  wage_type: string | null;
  payment_frequency: string | null;
  date_joined: string | null;
  monthly_wage: number | null;
  bank_account: string | null;
  dependents_list: Dependent[];
}
export interface ContributionLine {
  employee_id: number | null;
  worker_name: string;
  cnic: string;
  mobile: string | null;
  employment_type: string;
  wage: number;
  days: number;
  amount: number;
}
export interface Challan {
  challan_no: string;
  month: string;
  amount: number;
  service_charges: number;
  payable_now: number;
  due_date: string;
  status: 'unpaid' | 'paid';
  paid_at: string | null;
  days_late: number | null;
  late_increase: number | null;
  total_paid: number | null;
  receipt_no: string | null;
  payment_channel: string | null;
  transaction_ref: string | null;
}
export interface Contribution {
  id: number;
  ref: string;
  month: string;
  workers: number;
  total_wages: number;
  amount: number;
  status: string;
  submitted_at: string;
  challan: Challan | null;
}
export interface ContributionDetail extends Contribution {
  lines: ContributionLine[];
}
export interface ContributionPreview {
  month: string;
  workers: number;
  total_wages: number;
  amount: number;
  service_charges: number;
  total: number;
  lines: ContributionLine[];
}
export interface Receipt {
  receipt_no: string;
  challan_no: string;
  month: string;
  employer_no: string;
  employer_name: string;
  directorate: string;
  workers: number;
  contribution: number;
  service_charges: number;
  days_late: number;
  late_increase: number;
  total_paid: number;
  total_in_words: string;
  paid_at: string;
  due_date: string;
  payment_channel: string;
  transaction_ref: string;
}
export interface F4Return {
  form: string;
  month: string;
  ref: string;
  employer_no: string;
  employer_name: string;
  industry: string;
  directorate: string;
  address: string;
  ntn: string;
  declarant: string;
  designation: string | null;
  workers: number;
  total_wages: number;
  contribution: number;
  service_charges: number;
  total: number;
  total_in_words: string;
  receipt_no: string | null;
  lines: ContributionLine[];
}
export interface DashboardSummary {
  employees: Record<string, number>;
  contributions_last_6_months: { month: string; amount: number; paid: boolean }[];
  outstanding: number;
  next_due: string | null;
  last_payment: string | null;
}
export interface Notification {
  subject: string;
  body: string;
  created_at: string;
}
export type EmployerDocument = ApplicationDocument;
export interface ChangeRequestEvent {
  text: string;
  actor: string;
  created_at: string;
}
export interface ChangeRequest {
  id: number;
  ref: string;
  field: string;
  label: string;
  old_value: string | null;
  new_value: string;
  reason: string;
  document: string | null;
  status: 'Pending Review' | 'Under Review' | 'Approved' | 'Rejected';
  remarks: string | null;
  submitted_by: string;
  created_at: string;
  events: ChangeRequestEvent[];
}
export interface OutboxItem {
  mobile: string | null;
  email: string | null;
  subject: string;
  body: string;
  created_at: string;
}
