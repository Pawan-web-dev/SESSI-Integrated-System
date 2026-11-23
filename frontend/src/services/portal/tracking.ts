/** Registration application progress (review stages + activity log). */
import { nowStamp } from '@/utils/format';
import type { Account, TrackEvent } from './types';

/** Number of completed review stages (1-4). */
export function completedStages(a: Account): number {
  const s = a.status || 'approved';
  if (s === 'approved') return 4;
  return Math.max(1, Math.min(3, a.stage || 1));
}

/** Activity log of an application (built from its status when none was stored). */
export function getTrack(a: Account): TrackEvent[] {
  if (a.track && a.track.length) return a.track;
  const t: TrackEvent[] = [{ s: 'submitted', t: a.submitted || '', n: 'Application ' + a.appNo + ' received.' }];
  const s = a.status || 'approved';
  if (s === 'approved') t.push({ s: 'final', t: a.approved || '', n: 'Approved. Employer No. ' + (a.employerNo || '') + ' assigned.' });
  if (s === 'rejected') t.push({ s: 'rejected', t: a.rejectedAt || '', n: a.reason || '' });
  return t;
}

/** Append an event to an application's activity log (mutates the account). */
export function addTrackEvent(a: Account, code: string, note: string): void {
  a.track = getTrack(a).slice();
  a.track.push({ s: code, t: nowStamp(), n: note || '' });
}
