/* Employer dashboard – Company Profile > Mandatory Documents (markup taken from the approved design). */
import React from 'react';
import type { Any, ViewProps } from '@/types/view';

export function MandatoryDocumentsSection({ v, P }: ViewProps) {
  return (
    <>
      <div className="mt-4">
        <div className="bg-essi-green text-white py-2.5 px-5 rounded-lg text-[16px] font-semibold">
          {"COMPANY PROFILE - MANDATORY DOCUMENTS"}
        </div>
        <div className="bg-white border border-solid border-essi-line rounded-[10px] mt-3.5 p-4 flex flex-wrap items-center gap-y-3.5 gap-x-5">
          <div className="w-[56px] h-[56px] rounded-xl bg-essi-mint flex items-center justify-center">
            <svg width={"30"} height={"30"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M3 8h18v12H3zM9 8V5h6v3M3 13h18"}>
              </path>
            </svg>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="text-[20px] font-bold">
              {v.co.employer}
            </div>
            <div className="text-[13px] text-ink-soft mt-1">
              {"Employer Registration No. "}{P.empNo}{"  |  "}{P.dir}{"  |  Registered on " + v.registeredOn}
            </div>
          </div>
          <span className="bg-essi-tint text-essi-dark rounded-[14px] py-1 px-3.5 text-[13px] font-bold">
            {"Approved Employer"}
          </span>
        </div>
        <div className="mt-3.5 text-[13px] text-ink-soft">
          {"Documents you uploaded at registration. Press View to open a file. To replace a document, contact your ESSI Directorate."}
        </div>

        <div className="bg-white border border-solid border-essi-line rounded-[10px] mt-2.5 overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse"><tbody>
            <tr>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"Document"}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"Requirement"}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"File"}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"Status"}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"Action"}
              </th>
            </tr>
            {(v.docRows || []).map((d: Any, _i17: number) => (<React.Fragment key={_i17}>
              <tr>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] font-semibold">
                  {d.name}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px]">
                  {d.req}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px]">
                  {d.file}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] font-bold" style={{color: d.col}}>
                  {d.status}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px]">
                  {d.canView ? (<>
                    <button type="button" onClick={d.view} className="min-h-[44px] py-0 px-3.5 border border-solid border-essi-green rounded-md bg-white text-essi-green cursor-pointer">
                      {"View"}
                    </button>
                  </>) : d.has ? (<span className="text-ink-muted">{"File not stored"}</span>) : null}
                </td>
              </tr>
            </React.Fragment>))}
          </tbody></table>
        </div>
        <div className="text-[13px] text-ink-muted mt-3">
          {"Registered details can only be changed through a change request that ESSI reviews."}
        </div>
      </div>
    </>
  );
}
