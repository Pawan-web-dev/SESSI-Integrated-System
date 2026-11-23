/* Employer dashboard – Challans & Payments > Payment History (markup taken from the approved design). */
import React from 'react';
import type { Any, ViewProps } from '@/types/view';

export function PaymentHistorySection({ v }: ViewProps) {
  return (
    <>
      <div className="mt-4">
        <div className="bg-essi-green text-white py-2.5 px-5 rounded-lg text-[16px] font-semibold">
          {"PAYMENT HISTORY"}
        </div>
        <div className="bg-white border border-solid border-essi-line rounded-[10px] mt-3.5 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse"><tbody>
            <tr>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                {"Challan No."}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                {"Contribution Month"}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                {"Amount (PKR)"}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                {"Due Date"}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                {"Payment Date"}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                {"Payment Status"}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                {"Action"}
              </th>
            </tr>
            {v.noHist ? (<>
              <tr>
                <td colSpan={7} className="border border-solid border-essi-line text-[13px] text-left text-ink-muted p-4.5">
                  {"No challans or payments yet."}
                </td>
              </tr>
            </>) : null}
            {(v.histRows || []).map((h: Any, _i13: number) => (<React.Fragment key={_i13}>
              <tr>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                  {h.ch}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                  {h.m}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                  {h.amt}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                  {h.due}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                  {h.paidOn}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center font-bold" style={{color: h.col}}>
                  {h.status}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                  {h.hasBtn ? (<>
                    <button onClick={h.go} className="min-h-[44px] py-0 px-3.5 border border-solid border-essi-green rounded-md bg-white text-essi-green">
                      {h.act}
                    </button>
                  </>) : null}
                </td>
              </tr>
            </React.Fragment>))}
          </tbody></table>
        </div>
        <div className="mt-4.5">
          <button onClick={v.goHome} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-5 rounded-lg text-[14px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M15 6l-6 6 6 6"}>
              </path>
            </svg>
            {"Back to Dashboard"}
          </button>
        </div>
      </div>
    </>
  );
}
