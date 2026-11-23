/* Employer dashboard – Challans & Payments > F-5 (markup taken from the approved design). */
import React from 'react';
import type { Any, ViewProps } from '@/types/view';

export function F5ReturnSection({ v }: ViewProps) {
  return (
    <>
      <div className="mt-4">
        <div className="bg-essi-green text-white py-2.5 px-5 rounded-lg text-[16px] font-semibold">
          {"CONTRIBUTION LATE PAYMENT VOUCHER"}
        </div>
        <div className="bg-white border border-solid border-essi-line rounded-[10px] mt-3.5 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse"><tbody>
            <tr>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                {"Sr. No."}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                {"Receipt No."}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                {"Month"}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                {"No. of Employee"}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                {"Amount"}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                {"Payment Status"}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                {"Payment Mode"}
              </th>
              <th className="p-2.5 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-center">
                {"Print F-5"}
              </th>
            </tr>
            <tr>
              <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
              </td>
              <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                <div className="flex items-center gap-0.75">
                  <input aria-label={"Filter Receipt No."} className="w-full min-w-[56px] min-h-[32px] box-border border border-solid border-[#bbb] rounded" />
                  <button type={"button"} aria-label={"Apply filter"} className="min-w-[32px] min-h-[32px] border border-solid border-[#bbb] rounded bg-[#eee] p-0 inline-flex items-center justify-center">
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"#555"} aria-hidden={"true"}>
                      <path d={"M3 4h18l-7 8v7l-4 2v-9z"}>
                      </path>
                    </svg>
                  </button>
                </div>
              </td>
              <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                <div className="flex items-center gap-0.75">
                  <input aria-label={"Filter Month"} className="w-full min-w-[56px] min-h-[32px] box-border border border-solid border-[#bbb] rounded" />
                  <button type={"button"} aria-label={"Apply filter"} className="min-w-[32px] min-h-[32px] border border-solid border-[#bbb] rounded bg-[#eee] p-0 inline-flex items-center justify-center">
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"#555"} aria-hidden={"true"}>
                      <path d={"M3 4h18l-7 8v7l-4 2v-9z"}>
                      </path>
                    </svg>
                  </button>
                </div>
              </td>
              <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                <div className="flex items-center gap-0.75">
                  <input aria-label={"Filter No. of Employee"} className="w-full min-w-[56px] min-h-[32px] box-border border border-solid border-[#bbb] rounded" />
                  <button type={"button"} aria-label={"Apply filter"} className="min-w-[32px] min-h-[32px] border border-solid border-[#bbb] rounded bg-[#eee] p-0 inline-flex items-center justify-center">
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"#555"} aria-hidden={"true"}>
                      <path d={"M3 4h18l-7 8v7l-4 2v-9z"}>
                      </path>
                    </svg>
                  </button>
                </div>
              </td>
              <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                <div className="flex items-center gap-0.75">
                  <input aria-label={"Filter Amount"} className="w-full min-w-[56px] min-h-[32px] box-border border border-solid border-[#bbb] rounded" />
                  <button type={"button"} aria-label={"Apply filter"} className="min-w-[32px] min-h-[32px] border border-solid border-[#bbb] rounded bg-[#eee] p-0 inline-flex items-center justify-center">
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"#555"} aria-hidden={"true"}>
                      <path d={"M3 4h18l-7 8v7l-4 2v-9z"}>
                      </path>
                    </svg>
                  </button>
                </div>
              </td>
              <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                <div className="flex items-center gap-0.75">
                  <input aria-label={"Filter Payment Status"} className="w-full min-w-[56px] min-h-[32px] box-border border border-solid border-[#bbb] rounded" />
                  <button type={"button"} aria-label={"Apply filter"} className="min-w-[32px] min-h-[32px] border border-solid border-[#bbb] rounded bg-[#eee] p-0 inline-flex items-center justify-center">
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"#555"} aria-hidden={"true"}>
                      <path d={"M3 4h18l-7 8v7l-4 2v-9z"}>
                      </path>
                    </svg>
                  </button>
                </div>
              </td>
              <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                <div className="flex items-center gap-0.75">
                  <input aria-label={"Filter Payment Mode"} className="w-full min-w-[56px] min-h-[32px] box-border border border-solid border-[#bbb] rounded" />
                  <button type={"button"} aria-label={"Apply filter"} className="min-w-[32px] min-h-[32px] border border-solid border-[#bbb] rounded bg-[#eee] p-0 inline-flex items-center justify-center">
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"#555"} aria-hidden={"true"}>
                      <path d={"M3 4h18l-7 8v7l-4 2v-9z"}>
                      </path>
                    </svg>
                  </button>
                </div>
              </td>
              <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
              </td>
            </tr>
            {v.noF5 ? (<>
              <tr>
                <td colSpan={8} className="border border-solid border-essi-line text-[13px] text-left text-ink-muted p-4.5">
                  {"No records to display."}
                </td>
              </tr>
            </>) : null}
            {(v.f5Rows || []).map((r: Any, _i15: number) => (<React.Fragment key={_i15}>
              <tr>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                  {r.n}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                  {r.rc}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                  {r.m}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                  {r.emp}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                  {r.amt}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center font-bold text-essi-green">
                  {"PAID"}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                  {r.mode}
                </td>
                <td className="p-2.5 border border-solid border-essi-line text-[13px] text-center">
                  <button type={"button"} onClick={r.pr} aria-label={"Print F-5"} className="min-w-[44px] min-h-[44px] border-0 bg-transparent text-essi-dark">
                    <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M6 9V3h12v6M6 18H4v-7h16v7h-2M6 14h12v7H6z"}>
                      </path>
                    </svg>
                  </button>
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
