import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { decideChangeRequest, getChangeRequests, isChangeRequestOpen, type AdminChangeRequest } from '@/services/portal';
import { AdminTable, StatusPill } from '../components/AdminTable';
import type { AdminViewProps } from './viewTypes';

/** Requests employers submit to change their company profile. */
export function ChangeRequestsView({ refresh, notify }: AdminViewProps) {
  const requests = getChangeRequests();
  const [rejecting, setRejecting] = useState<AdminChangeRequest | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const approve = (r: AdminChangeRequest) => {
    if (decideChangeRequest(r.companyId, r.id, 'Approved')) notify('Approved ' + r.ref + ': ' + r.company + "'s " + r.label.toLowerCase() + ' was updated and the employer was notified.');
    refresh();
  };
  const confirmReject = () => {
    if (!rejecting) return;
    if (reason.trim().length < 5) return setError('Enter a reason (at least 5 characters).');
    decideChangeRequest(rejecting.companyId, rejecting.id, 'Rejected', reason.trim());
    notify('Rejected ' + rejecting.ref + '. The employer was notified.');
    setRejecting(null);
    refresh();
  };
  const closeReject = () => setRejecting(null);

  return (
    <>
      <p className="admin-muted">Review requests submitted by enrolled companies. Approving a request updates the company profile stored in this demo.</p>
      <AdminTable
        headers={['Request ID', 'Company', 'Requested change', 'Current value', 'New value', 'Reason', 'Status', 'Action']}
        rowKeys={requests.map((r) => r.companyId + r.id)}
        empty="No change requests submitted."
        rows={requests.map((r) => [
          r.ref, r.company, r.label, r.oldVal, r.newVal, r.reason,
          <StatusPill tone={r.status === 'Rejected' ? 'rejected' : isChangeRequestOpen(r) ? 'pending' : undefined}>{r.status}</StatusPill>,
          isChangeRequestOpen(r) ? (
            <>
              <button type="button" className="btn admin-action" onClick={() => approve(r)}>
                Approve
              </button>
              <button
                type="button"
                className="btn ghost admin-action"
                onClick={() => {
                  setRejecting(r);
                  setReason('');
                  setError('');
                }}
              >
                Reject
              </button>
            </>
          ) : (
            '—'
          ),
        ])}
      />
      <Modal open={!!rejecting} onClose={closeReject} labelledBy="cr-t" boxClassName="max-w-[460px]">
        <h1 id="cr-t" className="text-[20px]">
          Reject change request
        </h1>
        <p className="sub mt-1.5 mb-3">{rejecting ? rejecting.ref + ' — ' + rejecting.company + ' (' + rejecting.label + ')' : ''}</p>
        <div className="f">
          <label htmlFor="cr-reason">
            Reason for rejection <i>*</i>
          </label>
          <input id="cr-reason" className="inp" placeholder="e.g. Supporting document is unclear" value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <Alert kind="error" message={error} />
        <div className="row justify-end mt-4">
          <button type="button" className="btn ghost" onClick={closeReject}>
            Cancel
          </button>
          <button type="button" className="btn bg-danger" onClick={confirmReject}>
            Reject request
          </button>
        </div>
      </Modal>
    </>
  );
}
