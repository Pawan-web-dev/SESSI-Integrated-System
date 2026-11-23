/* Registration step 1 – business information (markup taken from the approved design). */
import type { Any, ViewProps } from '@/types/view';

export function BusinessInformationStep({ v }: ViewProps) {
  return (
    <>
      <div>
        <div className="flex items-center gap-3 mb-4.5">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-essi-mint flex items-center justify-center">
            <svg width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M3 8h18v12H3zM9 8V5h6v3M3 13h18"}>
              </path>
            </svg>
          </div>
          <div className="text-[22px] font-bold text-essi-dark">
            {"Business Information"}
          </div>
          <div className="flex-1 h-[2px] bg-essi-green opacity-[.7]">
          </div>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-y-4.5 gap-x-7">
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"en"} className="font-semibold text-ink">
              {"Employer Name "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <input id={"en"} type={"text"} placeholder={"Enter Employer Name"} value={v.v_en} onChange={v.h_en} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"ba"} className="font-semibold text-ink">
              {"Business Address "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <input id={"ba"} type={"text"} placeholder={"Enter Business Address"} value={v.v_ba} onChange={v.h_ba} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"bt"} className="font-semibold text-ink">
              {"Business Type "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <select id={"bt"} value={v.v_bt} onChange={v.h_bt} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]">
              <option value={""}>
                {"Select Business Type"}
              </option>
              <option value={"Sole Proprietorship"}>
                {"Sole Proprietorship"}
              </option>
              <option value={"Partnership"}>
                {"Partnership"}
              </option>
              <option value={"Private Limited Company"}>
                {"Private Limited Company"}
              </option>
              <option value={"Single Member Company"}>
                {"Single Member Company"}
              </option>
              <option value={"Public Limited Company"}>
                {"Public Limited Company"}
              </option>
              <option value={"Trust / NGO"}>
                {"Trust / NGO"}
              </option>
              <option value={"Other"}>
                {"Other"}
              </option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor="ind" className="font-semibold text-ink">
              Industry Classification <span className="text-[#d00]">*</span>
            </label>
            <select id="ind" value={v.v_ind} onChange={v.h_ind} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]">
              <option value="">Select Industry Classification</option>
              {v.industries.map((i: Any) => (
                <option key={i.code} value={i.code}>
                  {i.name} ({i.code})
                </option>
              ))}
            </select>
            <span className="text-[12px] text-ink-muted">Principal business activity. Its code becomes part of your Employer No. ({v.einHint}).</span>
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label className="font-semibold text-ink">
              {"Province "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <input type={"text"} value={"Sindh"} readOnly className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full font-[inherit] bg-[#f1f1f1]" />
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"secp"} className="font-semibold text-ink">
              {"SECP Certificate No. "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <div className="flex gap-2">
              <input id={"secp"} type={"text"} placeholder={"Enter SECP Certificate Number"} value={v.v_secp} onChange={v.h_secp} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
              <button onClick={v.chk_secp} className="min-h-[44px] py-0 px-3.5 border border-solid border-essi-green rounded-md bg-white text-essi-green font-semibold flex-none">
                {"Check"}
              </button>
            </div>
            <span className="text-[12px]" style={{color: v.cc_secp}}>
              {v.c_secp}
            </span>
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"dist"} className="font-semibold text-ink">
              {"District "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <select id={"dist"} value={v.v_dist} onChange={v.h_dist} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]">
              <option value={""}>
                {"Select District"}
              </option>
              <option value={"Karachi Central"}>
                {"Karachi Central"}
              </option>
              <option value={"Karachi East"}>
                {"Karachi East"}
              </option>
              <option value={"Karachi South"}>
                {"Karachi South"}
              </option>
              <option value={"Karachi West"}>
                {"Karachi West"}
              </option>
              <option value={"Korangi"}>
                {"Korangi"}
              </option>
              <option value={"Malir"}>
                {"Malir"}
              </option>
              <option value={"Keamari"}>
                {"Keamari"}
              </option>
              <option value={"Hyderabad"}>
                {"Hyderabad"}
              </option>
              <option value={"Sukkur"}>
                {"Sukkur"}
              </option>
              <option value={"Larkana"}>
                {"Larkana"}
              </option>
              <option value={"Shaheed Benazirabad"}>
                {"Shaheed Benazirabad"}
              </option>
              <option value={"Mirpurkhas"}>
                {"Mirpurkhas"}
              </option>
              <option value={"Thatta"}>
                {"Thatta"}
              </option>
              <option value={"Jamshoro"}>
                {"Jamshoro"}
              </option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"ntn"} className="font-semibold text-ink">
              {"NTN "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <div className="flex gap-2">
              <input id={"ntn"} type={"text"} placeholder={"Enter NTN Number"} value={v.v_ntn} onChange={v.h_ntn} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
              <button onClick={v.chk_ntn} className="min-h-[44px] py-0 px-3.5 border border-solid border-essi-green rounded-md bg-white text-essi-green font-semibold flex-none">
                {"Check"}
              </button>
            </div>
            <span className="text-[12px]" style={{color: v.cc_ntn}}>
              {v.c_ntn}
            </span>
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label className="font-semibold text-ink">
              {"GPS Location "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <div className="flex gap-2">
              <input type={"text"} placeholder={"Select Location on Map"} value={v.v_gps} readOnly className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full font-[inherit] bg-[#f6fbf8]" />
              <button onClick={v.viewMap} className="inline-flex items-center gap-1.5 min-h-[44px] py-0 px-4 border-0 rounded-md bg-essi-dark text-white font-semibold flex-none">
                <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#fff"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                  <path d={"M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12zM12 11a2 2 0 100-4 2 2 0 000 4z"}>
                  </path>
                </svg>
                {"View Map"}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 text-[14px]">
            <label htmlFor={"srb"} className="font-semibold text-ink">
              {"SRB Registration No. "}
              <span className="text-[#d00]">
                {"*"}
              </span>
            </label>
            <div className="flex gap-2">
              <input id={"srb"} type={"text"} placeholder={"Enter SRB Registration Number"} value={v.v_srb} onChange={v.h_srb} className="py-0 px-3 min-h-[44px] border border-solid border-essi-input rounded-md text-[14px] box-border w-full bg-white font-[inherit]" />
              <button onClick={v.chk_srb} className="min-h-[44px] py-0 px-3.5 border border-solid border-essi-green rounded-md bg-white text-essi-green font-semibold flex-none">
                {"Check"}
              </button>
            </div>
            <span className="text-[12px]" style={{color: v.cc_srb}}>
              {v.c_srb}
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
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={v.reset} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-6 rounded-lg text-[15px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                <path d={"M20 11a8 8 0 10-2.3 6M20 4v7h-7"}>
                </path>
              </svg>
              {"Reset"}
            </button>
            <button onClick={v.next} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-6 rounded-lg text-[15px] font-semibold bg-essi-dark text-white border-0">
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
