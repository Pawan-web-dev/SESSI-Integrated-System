/* Registration – application submitted (markup taken from the approved design). */
import React from 'react';
import type { Any, ViewProps } from '@/types/view';

export function SubmittedStep({ v }: ViewProps) {
  return (
    <>
      <div className="text-center">
        <div className="w-[110px] h-[110px] rounded-[50%] bg-essi-tint mt-0 mx-auto mb-3.5 flex items-center justify-center">
          <svg width={"56"} height={"56"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
            <path d={"M5 12l5 5 9-10"}>
            </path>
          </svg>
        </div>
        <h2 className="m-0 text-essi-deep [font-size:clamp(22px,3vw,30px)]">
          {"Application submitted"}
        </h2>
        <p className="mt-2.5 mx-auto mb-0 max-w-[560px] text-[16px] text-[#25324a]">
          {"Thank you. Your registration is now with ESSI for verification. We sent the details to "}
          <b>
            {v.v_ae}
          </b>
          {" and "}
          <b>
            {v.v_am}
          </b>
          {"."}
        </p>
        <div className="inline-block mt-4 bg-essi-mint border border-solid border-essi-line rounded-[10px] py-3 px-6">
          <div className="text-[12px] text-ink-muted">
            {"Application number"}
          </div>
          <div className="text-[22px] font-bold text-essi-dark">
            {v.appNo}
          </div>
        </div>
        <div className="max-w-[620px] mt-5.5 mx-auto mb-0 text-left border border-solid border-essi-line rounded-[10px] py-2 px-4.5">
          <div className="font-bold py-2 px-0 text-essi-dark">
            {"What happens next"}
          </div>
          {(v.timeline || []).map((t: Any, _i4: number) => (<React.Fragment key={_i4}>
            <div className="flex gap-3 py-2.5 px-0 border-t border-t-essi-mint">
              <div className="w-[28px] h-[28px] rounded-[50%] flex items-center justify-center font-bold flex-none" style={{background: t.bg, color: t.fg}}>
                {t.mark}
              </div>
              <div>
                <div className="font-semibold">
                  {t.title}
                </div>
                <div className="text-[13px] text-ink-muted">
                  {t.sub}
                </div>
              </div>
            </div>
          </React.Fragment>))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3 justify-center">
          <button onClick={v.newApp} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-6 rounded-lg text-[15px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
            {"Start a new application"}
          </button>
        </div>
      </div>
    </>
  );
}
