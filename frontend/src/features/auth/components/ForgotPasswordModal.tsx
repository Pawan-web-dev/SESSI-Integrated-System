import { useEffect, useRef, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { changePassword, findAccountByLoginId, RESET_CODE, type Account } from '@/services/portal';
import { digitsOnly } from '@/utils/format';

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
  const [account, setAccount] = useState<Account | null>(null);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const loginIdRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setAccount(null);
    setError('');
    setLoginId(initialLoginId);
    setTimeout(() => loginIdRef.current?.focus(), 0);
    // reset only when the dialog opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const sendCode = () => {
    const a = findAccountByLoginId(loginId);
    if (!a) return setError('No account found for that login ID.');
    setAccount(a);
    setError('');
    setStep(2);
    setTimeout(() => codeRef.current?.focus(), 0);
  };

  const save = () => {
    if (code.trim() !== RESET_CODE) return setError('The code is incorrect.');
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) return setError('Password needs at least 8 characters, one capital letter and one number.');
    if (password !== confirm) return setError('Passwords do not match.');
    if (account) changePassword(account.id, password);
    setCode('');
    setPassword('');
    setConfirm('');
    onPasswordChanged();
  };

  const mobile = account ? digitsOnly(account.mobile) : '';
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
          <button className="btn" onClick={sendCode}>
            Send code
          </button>
        </div>
      </div>
      <div style={{ display: step === 2 ? undefined : 'none' }}>
        <div className="ok on">{'Code sent to ' + mobile.slice(0, 4) + '-XXX' + mobile.slice(-4) + '. Demo code: ' + RESET_CODE}</div>
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
          <button className="btn" onClick={save}>
            Change password
          </button>
        </div>
      </div>
    </Modal>
  );
}
