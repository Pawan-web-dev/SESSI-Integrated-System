import { useEffect, useRef, useState } from 'react';
import { ApplicationTimeline } from '@/components/shared/ApplicationTimeline';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { getAccounts, getStatus, type Account } from '@/services/portal';
import { digitsOnly } from '@/utils/format';

const STATUS_STYLE = {
  pending: ['Pending approval', '#fff4d6', '#8a5200'],
  approved: ['Approved', '#dff3e5', '#0b4d24'],
  rejected: ['Rejected', '#fdecea', '#b00020'],
} as const;

/** "Track my application" dialog: look up an application by Application No. + CNIC. */
export function TrackApplicationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [appNo, setAppNo] = useState('');
  const [cnic, setCnic] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<Account | null>(null);
  const appNoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setError('');
    setResult(null);
    setTimeout(() => appNoRef.current?.focus(), 0);
  }, [open]);

  const check = () => {
    const a = getAccounts().find((x) => x.appNo && x.appNo.toUpperCase() === appNo.trim().toUpperCase() && digitsOnly(x.cnic) === digitsOnly(cnic));
    if (!a) {
      setError('No application found for that Application No. and CNIC.');
      setResult(null);
      return;
    }
    setError('');
    setResult(a);
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="tr-t" boxClassName="max-h-[92vh] overflow-auto">
      <h1 id="tr-t" className="text-[20px]">
        Track your application
      </h1>
      <p className="sub">Enter the Application No. you received after registering and your CNIC.</p>
      <Alert kind="error" message={error} />
      <div id="tr-res">{result ? <TrackResult application={result} /> : null}</div>
      <div className="f">
        <label htmlFor="tr-a">Application No.</label>
        <input ref={appNoRef} className="inp" id="tr-a" placeholder="REG-2026-12345" value={appNo} onChange={(e) => setAppNo(e.target.value)} />
      </div>
      <div className="f">
        <label htmlFor="tr-c">CNIC</label>
        <input className="inp" id="tr-c" placeholder="00000-0000000-0" value={cnic} onChange={(e) => setCnic(e.target.value)} />
      </div>
      <div className="row justify-end">
        <button className="btn ghost" onClick={onClose}>
          Close
        </button>
        <button className="btn" id="tr-go" onClick={check}>
          Check status
        </button>
      </div>
    </Modal>
  );
}

function TrackResult({ application: a }: { application: Account }) {
  const status = getStatus(a);
  const [label, bg, fg] = STATUS_STYLE[status];
  const message =
    status === 'pending' ? (
      'ESSI is verifying your documents. Check again later.'
    ) : status === 'approved' ? (
      <>
        Your Employer No. is <b>{a.employerNo}</b>. Log in with it (or your CNIC / email) and the password you created.
      </>
    ) : (
      'Reason: ' + (a.reason || '-') + '. Please register again with corrected details.'
    );
  return (
    <>
      <div className="rounded-lg py-3 px-3.5 mb-3.5" style={{background: bg, color: fg}}>
        <b>{label}</b> — {a.co.employer}
        <br />
        <span className="text-[14px] text-[#25324a]">{message}</span>
      </div>
      <ApplicationTimeline application={a} />
    </>
  );
}
