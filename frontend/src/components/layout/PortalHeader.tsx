import type { ReactNode } from 'react';
import logo from '@/assets/images/essi-logo.png';

interface PortalHeaderProps {
  /** third line of the title, e.g. "Employer Contribution Portal" */
  subtitle: string;
  /** links shown at the top right (optional) */
  children?: ReactNode;
}

/** Green banner header used on the login, application-submitted, inbox and admin pages. */
export function PortalHeader({ subtitle, children }: PortalHeaderProps) {
  return (
    <header className="hd">
      <img className="hl" src={logo} alt="ESSI Sindh logo" />
      <div className="hv"></div>
      <div className="ht">
        Employees’ Social Security Institution
        <br />
        Sindh<div>{subtitle}</div>
      </div>
      {children ? <div className="hr">{children}</div> : null}
    </header>
  );
}
