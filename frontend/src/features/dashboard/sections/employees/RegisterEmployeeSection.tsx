/* Employer dashboard – Employee Management > Register / Edit Employee (markup taken from the approved design). */
import type { ViewProps } from '@/types/view';

export function RegisterEmployeeSection({ v }: ViewProps) {
  return (
    <>
      <div className="mt-4">
        <div className="bg-essi-green text-white py-2.5 px-5 rounded-lg text-[16px] font-semibold">
          {v.regTitle}
        </div>
        <div className="mt-3.5">
          <fieldset className="border border-solid border-essi-line rounded-lg pt-4 px-5 pb-5.5 mt-0 mx-0 mb-4.5 bg-white">
            <legend className="text-[18px] py-0 px-2 text-essi-dark">
              {"Personal Info"}
            </legend>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-4.5">
              <div className="flex flex-col gap-1.5 text-[13px]">
                <span>
                  {"Employee Photo"}
                </span>
                <div className="flex gap-3.5 items-center min-h-[44px]">
                  {v.hasFormPhoto ? (<>
                    <img src={v.formPhoto} alt={"Employee photo preview"} width={"72"} height={"72"} className="w-[72px] h-[72px] rounded-[50%] object-cover border-2 border-solid border-essi-green" />
                  </>) : null}
                  {v.noFormPhoto ? (<>
                    <svg width={"72"} height={"72"} viewBox={"0 0 44 44"} aria-hidden={"true"} className="rounded-[50%] flex-none">
                      <rect width={"44"} height={"44"} fill={"#d9d9d9"}>
                      </rect>
                      <circle cx={"22"} cy={"17"} r={"8"} fill={"#fff"}>
                      </circle>
                      <path d={"M6 44c0-10 7-14 16-14s16 4 16 14z"} fill={"#fff"}>
                      </path>
                    </svg>
                  </>) : null}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={"empPhoto"} className="inline-flex items-center justify-center min-h-[40px] py-0 px-3.5 border border-solid border-essi-green rounded-md text-essi-green font-semibold cursor-pointer bg-white">
                      {"Upload photo"}
                    </label>
                    <input id={"empPhoto"} type={"file"} accept={"image/png,image/jpeg,image/webp"} onChange={v.in_photo} className="absolute w-[1px] h-[1px] opacity-[0]" />
                    {v.hasFormPhoto ? (<>
                      <button type={"button"} onClick={v.rmPhoto} className="bg-transparent border-0 text-danger text-left p-0 text-[12px] cursor-pointer">
                        {"Remove photo"}
                      </button>
                    </>) : null}
                    <span className="text-[11px] text-ink-muted">
                      {"JPG, PNG or WebP, up to 5 MB"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 text-[13px]">
                <label htmlFor={"fn"}>
                  {"Full Name "}
                  <span className="text-[#c00]">
                    {"*"}
                  </span>
                </label>
                <input id={"fn"} onChange={v.in_fn} value={v.fv_fn} type={"text"} placeholder={"Enter full name"} className="py-0 px-2.5 min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white" />
              </div>
              <div className="flex flex-col gap-1.5 text-[13px]">
                <label htmlFor={"fa"}>
                  {"Father’s Name "}
                  <span className="text-[#c00]">
                    {"*"}
                  </span>
                </label>
                <input id={"fa"} onChange={v.in_fa} value={v.fv_fa} type={"text"} placeholder={"Enter father’s name"} className="py-0 px-2.5 min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white" />
              </div>
              <div className="flex flex-col gap-2.5 text-[13px]">
                <span>
                  {"Gender "}
                  <span className="text-[#c00]">
                    {"*"}
                  </span>
                </span>
                <div className="flex gap-4.5 min-h-[44px] items-center">
                  <label className="flex items-center gap-1.5 text-[13px]">
                    <input type={"radio"} name={"gender"} onChange={v.gM} checked={!!v.gcM} />
                    {" MALE"}
                  </label>
                  <label className="flex items-center gap-1.5 text-[13px]">
                    <input type={"radio"} name={"gender"} onChange={v.gF} checked={!!v.gcF} />
                    {" FEMALE"}
                  </label>
                  <label className="flex items-center gap-1.5 text-[13px]">
                    <input type={"radio"} name={"gender"} onChange={v.gT} checked={!!v.gcT} />
                    {" TRANSGENDER"}
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 text-[13px]">
                <label htmlFor={"cn"}>
                  {"CNIC No. "}
                  <span className="text-[#c00]">
                    {"*"}
                  </span>
                </label>
                <input id={"cn"} onChange={v.in_cn} value={v.fv_cn} type={"text"} placeholder={"00000-0000000-0"} className="py-0 px-2.5 min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white" />
              </div>
              <div className="flex flex-col gap-1.5 text-[13px]">
                <label htmlFor={"dob"}>
                  {"Date of Birth "}
                  <span className="text-[#c00]">
                    {"*"}
                  </span>
                </label>
                <input id={"dob"} onChange={v.in_dob} value={v.fv_dob} type={"text"} placeholder={"DD/MM/YYYY"} className="py-0 px-2.5 min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white" />
              </div>
              <div className="flex flex-col gap-1.5 text-[13px]">
                <label htmlFor={"mb"}>
                  {"Mobile No. "}
                  <span className="text-[#c00]">
                    {"*"}
                  </span>
                </label>
                <input id={"mb"} onChange={v.in_mb} value={v.fv_mb} type={"text"} placeholder={"03XX-XXXXXXX"} className="py-0 px-2.5 min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white" />
              </div>
            </div>
          </fieldset>
          <fieldset className="border border-solid border-essi-line rounded-lg pt-4 px-5 pb-5.5 mt-0 mx-0 mb-4.5 bg-white">
            <legend className="text-[18px] py-0 px-2 text-essi-dark">
              {"Employment Detail"}
            </legend>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4.5">
              <div className="flex flex-col gap-1.5 text-[13px]">
                <label htmlFor={"ds"}>
                  {"Designation "}
                  <span className="text-[#c00]">
                    {"*"}
                  </span>
                </label>
                <input id={"ds"} onChange={v.in_ds} value={v.fv_ds} type={"text"} placeholder={"Enter designation"} className="py-0 px-2.5 min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white" />
              </div>
              <div className="flex flex-col gap-1.5 text-[13px]">
                <label htmlFor={"sk"}>
                  {"Skill Level "}
                  <span className="text-[#c00]">
                    {"*"}
                  </span>
                </label>
                <select id={"sk"} onChange={v.in_sk} value={v.fv_sk} className="py-0 px-2.5 min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white">
                  <option>
                    {"--- Please Select ---"}
                  </option>
                  <option>
                    {"Unskilled"}
                  </option>
                  <option>
                    {"Semi-Skilled"}
                  </option>
                  <option>
                    {"Skilled"}
                  </option>
                  <option>
                    {"Highly Skilled"}
                  </option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 text-[13px]">
                <label htmlFor={"et"}>
                  {"Employment Type "}
                  <span className="text-[#c00]">
                    {"*"}
                  </span>
                </label>
                <select id={"et"} onChange={v.in_et} value={v.fv_et} className="py-0 px-2.5 min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white">
                  <option>
                    {"--- Please Select ---"}
                  </option>
                  <option>
                    {"Permanent"}
                  </option>
                  <option>
                    {"Contractual"}
                  </option>
                  <option>
                    {"Daily Wages"}
                  </option>
                  <option>
                    {"Piece Rated"}
                  </option>
                  <option>
                    {"Others"}
                  </option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 text-[13px]">
                <label htmlFor={"wt"}>
                  {"Wage Type "}
                  <span className="text-[#c00]">
                    {"*"}
                  </span>
                </label>
                <select id={"wt"} onChange={v.in_wt} value={v.fv_wt} className="py-0 px-2.5 min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white">
                  <option>
                    {"--- Please Select ---"}
                  </option>
                  <option>
                    {"Monthly"}
                  </option>
                  <option>
                    {"Daily"}
                  </option>
                  <option>
                    {"Piece Rate"}
                  </option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 text-[13px]">
                <label htmlFor={"pf"}>
                  {"Payment Frequency "}
                  <span className="text-[#c00]">
                    {"*"}
                  </span>
                </label>
                <select id={"pf"} onChange={v.in_pf} value={v.fv_pf} className="py-0 px-2.5 min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white">
                  <option>
                    {"--- Please Select ---"}
                  </option>
                  <option>
                    {"Monthly"}
                  </option>
                  <option>
                    {"Weekly"}
                  </option>
                  <option>
                    {"Daily"}
                  </option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 text-[13px]">
                <label htmlFor={"dj"}>
                  {"Date of Joining "}
                  <span className="text-[#c00]">
                    {"*"}
                  </span>
                </label>
                <input id={"dj"} onChange={v.in_dj} value={v.fv_dj} type={"text"} placeholder={"DD/MM/YYYY"} className="py-0 px-2.5 min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white" />
              </div>
              <div className="flex flex-col gap-1.5 text-[13px]">
                <label htmlFor={"mw"}>
                  {"Monthly Wages "}
                  <span className="text-[#c00]">
                    {"*"}
                  </span>
                </label>
                <input id={"mw"} onChange={v.in_mw} value={v.fv_mw} type={"text"} placeholder={"Enter monthly wages"} className="py-0 px-2.5 min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white" />
              </div>
              <div className="flex flex-col gap-1.5 text-[13px]">
                <label htmlFor={"ba"}>
                  {"Bank Account "}
                  <span className="text-[#c00]">
                    {"*"}
                  </span>
                </label>
                <input id={"ba"} onChange={v.in_ba} value={v.fv_ba} type={"text"} placeholder={"Enter bank account number"} className="py-0 px-2.5 min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white" />
              </div>
            </div>
          </fieldset>
          {v.hasErr ? (<>
            <div role={"alert"} className="text-danger text-[14px] mt-0 mx-0 mb-3 text-right">
              {v.formErr}
            </div>
          </>) : null}
          <div className="flex gap-3 justify-end">
            <button onClick={v.cancelEmp} className="min-h-[44px] py-0 px-5.5 border border-solid border-essi-green rounded-lg bg-white text-essi-green text-[14px]">
              {"Cancel"}
            </button>
            <button onClick={v.saveEmp} className="min-h-[44px] py-0 px-6.5 border-0 rounded-lg bg-essi-dark text-white text-[14px]">
              {v.saveLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
