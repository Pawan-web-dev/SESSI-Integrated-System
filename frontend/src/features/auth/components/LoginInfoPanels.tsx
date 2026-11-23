import { Link } from 'react-router-dom';
import { ROUTES } from '@/app/routes';

/** Right column of the login page: demo accounts and help panels. */
export function LoginInfoPanels({ onUseAccount }: { onUseAccount: (loginId: string) => void }) {
  return (
    <>
      <div className="panel demo">
        <h3>
          Demo accounts <span className="tag">TEST ONLY</span>
        </h3>
        <table>
          <tbody>
            <tr>
              <th>Account</th>
              <th>Login ID</th>
              <th>Password</th>
              <th></th>
            </tr>
            <tr>
              <td>
                <b>ABC Manufacturing</b>
                <br />
                <span className="tag">Dashboard with data</span>
              </td>
              <td>
                <code>101-10-000001</code>
              </td>
              <td>
                <code>Essi@2026</code>
              </td>
              <td>
                <button className="link" onClick={() => onUseAccount('101-10-000001')}>
                  Use
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <b>Sunrise Traders</b>
                <br />
                <span className="tag n">New · no data yet</span>
              </td>
              <td>
                <code>102-96-000001</code>
              </td>
              <td>
                <code>Essi@2026</code>
              </td>
              <td>
                <button className="link" onClick={() => onUseAccount('102-96-000001')}>
                  Use
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2.5 mx-0 mb-0 text-[12.5px] text-[#5b5320]">
          A newly registered employer can log in only <b>after ESSI approves</b>
          {' the application. Approve it from the '}
          <Link to={ROUTES.admin} className="text-essi-green font-bold">
            Admin panel
          </Link>
          {' (ID '}
          <code>admin</code> / <code>Admin@2026</code>).
        </p>
      </div>
      <div className="panel">
        <h3>Before you log in</h3>
        <ul>
          <li>Use the Employer No. issued by ESSI at registration.</li>
          <li>Enter the security code exactly as shown (not case sensitive).</li>
          <li>After 5 wrong attempts the login is locked for 1 minute.</li>
          <li>ESSI never asks for your password by phone or email.</li>
        </ul>
      </div>
      <div className="panel">
        <h3>What you can do after login</h3>
        <ul>
          <li>Register employees and manage their records</li>
          <li>Submit monthly contributions and F-4 returns</li>
          <li>Generate and pay challans, download reports</li>
        </ul>
      </div>
    </>
  );
}
