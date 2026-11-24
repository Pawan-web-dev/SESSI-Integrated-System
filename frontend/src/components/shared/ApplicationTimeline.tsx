import type { Application } from '@/services/api/types';
import { formatDateTime } from '@/utils/format';

const STATE_CLASS = { done: 'done', current: 'cur', stopped: 'bad', waiting: '' } as const;
const STATE_TAG = { done: 'Completed', current: 'In progress', stopped: 'Stopped here', waiting: 'Waiting' } as const;

/**
 * Progress of a registration application: the four review stages and the activity log (newest first).
 * Used on the application-submitted page, the "Track my application" dialog and the admin review.
 */
export function ApplicationTimeline({ application }: { application: Application }) {
  const events = application.events;
  const last = events[0];

  return (
    <>
      <ol className="tl">
        {application.stages.map((stage, i) => (
          <li key={stage.title} className={'tl-i ' + STATE_CLASS[stage.state]}>
            <span className="tl-dot">{stage.state === 'done' ? '✓' : stage.state === 'stopped' ? '!' : i + 1}</span>
            <div>
              <span className="tl-t">{stage.title}</span>
              <span className="tl-tag">{STATE_TAG[stage.state]}</span>
              <div className="tl-d">{stage.description}</div>
            </div>
          </li>
        ))}
      </ol>
      <div className="tl-log">
        <h4>
          Activity log <span className="font-normal text-[#5b6b60]">{'(last updated ' + (last ? formatDateTime(last.at) : '-') + ')'}</span>
        </h4>
        {events.map((e, i) => (
          <div key={i} className="tl-ev">
            <b>{e.label}</b>
            {' — ' + formatDateTime(e.at)}
            {e.note ? <small>{e.note}</small> : null}
          </div>
        ))}
      </div>
    </>
  );
}
