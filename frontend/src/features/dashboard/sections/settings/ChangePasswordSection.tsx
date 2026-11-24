/* Employer dashboard – Settings > Change Password (markup taken from the approved design). */
import type { ViewProps } from '@/types/view';

export function ChangePasswordSection({ v }: ViewProps) {
  return (
    <>
      <div className="mt-4">
        <div className="bg-essi-green text-white py-2.5 px-5 rounded-lg text-[16px] font-semibold">
          {"SETTINGS - CHANGE PASSWORD"}
        </div>
        {v.pwDone ? (<>
          <div className="bg-white border border-solid border-essi-line rounded-[10px] mt-3.5 py-8 px-4 text-center">
            <div className="w-[84px] h-[84px] rounded-[50%] bg-essi-tint mt-0 mx-auto mb-3 flex items-center justify-center">
              <svg width={"44"} height={"44"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                <path d={"M5 12l5 5 9-10"}>
                </path>
              </svg>
            </div>
            <div className="font-bold text-[20px] text-essi-dark">
              {"Password updated"}
            </div>
            <p className="text-ink-soft text-[14px] mt-2 mx-0 mb-4">
              {"Your new password is active. Use it the next time you log in."}
            </p>
            <button onClick={v.pwAgain} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-5 rounded-lg text-[14px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
              {"Change again"}
            </button>
          </div>
        </>) : null}
        {v.pwForm ? (<>
          <div className="bg-white border border-solid border-essi-line rounded-[10px] mt-3.5 p-5 max-w-[560px]">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 text-[13px]">
                <label htmlFor={"pw1"}>
                  {"Current Password "}
                  <span className="text-[#c00]">
                    {"*"}
                  </span>
                </label>
                <input id={"pw1"} type={"password"} autoComplete={"off"} onChange={v.in_pc} className="py-0 px-2.5 min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white" />
              </div>
              <div className="flex flex-col gap-1.5 text-[13px]">
                <label htmlFor={"pw2"}>
                  {"New Password "}
                  <span className="text-[#c00]">
                    {"*"}
                  </span>
                </label>
                <input id={"pw2"} type={"password"} autoComplete={"off"} onChange={v.in_pn} className="py-0 px-2.5 min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white" />
              </div>
              <div className="flex flex-col gap-1.5 text-[13px]">
                <label htmlFor={"pw3"}>
                  {"Confirm New Password "}
                  <span className="text-[#c00]">
                    {"*"}
                  </span>
                </label>
                <input id={"pw3"} type={"password"} autoComplete={"off"} onChange={v.in_pf2} className="py-0 px-2.5 min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white" />
              </div>
            </div>
            <div className="text-[13px] text-ink-soft mt-3">
              {"Use at least 8 characters, with one capital letter and one number."}
            </div>
            {v.hasPwErr ? (<>
              <div role={"alert"} className="text-danger text-[14px] mt-3">
                {v.pwErr}
              </div>
            </>) : null}
            <div className="mt-4 flex flex-wrap gap-2.5">
              <button onClick={v.updatePw} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-5 rounded-lg text-[14px] font-semibold bg-essi-dark text-white border-0">
                {"Update Password"}
              </button>
            </div>
          </div>
        </>) : null}
      </div>
    </>
  );
}
