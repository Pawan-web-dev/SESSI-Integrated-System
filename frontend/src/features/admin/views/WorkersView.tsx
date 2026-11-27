/** Admin: workers of every establishment (search by name / CNIC / worker number / establishment) with their number of dependents. */
import { useDeferredValue, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Alert } from '@/components/ui/Alert';
import { errorMessage } from '@/services/api/errors';
import type { AdminWorker } from '@/services/api/types';
import { workerNoDigits } from '@/utils/format';
import { useGetAdminWorkersQuery } from '../adminApi';
import { employerOpened, workerOpened } from '../adminSlice';
import { Avatar, Badge, BTN_GHOST, Empty, FilterSelect, LINK, Panel, SearchBox, TABLE, TD, TH } from '../components/ui';
import { WorkerDetail } from './WorkerDetail';

const PAGE = 25;

export function WorkersTable({ rows, showEmployer = true, onOpen }: { rows: AdminWorker[]; showEmployer?: boolean; onOpen: (id: number) => void }) {
  const dispatch = useAppDispatch();
  const heads = ['Employee', 'Worker No.', 'CNIC', ...(showEmployer ? ['Establishment'] : []), 'Designation', 'Type', 'Dependents', 'Status', ''];
  return (
    <div className="overflow-x-auto">
      <table className={TABLE + ' min-w-[960px]'}>
        <thead>
          <tr>
            {heads.map((h) => (
              <th key={h} className={TH}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((w) => (
            <tr key={w.id} className="hover:bg-[#f7faf8]">
              <td className={TD}>
                <div className="flex items-center gap-2.5">
                  <Avatar photo={w.photo} name={w.full_name} />
                  <div className="min-w-0">
                    <button className={LINK + ' text-left whitespace-nowrap'} onClick={() => onOpen(w.id)}>
                      {w.full_name}
                    </button>
                    <div className="text-[12px] text-ink-muted whitespace-nowrap">s/o {w.father_name}</div>
                  </div>
                </div>
              </td>
              <td className={TD + ' whitespace-nowrap font-mono text-[13px] font-semibold text-essi-dark'}>
                {w.worker_no || '—'}
                {w.worker_no ? <div className="text-[12px] font-normal text-ink-muted">{workerNoDigits(w.worker_no)}</div> : null}
              </td>
              <td className={TD + ' whitespace-nowrap font-mono text-[13px]'}>{w.cnic}</td>
              {showEmployer ? (
                <td className={TD}>
                  <button className={LINK + ' text-left font-normal'} onClick={() => dispatch(employerOpened(w.employer_id))}>
                    {w.employer_name}
                  </button>
                  <div className="text-[12px] text-ink-muted font-mono">{w.employer_ein}</div>
                </td>
              ) : null}
              <td className={TD}>{w.designation}</td>
              <td className={TD}>{w.employment_type}</td>
              <td className={TD}>
                <button
                  className={'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[12px] font-semibold border-0 cursor-pointer ' + (w.dependents ? 'bg-[#f1e9fb] text-[#6b3fa0]' : 'bg-[#f1f1f1] text-[#666]')}
                  onClick={() => onOpen(w.id)}
                  title="View and manage dependents"
                >
                  {w.dependents} {w.dependents === 1 ? 'dependent' : 'dependents'}
                </button>
              </td>
              <td className={TD}>
                <Badge status={w.status} />
              </td>
              <td className={TD + ' text-right'}>
                <button className={LINK} onClick={() => onOpen(w.id)}>
                  Open
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length ? <Empty>No employees.</Empty> : null}
    </div>
  );
}

export function WorkersView() {
  const workerId = useAppSelector((s) => s.admin.workerId);
  return workerId ? <WorkerDetail id={workerId} /> : <WorkerList />;
}

function WorkerList() {
  const dispatch = useAppDispatch();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const query = useDeferredValue(q);
  const { data, error, isFetching } = useGetAdminWorkersQuery({ q: query, status, offset: page * PAGE, limit: PAGE });
  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE));

  return (
    <Panel>
      <div className="flex flex-wrap gap-3 mb-4">
        <SearchBox value={q} onChange={(v) => { setQ(v); setPage(0); }} placeholder="Search by name, father’s name, CNIC, worker no. or establishment" />
        <FilterSelect label="Status" value={status} onChange={(v) => { setStatus(v); setPage(0); }} options={[['', 'All statuses'], ['Active', 'Active'], ['Inactive', 'Inactive'], ['Separated', 'Separated']]} />
        <span className="self-center text-[13px] text-ink-muted">{isFetching ? 'Loading…' : `${total} employee(s)`}</span>
      </div>
      <Alert kind="error" message={error ? errorMessage(error) : ''} />
      <WorkersTable rows={data?.items ?? []} onOpen={(id) => dispatch(workerOpened(id))} />
      {total > PAGE ? (
        <div className="flex items-center justify-end gap-3 mt-4 text-[13px]">
          <button className={BTN_GHOST} disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span>
            Page {page + 1} of {pages}
          </span>
          <button className={BTN_GHOST} disabled={page + 1 >= pages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      ) : null}
    </Panel>
  );
}
