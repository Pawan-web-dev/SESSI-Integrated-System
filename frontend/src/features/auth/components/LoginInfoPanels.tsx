/** Right column of the login page: help panels. */
export function LoginInfoPanels() {
  return (
    <>
      <div className="panel">
        <h3>Before you log in</h3>
        <ul>
          <li>Use the Employer No. issued by ESSI at registration (or your CNIC, e-mail or mobile number).</li>
          <li>Enter the security code exactly as shown (not case sensitive).</li>
          <li>After 5 wrong attempts the login is locked for 1 minute.</li>
          <li>ESSI never asks for your password by phone or email.</li>
        </ul>
      </div>
      <div className="panel">
        <h3>Registered but not approved yet?</h3>
        <ul>
          <li>You can log in once ESSI approves your registration and issues your Employer No.</li>
          <li>Use “Track my application” with your Application No. and CNIC to see the progress.</li>
        </ul>
      </div>
      <div className="panel">
        <h3>What you can do after login</h3>
        <ul>
          <li>Register employees and manage their records</li>
          <li>Submit monthly contributions and F-4 returns</li>
          <li>Generate and pay challans, download receipts</li>
        </ul>
      </div>
    </>
  );
}
