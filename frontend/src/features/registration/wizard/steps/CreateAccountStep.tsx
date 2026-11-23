/* Registration – create account (applicant details + password) (markup taken from the approved design). */
import type { ViewProps } from '@/types/view';

export function CreateAccountStep({ v }: ViewProps) {
  return (
    <>
      <div>
        <div className="flex items-center gap-3 mb-4.5">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-essi-mint flex items-center justify-center">
            <svg width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M10 12a4 4 0 100-8 4 4 0 000 8zM3 21c0-4 3-6 7-6s7 2 7 6M19 8v6M16 11h6"}>
              </path>
            </svg>
          </div>
          <div className="text-[22px] font-bold text-essi-dark">
            {"Create your employer account"}
          </div>
          <div className="flex-1 h-[2px] bg-essi-green opacity-[.7]">
          </div>
        </div>
        <p className="mt-0 mx-0 mb-4.5 text-[14px] text-ink-soft">
          {"Step 1 of the process: tell us who is applying. We verify your mobile number and email before you fill in the business details."}
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-y-4.5 gap-x-7">
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"an"} className="font-semibold text-ink">
              {"Full name of authorized person "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <input id={"an"} type={"text"} placeholder={"As on CNIC"} value={v.v_an} onChange={v.h_an} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"ac"} className="font-semibold text-ink">
              {"CNIC number "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <input id={"ac"} type={"text"} placeholder={"00000-0000000-0"} value={v.v_ac} onChange={v.h_ac} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"am"} className="font-semibold text-ink">
              {"Mobile number "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <input id={"am"} type={"text"} placeholder={"03XX-XXXXXXX"} value={v.v_am} onChange={v.h_am} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"ae"} className="font-semibold text-ink">
              {"Email address "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <input id={"ae"} type={"email"} placeholder={"name@company.com"} value={v.v_ae} onChange={v.h_ae} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"ap"} className="font-semibold text-ink">
              {"Password "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <input id={"ap"} type={"password"} placeholder={"At least 8 characters"} value={v.v_ap} onChange={v.h_ap} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
            <span className="text-[12px] text-ink-muted">
              {"Use a capital letter and a number."}
            </span>
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"ap2"} className="font-semibold text-ink">
              {"Confirm password "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <input id={"ap2"} type={"password"} placeholder={"Repeat password"} value={v.v_ap2} onChange={v.h_ap2} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
          </div>
        </div>
        <label className="flex gap-2.5 items-start mt-4.5 text-[14px] min-h-[44px]">
          <input type={"checkbox"} checked={!!v.v_agree} onChange={v.h_agree} className="mt-1" />
          {" I confirm I am authorized to register this establishment and that the details I give are true."}
        </label>
        {v.hasErr ? (<>
          <div role={"alert"} className="mt-4 text-danger text-[14px] bg-danger-bg border border-solid border-[#f3b9b3] rounded-lg py-2.5 px-3.5">
            {v.err}
          </div>
        </>) : null}
        <div className="mt-5.5 flex justify-end">
          <button onClick={v.next} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-6 rounded-lg text-[15px] font-semibold bg-essi-dark text-white border-0">
            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M5 12h14M13 6l6 6-6 6"}>
              </path>
            </svg>
            {"Send verification codes"}
          </button>
        </div>
      </div>
    </>
  );
}
