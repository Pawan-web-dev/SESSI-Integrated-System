/* Employer dashboard – Monthly Contributions > Submitted (markup taken from the approved design). */
import type { ViewProps } from '@/types/view';

export function ContributionSubmittedSection({ v }: ViewProps) {
  return (
    <>
      <div className="mt-4">
        <div className="bg-white border border-solid border-essi-line rounded-xl py-8 px-5 text-center">
          <div className="w-[120px] h-[120px] rounded-[50%] bg-essi-tint mt-0 mx-auto mb-4 flex items-center justify-center">
            <svg width={"56"} height={"56"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M7 3h8l4 4v14H7zM15 3v4h4M10 12h6M10 16h3"}>
              </path>
            </svg>
          </div>
          <h2 className="m-0 text-essi-deep [font-size:clamp(22px,3vw,30px)]">
            {"Contribution Submitted Successfully!"}
          </h2>
          <p className="mt-2.5 mx-auto mb-0 max-w-[560px] text-[16px] text-[#25324a]">
            {"Your contribution has been submitted and is now pending for approval by the ESSI Sindh team."}
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-2.5 mt-6 mx-0 mb-0 bg-essi-mint border border-solid border-essi-line rounded-[10px] p-3.5 text-left">
            <div className="flex gap-2.5 items-start py-1.5 px-2.5">
              <svg width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                <path d={"M4 6h16v14H4zM4 11h16M8 3v4M16 3v4"}>
                </path>
              </svg>
              <div>
                <div className="text-[14px] text-ink-soft">
                  {"Contribution Month"}
                </div>
                <div className="text-[18px] font-bold mt-1">
                  {"November, 2026"}
                </div>
              </div>
            </div>
            <div className="flex gap-2.5 items-start py-1.5 px-2.5">
              <svg width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                <path d={"M7 3h8l4 4v14H7zM15 3v4h4M10 12h6M10 16h3"}>
                </path>
              </svg>
              <div>
                <div className="text-[14px] text-ink-soft">
                  {"Submission Reference No."}
                </div>
                <div className="text-[18px] font-bold mt-1">
                  {"CNTR-2026-00123"}
                </div>
              </div>
            </div>
            <div className="flex gap-2.5 items-start py-1.5 px-2.5">
              <svg width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                <path d={"M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2"}>
                </path>
              </svg>
              <div>
                <div className="text-[14px] text-ink-soft">
                  {"Submission Date & Time"}
                </div>
                <div className="text-[18px] font-bold mt-1">
                  {"17-Nov-2026 10:45 AM"}
                </div>
              </div>
            </div>
            <div className="flex gap-2.5 items-start py-1.5 px-2.5">
              <svg width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                <path d={"M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"}>
                </path>
              </svg>
              <div>
                <div className="text-[14px] text-ink-soft">
                  {"Current Status"}
                </div>
                <div className="text-[18px] font-bold mt-1">
                  <span className="inline-block bg-[#9fe3b3] text-essi-dark rounded-[14px] py-0.75 px-3 text-[13px] font-semibold">
                    {"Pending for Approval"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="inline-flex items-center gap-2.5 mt-5 bg-[#e8f1fb] border border-solid border-[#b9d3f0] rounded-[10px] py-3.5 px-5.5 text-[#0b3d91] font-semibold text-[15px]">
            <svg width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6fd0"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v5M12 8h.01"}>
              </path>
            </svg>
            {"You will be notified once your contribution is approved."}
          </div>
          <div className="mt-4.5">
            <button onClick={v.goHome} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-7 border border-solid border-essi-green rounded-lg bg-white text-essi-green text-[15px] font-semibold">
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                <path d={"M15 6l-6 6 6 6"}>
                </path>
              </svg>
              {"Back to Dashboard"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
