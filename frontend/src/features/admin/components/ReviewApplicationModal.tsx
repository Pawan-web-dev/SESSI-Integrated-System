import { useEffect, useRef, useState } from 'react';
import { ApplicationTimeline } from '@/components/shared/ApplicationTimeline';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { DocumentViewerModal } from './DocumentViewerModal';
import {
  approveApplication, COMPANY_DOCUMENTS, completedStages, expectedEmployerNo, findIndustry, getAccountById, getStatus, postProgressUpdate, rejectApplication, type Account, type ApplicationStatus,
} from '@/services/portal';

const BOX_CLASSES = 'max-w-[640px] max-h-[92vh] overflow-auto';

interface ReviewApplicationModalProps {
  /** id of the application being reviewed; null = closed */
  applicationId: string | null;
  onClose: () => void;
  /** called after any change; `switchTo` closes the dialog and selects that tab */
  onChanged: (message: string, switchTo?: ApplicationStatus) => void;
}

/** Admin dialog: application details, progress updates, approve / reject. */
export function ReviewApplicationModal({ applicationId, onClose, onChanged }: ReviewApplicationModalProps) {
  const [, setVersion] = useState(0);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [stage, setStage] = useState('2');
  const [note, setNote] = useState('');
  const [viewDoc, setViewDoc] = useState<string | null>(null);
  const reasonRef = useRef<HTMLInputElement>(null);
  const application = getAccountById(applicationId);

  useEffect(() => {
    if (!applicationId) return;
    setShowReject(false);
    setError('');
    setReason('');
    setNote('');
    setViewDoc(null);
    const a = getAccountById(applicationId);
    setStage(a && completedStages(a) >= 2 ? '3' : '2');
  }, [applicationId]);

  if (!application) {
    return (
      <Modal open={false} onClose={onClose} labelledBy="rv-t" boxClassName={BOX_CLASSES}>
        {null}
      </Modal>
    );
  }
  const id = application.id;

  const postUpdate = () => {
    const a = postProgressUpdate(id, +stage, note.trim());
    if (!a) return;
    setNote('');
    setStage(completedStages(a) >= 2 ? '3' : '2');
    setVersion((n) => n + 1);
    onChanged('Update posted for ' + a.co.employer + '. The applicant was notified by SMS and email (see Demo SMS / email inbox).');
  };

  const approve = () => {
    const a = approveApplication(id);
    if (a) onChanged('Approved ' + a.co.employer + '. Employer No. ' + a.employerNo + ' was assigned and an SMS and email were sent (see Demo SMS / email inbox).', 'approved');
  };

  const reject = () => {
    if (!showReject) {
      setShowReject(true);
      setTimeout(() => reasonRef.current?.focus(), 0);
      return;
    }
    if (reason.trim().length < 5) return setError('Enter a reason (at least 5 characters).');
    rejectApplication(id, reason.trim());
    onChanged('', 'rejected');
  };

  return (
    <>
    <Modal open={!!applicationId} onClose={onClose} labelledBy="rv-t" boxClassName={BOX_CLASSES}>
      <h1 id="rv-t" className="text-[20px]">
        Review application
      </h1>
      <div id="rv-body">
        <ApplicationDetails application={application} />
        <h3 className="text-[15px] mt-4 mx-0 mb-2 text-[#10331d]">Uploaded company documents</h3>
        {COMPANY_DOCUMENTS.map(([key, label, required]) => {
          const d = application.uploadedDocs?.[key];
          return (
            <div key={key} className="admin-doc-row">
              <div className="min-w-0">
                <b>{label}</b> <small className="admin-muted">{required ? 'Required' : 'Optional'}</small>
                <br />
                <small className="admin-muted break-all">{d ? d.name + ' (' + Math.max(1, Math.ceil(d.size / 1024)) + ' KB)' : 'demo copy'}</small>
              </div>
              <button type="button" className="btn ghost py-1.5 px-3.5 text-[13px] min-h-0" onClick={() => setViewDoc(key)}>
                View
              </button>
            </div>
          );
        })}
        <p className="admin-muted text-[12px] mt-2">Documents marked "demo copy" have no stored file; View shows a sample placeholder.</p>
        {getStatus(application) === 'pending' ? (
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
            <button className="btn ghost min-h-[40px]" id="rv-post" type="button" onClick={postUpdate}>
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
        {getStatus(application) === 'pending' ? (
          <>
            <button className="btn bg-danger" onClick={reject}>
              Reject
            </button>
            <button className="btn" onClick={approve}>
              Approve &amp; assign Employer No.
            </button>
          </>
        ) : null}
      </div>
    </Modal>
    <DocumentViewerModal application={application} docKey={viewDoc} onClose={() => setViewDoc(null)} />
    </>
  );
}

function ApplicationDetails({ application: a }: { application: Account }) {
  const c = a.co;
  const rows: [string, string | undefined][] = [
    ['Application No.', a.appNo], ['Submitted', a.submitted], ['Company', c.employer], ['Business type', c.btype], ['Industry', (findIndustry(a.industry)?.name || c.industry || '-') + (a.industry ? ' (code ' + a.industry + ')' : '')], ['Address', c.addr + ', ' + c.district],
    ['SECP / NTN / SRB', c.secp + ' / ' + c.ntn + ' / ' + c.srb], ['Applicant', c.person + ' (' + c.desig + ')'], ['CNIC', a.cnic], ['Mobile / Email', a.mobile + ' / ' + a.email],
    ['Expected workers', a.workers || '-'], ['Documents', (a.docs || 10) + ' uploaded'], ['Directorate', a.dir + (a.directorateCode ? ' (code ' + a.directorateCode + ')' : '')],
    [a.employerNo ? 'Employer No.' : 'Employer No. on approval', expectedEmployerNo(a)],
  ];
  return (
    <div className="kv grid-cols-[150px_1fr] max-w-none mt-3 mx-0 mb-0">
      {rows.map(([label, value]) => [<div key={label + 'l'}>{label}</div>, <div key={label + 'v'}>{value}</div>])}
    </div>
  );
}
