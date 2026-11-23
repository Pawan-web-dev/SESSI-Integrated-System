import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { PortalFooter } from '@/components/layout/PortalFooter';
import { PortalHeader } from '@/components/layout/PortalHeader';
import { PortalPage } from '@/components/layout/PortalPage';
import { Alert } from '@/components/ui/Alert';
import {
  clearLoginFlash, DEMO_PASSWORD, findAccountByLoginId, getAccounts, getLoginFailures, getStatus, LOGIN_LOCK_MS, MAX_LOGIN_ATTEMPTS,
  peekLoginFlash, resetLoginFailures, setLoginFailures, startSession,
} from '@/services/portal';
import { hashPassword } from '@/utils/hash';
import { CaptchaField } from '../components/CaptchaField';
import { ForgotPasswordModal } from '../components/ForgotPasswordModal';
import { LoginInfoPanels } from '../components/LoginInfoPanels';
import { TrackApplicationModal } from '../components/TrackApplicationModal';
import { captchaText, createCaptcha } from '../utils/captcha';

/** Employer login (#/login). */
export function LoginPage() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState(createCaptcha);
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(peekLoginFlash);
  const [signingIn, setSigningIn] = useState(false);
  const [locked, setLocked] = useState(false);
  const [lockCheck, setLockCheck] = useState(0);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const loginIdRef = useRef<HTMLInputElement>(null);
  const captchaRef = useRef<HTMLInputElement>(null);

  const newCaptcha = () => {
    setCaptcha(createCaptcha());
    setCaptchaInput('');
  };

  /** Show the lock countdown; returns true while the form is locked. */
  const updateLock = useCallback(() => {
    const f = getLoginFailures();
    const left = Math.ceil((f.until - Date.now()) / 1000);
    if (left > 0) {
      setLocked(true);
      setError('Too many failed attempts. Try again in ' + left + ' second' + (left === 1 ? '' : 's') + '.');
      return true;
    }
    if (f.until) {
      resetLoginFailures();
      setError('');
    }
    setLocked(false);
    return false;
  }, []);

  useEffect(() => {
    if (!updateLock()) return;
    const timer = setInterval(() => {
      if (!updateLock()) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [updateLock, lockCheck]);

  useEffect(() => {
    document.title = 'Employer Login | ESSI Sindh';
    getAccounts();
    clearLoginFlash();
    const t = setTimeout(() => loginIdRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, []);

  const submit = () => {
    setSuccess('');
    let failures = getLoginFailures();
    if (failures.until > Date.now()) return;
    const id = loginId.trim();
    const code = captchaInput.trim().toUpperCase();
    if (!id || !password) return setError('Enter your login ID and password.');
    if (!code) return setError('Enter the security code shown in the image.');
    if (code !== captchaText(captcha)) {
      setError('The security code is incorrect. A new code has been generated.');
      newCaptcha();
      return;
    }
    const acc = findAccountByLoginId(id);
    if (!acc || acc.ph !== hashPassword(password)) {
      failures = { n: failures.n + 1, until: failures.until };
      const left = MAX_LOGIN_ATTEMPTS - failures.n;
      if (left <= 0) {
        failures.until = Date.now() + LOGIN_LOCK_MS;
        setLoginFailures(failures);
        setLockCheck((n) => n + 1);
      } else {
        setLoginFailures(failures);
        setError('Invalid login ID or password. ' + left + ' attempt' + (left === 1 ? '' : 's') + ' remaining.');
      }
      newCaptcha();
      setPassword('');
      return;
    }
    resetLoginFailures();
    const status = getStatus(acc);
    if (status === 'pending') {
      setError('Your application ' + acc.appNo + ' is still waiting for ESSI approval. You can log in once an Employer No. is assigned. Use “Track my application” to check the status.');
      newCaptcha();
      return;
    }
    if (status === 'rejected') {
      setError('Your application ' + acc.appNo + ' was rejected. Reason: ' + (acc.reason || '-') + '. Please register again.');
      newCaptcha();
      return;
    }
    startSession(acc);
    setError('');
    setSuccess('Login successful. Opening your dashboard…');
    setSigningIn(true);
    setTimeout(() => navigate(ROUTES.dashboard), 400);
  };

  const onFormKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
      e.preventDefault();
      submit();
    }
  };

  const fillDemoAccount = (id: string) => {
    setLoginId(id);
    setPassword(DEMO_PASSWORD);
    captchaRef.current?.focus();
    setError('');
  };

  const closeModals = useCallback(() => {
    setForgotOpen(false);
    setTrackOpen(false);
  }, []);

  const onPasswordChanged = () => {
    closeModals();
    resetLoginFailures();
    setLockCheck((n) => n + 1);
    setError('');
    setSuccess('Password changed. Log in with your new password.');
    setPassword('');
    newCaptcha();
  };

  return (
    <PortalPage
      label="Employer login"
      modals={
        <>
          <TrackApplicationModal open={trackOpen} onClose={closeModals} />
          <ForgotPasswordModal open={forgotOpen} initialLoginId={loginId} onClose={closeModals} onPasswordChanged={onPasswordChanged} />
        </>
      }
    >
      <PortalHeader subtitle="Employer Contribution Portal">
        <span className="hn">New employer?</span>
        <Link to={ROUTES.register}>Register</Link>
      </PortalHeader>
      <div className="wrap">
        <div className="card">
          <div className="cols">
            <div className="l">
              <h1>Employer login</h1>
              <p className="sub">Sign in with your Employer No., CNIC, email or mobile number.</p>
              <Alert kind="success" id="lg-ok" message={success} />
              <Alert kind="error" id="lg-err" message={error} />
              <form
                id="lg-form"
                autoComplete="on"
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
                onKeyDown={onFormKeyDown}
              >
                <div className="f">
                  <label htmlFor="lg-id">
                    Employer No. / CNIC / Email / Mobile <i>*</i>
                  </label>
                  <input ref={loginIdRef} className="inp" id="lg-id" name="username" autoComplete="username" placeholder="e.g. 101-10-000001" value={loginId} onChange={(e) => setLoginId(e.target.value)} />
                </div>
                <div className="f">
                  <label htmlFor="lg-pw">
                    Password <i>*</i>
                  </label>
                  <div className="pw">
                    <input className="inp" id="lg-pw" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="button" id="lg-show" aria-label="Show password" onClick={() => setShowPassword((s) => !s)}>
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <CaptchaField code={captcha} value={captchaInput} onChange={setCaptchaInput} onRefresh={newCaptcha} inputRef={captchaRef} />
                <div className="row -mt-1 mx-0 mb-4.5">
                  <button type="button" className="link" id="lg-forgot" onClick={() => setForgotOpen(true)}>
                    Forgot password?
                  </button>
                </div>
                <button className="btn full" id="lg-go" type="button" disabled={signingIn || locked} onClick={submit}>
                  {signingIn ? 'Signing in…' : 'Log in'}
                </button>
              </form>
              <div className="hr2"></div>
              <div className="row mb-3.5">
                <button type="button" className="link" id="lg-track" onClick={() => setTrackOpen(true)}>
                  Track my application
                </button>
                <Link className="link" to={ROUTES.inbox}>
                  Demo SMS / email inbox
                </Link>
              </div>
              <div className="row">
                <span className="text-[14px]">New establishment?</span>
                <Link className="btn ghost no-underline" to={ROUTES.register}>
                  Register as employer
                </Link>
              </div>
            </div>
            <div className="r">
              <LoginInfoPanels onUseAccount={fillDemoAccount} />
            </div>
          </div>
        </div>
      </div>
      <PortalFooter />
    </PortalPage>
  );
}
