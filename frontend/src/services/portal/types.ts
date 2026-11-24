/** Data shapes used by the employer portal. */

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface Company {
  employer: string;
  btype: string;
  secp: string;
  ntn: string;
  srb: string;
  addr: string;
  province: string;
  district: string;
  gps: string;
  person: string;
  desig: string;
  mobile: string;
  email: string;
  phone: string;
  /** Industry Classification name (from INDUSTRY_MASTER) */
  industry?: string;
}

/** One entry in an application's activity log. */
export interface TrackEvent {
  /** event code: submitted | docs | inspect | final | rejected */
  s: string;
  /** time stamp shown to the user */
  t: string;
  /** note */
  n: string;
}

/** An employer account / registration application. */
export interface Account {
  id: string;
  status?: ApplicationStatus;
  /** highest completed review stage (1-4) */
  stage?: number;
  track?: TrackEvent[];
  appNo?: string;
  submitted?: string;
  approved?: string;
  rejectedAt?: string;
  reason?: string;
  /** Employer Identification Number DDD-II-NNNNNN – empty until issued, never changes once issued */
  employerNo: string;
  /** Industry Classification Code (2 digits) chosen at registration */
  industry?: string;
  /** Directorate Code (3 digits) assigned from the district */
  directorateCode?: string;
  /** which demo dashboard to show: with data, or a brand-new employer */
  variant: 'data' | 'empty';
  /** password hash */
  ph: string;
  cnic: string;
  mobile: string;
  email: string;
  dir: string;
  workers?: string;
  docs?: number;
  /** files uploaded with the application, by document key (optional; demo seeds have none) */
  uploadedDocs?: Record<string, StoredDocument>;
  co: Company;
}

/** A document file kept with an application (data URL, demo storage only). */
export interface StoredDocument {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

/** A message ESSI would send by SMS and email (shown in the demo inbox). */
export interface OutboxMessage {
  t: string;
  mobile: string;
  email: string;
  subject: string;
  body: string;
}

/** Failed login counter used for the 1-minute lock. */
export interface LoginFailures {
  n: number;
  until: number;
}

/** Raw field values submitted by the registration wizard. */
export type RegistrationForm = Record<string, string | boolean | undefined>;
