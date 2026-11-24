import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { ROUTES } from '@/app/routes';
import { PortalFooter } from '@/components/layout/PortalFooter';
import { PortalHeader } from '@/components/layout/PortalHeader';
import { PortalPage } from '@/components/layout/PortalPage';
import { Alert } from '@/components/ui/Alert';
import { config } from '@/config/env';
import { errorMessage } from '@/services/api/errors';
import { useLoginMutation } from '../authApi';
import { employerSignedIn, setFlash } from '../authSlice';
import { CaptchaField } from '../components/CaptchaField';
import { ForgotPasswordModal } from '../components/ForgotPasswordModal';
import { LoginInfoPanels } from '../components/LoginInfoPanels';
import { TrackApplicationModal } from '../components/TrackApplicationModal';
import { captchaText, createCaptcha } from '../utils/captcha';

/** Employer login (#/login). The server checks the password and locks the account after 5 failed attempts. */
export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const flash = useAppSelector((s) => s.auth.flash);
  const [login, { isLoading }] = useLoginMutation();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState(createCaptcha);
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(flash);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const loginIdRef = useRef<HTMLInputElement>(null);

  const newCaptcha = () => {
    setCaptcha(createCaptcha());
    setCaptchaInput('');
  };

  useEffect(() => {
    document.title = 'Employer Login | ESSI Sindh';
    if (flash) dispatch(setFlash(''));
    const t = setTimeout(() => loginIdRef.current?.focus(), 30);
    return () => clearTimeout(t);
    // run once when the page opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    setSuccess('');
    const id = loginId.trim();
    const code = captchaInput.trim().toUpperCase();
    if (!id || !password) return setError('Enter your login ID and password.');
    if (!code) return setError('Enter the security code shown in the image.');
    if (code !== captchaText(captcha)) {
      setError('The security code is incorrect. A new code has been generated.');
      newCaptcha();
      return;
    }
    try {
      const res = await login({ login_id: id, password }).unwrap();
      dispatch(employerSignedIn({ token: res.access_token, name: res.name, employerNo: res.employer_no || '' }));
      setError('');
      setSuccess('Login successful. Opening your dashboard…');
      navigate(ROUTES.dashboard);
    } catch (err) {
      setError(errorMessage(err));
      setPassword('');
      newCaptcha();
    }
  };

  const onFormKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
      e.preventDefault();
      void submit();
    }
  };

  const closeModals = useCallback(() => {
    setForgotOpen(false);
    setTrackOpen(false);
  }, []);

  const onPasswordChanged = () => {
    closeModals();
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
                  void submit();
                }}
                onKeyDown={onFormKeyDown}
              >
                <div className="f">
                  <label htmlFor="lg-id">
                    Employer No. / CNIC / Email / Mobile <i>*</i>
                  </label>
                  <input ref={loginIdRef} className="inp" id="lg-id" name="username" autoComplete="username" placeholder="e.g. 100-91-000001" value={loginId} onChange={(e) => setLoginId(e.target.value)} />
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
                <CaptchaField code={captcha} value={captchaInput} onChange={setCaptchaInput} onRefresh={newCaptcha} />
                <div className="row -mt-1 mx-0 mb-4.5">
                  <button type="button" className="link" id="lg-forgot" onClick={() => setForgotOpen(true)}>
                    Forgot password?
                  </button>
                </div>
                <button className="btn full" id="lg-go" type="button" disabled={isLoading} onClick={() => void submit()}>
                  {isLoading ? 'Signing in…' : 'Log in'}
                </button>
              </form>
              <div className="hr2"></div>
              <div className="row mb-3.5">
                <button type="button" className="link" id="lg-track" onClick={() => setTrackOpen(true)}>
                  Track my application
                </button>
                {config.showTestInbox && (
                  <Link className="link" to={ROUTES.inbox}>
                    SMS / email inbox (testing)
                  </Link>
                )}
              </div>
              <div className="row">
                <span className="text-[14px]">New establishment?</span>
                <Link className="btn ghost no-underline" to={ROUTES.register}>
                  Register as employer
                </Link>
              </div>
            </div>
            <div className="r">
              <LoginInfoPanels />
            </div>
          </div>
        </div>
      </div>
      <PortalFooter />
    </PortalPage>
  );
}
