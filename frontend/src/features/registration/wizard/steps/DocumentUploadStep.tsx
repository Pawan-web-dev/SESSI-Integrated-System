/* Registration step 2 – document upload (markup taken from the approved design). */
import React from 'react';
import type { Any, ViewProps } from '@/types/view';

export function DocumentUploadStep({ v }: ViewProps) {
  return (
    <>
      <div>
        <div className="flex items-center gap-3 mb-4.5">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-essi-mint flex items-center justify-center">
            <svg width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M7 3h8l4 4v14H7zM15 3v4h4M10 12h6M10 16h3"}>
              </path>
            </svg>
          </div>
          <div className="text-[22px] font-bold text-essi-dark">
            {"Document Upload"}
          </div>
          <div className="flex-1 h-[2px] bg-essi-green opacity-[.7]">
          </div>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-2.5 mb-3">
          <div className="text-[13px] text-ink-soft">
            {"Upload the following documents in PDF, JPG or PNG format (max size 5 MB each). Fields marked * are required."}
          </div>
          <button onClick={v.sampleDocs} className="min-h-[44px] py-0 px-3.5 border border-dashed border-essi-green rounded-lg bg-white text-essi-green font-semibold text-[13px]">
            {"Use sample documents (demo)"}
          </button>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(170px,100%),1fr))] gap-3">
          {(v.docTiles || []).map((d: Any, _i2: number) => (<React.Fragment key={_i2}>
            <label className="relative flex flex-col items-center justify-center gap-1.5 min-h-[96px] p-2.5 rounded-lg text-center text-[13px] cursor-pointer" style={{border: `1px solid ${d.bc}`, background: d.bg}}>
              <svg width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"} stroke={d.ic} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                <path d={"M7 18a4 4 0 01-.5-8A6 6 0 0118 8.5 4.5 4.5 0 0117.5 18M12 12v7M9 15l3-3 3 3"}>
                </path>
              </svg>
              <span className="font-semibold">
                {d.label}
              </span>
              <span className="text-[11px] wrap-anywhere" style={{color: d.sc}}>
                {d.sub}
              </span>
              <input type={"file"} accept={".pdf,.jpg,.jpeg,.png"} onChange={d.pick} className="absolute left-0 top-0 w-full h-full opacity-[0] cursor-pointer" />
            </label>
          </React.Fragment>))}
        </div>
        {v.hasErr ? (<>
          <div role={"alert"} className="mt-4 text-danger text-[14px] bg-danger-bg border border-solid border-[#f3b9b3] rounded-lg py-2.5 px-3.5">
            {v.err}
          </div>
        </>) : null}
        <div className="mt-5.5 pt-4 border-t border-t-essi-mint flex flex-wrap gap-3 justify-between">
          <div>
            <button onClick={v.back} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-6 rounded-lg text-[15px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                <path d={"M15 6l-6 6 6 6"}>
                </path>
              </svg>
              {"Back"}
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={v.reset} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-6 rounded-lg text-[15px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                <path d={"M20 11a8 8 0 10-2.3 6M20 4v7h-7"}>
                </path>
              </svg>
              {"Reset"}
            </button>
            <button onClick={v.next} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-6 rounded-lg text-[15px] font-semibold bg-essi-dark text-white border-0">
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                <path d={"M5 12h14M13 6l6 6-6 6"}>
                </path>
              </svg>
              {"Next"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
