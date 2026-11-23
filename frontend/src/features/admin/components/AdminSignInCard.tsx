import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { ADMIN_ID, ADMIN_PASSWORD, startAdminSession } from '@/services/portal';

/** Admin sign-in form. Hidden (not unmounted) while signed in, as in the design. */
export function AdminSignInCard({ hidden, onSignedIn }: { hidden: boolean; onSignedIn: () => void }) {
  const [adminId, setAdminId] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const signIn = () => {
    if (adminId.trim().toLowerCase() === ADMIN_ID && password === ADMIN_PASSWORD) {
      startAdminSession();
      setPassword('');
      setError('');
      onSignedIn();
    } else setError('Wrong admin ID or password.');
  };

  return (
    <div className="card max-w-[480px] -mt-2.5 mx-auto mb-0" id="ad-login" style={{display: hidden ? 'none' : undefined}}>
      <h1>Admin sign in</h1>
      <p className="sub">ESSI officers review and approve employer registrations here.</p>
      <Alert kind="error" id="ad-err" message={error} />
      <form
        id="ad-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          signIn();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            signIn();
          }
        }}
      >
        <div className="f">
          <label htmlFor="ad-u">Admin ID</label>
          <input className="inp" id="ad-u" autoComplete="username" value={adminId} onChange={(e) => setAdminId(e.target.value)} />
        </div>
        <div className="f">
          <label htmlFor="ad-p">Password</label>
          <input className="inp" id="ad-p" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn full" id="ad-go" type="button" onClick={signIn}>
          Sign in
        </button>
      </form>
      <p className="text-[13px] text-[#5b5320] bg-[#fffdf3] border border-dashed border-essi-green rounded-lg py-2.5 px-3 mt-4 mx-0 mb-0">
        Demo admin — ID <code>admin</code>, password <code>Admin@2026</code>
      </p>
    </div>
  );
}
