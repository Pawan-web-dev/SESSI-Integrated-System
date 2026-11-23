import { useEffect, type ReactNode } from 'react';

interface PortalPageProps {
  /** accessible name of the page region */
  label: string;
  children: ReactNode;
  /** dialogs rendered outside the page section */
  modals?: ReactNode;
}

/**
 * Wrapper for the public portal pages (login, application submitted, inbox, admin).
 * `.portal` scopes the portal stylesheet; `.view.on` is the page section from the design.
 */
export function PortalPage({ label, children, modals }: PortalPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="portal">
      <section className="view on" aria-label={label}>
        {children}
      </section>
      {modals}
    </div>
  );
}
