import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Alert } from '@/components/ui/Alert';
import { errorMessage } from '@/services/api/errors';
import type { ChangeRequest } from '@/services/api/types';
import { formatDateTime } from '@/utils/format';
import { useDecideChangeRequestMutation, useGetChangeRequestsForReviewQuery } from '../adminApi';
import { changeRequestStatusChanged } from '../adminSlice';

const CELL = 'p-2.5 border border-solid border-essi-line text-left align-top';
const STATUSES = ['Pending Review', 'Under Review', 'Approved', 'Rejected'] as const;

/** Admin: review employers' requests to change registered details (incl. Industry Classification). */
export function ChangeRequestsReview({ onMessage }: { onMessage: (msg: string) => void }) {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.admin.changeRequestStatus);
  const { data: rows = [], isFetching, error } = useGetChangeRequestsForReviewQuery(status);
  const [decide, { isLoading }] = useDecideChangeRequestMutation();
  const [actionError, setActionError] = useState('');

  const act = async (r: ChangeRequest, next: string) => {
    let remarks: string | undefined;
    if (next === 'Rejected') {
      remarks = window.prompt(`Reason for rejecting ${r.ref}:`)?.trim();
      if (!remarks) return;
    }
    try {
      setActionError('');
      await decide({ id: r.id, status: next, remarks }).unwrap();
      onMessage(`${r.ref} (${r.label}) is now "${next}". The employer was notified.`);
    } catch (err) {
      setActionError(errorMessage(err));
    }
  };

  return (
    <>
      <div className="flex gap-2 flex-wrap my-4 mx-0">
        {STATUSES.map((s) => (
          <button key={s} className={`btn ${s === status ? '' : 'ghost'} min-h-[40px]`} onClick={() => dispatch(changeRequestStatusChanged(s))}>
            {s}
          </button>
        ))}
      </div>
      <Alert kind="error" message={actionError || (error ? errorMessage(error) : '')} />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[14px]">
          <tbody>
            <tr className="bg-[#e8f2ec]">
              {['Request', 'Change', 'Reason / document', 'Submitted', 'Action'].map((h) => (
                <th key={h} className={CELL}>
                  {h}
                </th>
              ))}
            </tr>
            {rows.length ? (
              rows.map((r) => (
                <tr key={r.id}>
                  <td className={CELL}>
                    <b>{r.ref}</b>
                    <br />
                    <small>by {r.submitted_by}</small>
                  </td>
                  <td className={CELL}>
                    <b>{r.label}</b>
                    <br />
                    {r.old_value || '-'} → <b>{r.new_value}</b>
                  </td>
                  <td className={CELL}>
                    {r.reason}
                    <br />
                    <small>Document: {r.document || '-'}</small>
                  </td>
                  <td className={CELL}>{formatDateTime(r.created_at)}</td>
                  <td className={CELL}>
                    {r.status === 'Approved' || r.status === 'Rejected' ? (
                      <small>{r.status + (r.remarks ? ': ' + r.remarks : '')}</small>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {r.status === 'Pending Review' ? (
                          <button className="btn ghost min-h-[36px] px-3" disabled={isLoading} onClick={() => void act(r, 'Under Review')}>
                            Start review
                          </button>
                        ) : null}
                        <button className="btn min-h-[36px] px-3" disabled={isLoading} onClick={() => void act(r, 'Approved')}>
                          Approve
                        </button>
                        <button className="btn bg-danger min-h-[36px] px-3" disabled={isLoading} onClick={() => void act(r, 'Rejected')}>
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={`${CELL} text-ink-muted p-4.5`}>
                  {isFetching ? 'Loading…' : `No requests with status "${status}".`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
