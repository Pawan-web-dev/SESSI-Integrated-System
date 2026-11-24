import { useState } from 'react';
import { getStatus } from '@/services/portal';
import type { AdminViewProps } from './viewTypes';
import { CompaniesTable } from './CompaniesTable';

/** Approved companies that hold an Employer Number, with search. */
export function CompaniesView({ accounts, onViewCompany }: AdminViewProps & { onViewCompany: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const list = accounts.filter((a) => getStatus(a) === 'approved').filter((a) => !q || [a.co.employer, a.employerNo, a.co.district].join(' ').toLowerCase().includes(q));
  return (
    <>
      <p className="admin-muted">Approved companies with an Employer Number are shown here as enrolled companies. Search by company, Employer No. or district.</p>
      <div className="admin-filter">
        <input className="inp" aria-label="Search companies" placeholder="Search company / Employer No. / district" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <CompaniesTable companies={list} empty="No enrolled companies match your search." onView={onViewCompany} />
    </>
  );
}
