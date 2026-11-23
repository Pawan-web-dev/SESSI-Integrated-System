/* Employer dashboard – Dashboard > Overview (markup taken from the approved design). */
import React from 'react';
import type { Any, ViewProps } from '@/types/view';

export function OverviewSection({ v, P }: ViewProps) {
  return (
    <>
      <div>
        {P.empty ? (<>
          <div className="mt-4 bg-white border border-solid border-essi-line rounded-[10px] p-5">
            <div className="font-bold text-[16px] text-essi-dark">
              {"Registration successful — your employer account is approved"}
            </div>
            <p className="mt-1.5 mx-0 mb-3.5 text-ink-soft text-[14px]">
              {"Your dashboard has no data yet. Get started in three steps:"}
            </p>
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px] bg-[#eaf6ee] rounded-lg p-3 text-[14px]">
                <b>
                  {"1. Add employees"}
                </b>
                <br />
                {"Upload Excel/CSV or enter manually."}
              </div>
              <div className="flex-1 min-w-[200px] bg-[#eaf6ee] rounded-lg p-3 text-[14px]">
                <b>
                  {"2. Submit monthly contribution"}
                </b>
                <br />
                {"Available once employees are added."}
              </div>
              <div className="flex-1 min-w-[200px] bg-[#eaf6ee] rounded-lg p-3 text-[14px]">
                <b>
                  {"3. Pay challan"}
                </b>
                <br />
                {"Pay through your bank."}
              </div>
            </div>
          </div>
        </>) : null}
        <div className="border border-solid border-essi-line rounded-xl shadow-card mt-4 py-3.5 px-4.5 flex flex-wrap items-center justify-between gap-3 bg-essi-pale">
          <div className="text-[14px] text-ink flex-1 min-w-[220px]">
            <b>
              {"Next step:"}
            </b>
            {" "}{v.tip}
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button onClick={v.tipGo} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] font-semibold bg-essi-dark text-white border-0">
              {v.tipBtn}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5 mt-3.5">
          <button onClick={v.goReg} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M10 12a4 4 0 100-8 4 4 0 000 8zM3 21c0-4 3-6 7-6s7 2 7 6M19 8v6M16 11h6"}>
              </path>
            </svg>
            {"Register Employee"}
          </button>
          <button onClick={v.goCC} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M4 6h16v14H4zM4 11h16M8 3v4M16 3v4"}>
              </path>
            </svg>
            {"Create Contribution"}
          </button>
          <button onClick={v.goChallan} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
              <path d={"M7 3h8l4 4v14H7zM15 3v4h4M10 12h6M10 16h3"}>
              </path>
            </svg>
            {"View Challan"}
          </button>
        </div>
        <div className="mt-5.5 mx-0 mb-2.5 border-l-4 border-l-essi-green pl-2.5">
          <div className="text-[18px] font-bold text-essi-dark">
            {"Workforce overview"}
          </div>
          <div className="text-[13px] text-ink-muted">
            {"Employees registered under your establishment"}
          </div>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-3.5">
          {(v.cards || []).map((c: Any, _i7: number) => (<React.Fragment key={_i7}>
            <div className="flex items-center gap-3.5 bg-white border border-solid border-essi-line rounded-xl shadow-card p-4">
              <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center flex-none" style={{background: c.bg}}>
                <svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={c.fg} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={c.ic}>
                  </path>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-ink-muted">
                  {c.name}
                </div>
                <div className="text-[30px] font-bold text-essi-dark leading-[1.1]">
                  {c.val}
                </div>
              </div>
            </div>
          </React.Fragment>))}
        </div>
        <div className="flex flex-wrap items-end justify-between gap-2.5">
          <div className="mt-5.5 mx-0 mb-2.5 border-l-4 border-l-essi-green pl-2.5">
            <div className="text-[18px] font-bold text-essi-dark">
              {"Current contribution month"}
            </div>
            <div className="text-[13px] text-ink-muted">
              {"November, 2026"}
            </div>
          </div>
          <div className="mb-2.5">
            <button onClick={v.goCS} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                <path d={"M5 20V10M12 20V4M19 20v-7M3 20h18"}>
                </path>
              </svg>
              {"Contribution Summary"}
            </button>
          </div>
        </div>
        <div className="bg-white border border-solid border-essi-line rounded-xl shadow-card overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse"><tbody>
            <tr>
              <th className="p-3 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"Contribution Month"}
              </th>
              <th className="p-3 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"No. of Employees"}
              </th>
              <th className="p-3 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"Contribution Amount"}
              </th>
              <th className="p-3 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"Contribution Status"}
              </th>
              <th className="p-3 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"Payment Status"}
              </th>
            </tr>
            {v.noRows ? (<>
              <tr>
                <td colSpan={5} className="p-3 border border-solid border-essi-line text-[14px] text-ink-muted">
                  {"No records to display."}
                </td>
              </tr>
            </>) : null}
            {(v.rows || []).map((r: Any, _i8: number) => (<React.Fragment key={_i8}>
              <tr>
                <td className="p-3 border border-solid border-essi-line text-[14px]">
                  {r.a}
                </td>
                <td className="p-3 border border-solid border-essi-line text-[14px]">
                  {r.b}
                </td>
                <td className="p-3 border border-solid border-essi-line text-[14px]">
                  {r.c}
                </td>
                <td className="p-3 border border-solid border-essi-line text-[14px] font-bold text-essi-green">
                  {r.d}
                </td>
                <td className="p-3 border border-solid border-essi-line text-[14px] font-bold" style={{color: v.payCol}}>
                  {v.payStatus}
                </td>
              </tr>
            </React.Fragment>))}
          </tbody></table>
        </div>
      </div>
    </>
  );
}
