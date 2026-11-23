/* Employer dashboard – Company Profile > New Change Request (markup taken from the approved design). */
import type { ViewProps } from '@/types/view';

export function NewChangeRequestSection({ v }: ViewProps) {
  return (
    <>
      <div className="mt-4">
        <div className="bg-essi-green text-white py-2.5 px-5 rounded-lg text-[16px] font-semibold">
          {"NEW CHANGE REQUEST"}
        </div>
        <div className="mt-3.5 bg-[#eef6fb] border border-solid border-[#b9d3f0] rounded-lg py-3 px-4 text-[14px] text-[#0b3d91]">
          {"Changes take effect only after ESSI reviews and approves the request. Typical review time: 3 working days (sample)."}
        </div>
        <div className="bg-white border border-solid border-essi-line rounded-[10px] mt-3.5 p-5 max-w-[640px]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-[13px]">
              <label htmlFor={"crf"}>
                {"What do you want to change? "}
                <span className="text-[#c00]">
                  {"*"}
                </span>
              </label>
              <select id={"crf"} onChange={v.in_crf} className="py-0 px-2.5 min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white font-[inherit]">
                <option>
                  {"--- Please Select ---"}
                </option>
                <option>
                  {"Employer Name"}
                </option>
                <option>
                  {"Business Type"}
                </option>
                <option>Industry Classification</option>
                <option>
                  {"SECP Certificate No."}
                </option>
                <option>
                  {"NTN"}
                </option>
                <option>
                  {"SRB Registration No."}
                </option>
                <option>
                  {"Business Address"}
                </option>
                <option>
                  {"District"}
                </option>
                <option>
                  {"GPS Location"}
                </option>
                <option>
                  {"Contact Person"}
                </option>
                <option>
                  {"Designation"}
                </option>
                <option>
                  {"Mobile No."}
                </option>
                <option>
                  {"Email Address"}
                </option>
                <option>
                  {"Office Phone"}
                </option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 text-[13px]">
              <span>
                {"Current value"}
              </span>
              <div className="min-h-[44px] flex items-center py-0 px-2.5 rounded-md bg-[#ececec] text-[14px] wrap-anywhere">
                {v.crCurrent}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 text-[13px]">
              <label htmlFor={"crn"}>
                {"New value "}
                <span className="text-[#c00]">
                  {"*"}
                </span>
              </label>
              {v.crIsIndustry ? (
                <select id="crn" defaultValue="" onChange={v.in_crn} className="py-0 px-2.5 min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white font-[inherit]">
                  <option value="">--- Please Select ---</option>
                  {v.industryNames.map((n: string) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              ) : (
                <input id={"crn"} type={"text"} onChange={v.in_crn} className="py-0 px-2.5 min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
              )}
            </div>
            <div className="flex flex-col gap-1.5 text-[13px]">
              <label htmlFor={"crr"}>
                {"Reason for change "}
                <span className="text-[#c00]">
                  {"*"}
                </span>
              </label>
              <textarea id={"crr"} rows={4} onChange={v.in_crr} className="min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white font-[inherit] p-2.5">
              </textarea>
            </div>
            <div className="flex flex-col gap-1.5 text-[13px]">
              <label htmlFor={"crd"}>
                {"Supporting document "}
                <span className="text-ink-soft">
                  {"("}{v.crHint}{")"}
                </span>
              </label>
              <input id={"crd"} type={"file"} onChange={v.in_crd} className="text-[13px]" />
            </div>
          </div>
          {v.hasCrErr ? (<>
            <div role={"alert"} className="text-danger text-[14px] mt-3.5">
              {v.crErr}
            </div>
          </>) : null}
          <div className="mt-4.5 flex flex-wrap gap-2.5">
            <button onClick={v.submitCr} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-5 rounded-lg text-[14px] font-semibold bg-essi-dark text-white border-0">
              {"Submit Request"}
            </button>
            <button onClick={v.goCRL} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-5 rounded-lg text-[14px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
              {"Cancel"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
