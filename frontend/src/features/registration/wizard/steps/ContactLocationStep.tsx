/* Registration step 3 – contact & location (markup taken from the approved design). */
import type { ViewProps } from '@/types/view';

export function ContactLocationStep({ v }: ViewProps) {
  return (
    <>
      <div>
        <div className="flex items-center gap-3 mb-4.5">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-essi-mint flex items-center justify-center">
            <svg width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12zM12 11a2 2 0 100-4 2 2 0 000 4z"}>
              </path>
            </svg>
          </div>
          <div className="text-[22px] font-bold text-essi-dark">
            {"Contact & Location"}
          </div>
          <div className="flex-1 h-[2px] bg-essi-green opacity-[.7]">
          </div>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-y-4.5 gap-x-7">
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"pn"} className="font-semibold text-ink">
              {"Contact person (POC) "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <input id={"pn"} type={"text"} placeholder={"Full name"} value={v.v_pn} onChange={v.h_pn} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"pd"} className="font-semibold text-ink">
              {"Designation "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <input id={"pd"} type={"text"} placeholder={"e.g. Accounts Manager"} value={v.v_pd} onChange={v.h_pd} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"pm"} className="font-semibold text-ink">
              {"Mobile number "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <input id={"pm"} type={"text"} placeholder={"03XX-XXXXXXX"} value={v.v_pm} onChange={v.h_pm} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"pe"} className="font-semibold text-ink">
              {"Email address "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <input id={"pe"} type={"email"} placeholder={"name@company.com"} value={v.v_pe} onChange={v.h_pe} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"ph"} className="font-semibold text-ink">
              {"Office phone"}
            </label>
            <input id={"ph"} type={"text"} placeholder={"021-XXXXXXXX"} value={v.v_ph} onChange={v.h_ph} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"wk"} className="font-semibold text-ink">
              {"Expected number of workers "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <input id={"wk"} type={"number"} placeholder={"e.g. 48"} value={v.v_wk} onChange={v.h_wk} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"st"} className="font-semibold text-ink">
              {"Date operations started "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <input id={"st"} type={"text"} placeholder={"DD/MM/YYYY"} value={v.v_st} onChange={v.h_st} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label className="font-semibold text-ink">
              {"ESSI Directorate"}
            </label>
            <input type={"text"} readOnly value={v.directorate} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full font-[inherit] bg-[#f1f1f1]" />
            <span className="text-[12px] text-ink-muted">
              {"Assigned automatically from the district."}
            </span>
          </div>
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
            <button onClick={v.next} disabled={v.busy} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-6 rounded-lg text-[15px] font-semibold bg-essi-dark text-white border-0">
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
