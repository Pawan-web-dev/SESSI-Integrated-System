/* Employer dashboard – Monthly Contributions > Monthly Contribution (markup taken from the approved design). */
import React from 'react';
import type { Any, ViewProps } from '@/types/view';

export function MonthlyContributionSection({ v, P }: ViewProps) {
  return (
    <>
      <div className="mt-4">
        <div className="bg-essi-green text-white py-2.5 px-5 rounded-lg text-[16px] font-semibold">
          {"MONTHLY CONTRIBUTION"}
        </div>
        <div className="flex flex-wrap items-center gap-y-2.5 gap-x-7 mt-3.5 bg-essi-mint border border-solid border-essi-line rounded-lg py-3 px-4.5 text-[14px]">
          <svg width={"26"} height={"26"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
            <path d={"M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"}>
            </path>
          </svg>
          <span>
            {"Employer Name: "}
            <b>
              {P.coName}
            </b>
          </span>
          <span>
            {"Registration No: "}
            <b>
              {P.empNo}
            </b>
          </span>
          <span>
            {"Period: "}
            <b>
              {v.currentMonthLabel}
            </b>
          </span>
        </div>
        <div className="mt-3.5 bg-white border border-solid border-essi-line rounded-lg">
          <div className="flex flex-wrap gap-2.5 py-2.5 px-3.5 bg-[#eef6f0] border-b border-b-essi-line">
            <button onClick={v.goCC} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] bg-white text-essi-green border border-solid border-essi-green">
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                <path d={"M12 5v14M5 12h14"}>
                </path>
              </svg>
              {"Create Contribution"}
            </button>
            <button className="inline-flex items-center gap-2 min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] bg-[#f3f3f3] text-ink border border-solid border-[#bbb]">
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                <path d={"M6 3h8l4 4v14H6zM14 3v4h4M9 13l4 4M13 13l-4 4"}>
                </path>
              </svg>
              {"Import MS Excel"}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse"><tbody>
              <tr>
                <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                  {"Contribution Month"}
                </th>
                <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                  {"No. of Employees"}
                </th>
                <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                  {"Contribution Amount"}
                </th>
                <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                  {"CI Status"}
                </th>
                <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                  {"Declaration"}
                </th>
                <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                  {"CI"}
                </th>
                <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                  {"Action"}
                </th>
              </tr>
              <tr>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                  <select aria-label={"Select Month"} className="w-full min-h-[36px] border border-solid border-[#bbb] rounded-md bg-white">
                    <option>
                      {"Select Month"}
                    </option>
                  </select>
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                  <select aria-label={""} className="w-full min-h-[36px] border border-solid border-[#bbb] rounded-md bg-white">
                    <option>
                    </option>
                  </select>
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                  <select aria-label={""} className="w-full min-h-[36px] border border-solid border-[#bbb] rounded-md bg-white">
                    <option>
                    </option>
                  </select>
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                  <select aria-label={"Select"} className="w-full min-h-[36px] border border-solid border-[#bbb] rounded-md bg-white">
                    <option>
                      {"Select"}
                    </option>
                  </select>
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                  <select aria-label={"Select"} className="w-full min-h-[36px] border border-solid border-[#bbb] rounded-md bg-white">
                    <option>
                      {"Select"}
                    </option>
                  </select>
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                </td>
              </tr>
              {(v.mcRows || []).map((m: Any, _i11: number) => (<React.Fragment key={_i11}>
                <tr>
                  <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                    {m.a}
                  </td>
                  <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                    {m.b}
                  </td>
                  <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                    {m.c}
                  </td>
                  <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                    {m.d}
                  </td>
                  <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                    {m.e}
                  </td>
                  <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                    {m.f}
                  </td>
                  <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                    <button onClick={v.goCC} className="min-h-[44px] py-0 px-3.5 border border-solid border-essi-green rounded-md bg-white text-essi-green">
                      {"View"}
                    </button>
                  </td>
                </tr>
              </React.Fragment>))}
            </tbody></table>
          </div>
          {v.noMC ? (<>
            <div className="py-2.5 px-3.5 text-[14px] border-t border-t-essi-line">
              {"No records to display."}
            </div>
            <div className="text-center py-9 px-4 border-t border-t-essi-line">
              <div className="w-[84px] h-[84px] rounded-[50%] bg-essi-tint mt-0 mx-auto mb-3 flex items-center justify-center">
                <svg width={"40"} height={"40"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                  <path d={"M6 3h8l4 4v6M14 3v4h4M9 11h6M9 15h3M17 20a3 3 0 100-6 3 3 0 000 6zM21 22l-2-2"}>
                  </path>
                </svg>
              </div>
              <div className="font-bold text-[18px] text-essi-dark">
                {"No Contribution Records Found"}
              </div>
              <div className="text-[14px] text-ink-soft mt-1.5">
                {"Please select filters or create a new contribution."}
              </div>
            </div>
          </>) : null}
        </div>
        <div className="flex justify-between flex-wrap gap-2.5 mt-4.5">
          <button onClick={v.goHome} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] bg-white text-essi-green border border-solid border-essi-green">
            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M15 6l-6 6 6 6"}>
              </path>
            </svg>
            {"Back"}
          </button>
          <button className="inline-flex items-center gap-2 min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] bg-white text-essi-green border border-solid border-essi-green">
            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M20 11a8 8 0 10-2.3 6M20 4v7h-7"}>
              </path>
            </svg>
            {"Refresh"}
          </button>
        </div>
      </div>
    </>
  );
}
