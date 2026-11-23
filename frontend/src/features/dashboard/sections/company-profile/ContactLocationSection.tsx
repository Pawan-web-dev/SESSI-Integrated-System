/* Employer dashboard – Company Profile > Contact & Location (markup taken from the approved design). */
import type { ViewProps } from '@/types/view';

export function ContactLocationSection({ v, P }: ViewProps) {
  return (
    <>
      <div className="mt-4">
        <div className="bg-essi-green text-white py-2.5 px-5 rounded-lg text-[16px] font-semibold">
          {"COMPANY PROFILE - CONTACT & LOCATION"}
        </div>
        <div className="bg-white border border-solid border-essi-line rounded-[10px] mt-3.5 p-4 flex flex-wrap items-center gap-y-3.5 gap-x-5">
          <div className="w-[56px] h-[56px] rounded-xl bg-essi-mint flex items-center justify-center">
            <svg width={"30"} height={"30"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M3 8h18v12H3zM9 8V5h6v3M3 13h18"}>
              </path>
            </svg>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="text-[20px] font-bold">
              {v.co.employer}
            </div>
            <div className="text-[13px] text-ink-soft mt-1">
              {"Employer Registration No. "}{P.empNo}{"  |  "}{P.dir}{"  |  Registered on 12-Oct-2026 (sample)"}
            </div>
          </div>
          <span className="bg-essi-tint text-essi-dark rounded-[14px] py-1 px-3.5 text-[13px] font-bold">
            {"Approved Employer"}
          </span>
        </div>
        <div className="bg-white border border-solid border-essi-line rounded-[10px] mt-3.5 overflow-hidden">
          <div className="flex items-center gap-2.5 py-3.5 px-4 border-b border-b-essi-line font-bold text-[16px] text-essi-dark">
            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 3.6-6 8-6s8 2 8 6"}>
              </path>
            </svg>
            {"Contact Person (POC)"}
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))]">
            <div className="py-3 px-4 border-b border-b-essi-mint">
              <div className="text-[12px] text-ink-muted">
                {"Contact Person"}
              </div>
              <div className="text-[15px] font-semibold mt-0.75 wrap-anywhere">
                {v.co.person}
              </div>
            </div>
            <div className="py-3 px-4 border-b border-b-essi-mint">
              <div className="text-[12px] text-ink-muted">
                {"Designation"}
              </div>
              <div className="text-[15px] font-semibold mt-0.75 wrap-anywhere">
                {v.co.desig}
              </div>
            </div>
            <div className="py-3 px-4 border-b border-b-essi-mint">
              <div className="text-[12px] text-ink-muted">
                {"Mobile No."}
              </div>
              <div className="text-[15px] font-semibold mt-0.75 wrap-anywhere">
                {v.co.mobile}
              </div>
            </div>
            <div className="py-3 px-4 border-b border-b-essi-mint">
              <div className="text-[12px] text-ink-muted">
                {"Email Address"}
              </div>
              <div className="text-[15px] font-semibold mt-0.75 wrap-anywhere">
                {v.co.email}
              </div>
            </div>
            <div className="py-3 px-4 border-b border-b-essi-mint">
              <div className="text-[12px] text-ink-muted">
                {"Office Phone"}
              </div>
              <div className="text-[15px] font-semibold mt-0.75 wrap-anywhere">
                {v.co.phone}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 py-3.5 px-4 border-b border-b-essi-line font-bold text-[16px] text-essi-dark">
            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12zM12 11a2 2 0 100-4 2 2 0 000 4z"}>
              </path>
            </svg>
            {"Location"}
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))]">
            <div className="py-3 px-4 border-b border-b-essi-mint">
              <div className="text-[12px] text-ink-muted">
                {"Business Address"}
              </div>
              <div className="text-[15px] font-semibold mt-0.75 wrap-anywhere">
                {v.co.addr}
              </div>
            </div>
            <div className="py-3 px-4 border-b border-b-essi-mint">
              <div className="text-[12px] text-ink-muted">
                {"Province / District"}
              </div>
              <div className="text-[15px] font-semibold mt-0.75 wrap-anywhere">
                {v.co.province}{" / "}{v.co.district}
              </div>
            </div>
            <div className="py-3 px-4 border-b border-b-essi-mint">
              <div className="text-[12px] text-ink-muted">
                {"GPS Location"}
              </div>
              <div className="text-[15px] font-semibold mt-0.75 wrap-anywhere">
                {v.co.gps}
              </div>
            </div>
            <div className="py-3 px-4 border-b border-b-essi-mint">
              <div className="text-[12px] text-ink-muted">
                {"ESSI Directorate"}
              </div>
              <div className="text-[15px] font-semibold mt-0.75 wrap-anywhere">
                {P.dir}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3.5 flex flex-wrap gap-2.5">
          <button onClick={v.goCRF} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-5 rounded-lg text-[14px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M4 20h4L19 9l-4-4L4 16z"}>
              </path>
            </svg>
            {"Request Change"}
          </button>
        </div>
        <div className="text-[13px] text-ink-muted mt-3">
          {"Registered details can only be changed through a change request that ESSI reviews. All values shown are sample data."}
        </div>
      </div>
    </>
  );
}
