/**
 * Admin: hospitals and pharmacies. Check a worker's or family member's eligibility (the same answer the partner
 * systems get) and issue / revoke the API keys those systems use.
 */
import { useState, type FormEvent } from 'react';
import { useAppSelector } from '@/app/hooks';
import { Alert } from '@/components/ui/Alert';
import { errorMessage } from '@/services/api/errors';
import type { Eligibility, PartnerKeyCreated, PartnerKind } from '@/services/api/types';
import { formatDate, formatDateTime } from '@/utils/format';
import { useCheckEligibilityMutation, useCreatePartnerKeyMutation, useGetPartnerKeysQuery, useRevokePartnerKeyMutation } from '../adminApi';
import { Avatar, Badge, BTN, BTN_GHOST, Empty, FilterSelect, Panel, TABLE, TD, TH } from '../components/ui';

const INPUT = 'min-h-[42px] px-3 border border-solid border-essi-input rounded-lg text-[14px] bg-white box-border';
const KINDS: PartnerKind[] = ['HMIS', 'Pharmacy', 'Other'];

export function PartnersView() {
  return (
    <div className="flex flex-col gap-5">
      <EligibilityCheck />
      <PartnerKeys />
    </div>
  );
}

function EligibilityCheck() {
  const [number, setNumber] = useState('');
  const [check, { data, error, isLoading, reset }] = useCheckEligibilityMutation();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (number.trim()) void check(number);
  };
  return (
    <Panel title="Check eligibility">
      <p className="mt-0 mb-3 text-[13px] text-ink-muted">
        Type the number the way it is on the card or the way the patient says it: W-26-102-004573-6 or 261020045736 for the worker,
        W-26-102-004573-6/02 or 26102004573602 for a family member, or a 13-digit CNIC.
      </p>
      <form className="flex flex-wrap gap-3" onSubmit={submit}>
        <input
          aria-label="Worker number or CNIC"
          className={INPUT + ' flex-1 min-w-[220px] max-w-[420px] font-mono'}
          value={number}
          onChange={(e) => { setNumber(e.target.value); reset(); }}
          placeholder="W-26-102-004573-6 or 261020045736"
        />
        <button className={BTN} disabled={isLoading || !number.trim()}>
          {isLoading ? 'Checking…' : 'Check'}
        </button>
      </form>
      <div className="mt-4">
        <Alert kind="error" message={error ? errorMessage(error) : ''} />
        {data ? <EligibilityCard e={data} /> : null}
      </div>
    </Panel>
  );
}

function EligibilityCard({ e }: { e: Eligibility }) {
  const facts: [string, string | null][] = [
    ['Relation', e.relation], ['Father’s name', e.father_name], ['Gender', e.gender], ['Date of birth', e.date_of_birth ? formatDate(e.date_of_birth) : null],
    ['CNIC', e.cnic_masked], ['Last paid month', e.last_paid_month],
    ...(e.person === 'family member' ? ([['Worker', `${e.worker_name} (${e.worker_no})`]] as [string, string][]) : []),
  ];
  return (
    <div className={'rounded-xl border border-solid p-4 ' + (e.eligible ? 'border-[#9fd3b1] bg-[#f3faf5]' : 'border-[#f1b8b8] bg-[#fdf4f4]')}>
      <div className="flex flex-wrap items-center gap-4">
        <Avatar photo={e.photo} name={e.name} size={56} />
        <div className="min-w-0 flex-1">
          <div className="text-[18px] font-bold text-[#10331d]">{e.name}</div>
          <div className="font-mono text-[14px] font-semibold text-essi-green">
            {e.id} <span className="font-normal text-ink-muted">· {e.id_digits}</span>
          </div>
        </div>
        <span className={'rounded-full px-3 py-1 text-[13px] font-bold ' + (e.eligible ? 'bg-[#067a35] text-white' : 'bg-[#b00020] text-white')}>
          {e.eligible ? 'COVERED' : 'NOT COVERED'}
        </span>
      </div>
      <p className="mt-3 mb-3 text-[14px]">{e.reason}</p>
      <dl className="grid grid-cols-[repeat(auto-fill,minmax(min(180px,100%),1fr))] gap-x-6 gap-y-2 m-0">
        {facts.map(([l, v]) => (
          <div key={l}>
            <dt className="text-[12px] text-ink-muted">{l}</dt>
            <dd className="m-0 text-[14px] font-semibold break-words">{v || '—'}</dd>
          </div>
        ))}
      </dl>
      {e.employers.length ? (
        <p className="mt-3 mb-0 text-[13px]">
          Employed at: {e.employers.map((x) => `${x.name} (${x.ein ?? '—'})${x.since ? ' since ' + formatDate(x.since) : ''}`).join('; ')}
        </p>
      ) : null}
      {e.family.length ? (
        <div className="mt-3">
          <div className="text-[12px] text-ink-muted mb-1">Family members</div>
          <ul className="m-0 pl-5 text-[13px]">
            {e.family.map((m) => (
              <li key={m.id ?? m.name}>
                <span className="font-semibold">{m.name}</span> ({m.relation}) — <span className="font-mono">{m.id} · {m.id_digits}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function PartnerKeys() {
  const isAdmin = useAppSelector((s) => s.auth.admin?.role === 'admin');
  const { data = [], error, isLoading } = useGetPartnerKeysQuery();
  const [create, created] = useCreatePartnerKeyMutation();
  const [revoke, revoking] = useRevokePartnerKeyMutation();
  const [name, setName] = useState('');
  const [kind, setKind] = useState<PartnerKind>('HMIS');
  const [fresh, setFresh] = useState<PartnerKeyCreated | null>(null);
  const [copied, setCopied] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setCopied(false);
    try {
      setFresh(await create({ name: name.trim(), kind }).unwrap());
      setName('');
    } catch {
      /* shown from created.error */
    }
  };
  const copy = async () => {
    if (!fresh) return;
    try {
      await navigator.clipboard.writeText(fresh.key);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Panel title="API keys for hospital and pharmacy systems">
      <p className="mt-0 mb-3 text-[13px] text-ink-muted">
        Each system gets its own key. It sends the key in the <code>X-API-Key</code> header and asks{' '}
        <code>GET /api/v1/eligibility/&lt;number&gt;</code> (either form of the number, or a CNIC). Every lookup is written to the audit trail.
      </p>
      {isAdmin ? (
        <form className="flex flex-wrap gap-3 mb-4" onSubmit={(e) => void submit(e)}>
          <input aria-label="Hospital, pharmacy or system name" className={INPUT + ' flex-1 min-w-[220px] max-w-[380px]'} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Civil Hospital Karachi – HMIS" />
          <FilterSelect label="Type" value={kind} onChange={(v) => setKind(v as PartnerKind)} options={KINDS.map((k) => [k, k])} />
          <button className={BTN} disabled={created.isLoading || name.trim().length < 2}>
            {created.isLoading ? 'Issuing…' : 'Issue key'}
          </button>
        </form>
      ) : (
        <p className="mb-4 text-[13px]">Only an ESSI administrator can issue or revoke keys.</p>
      )}
      <Alert kind="error" message={created.error ? errorMessage(created.error) : revoking.error ? errorMessage(revoking.error) : error ? errorMessage(error) : ''} />
      {fresh ? (
        <div className="mb-4 rounded-xl border border-solid border-[#f0c36d] bg-[#fff8e6] p-4">
          <div className="text-[14px] font-semibold mb-1">Key for {fresh.name}. Copy it now: it will not be shown again.</div>
          <div className="flex flex-wrap items-center gap-3">
            <code className="break-all text-[13px] bg-white px-2 py-1 rounded border border-solid border-[#eadfb8]">{fresh.key}</code>
            <button type="button" className={BTN_GHOST} onClick={() => void copy()}>
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button type="button" className={BTN_GHOST} onClick={() => setFresh(null)}>
              Done
            </button>
          </div>
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className={TABLE + ' min-w-[760px]'}>
          <thead>
            <tr>
              {['System', 'Type', 'Key', 'Issued', 'Last used', 'Status', ''].map((h) => (
                <th key={h} className={TH}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((k) => (
              <tr key={k.id}>
                <td className={TD + ' font-semibold'}>{k.name}</td>
                <td className={TD}>{k.kind}</td>
                <td className={TD + ' font-mono text-[13px]'}>{k.key_prefix}…</td>
                <td className={TD + ' text-[13px]'}>
                  {formatDate(k.created_at)} <span className="text-ink-muted">by {k.created_by}</span>
                </td>
                <td className={TD + ' text-[13px]'}>{k.last_used_at ? formatDateTime(k.last_used_at) : 'Never'}</td>
                <td className={TD}>
                  <Badge status={k.active ? 'Active' : 'Revoked'} />
                </td>
                <td className={TD + ' text-right'}>
                  {isAdmin && k.active ? (
                    <button
                      className={BTN_GHOST}
                      disabled={revoking.isLoading}
                      onClick={() => {
                        if (window.confirm(`Revoke the key of ${k.name}? Their system will stop getting answers at once.`)) void revoke(k.id);
                      }}
                    >
                      Revoke
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data.length && !isLoading ? <Empty>No keys issued yet.</Empty> : null}
      </div>
    </Panel>
  );
}
