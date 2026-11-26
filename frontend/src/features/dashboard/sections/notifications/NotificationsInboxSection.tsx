/* Employer dashboard – Notifications > Inbox (markup taken from the approved design). */
import React from 'react';
import type { Any, ViewProps } from '@/types/view';

export function NotificationsInboxSection({ v }: ViewProps) {
  return (
    <>
      <div className="mt-4">
        <div className="bg-essi-green text-white py-2.5 px-5 rounded-lg text-[16px] font-semibold flex items-center gap-3">
          <span className="flex-1">{"NOTIFICATIONS"}</span>
          {v.unreadCount > 0 ? (<button onClick={v.markAllRead} className="bg-transparent border border-solid border-white/70 text-white rounded-md text-[13px] py-1 px-3 cursor-pointer">
            {"Mark all as read"}
          </button>) : null}
        </div>
        <div className="bg-white border border-solid border-essi-line rounded-[10px] mt-3.5">
          {(v.notifRows || []).map((n: Any, _i16: number) => (<React.Fragment key={_i16}>
            <div onClick={n.open} className={'flex gap-3 items-start py-3.5 px-4 border-b border-b-essi-mint' + (n.unread ? ' bg-essi-mint/40 cursor-pointer font-semibold' : '')}>
              <span className="w-[10px] h-[10px] rounded-[50%] mt-1.5 flex-none" style={{background: n.dot}}>
              </span>
              <div className="flex-1 min-w-0 text-[14px]">
                <div>
                  {n.text}
                </div>
                <div className="text-[12px] text-ink-muted mt-1">
                  {n.time}
                </div>
              </div>
              {n.hasAct ? (<>
                <button onClick={v.goChallan} className="min-h-[44px] py-0 px-3.5 border border-solid border-essi-green rounded-md bg-white text-essi-green flex-none">
                  {"View Challan"}
                </button>
              </>) : null}
            </div>
          </React.Fragment>))}
          {(v.notifRows || []).length === 0 ? (<div className="py-6 px-4 text-[14px] text-ink-muted text-center">{"No notifications yet."}</div>) : null}
        </div>
        <div className="mt-4.5">
          <button onClick={v.goHome} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-5 rounded-lg text-[14px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M15 6l-6 6 6 6"}>
              </path>
            </svg>
            {"Back to Dashboard"}
          </button>
        </div>
      </div>
    </>
  );
}
