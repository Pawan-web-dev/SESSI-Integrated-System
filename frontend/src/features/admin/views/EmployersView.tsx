/** Admin: registered establishments (search + status filter) and one establishment's profile and workforce. */
import { useDeferredValue, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Alert } from '@/components/ui/Alert';
import { errorMessage } from '@/services/api/errors';
import { formatDate } from '@/utils/format';
import { useGetAdminEmployerQuery, useGetAdminEmployersQuery } from '../adminApi';
import { employerOpened, workerOpened } from '../adminSlice';
import { BackButton, Badge, Empty, FilterSelect, LINK, Panel, SearchBox, TABLE, TD, TH } from '../components/ui';
import { WorkersTable } from './WorkersView';
import { WorkerDetail } from './WorkerDetail';

export function EmployersView() {
  const { employerId, workerId } = useAppSelector((s) => s.admin);
  if (employerId && workerId) return <WorkerDetail id={workerId} />;
  if (employerId) return <EmployerDetail id={employerId} />;
  return <EmployerList />;
}

function EmployerList() {
  const dispatch = useAppDispatch();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('approved');
  const query = useDeferredValue(q);
  const { data = [], error, isFetching } = useGetAdminEmployersQuery({ q: query, status });

  return (
    <Panel>
      <div className="flex flex-wrap gap-3 mb-4">
        <SearchBox value={q} onChange={setQ} placeholder="Search by name, EIN, contact person or district" />
        <FilterSelect label="Status" value={status} onChange={setStatus} options={[['approved', 'Registered (approved)'], ['pending', 'Pending'], ['rejected', 'Rejected'], ['', 'All statuses']]} />
        <span className="self-center text-[13px] text-ink-muted">{isFetching ? 'Loading…' : `${data.length} establishment(s)`}</span>
      </div>
      <Alert kind="error" message={error ? errorMessage(error) : ''} />
      <div className="overflow-x-auto">
        <table className={TABLE + ' min-w-[880px]'}>
          <thead>
            <tr>
              {['EIN', 'Establishment', 'Industry', 'District', 'Contact', 'Employees', 'Status', ''].map((h) => (
                <th key={h} className={TH}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((e) => (
              <tr key={e.id} className="hover:bg-[#f7faf8]">
                <td className={TD + ' whitespace-nowrap font-mono text-[13px]'}>{e.ein || '—'}</td>
                <td className={TD}>
                  <button className={LINK + ' text-left'} onClick={() => dispatch(employerOpened(e.id))}>
                    {e.name}
                  </button>
                  <div className="text-[12px] text-ink-muted">{e.business_type}</div>
                </td>
                <td className={TD}>{e.industry}</td>
                <td className={TD}>{e.district}</td>
                <td className={TD}>
                  {e.contact_person}
                  <div className="text-[12px] text-ink-muted">{e.contact_mobile}</div>
                </td>
                <td className={TD}>
                  <b>{e.active_employees}</b> <span className="text-ink-muted text-[12px]">active / {e.employees}</span>
                </td>
                <td className={TD}>
                  <Badge status={e.status} />
                </td>
                <td className={TD + ' text-right'}>
                  <button className={LINK} onClick={() => dispatch(employerOpened(e.id))}>
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data.length && !isFetching ? <Empty>No establishments match.</Empty> : null}
      </div>
    </Panel>
  );
}

function EmployerDetail({ id }: { id: number }) {
  const dispatch = useAppDispatch();
  const { data: e, error, isLoading } = useGetAdminEmployerQuery(id);
  const back = <BackButton onClick={() => dispatch(employerOpened(null))}>All establishments</BackButton>;
  if (error)
    return (
      <>
        {back}
        <Alert kind="error" message={errorMessage(error)} />
      </>
    );
  if (isLoading || !e) return <p className="text-ink-muted">Loading…</p>;
  const facts: [string, string | null][] = [
    ['EIN', e.ein], ['Business type', e.business_type], ['Industry', e.industry], ['Directorate', e.directorate], ['District', e.district], ['Address', e.address],
    ['SECP No.', e.secp_no], ['NTN', e.ntn], ['SRB No.', e.srb_no], ['Contact person', e.contact_person + (e.designation ? ` (${e.designation})` : '')],
    ['Mobile', e.contact_mobile], ['E-mail', e.contact_email], ['Office phone', e.office_phone], ['Registered on', e.approved_at ? formatDate(e.approved_at) : null],
  ];
  return (
    <div className="flex flex-col gap-5">
      <div>
        {back}
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="m-0 text-[22px] text-[#10331d]">{e.name}</h2>
          <Badge status={e.status} />
        </div>
      </div>
      <Panel title="Establishment profile">
        <dl className="grid grid-cols-[repeat(auto-fill,minmax(min(240px,100%),1fr))] gap-x-6 gap-y-3 m-0">
          {facts.map(([l, v]) => (
            <div key={l}>
              <dt className="text-[12px] text-ink-muted">{l}</dt>
              <dd className="m-0 text-[14px] font-semibold break-words">{v || '—'}</dd>
            </div>
          ))}
        </dl>
      </Panel>
      <Panel title={`Employees (${e.employees_list.length})`}>
        <WorkersTable rows={e.employees_list} showEmployer={false} onOpen={(wid) => dispatch(workerOpened(wid))} />
      </Panel>
    </div>
  );
}
