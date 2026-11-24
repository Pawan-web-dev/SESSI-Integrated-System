import { useState } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { Alert } from '@/components/ui/Alert';
import { adminSignedIn } from '@/features/auth/authSlice';
import { errorMessage } from '@/services/api/errors';
import { useAdminLoginMutation } from '../adminApi';

/** ESSI officer sign-in. Accounts are created on the server with `python -m app.create_admin`. */
export function AdminSignInCard() {
  const dispatch = useAppDispatch();
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const signIn = async () => {
    if (!username.trim() || !password) return setError('Enter your admin ID and password.');
    try {
      const res = await adminLogin({ username: username.trim(), password }).unwrap();
      dispatch(adminSignedIn({ token: res.access_token, name: res.name, role: res.role || 'officer' }));
    } catch (err) {
      setError(errorMessage(err));
      setPassword('');
    }
  };

  return (
    <div className="card max-w-[480px] -mt-2.5 mx-auto mb-0" id="ad-login">
      <h1>Admin sign in</h1>
      <p className="sub">ESSI officers review and approve employer registrations here.</p>
      <Alert kind="error" id="ad-err" message={error} />
      <form
        id="ad-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void signIn();
        }}
      >
        <div className="f">
          <label htmlFor="ad-u">Admin ID</label>
          <input className="inp" id="ad-u" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="f">
          <label htmlFor="ad-p">Password</label>
          <input className="inp" id="ad-p" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn full" id="ad-go" type="submit" disabled={isLoading}>
          {isLoading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
