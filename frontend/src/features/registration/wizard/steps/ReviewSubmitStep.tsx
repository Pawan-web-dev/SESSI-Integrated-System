/* Registration step 4 – review & submit (markup taken from the approved design). */
import React from 'react';
import type { Any, ViewProps } from '@/types/view';

export function ReviewSubmitStep({ v }: ViewProps) {
  return (
    <>
      <div>
        <div className="flex items-center gap-3 mb-4.5">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-essi-mint flex items-center justify-center">
            <svg width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M5 12l5 5 9-10"}>
              </path>
            </svg>
          </div>
          <div className="text-[22px] font-bold text-essi-dark">
            {"Review & Submit"}
          </div>
          <div className="flex-1 h-[2px] bg-essi-green opacity-[.7]">
          </div>
        </div>
        <p className="mt-0 mx-0 mb-3 text-[14px] text-ink-soft">
          {"Check everything before you submit. After submission you cannot edit the application; ESSI will contact you if anything needs correction."}
        </p>
        <div className="border border-solid border-essi-line rounded-[10px] overflow-hidden">
          {(v.summary || []).map((r: Any, _i3: number) => (<React.Fragment key={_i3}>
            <div className="flex flex-wrap gap-y-1 gap-x-4 py-2.5 px-4 border-b border-b-essi-mint text-[14px]" style={{background: r.bg}}>
              <span className="w-[230px] max-w-full text-ink-muted">
                {r.l}
              </span>
              <span className="flex-1 min-w-[160px] font-semibold wrap-anywhere">
                {r.v}
              </span>
            </div>
          </React.Fragment>))}
        </div>
        <label className="flex gap-2.5 items-start mt-4.5 text-[14px] min-h-[44px]">
          <input type={"checkbox"} checked={!!v.v_decl} onChange={v.h_decl} className="mt-1" />
          {" I declare that the information and documents provided are correct and I accept the terms of registration under the Sindh Employees’ Social Security Act, 2016."}
        </label>
        {v.hasErr ? (<>
          <div role={"alert"} className="mt-4 text-danger text-[14px] bg-danger-bg border border-solid border-[#f3b9b3] rounded-lg py-2.5 px-3.5">
            {v.err}
          </div>
        </>) : null}
        <div className="mt-5.5 flex flex-wrap gap-3 justify-between">
          <button onClick={v.back} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-6 rounded-lg text-[15px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M15 6l-6 6 6 6"}>
              </path>
            </svg>
            {"Back"}
          </button>
          <button onClick={v.next} disabled={v.busy} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-6 rounded-lg text-[15px] font-semibold bg-essi-dark text-white border-0">
            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M5 12l5 5 9-10"}>
              </path>
            </svg>
            {"Submit application"}
          </button>
        </div>
      </div>
    </>
  );
}
