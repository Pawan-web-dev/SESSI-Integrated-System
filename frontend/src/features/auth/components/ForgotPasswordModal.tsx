import { useEffect, useRef, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { errorMessage } from '@/services/api/errors';
import { useConfirmPasswordResetMutation, useRequestPasswordResetMutation } from '../authApi';

interface ForgotPasswordModalProps {
  open: boolean;
  /** login ID already typed on the login form */
  initialLoginId: string;
  onClose: () => void;
  /** called after the password was changed */
  onPasswordChanged: () => void;
}

/** "Reset your password" dialog: step 1 find account, step 2 code + new password. */
export function ForgotPasswordModal({ open, initialLoginId, onClose, onPasswordChanged }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [loginId, setLoginId] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [requestReset, { isLoading: sending }] = useRequestPasswordResetMutation();
  const [confirmReset, { isLoading: saving }] = useConfirmPasswordResetMutation();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const loginIdRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setSentTo('');
    setError('');
    setLoginId(initialLoginId);
    setTimeout(() => loginIdRef.current?.focus(), 0);
    // reset only when the dialog opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const sendCode = async () => {
    if (!loginId.trim()) return setError('Enter your login ID.');
    try {
      const res = await requestReset({ login_id: loginId.trim() }).unwrap();
      setSentTo(res.sent_to);
      setError('');
      setStep(2);
      setTimeout(() => codeRef.current?.focus(), 0);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const save = async () => {
    if (!/^\d{6}$/.test(code.trim())) return setError('Enter the 6-digit code.');
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) return setError('Password needs at least 8 characters, one capital letter and one number.');
    if (password !== confirm) return setError('Passwords do not match.');
    try {
      await confirmReset({ login_id: loginId.trim(), code: code.trim(), new_password: password }).unwrap();
      setCode('');
      setPassword('');
      setConfirm('');
      onPasswordChanged();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="fp-t">
      <h1 id="fp-t" className="text-[20px]">
        Reset your password
      </h1>
      <Alert kind="error" message={error} />
      <div style={{ display: step === 1 ? undefined : 'none' }}>
        <p className="sub">Enter your Employer No., CNIC, email or mobile. We send a 6-digit code to the registered mobile number.</p>
        <div className="f">
          <label htmlFor="fp-id">Login ID</label>
          <input ref={loginIdRef} className="inp" id="fp-id" autoComplete="off" value={loginId} onChange={(e) => setLoginId(e.target.value)} />
        </div>
        <div className="row justify-end">
          <button className="btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" disabled={sending} onClick={() => void sendCode()}>
            {sending ? 'Sending…' : 'Send code'}
          </button>
        </div>
      </div>
      <div style={{ display: step === 2 ? undefined : 'none' }}>
        <div className="ok on">{'A 6-digit code was sent to ' + sentTo + ' and your registered e-mail. It is valid for 10 minutes.'}</div>
        <div className="f">
          <label htmlFor="fp-code">6-digit code</label>
          <input ref={codeRef} className="inp" id="fp-code" maxLength={6} autoComplete="off" value={code} onChange={(e) => setCode(e.target.value)} />
        </div>
        <div className="f">
          <label htmlFor="fp-p1">New password</label>
          <input className="inp" id="fp-p1" type="password" autoComplete="new-password" placeholder="At least 8 characters, a capital letter and a number" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="f">
          <label htmlFor="fp-p2">Confirm new password</label>
          <input className="inp" id="fp-p2" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <div className="row justify-end">
          <button className="btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" disabled={saving} onClick={() => void save()}>
            {saving ? 'Saving…' : 'Change password'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
