import { useCallback, useState } from 'react';
import { getEinRegistry, getStatus, type ApplicationStatus } from '@/services/portal';
import { RegistrationsTable } from '../components/RegistrationsTable';
import { ReviewApplicationModal } from '../components/ReviewApplicationModal';
import type { AdminViewProps } from './viewTypes';

const TABS: ApplicationStatus[] = ['pending', 'approved', 'rejected'];

/** Registration applications: review documents, approve (issues the Employer No.) or reject. */
export function RegistrationsView({ accounts, refresh, notify }: AdminViewProps) {
  const [tab, setTab] = useState<ApplicationStatus>('pending');
  const [reviewId, setReviewId] = useState<string | null>(null);
  const applications = accounts.filter((a) => a.appNo);
  const counts: Record<ApplicationStatus, number> = { pending: 0, approved: 0, rejected: 0 };
  applications.forEach((a) => counts[getStatus(a)]++);
  const closeReview = useCallback(() => setReviewId(null), []);

  return (
    <>
      <p className="admin-muted">
        Employer Nos. issued: <b>{getEinRegistry().length}</b> · format <b>DDD-II-NNNNNN</b>
      </p>
      <div className="admin-filter">
        {TABS.map((k) => (
          <button key={k} type="button" className={`btn admin-action ${k === tab ? '' : 'ghost'}`} onClick={() => setTab(k)}>
            {k.charAt(0).toUpperCase() + k.slice(1) + ' (' + counts[k] + ')'}
          </button>
        ))}
      </div>
      <RegistrationsTable tab={tab} rows={applications.filter((a) => getStatus(a) === tab)} onReview={setReviewId} />
      <ReviewApplicationModal
        applicationId={reviewId}
        onClose={closeReview}
        onChanged={(msg, switchTo) => {
          if (switchTo) {
            setReviewId(null);
            setTab(switchTo);
          }
          if (msg) notify(msg);
          refresh();
        }}
      />
    </>
  );
}
