/** Fixed values used across the portal (demo credentials, directorates, review stages). */
import { DIRECTORATE_MASTER } from './masterData';

/** Password of the seeded demo employer accounts. */
export const DEMO_PASSWORD = 'Essi@2026';
/** Code "sent" by SMS when resetting a password (demo only). */
export const RESET_CODE = '123456';
/** Demo admin credentials. */
export const ADMIN_ID = 'admin';
export const ADMIN_PASSWORD = 'Admin@2026';

/** District -> ESSI Directorate name (derived from DIRECTORATE_MASTER). */
export const DIRECTORATES: Record<string, string> = Object.fromEntries(DIRECTORATE_MASTER.flatMap((d) => d.districts.map((district) => [district, d.name])));

/** The four review stages of a registration application: [title, description]. */
export const REVIEW_STAGES: [string, string][] = [
  ['Application Submitted', 'We received your application and uploaded documents.'],
  ['Under Review', 'ESSI officers check your SECP, NTN, SRB and CNIC documents.'],
  ['Approved', 'Your area directorate reviews the establishment details.'],
  ['Registration Complete', 'Your Employer No. is issued and you can log in.'],
];

/** Activity-log labels by event code. */
export const EVENT_LABELS: Record<string, string> = {
  submitted: 'Application submitted',
  docs: 'Documents verified',
  inspect: 'Directorate review completed',
  final: 'Approved',
  rejected: 'Rejected',
};

/** Failed logins allowed before the form is locked, and lock length. */
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOGIN_LOCK_MS = 60_000;
