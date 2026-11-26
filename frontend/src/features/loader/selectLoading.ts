/**
 * Decides whether the app is "loading" and what to tell the user.
 *
 *  - an API request that changes data (mutation) that is running           -> loading, label by action ("Saving employee…")
 *  - an API request that fetches data the screen does not have yet         -> loading ("Loading…")
 *  - a refresh of data the screen already shows (polling, refetch on focus) -> NOT loading (it happens quietly)
 *  - manual tasks started with useGlobalLoader                              -> loading, with their own label
 */
import type { RootState } from '@/app/store';

/** Endpoints that must never show the loader (e.g. a live check while typing). Add the endpoint name here. */
const SILENT_ENDPOINTS = new Set<string>([]);

/** What the user sees for each action; anything not listed gets "Saving…" / "Loading…". */
const LABELS: Record<string, string> = {
  login: 'Signing you in…',
  adminLogin: 'Signing you in…',
  requestPasswordReset: 'Sending the reset code…',
  confirmPasswordReset: 'Changing your password…',
  trackApplication: 'Finding your application…',
  sendContactCodes: 'Sending verification codes…',
  verifyContact: 'Verifying your codes…',
  uploadDocument: 'Uploading document…',
  submitRegistration: 'Submitting your application…',
  createEmployee: 'Saving employee…',
  updateEmployee: 'Saving employee…',
  setEmployeeStatus: 'Updating employee…',
  deleteEmployee: 'Removing employee…',
  createContribution: 'Preparing the contribution…',
  payChallan: 'Processing the payment…',
  createChangeRequest: 'Submitting your request…',
  changePassword: 'Changing your password…',
  approveApplication: 'Approving the application…',
  rejectApplication: 'Rejecting the application…',
  postProgress: 'Posting the update…',
  decideChangeRequest: 'Saving the decision…',
  addDependent: 'Saving dependent…',
  updateDependent: 'Saving dependent…',
  deleteDependent: 'Removing dependent…',
};

export interface LoadingInfo {
  active: boolean;
  label: string;
}

/** Returns a plain object of primitives, so use it with `shallowEqual` to avoid needless renders. */
export function selectLoading(state: RootState): LoadingInfo {
  let label = '';
  let labelTime = -1;
  let active = false;

  const consider = (endpointName: string | undefined, startedTimeStamp: number | undefined, fallback: string) => {
    if (endpointName && SILENT_ENDPOINTS.has(endpointName)) return;
    active = true;
    // the most recently started request decides the message
    const t = startedTimeStamp ?? 0;
    if (t >= labelTime) {
      labelTime = t;
      label = (endpointName && LABELS[endpointName]) || fallback;
    }
  };

  for (const q of Object.values(state.api.queries)) {
    if (q && q.status === 'pending' && q.data === undefined) consider(q.endpointName, q.startedTimeStamp, 'Loading…');
  }
  for (const m of Object.values(state.api.mutations)) {
    if (m && m.status === 'pending') consider(m.endpointName, m.startedTimeStamp, 'Saving…');
  }
  for (const text of Object.values(state.loader.tasks)) {
    active = true;
    if (labelTime < 0) label = text;
  }
  return { active, label: label || 'Loading…' };
}
