/* Employer dashboard – Employee Management > Profile for Contribution (markup taken from the approved design). */
import React from 'react';
import type { Any, ViewProps } from '@/types/view';

export function EmployeeProfilesSection({ v }: ViewProps) {
  return (
    <>
      <div className="mt-4">
        <div className="bg-essi-green text-white py-2.5 px-5 rounded-lg text-[16px] font-semibold">
          {"EMPLOYEE PROFILE FOR CONTRIBUTION"}
        </div>
        {v.hasMsg ? (<>
          <div role={"status"} className="mt-3 bg-[#e8f6ec] border border-solid border-[#9fd3ae] rounded-lg py-3 px-4 text-[14px] text-essi-dark">
            {v.savedMsg}
          </div>
        </>) : null}
        {v.pView ? (<>
          <div className="bg-white border border-solid border-essi-line rounded-[10px] mt-3 p-4">
            <div className="flex items-center gap-3.5">
              {v.pHasPh ? (<>
                <img src={v.pPhoto} alt={""} width={"84"} height={"84"} className="w-[84px] h-[84px] rounded-[50%] object-cover border-2 border-solid border-essi-green" />
              </>) : null}
              <div className="font-bold text-[16px] text-essi-dark">
                {v.pName}{" "}
                <span className="font-normal text-[13px] text-ink-muted">
                  {"("}{v.pCnic}{")"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-y-1 gap-x-4 mt-2.5">
              {(v.pFields || []).map((p: Any, _i9: number) => (<React.Fragment key={_i9}>
                <div className="py-1.5 px-0 border-b border-b-essi-mint">
                  <div className="text-[12px] text-ink-muted">
                    {p.l}
                  </div>
                  <div className="text-[14px] font-semibold">
                    {p.v}
                  </div>
                </div>
              </React.Fragment>))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2.5">
              <button onClick={v.editFromPanel} className="min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] font-semibold bg-essi-dark text-white border-0">
                {"Edit"}
              </button>
              <button onClick={v.closeP} className="min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
                {"Close"}
              </button>
            </div>
          </div>
        </>) : null}
        {v.pDel ? (<>
          <div role={"alertdialog"} className="mt-3 bg-danger-bg border border-solid border-[#f3b9b3] rounded-[10px] p-4">
            <div className="font-bold text-[#7a1b12]">
              {"Delete "}{v.pName}{"?"}
            </div>
            <p className="mt-1.5 mx-0 mb-3 text-[14px] text-[#5a1b14]">
              {"This removes the employee record ("}{v.pCnic}{") from the list. In the real system, an employee who already has contribution history should be marked Separated instead of deleted."}
            </p>
            <div className="flex flex-wrap gap-2.5">
              <button onClick={v.delOk} className="min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] font-semibold bg-danger text-white border-0">
                {"Delete employee"}
              </button>
              <button onClick={v.closeP} className="min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
                {"Cancel"}
              </button>
            </div>
          </div>
        </>) : null}
        {v.pSep ? (<>
          <div role={"alertdialog"} className="mt-3 bg-[#fff8e1] border border-solid border-[#f0d78a] rounded-[10px] p-4">
            <div className="font-bold text-[#5a4b10]">
              {"Mark "}{v.pName}{" as Separated?"}
            </div>
            <p className="mt-1.5 mx-0 mb-3 text-[14px] text-[#5a4b10]">
              {"The employee stays in your records but is no longer counted as active for future contributions."}
            </p>
            <div className="flex flex-wrap gap-2.5">
              <button onClick={v.sepOk} className="min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] font-semibold bg-[#8a4b00] text-white border-0">
                {"Mark as Separated"}
              </button>
              <button onClick={v.closeP} className="min-h-[44px] py-0 px-4.5 rounded-lg text-[14px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
                {"Cancel"}
              </button>
            </div>
          </div>
        </>) : null}
        <div className="mt-3.5 bg-white border border-solid border-essi-line rounded-lg">
          <div className="py-2.5 px-3.5 bg-[#eaf6ee] border-b border-b-essi-line">
            <button onClick={v.goReg} className="min-h-[44px] py-0 px-4 border-0 rounded-lg bg-essi-green text-white text-[14px]">
              {"+ Add New Employee for Contribution"}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse"><tbody>
              <tr className="bg-essi-mint">
                <th className="p-2.5 border border-solid border-[#d9d4a8] text-left text-[13px] font-semibold">
                  {"Sr. No."}
                </th>
                <th className="p-2.5 border border-solid border-[#d9d4a8] text-left text-[13px] font-semibold">
                  {"Name of Employee"}
                </th>
                <th className="p-2.5 border border-solid border-[#d9d4a8] text-left text-[13px] font-semibold">
                  {"CNIC No."}
                </th>
                <th className="p-2.5 border border-solid border-[#d9d4a8] text-left text-[13px] font-semibold">
                  {"Designation"}
                </th>
                <th className="p-2.5 border border-solid border-[#d9d4a8] text-left text-[13px] font-semibold">
                  {"Employment Type"}
                </th>
                <th className="p-2.5 border border-solid border-[#d9d4a8] text-left text-[13px] font-semibold">
                  {"Status"}
                </th>
                <th className="p-2.5 border border-solid border-[#d9d4a8] text-left text-[13px] font-semibold">
                  {"View"}
                </th>
                <th className="p-2.5 border border-solid border-[#d9d4a8] text-left text-[13px] font-semibold">
                  {"Edit"}
                </th>
                <th className="p-2.5 border border-solid border-[#d9d4a8] text-left text-[13px] font-semibold">
                  {"Promotion"}
                </th>
                <th className="p-2.5 border border-solid border-[#d9d4a8] text-left text-[13px] font-semibold">
                  {"Separation"}
                </th>
                <th className="p-2.5 border border-solid border-[#d9d4a8] text-left text-[13px] font-semibold">
                  {"Status"}
                </th>
                <th className="p-2.5 border border-solid border-[#d9d4a8] text-left text-[13px] font-semibold">
                  {"Delete"}
                </th>
              </tr>
              <tr>
                <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px]">
                </td>
                <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px]">
                </td>
                <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px]">
                  <input aria-label={"Filter CNIC No."} className="w-full min-h-[32px] box-border border border-solid border-[#bbb] rounded" />
                </td>
                <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px]">
                  <input aria-label={"Filter Designation"} className="w-full min-h-[32px] box-border border border-solid border-[#bbb] rounded" />
                </td>
                <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px]">
                  <input aria-label={"Filter Employment Type"} className="w-full min-h-[32px] box-border border border-solid border-[#bbb] rounded" />
                </td>
                <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px]">
                  <input aria-label={"Filter Status"} className="w-full min-h-[32px] box-border border border-solid border-[#bbb] rounded" />
                </td>
                <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px]">
                </td>
                <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px]">
                </td>
                <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px]">
                </td>
                <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px]">
                </td>
                <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px]">
                  <input aria-label={"Filter Status"} className="w-full min-h-[32px] box-border border border-solid border-[#bbb] rounded" />
                </td>
                <td className="p-2.5 border border-solid border-[#e6e2c4]">
                </td>
              </tr>
              {v.noEmp ? (<>
                <tr>
                  <td colSpan={12} className="border border-solid border-[#e6e2c4] text-[13px] text-ink-muted p-4.5">
                    {"No records to display. Click “Add New Employee for Contribution” to register your first employee."}
                  </td>
                </tr>
              </>) : null}
              {(v.empRows || []).map((e: Any, _i10: number) => (<React.Fragment key={_i10}>
                <tr>
                  <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px]">
                    {e.n}
                  </td>
                  <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px]">
                    <div className="flex gap-2.5 items-center">
                      {e.hasPh ? (<>
                        <img src={e.photo} alt={""} width={"44"} height={"44"} className="w-[44px] h-[44px] rounded-[50%] object-cover border border-solid border-essi-line" />
                      </>) : null}
                      {e.noPh ? (<>
                        <svg className="rounded-[50%]" width={"44"} height={"44"} viewBox={"0 0 44 44"} aria-hidden={"true"}>
                          <rect width={"44"} height={"44"} fill={"#d9d9d9"}>
                          </rect>
                          <circle cx={"22"} cy={"17"} r={"8"} fill={"#fff"}>
                          </circle>
                          <path d={"M6 44c0-10 7-14 16-14s16 4 16 14z"} fill={"#fff"}>
                          </path>
                        </svg>
                      </>) : null}
                      <span>
                        {e.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px]">
                    {e.cnic}
                  </td>
                  <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px]">
                    {e.des}
                  </td>
                  <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px]">
                    {e.type}
                  </td>
                  <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px]">
                    <b style={{color: e.scol}}>
                      {e.status}
                    </b>
                  </td>
                  <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px] text-center">
                    <button onClick={e.vw} aria-label={"View"} className="min-w-[44px] min-h-[44px] border-0 bg-transparent text-essi-dark">
                      <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} aria-hidden={"true"}>
                        <path d={"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"}>
                        </path>
                        <circle cx={"12"} cy={"12"} r={"3"}>
                        </circle>
                      </svg>
                    </button>
                  </td>
                  <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px] text-center">
                    <button onClick={e.ed} aria-label={"Edit"} className="min-w-[44px] min-h-[44px] border-0 bg-transparent text-essi-dark">
                      <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} aria-hidden={"true"}>
                        <path d={"M4 20h4L19 9l-4-4L4 16z"}>
                        </path>
                      </svg>
                    </button>
                  </td>
                  <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px] text-center">
                    <button aria-label={"Promotion"} className="min-w-[44px] min-h-[44px] border-0 bg-transparent text-essi-dark">
                      <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} aria-hidden={"true"}>
                        <path d={"M12 20V6M6 12l6-6 6 6"}>
                        </path>
                      </svg>
                    </button>
                  </td>
                  <td className="p-2.5 border border-solid border-[#e6e2c4] text-[13px] text-center">
                    <button onClick={e.sp} aria-label={"Separation"} className="min-w-[44px] min-h-[44px] border-0 bg-transparent text-essi-dark">
                      <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} aria-hidden={"true"}>
                        <circle cx={"9"} cy={"8"} r={"4"}>
                        </circle>
                        <path d={"M2 20c0-4 3-6 7-6M16 14l6 6M22 14l-6 6"}>
                        </path>
                      </svg>
                    </button>
                  </td>
                  <td className="p-2.5 border border-solid border-[#e6e2c4] text-center text-[20px]" style={{color: e.col}}>
                    {e.canTg ? (<>
                      <button onClick={e.tg} aria-label={"Change status"} className="min-w-[44px] min-h-[44px] border-0 bg-transparent text-[20px]" style={{color: e.col}}>
                        {e.mark}
                      </button>
                    </>) : null}
                    {e.noTg ? (<>
                      <span>
                        {"-"}
                      </span>
                    </>) : null}
                  </td>
                  <td className="p-2.5 border border-solid border-[#e6e2c4] text-center">
                    <button onClick={e.dl} aria-label={"Delete"} className="min-w-[44px] min-h-[44px] border-0 bg-transparent text-danger">
                      <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                        <path d={"M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"}>
                        </path>
                      </svg>
                    </button>
                  </td>
                </tr>
              </React.Fragment>))}
            </tbody></table>
          </div>
          <div className="py-2.5 px-3.5 text-[13px] text-ink-muted">
            {v.empNote}
          </div>
        </div>
      </div>
    </>
  );
}
