/* Employer dashboard – Monthly Contributions > Create Contribution (markup taken from the approved design). */
import React from 'react';
import type { Any, ViewProps } from '@/types/view';

export function CreateContributionSection({ v, P }: ViewProps) {
  return (
    <>
      <div className="mt-4">
        <div className="bg-essi-green text-white py-2.5 px-5 rounded-lg text-[16px] font-semibold">
          {"CREATE CONTRIBUTION"}
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
              {v.ccMonthLabel}
            </b>
          </span>
        </div>
        <div className="mt-3.5 bg-[#f4f7f5] border border-solid border-essi-line rounded-lg py-3.5 px-4.5 text-[14px]">
          <div className="flex items-center gap-2 font-bold text-essi-dark text-[16px]">
            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v5M12 8h.01"}>
              </path>
            </svg>
            {"Contribution Details"}
          </div>
          <div className="mt-2">
            <b>
              {"Note:"}
            </b>
            <br />
            {"Daily minimum wage as per government notification: "}
            <b>
              {"5000"}
            </b>
            <br />
            {"Monthly minimum wage as per government notification: "}
            <b>
              {"37000"}
            </b>
          </div>
        </div>
        <div className="flex flex-wrap justify-between items-end gap-3.5 mt-4">
          <div className="flex flex-col gap-1.5 text-[14px] font-semibold text-essi-dark">
            {"Contribution Month *"}
            <span className="flex items-center justify-between gap-7.5 min-h-[44px] min-w-[240px] box-border py-0 px-3 border border-solid border-[#bbb] rounded-md bg-white font-normal text-ink">
              {v.ccMonthLabel}
              <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                <path d={"M4 6h16v14H4zM4 11h16M8 3v4M16 3v4"}>
                </path>
              </svg>
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button className="inline-flex items-center gap-2 min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] bg-essi-dark text-white border-0">
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                <path d={"M4 6h16v14H4zM4 11h16M8 3v4M16 3v4"}>
                </path>
              </svg>
              {"Re-Create Contribution"}
            </button>
            <button onClick={v.submitContribution} disabled={!v.canSubmitCC} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] bg-essi-dark text-white border-0">
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                <path d={"M5 12l5 5 9-10"}>
                </path>
              </svg>
              {"Submit"}
            </button>
          </div>
        </div>
        <div className="mt-4 border border-solid border-essi-line rounded-lg bg-white">
        {v.ccNote ? <div className="mt-4 rounded-lg border border-solid border-[#f0d78a] bg-[#fff8e1] px-3.5 py-2.5 text-[14px] text-[#5a4b10]">{v.ccNote}</div> : null}
          <div className="flex items-center gap-2.5 bg-essi-mint py-2.5 px-3.5 font-semibold text-[15px]">
            <svg width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3.5 2.7-5.5 6-5.5s6 2 6 5.5M16 6a3 3 0 010 5.5M17.5 14.7c2 .6 3.5 2.4 3.5 5.3"}>
              </path>
            </svg>
            {"Employee Contribution Details"}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse"><tbody>
              <tr>
                <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                  {"Sr. No."}
                </th>
                <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                  {"Full Name"}
                </th>
                <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                  {"CNIC No."}
                </th>
                <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                  {"Mobile No."}
                </th>
                <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                  {"Employment Type"}
                </th>
                <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                  {"Wage Rate Type"}
                </th>
                <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                  {"Employee Wage"}
                </th>
                <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                  {"Working Days"}
                </th>
                <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                  {"Wage Pay to Employee"}
                </th>
                <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                  {"Wage to pay Contribution"}
                </th>
                <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                  {"Amount"}
                </th>
              </tr>
              {v.noCC ? (<>
                <tr>
                  <td colSpan={11} className="border border-solid border-essi-line text-[13px] text-left text-ink-muted p-4.5">
                    {"No employees to contribute for yet. Register employees first, then create the contribution."}
                  </td>
                </tr>
              </>) : null}
              {(v.ccRows || []).map((r: Any, _i12: number) => (<React.Fragment key={_i12}>
                <tr>
                  <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                    {r.n}
                  </td>
                  <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                    {r.name}
                  </td>
                  <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                    {r.cnic}
                  </td>
                  <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                    {r.mob}
                  </td>
                  <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                    {r.type}
                  </td>
                  <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                    {"MONTHLY"}
                  </td>
                  <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                    {r.wage}
                  </td>
                  <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                    <span className="inline-block min-w-[34px] border border-solid border-[#bbb] rounded py-1.5 px-2.5">
                      {r.days}
                    </span>
                  </td>
                  <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                    <span className="inline-block min-w-[90px] rounded bg-[#ececec] py-1.5 px-2.5">
                      {r.paid}
                    </span>
                  </td>
                  <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                    {r.cwage}
                  </td>
                  <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                    {r.amt}
                  </td>
                </tr>
              </React.Fragment>))}
            </tbody></table>
          </div>
        </div>
        <div className="flex justify-between flex-wrap gap-2.5 mt-4.5">
          <button onClick={v.goMC} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] bg-white text-essi-green border border-solid border-essi-green">
            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M15 6l-6 6 6 6"}>
              </path>
            </svg>
            {"Back"}
          </button>
          <button onClick={v.submitContribution} disabled={!v.canSubmitCC} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] bg-white text-essi-green border border-solid border-essi-green">
            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M5 12l5 5 9-10"}>
              </path>
            </svg>
            {"Submit"}
          </button>
        </div>
      </div>
    </>
  );
}
