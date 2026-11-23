import { completedStages, EVENT_LABELS, getTrack, REVIEW_STAGES, type Account } from '@/services/portal';

/**
 * Progress of a registration application: the four review stages and the activity log.
 * Used on the application-submitted page, the "Track my application" dialog and the admin review.
 */
export function ApplicationTimeline({ application }: { application: Account }) {
  const status = application.status || 'approved';
  const done = completedStages(application);
  const rejected = status === 'rejected';
  const events = getTrack(application);
  const last = events[events.length - 1];

  return (
    <>
      <ol className="tl">
        {REVIEW_STAGES.map(([title, description], i) => {
          const cls = i < done ? 'done' : i === done ? (rejected ? 'bad' : 'cur') : '';
          const tag = i < done ? 'Completed' : i === done ? (rejected ? 'Stopped here' : 'In progress') : 'Waiting';
          return (
            <li key={i} className={'tl-i ' + cls}>
              <span className="tl-dot">{i < done ? '✓' : rejected && i === done ? '!' : i + 1}</span>
              <div>
                <span className="tl-t">{title}</span>
                <span className="tl-tag">{tag}</span>
                <div className="tl-d">{description}</div>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="tl-log">
        <h4>
          Activity log <span className="font-normal text-[#5b6b60]">{'(last updated ' + (last.t || '-') + ')'}</span>
        </h4>
        {events
          .slice()
          .reverse()
          .map((e, i) => (
            <div key={i} className="tl-ev">
              <b>{EVENT_LABELS[e.s] || e.s}</b>
              {' — ' + e.t}
              {e.n ? <small>{e.n}</small> : null}
            </div>
          ))}
      </div>
    </>
  );
}
