/* Registration – verify mobile number and email (OTP) (markup taken from the approved design). */
import type { ViewProps } from '@/types/view';

export function VerifyContactStep({ v }: ViewProps) {
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
            {"Verify your contact details"}
          </div>
          <div className="flex-1 h-[2px] bg-essi-green opacity-[.7]">
          </div>
        </div>
        <div className="bg-[#eef6fb] border border-solid border-[#b9d3f0] rounded-lg py-3 px-4 text-[14px] text-[#0b3d91] mb-4.5">
          {"We sent a 6-digit code by SMS to "}
          <b>
            {v.v_am}
          </b>
          {" and a verification code to "}
          <b>
            {v.v_ae}
          </b>
          {". The codes are valid for 10 minutes."}
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-y-4.5 gap-x-7">
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"otpM"} className="font-semibold text-ink">
              {"SMS code "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <input id={"otpM"} type={"text"} placeholder={"6-digit code"} value={v.v_otpM} onChange={v.h_otpM} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"otpE"} className="font-semibold text-ink">
              {"Email code "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <input id={"otpE"} type={"text"} placeholder={"6-digit code"} value={v.v_otpE} onChange={v.h_otpE} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
          </div>
        </div>
        <div className="mt-3 text-[13px]">
          <button onClick={v.resend} className="min-h-[44px] border-0 bg-transparent text-essi-green font-semibold underline">
            {"Resend codes"}
          </button>
          {" "}
          <span className="text-ink-muted">
            {v.resendMsg}
          </span>
        </div>
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
              <path d={"M5 12h14M13 6l6 6-6 6"}>
              </path>
            </svg>
            {"Verify and continue"}
          </button>
        </div>
      </div>
    </>
  );
}
