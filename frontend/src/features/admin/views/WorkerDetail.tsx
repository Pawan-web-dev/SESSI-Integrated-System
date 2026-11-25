/** Admin: one worker's record and their dependents, which the admin can add, correct or remove. */
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Alert } from '@/components/ui/Alert';
import { DependentsEditor } from '@/features/dependents/DependentsEditor';
import { draftsToInput, toDraft, type DependentDraft } from '@/features/dependents/dependentDraft';
import { errorMessage } from '@/services/api/errors';
import type { AdminWorkerDetail } from '@/services/api/types';
import { formatAmount } from '@/utils/format';
import { useAddDependentMutation, useDeleteDependentMutation, useGetAdminWorkerQuery, useUpdateDependentMutation } from '../adminApi';
import { employerOpened, workerOpened } from '../adminSlice';
import { Avatar, BackButton, Badge, BTN, BTN_GHOST, LINK, Panel } from '../components/ui';

const date = (iso: string | null) => (iso ? iso.split('-').reverse().join('/') : null);

/** comparable form of a row, to tell which saved dependents were changed */
const sig = (d: DependentDraft) => JSON.stringify([d.name.trim(), d.relation.trim(), d.cnic.trim(), d.dob.trim(), d.gender, d.photo || '']);

export function WorkerDetail({ id }: { id: number }) {
  const dispatch = useAppDispatch();
  const inEmployer = useAppSelector((s) => s.admin.section === 'employers');
  const { data: w, error, isLoading } = useGetAdminWorkerQuery(id);
  // kept here: the dependents panel below is re-created after every save
  const [saved, setSaved] = useState('');
  const back = <BackButton onClick={() => dispatch(workerOpened(null))}>{inEmployer ? 'Back to establishment' : 'All employees'}</BackButton>;

  if (error)
    return (
      <>
        {back}
        <Alert kind="error" message={errorMessage(error)} />
      </>
    );
  if (isLoading || !w) return <p className="text-ink-muted">Loading…</p>;

  const facts: [string, string | null][] = [
    ['Father’s name', w.father_name], ['CNIC', w.cnic], ['Gender', w.gender], ['Date of birth', date(w.date_of_birth)], ['Mobile', w.mobile],
    ['Designation', w.designation], ['Skill level', w.skill_level], ['Employment type', w.employment_type], ['Wage type', w.wage_type],
    ['Payment frequency', w.payment_frequency], ['Date of joining', date(w.date_joined)], ['Monthly wages', w.monthly_wage != null ? 'PKR ' + formatAmount(w.monthly_wage) : null],
    ['Bank account', w.bank_account],
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        {back}
        <div className="flex flex-wrap items-center gap-4">
          <Avatar photo={w.photo} name={w.full_name} size={64} />
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="m-0 text-[22px] text-[#10331d]">{w.full_name}</h2>
              <Badge status={w.status} />
            </div>
            <div className="text-[14px] text-ink-muted mt-0.5">
              {w.designation} at{' '}
              <button className={LINK} onClick={() => dispatch(employerOpened(w.employer_id))}>
                {w.employer_name}
              </button>{' '}
              <span className="font-mono text-[12px]">({w.employer_ein})</span>
            </div>
          </div>
        </div>
      </div>
      <Panel title="Employee details">
        <dl className="grid grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))] gap-x-6 gap-y-3 m-0">
          {facts.map(([l, v]) => (
            <div key={l}>
              <dt className="text-[12px] text-ink-muted">{l}</dt>
              <dd className="m-0 text-[14px] font-semibold break-words">{v || '—'}</dd>
            </div>
          ))}
        </dl>
      </Panel>
      {/* re-created (fresh rows) whenever the saved list changes: after saving, or when the employer edited it */}
      <DependentsManager key={w.dependents_list.map((d) => [d.id, d.name, d.relation, d.cnic, d.date_of_birth, d.gender, d.photo?.length].join('|')).join(';')} worker={w} message={saved} onMessage={setSaved} />
    </div>
  );
}

function DependentsManager({ worker, message, onMessage: setMessage }: { worker: AdminWorkerDetail; message: string; onMessage: (m: string) => void }) {
  const saved = worker.dependents_list;
  const [rows, setRows] = useState<DependentDraft[]>(() => saved.map(toDraft));
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [add] = useAddDependentMutation();
  const [update] = useUpdateDependentMutation();
  const [remove] = useDeleteDependentMutation();

  const original = new Map(saved.map((d) => [d.id, sig(toDraft(d))]));
  const removed = saved.filter((d) => !rows.some((r) => r.id === d.id));
  const changed = rows.filter((r) => !r.id || original.get(r.id) !== sig(r));
  const dirty = removed.length > 0 || changed.length > 0;

  const save = async () => {
    setErr('');
    setMessage('');
    const input = draftsToInput(rows);
    if (typeof input === 'string') return setErr(input);
    setBusy(true);
    try {
      for (const d of removed) await remove(d.id).unwrap();
      for (const [i, r] of rows.entries()) {
        if (!changed.includes(r)) continue;
        const body = input[i];
        if (r.id) await update({ id: r.id, body }).unwrap();
        else await add({ employeeId: worker.id, body }).unwrap();
      }
      setMessage(`Dependents of ${worker.full_name} were saved. The employer sees the same list.`);
    } catch (e) {
      setErr(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel
      title={`Dependents (${saved.length})`}
      action={
        dirty ? (
          <span className="flex gap-2">
            <button className={BTN_GHOST} disabled={busy} onClick={() => { setRows(saved.map(toDraft)); setErr(''); }}>
              Discard
            </button>
            <button className={BTN} disabled={busy} onClick={() => void save()}>
              {busy ? 'Saving…' : 'Save changes'}
            </button>
          </span>
        ) : null
      }
    >
      <Alert kind="success" message={message} />
      <Alert kind="error" message={err} />
      <p className="mt-0 mb-3 text-[13px] text-ink-muted">Correct any value in the table, add a family member with “+ Add dependent”, or remove a row, then click Save changes.</p>
      <DependentsEditor rows={rows} onChange={(r) => { setRows(r); setMessage(''); }} disabled={busy} emptyText="No dependents on record for this employee. Click “+ Add dependent” to add one." />
    </Panel>
  );
}
