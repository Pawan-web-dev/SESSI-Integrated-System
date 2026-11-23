/* Employer dashboard – Company Profile > Change Requests (markup taken from the approved design). */
import React from 'react';
import type { Any, ViewProps } from '@/types/view';

export function ChangeRequestsSection({ v }: ViewProps) {
  return (
    <>
      <div className="mt-4">
        <div className="bg-essi-green text-white py-2.5 px-5 rounded-lg text-[16px] font-semibold">
          {"COMPANY PROFILE - CHANGE REQUESTS"}
        </div>
        {v.hasCrMsg ? (<>
          <div role={"status"} className="mt-3 bg-[#e8f6ec] border border-solid border-[#9fd3ae] rounded-lg py-3 px-4 text-[14px] text-essi-dark">
            {v.crMsg}
          </div>
        </>) : null}
        <div className="mt-3.5">
          <button onClick={v.goCRF} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-5 rounded-lg text-[14px] font-semibold bg-essi-dark text-white border-0">
            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M12 5v14M5 12h14"}>
              </path>
            </svg>
            {"New Change Request"}
          </button>
        </div>
        <div className="bg-white border border-solid border-essi-line rounded-[10px] mt-3.5 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse"><tbody>
            <tr>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"Ref. No."}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"Field"}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"Current value"}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"Requested value"}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"Submitted on"}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"Status"}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"Action"}
              </th>
            </tr>
            {v.noCr ? (<>
              <tr>
                <td colSpan={7} className="border border-solid border-essi-line text-[13px] text-ink-muted p-4.5">
                  {"No change requests yet. Use New Change Request to ask ESSI to update your registered details."}
                </td>
              </tr>
            </>) : null}
            {(v.crRows || []).map((r: Any, _i18: number) => (<React.Fragment key={_i18}>
              <tr>
                <td className="p-2.5 border border-solid border-essi-line text-[13px]">
                  {r.ref}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px]">
                  {r.label}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px]">
                  {r.oldVal}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px]">
                  {r.newVal}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px]">
                  {r.submitted}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] font-bold" style={{color: r.col}}>
                  {r.status}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px]">
                  <button onClick={r.view} className="min-h-[44px] py-0 px-3.5 border border-solid border-essi-green rounded-md bg-white text-essi-green">
                    {"View"}
                  </button>
                </td>
              </tr>
            </React.Fragment>))}
          </tbody></table>
        </div>
      </div>
    </>
  );
}
