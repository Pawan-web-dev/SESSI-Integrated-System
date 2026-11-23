/* Employer dashboard – Dashboard > Contribution Summary (markup taken from the approved design). */
import React from 'react';
import type { Any, ViewProps } from '@/types/view';

export function ContributionSummarySection({ v }: ViewProps) {
  return (
    <>
      <div className="mt-4">
        <div className="bg-essi-green text-white py-2.5 px-5 rounded-lg text-[16px] font-semibold">
          {"CONTRIBUTION SUMMARY"}
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-3.5 mt-3.5">
          {(v.csKpis || []).map((k: Any, _i3: number) => (<React.Fragment key={_i3}>
            <div className="bg-white border border-solid border-essi-line rounded-xl shadow-card p-4" style={{borderTop: `4px solid ${k.fg}`}}>
              <div className="text-[13px] text-ink-muted">
                {k.label}
              </div>
              <div className="text-[24px] font-bold mt-1" style={{color: k.fg}}>
                {k.value}
              </div>
              <div className="text-[12px] text-ink-muted mt-0.5">
                {k.sub}
              </div>
            </div>
          </React.Fragment>))}
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-3.5 mt-3.5">
          <div className="bg-white border border-solid border-essi-line rounded-xl shadow-card p-4">
            <div className="font-bold text-essi-dark">
              {"Monthly contribution (PKR)"}
            </div>
            <div className="text-[12px] text-ink-muted mb-2">
              {"Green = paid, amber = payment pending"}
            </div>
            {v.noBars ? (<>
              <div className="py-10 px-2.5 text-center text-ink-muted text-[14px]">
                {"No contributions yet. The chart fills in after your first monthly contribution."}
              </div>
            </>) : null}
            <div className="flex items-end gap-2.5 h-[210px]">
              {(v.bars || []).map((b: Any, _i4: number) => (<React.Fragment key={_i4}>
                <div className="flex-1 min-w-0 h-full flex items-center justify-end flex-col">
                  <div className="text-[11px] text-ink-soft">
                    {b.val}
                  </div>
                  <div className="w-full max-w-[56px] rounded-[6px_6px_0_0] mt-1" style={{background: b.fill, height: `${b.h}px`}}>
                  </div>
                  <div className="text-[12px] mt-1.5">
                    {b.label}
                  </div>
                </div>
              </React.Fragment>))}
            </div>
          </div>
          <div className="bg-white border border-solid border-essi-line rounded-xl shadow-card p-4">
            <div className="font-bold text-essi-dark mb-2.5">
              {"Payment status"}
            </div>
            <div className="flex justify-between py-2.5 px-0 border-b border-b-essi-mint">
              <span>
                {"Paid"}
              </span>
              <b className="text-essi-green">
                {v.paidCount}
              </b>
            </div>
            <div className="flex justify-between py-2.5 px-0 border-b border-b-essi-mint">
              <span>
                {"Unpaid"}
              </span>
              <b className="text-warning">
                {v.unpaidCount}
              </b>
            </div>
            <div className="flex justify-between py-2.5 px-0">
              <span>
                {"Overdue"}
              </span>
              <b className="text-danger">
                {"0"}
              </b>
            </div>
            <div className="font-bold text-essi-dark mt-3.5 mx-0 mb-2">
              {"Employees by type"}
            </div>
            {v.noType ? (<>
              <div className="text-[14px] text-ink-muted">
                {"No employees yet."}
              </div>
            </>) : null}
            {(v.typeBars || []).map((t: Any, _i5: number) => (<React.Fragment key={_i5}>
              <div className="mb-2">
                <div className="flex justify-between text-[13px]">
                  <span>
                    {t.name}
                  </span>
                  <b>
                    {t.val}
                  </b>
                </div>
                <div className="h-[8px] bg-essi-mint rounded">
                  <div className="h-[8px] rounded" style={{background: t.color, width: `${t.pct}%`}}>
                  </div>
                </div>
              </div>
            </React.Fragment>))}
          </div>
        </div>
        <div className="font-bold text-essi-dark mt-4.5 mx-0 mb-2">
          {"Recent challans"}
        </div>
        <div className="bg-white border border-solid border-essi-line rounded-xl shadow-card overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse"><tbody>
            <tr>
              <th className="p-3 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"Month"}
              </th>
              <th className="p-3 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"Challan No."}
              </th>
              <th className="p-3 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"Amount (PKR)"}
              </th>
              <th className="p-3 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"Due date"}
              </th>
              <th className="p-3 border border-solid border-essi-line bg-essi-mint text-[13px] font-semibold text-left">
                {"Status"}
              </th>
            </tr>
            {v.noHist ? (<>
              <tr>
                <td colSpan={5} className="p-3 border border-solid border-essi-line text-[14px] text-ink-muted">
                  {"No challans yet."}
                </td>
              </tr>
            </>) : null}
            {(v.histRows || []).map((h: Any, _i6: number) => (<React.Fragment key={_i6}>
              <tr>
                <td className="p-3 border border-solid border-essi-line text-[14px]">
                  {h.m}
                </td>
                <td className="p-3 border border-solid border-essi-line text-[14px]">
                  {h.ch}
                </td>
                <td className="p-3 border border-solid border-essi-line text-[14px]">
                  {h.amt}
                </td>
                <td className="p-3 border border-solid border-essi-line text-[14px]">
                  {h.due}
                </td>
                <td className="p-3 border border-solid border-essi-line text-[14px] font-bold" style={{color: h.col}}>
                  {h.status}
                </td>
              </tr>
            </React.Fragment>))}
          </tbody></table>
        </div>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <button onClick={v.goHist} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
            {"Payment History"}
          </button>
          <button onClick={v.goHome} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
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
