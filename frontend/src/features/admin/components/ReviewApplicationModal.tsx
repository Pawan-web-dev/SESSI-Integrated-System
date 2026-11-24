import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { ApplicationTimeline } from '@/components/shared/ApplicationTimeline';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { errorMessage } from '@/services/api/errors';
import { openDocument } from '@/features/documents/documentViewerSlice';
import { adminDocumentUrl } from '@/services/api/files';
import type { ApplicationDetail, ApplicationStatus } from '@/services/api/types';
import { formatDateTime, formatFileSize } from '@/utils/format';
import { useApproveApplicationMutation, useGetApplicationQuery, usePostProgressMutation, useRejectApplicationMutation } from '../adminApi';

const BOX_CLASSES = 'max-w-[760px] max-h-[92vh] overflow-auto';
const CELL = 'p-2 border border-solid border-essi-line text-left align-middle text-[13px]';

interface ReviewApplicationModalProps {
  /** id of the application being reviewed; null = closed */
  applicationId: number | null;
  onClose: () => void;
  /** called after any change; `switchTo` closes the dialog and selects that tab */
  onChanged: (message: string, switchTo?: ApplicationStatus) => void;
}

/** Admin dialog: application details, progress updates, approve (issues the EIN) / reject. */
export function ReviewApplicationModal({ applicationId, onClose, onChanged }: ReviewApplicationModalProps) {
  const { data: application, isFetching } = useGetApplicationQuery(applicationId ?? 0, { skip: applicationId === null });
  const [postProgress, progress] = usePostProgressMutation();
  const [approveApplication, approving] = useApproveApplicationMutation();
  const [rejectApplication, rejecting] = useRejectApplicationMutation();
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [stage, setStage] = useState('2');
  const [note, setNote] = useState('');
  const reasonRef = useRef<HTMLInputElement>(null);
  const busy = progress.isLoading || approving.isLoading || rejecting.isLoading;

  useEffect(() => {
    if (applicationId === null) return;
    setShowReject(false);
    setError('');
    setReason('');
    setNote('');
  }, [applicationId]);

  useEffect(() => {
    if (application) setStage(application.stage >= 2 ? '3' : '2');
  }, [application]);

  if (applicationId === null || !application) {
    return (
      <Modal open={applicationId !== null} onClose={onClose} labelledBy="rv-t" boxClassName={BOX_CLASSES}>
        <h1 id="rv-t" className="text-[20px]">
          Review application
        </h1>
        <p className="sub">{isFetching ? 'Loading…' : 'Application not found.'}</p>
      </Modal>
    );
  }
  const id = application.id;
  const pending = application.status === 'pending';

  const run = async (work: () => Promise<void>) => {
    try {
      setError('');
      await work();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const postUpdate = () =>
    run(async () => {
      await postProgress({ id, stage: +stage, note: note.trim() }).unwrap();
      setNote('');
      onChanged('Update posted for ' + application.employer_name + '. The applicant was notified by SMS and e-mail.');
    });

  const approve = () =>
    run(async () => {
      const a = await approveApplication(id).unwrap();
      onChanged('Approved ' + a.employer_name + '. Employer No. ' + a.employer_no + ' was issued and the applicant was notified by SMS and e-mail.', 'approved');
    });

  const reject = () => {
    if (!showReject) {
      setShowReject(true);
      setTimeout(() => reasonRef.current?.focus(), 0);
      return;
    }
    if (reason.trim().length < 5) return setError('Enter a reason (at least 5 characters).');
    void run(async () => {
      await rejectApplication({ id, reason: reason.trim() }).unwrap();
      onChanged('Rejected ' + application.employer_name + '. The applicant was notified.', 'rejected');
    });
  };

  return (
    <Modal open onClose={onClose} labelledBy="rv-t" boxClassName={BOX_CLASSES}>
      <h1 id="rv-t" className="text-[20px]">
        Review application
      </h1>
      <div id="rv-body">
        <ApplicationDetails application={application} />
        <ApplicationDocuments application={application} />
        {pending ? (
          <div className="mt-3.5 p-3 border border-solid border-essi-line rounded-[10px] bg-[#f6fbf8]">
            <b className="text-[14px]">Post a progress update</b>
            <div className="f mt-2">
              <select className="inp" id="rv-stage" value={stage} onChange={(e) => setStage(e.target.value)}>
                <option value="2">Documents verified</option>
                <option value="3">Directorate review / inspection completed</option>
              </select>
            </div>
            <div className="f">
              <input className="inp" id="rv-note" placeholder="Note for the applicant (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <button className="btn ghost min-h-[40px]" id="rv-post" type="button" disabled={busy} onClick={() => void postUpdate()}>
              Post update &amp; notify applicant
            </button>
          </div>
        ) : null}
        <h3 className="text-[15px] mt-4 mx-0 mb-0 text-[#10331d]">Application progress</h3>
        <ApplicationTimeline application={application} />
      </div>
      <div id="rv-rej" style={{ display: showReject ? undefined : 'none' }}>
        <div className="f mt-3">
          <label htmlFor="rv-reason">
            Reason for rejection <i>*</i>
          </label>
          <input ref={reasonRef} className="inp" id="rv-reason" placeholder="e.g. SECP certificate is not readable" value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
      </div>
      <Alert kind="error" message={error} />
      <div className="row justify-end mt-4" id="rv-btns">
        <button className="btn ghost" onClick={onClose}>
          Close
        </button>
        {pending ? (
          <>
            <button className="btn bg-danger" disabled={busy} onClick={reject}>
              Reject
            </button>
            <button className="btn" disabled={busy} onClick={() => void approve()}>
              {approving.isLoading ? 'Approving…' : 'Approve & issue Employer No.'}
            </button>
          </>
        ) : null}
      </div>
    </Modal>
  );
}

function ApplicationDetails({ application: a }: { application: ApplicationDetail }) {
  const rows: [string, string][] = [
    ['Application No.', a.app_no], ['Submitted', formatDateTime(a.submitted_at)], ['Company', a.employer_name], ['Business type', a.business_type],
    ['Industry', `${a.industry} (code ${a.industry_code})`], ['Address', `${a.address}, ${a.district}`], ['SECP / NTN / SRB', `${a.secp_no} / ${a.ntn} / ${a.srb_no}`],
    ['Applicant', a.applicant + (a.designation ? ` (${a.designation})` : '')], ['CNIC', a.cnic], ['Mobile / Email', `${a.mobile} / ${a.email}`],
    ['Expected workers', String(a.expected_workers ?? '-')], ['Directorate', `${a.directorate} (code ${a.directorate_code})`],
    [a.employer_no ? 'Employer No.' : 'Employer No. on approval', a.employer_no || a.employer_no_on_approval],
  ];
  return (
    <div className="kv grid-cols-[150px_1fr] max-w-none mt-3 mx-0 mb-0">
      {rows.map(([label, value]) => [
        <div key={label + 'l'}>{label}</div>,
        <div key={label + 'v'} className="whitespace-pre-line">
          {value}
        </div>,
      ])}
    </div>
  );
}

/** The files the applicant uploaded, each with a View button (shown in the document viewer). */
function ApplicationDocuments({ application: a }: { application: ApplicationDetail }) {
  const dispatch = useAppDispatch();
  const view = (documentId: number, name: string) => void dispatch(openDocument({ path: adminDocumentUrl(a.id, documentId), name }));
  return (
    <>
      <h3 className="text-[15px] mt-4 mx-0 mb-2 text-[#10331d]">Uploaded documents ({a.documents.length})</h3>
      {a.documents.length === 0 ? (
        <p className="text-ink-muted text-[13px]">No documents were uploaded with this application.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" id="rv-docs">
            <thead>
              <tr className="bg-essi-mint">
                <th className={CELL}>Document</th>
                <th className={CELL}>File</th>
                <th className={CELL}>Size</th>
                <th className={CELL}>Uploaded</th>
                <th className={CELL}></th>
              </tr>
            </thead>
            <tbody>
              {a.documents.map((d) => (
                <tr key={d.doc_type}>
                  <td className={CELL}>
                    {d.label}
                    {d.required ? <span className="text-danger"> *</span> : null}
                  </td>
                  <td className={CELL + ' wrap-anywhere'}>{d.file_name || '-'}</td>
                  <td className={CELL + ' whitespace-nowrap'}>{d.size ? formatFileSize(d.size) : '-'}</td>
                  <td className={CELL + ' whitespace-nowrap'}>{d.uploaded_at ? formatDateTime(d.uploaded_at) : '-'}</td>
                  <td className={CELL}>
                    {d.has_file && d.id !== null ? (
                      <button type="button" className="btn ghost min-h-[34px] py-0 px-3 text-[13px]" onClick={() => view(d.id!, `${d.label} – ${d.file_name}`)}>
                        View
                      </button>
                    ) : (
                      <span className="text-ink-muted">No file</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
