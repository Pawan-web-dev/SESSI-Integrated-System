/* Employer dashboard – Company Profile > Request Details (markup taken from the approved design). */
import React from 'react';
import type { Any, ViewProps } from '@/types/view';

export function ChangeRequestDetailsSection({ v }: ViewProps) {
  return (
    <>
      <div className="mt-4">
        <div className="bg-essi-green text-white py-2.5 px-5 rounded-lg text-[16px] font-semibold">
          {"CHANGE REQUEST DETAILS"}
        </div>
        {v.noCr ? (<>
          <div className="bg-white border border-solid border-essi-line rounded-[10px] mt-3.5 p-6 text-ink-muted">
            {"No request selected."}
          </div>
        </>) : null}
        {v.hasD ? (<>
          <div>
            <div className="bg-white border border-solid border-essi-line rounded-[10px] mt-3.5 overflow-hidden">
              <div className="flex flex-wrap justify-between items-center gap-2.5 py-3.5 px-4 border-b border-b-essi-line">
                <b className="text-[16px]">
                  {v.d.ref}
                </b>
                <span className="font-bold" style={{color: v.d.col}}>
                  {v.d.status}
                </span>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))]">
                <div className="py-3 px-4 border-b border-b-essi-mint">
                  <div className="text-[12px] text-ink-muted">
                    {"Field"}
                  </div>
                  <div className="text-[15px] font-semibold mt-0.75 wrap-anywhere">
                    {v.d.label}
                  </div>
                </div>
                <div className="py-3 px-4 border-b border-b-essi-mint">
                  <div className="text-[12px] text-ink-muted">
                    {"Submitted"}
                  </div>
                  <div className="text-[15px] font-semibold mt-0.75 wrap-anywhere">
                    {v.d.submitted}{" by "}{v.d.by}
                  </div>
                </div>
                <div className="py-3 px-4 border-b border-b-essi-mint">
                  <div className="text-[12px] text-ink-muted">
                    {"Current value"}
                  </div>
                  <div className="text-[15px] font-semibold mt-0.75 wrap-anywhere">
                    {v.d.oldVal}
                  </div>
                </div>
                <div className="py-3 px-4 border-b border-b-essi-mint">
                  <div className="text-[12px] text-ink-muted">
                    {"Requested value"}
                  </div>
                  <div className="text-[15px] font-semibold mt-0.75 wrap-anywhere">
                    {v.d.newVal}
                  </div>
                </div>
                <div className="py-3 px-4 border-b border-b-essi-mint">
                  <div className="text-[12px] text-ink-muted">
                    {"Reason"}
                  </div>
                  <div className="text-[15px] font-semibold mt-0.75 wrap-anywhere">
                    {v.d.reason}
                  </div>
                </div>
                <div className="py-3 px-4 border-b border-b-essi-mint">
                  <div className="text-[12px] text-ink-muted">
                    {"Supporting document"}
                  </div>
                  <div className="text-[15px] font-semibold mt-0.75 wrap-anywhere">
                    {v.d.doc}
                  </div>
                </div>
              </div>
              {v.d.hasRemarks ? (<>
                <div className="py-3 px-4 bg-danger-bg text-[#7a1b12] text-[14px]">
                  <b>
                    {"ESSI remarks:"}
                  </b>
                  {" "}{v.d.remarks}
                </div>
              </>) : null}
            </div>
            <div className="bg-white border border-solid border-essi-line rounded-[10px] mt-3.5 p-4">
              <div className="font-bold mb-2.5">
                {"Timeline"}
              </div>
              {(v.d.events || []).map((ev: Any, _i19: number) => (<React.Fragment key={_i19}>
                <div className="flex gap-2.5 py-2 px-0 border-t border-t-essi-mint text-[14px]">
                  <span className="text-ink-muted min-w-[140px]">
                    {ev.t}
                  </span>
                  <span className="flex-1">
                    {ev.text}
                  </span>
                </div>
              </React.Fragment>))}
            </div>
          </div>
        </>) : null}
        <div className="mt-4">
          <button onClick={v.goCRL} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-5 rounded-lg text-[14px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M15 6l-6 6 6 6"}>
              </path>
            </svg>
            {"Back to Change Requests"}
          </button>
        </div>
      </div>
    </>
  );
}
