import type { OutboxMessage } from '@/services/portal';

/** One SMS / email message in the demo inbox. */
export function MessageCard({ message: m }: { message: OutboxMessage }) {
  return (
    <div className="panel mt-3.5">
      <div className="flex justify-between gap-2.5 flex-wrap text-[13px] text-ink-muted">
        <span>
          To: <b>{m.mobile}</b> (SMS) · <b>{m.email}</b> (email)
        </span>
        <span>{m.t}</span>
      </div>
      <h3 className="mt-2 mx-0 mb-1">{m.subject}</h3>
      <div className="text-[15px] leading-[1.5]">{m.body}</div>
    </div>
  );
}
