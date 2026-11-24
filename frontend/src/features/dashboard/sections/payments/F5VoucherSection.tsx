/* Employer dashboard – Challans & Payments > F-5 Voucher (markup taken from the approved design). */
import logo from '@/assets/images/essi-logo.png';
import { ActionButton, PrintIcon } from '@/components/ui/ActionButton';
import type { ViewProps } from '@/types/view';

export function F5VoucherSection({ v, P }: ViewProps) {
  return (
    <>
      <div className="mt-4">
        <div className="flex items-center gap-2.5 bg-[#e8f6ec] border border-solid border-[#9fd3ae] rounded-lg py-3 px-4 text-[14px] text-essi-dark">
          <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
            <path d={"M5 12l5 5 9-10"}>
            </path>
          </svg>
          <span>
            <b>
              {"Late payment received."}
            </b>
            {" Your contribution for "}{v.lv.month}{" was paid "}{v.lv.days}{" days after the due date, so an increase under section 24(1) has been added."}
          </span>
        </div>
        <div className="print-area relative mt-3.5 bg-white border border-solid border-[#bbb] rounded-md p-5 overflow-hidden font-document text-ink-print">
          <div className="absolute right-[6%] top-37.5 [transform:rotate(-14deg)] border-4 border-solid border-essi-paid text-essi-paid rounded-[10px] py-0.5 px-4.5 [font:800_38px_Arial,sans-serif] tracking-[.1em] opacity-[.35] pointer-events-none">
            {"PAID"}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 text-center">
            <img src={logo} alt={"ESSI logo"} className="h-[78px] w-auto" />
            <div className="flex-1 min-w-[220px]">
              <div className="font-bold [font-size:clamp(15px,2.2vw,22px)] leading-[1.25]">
                {"SINDH EMPLOYEES' SOCIAL SECURITY INSTITUTION"}
                <br />
                {P.dir.toUpperCase()}
              </div>
              <div className="font-bold text-[12px] mt-2.5">
                {"ACCOUNT TITLE: SESSI COLLECTION ACCOUNT, ACCOUNT NUMBER: 0100000000000001 (sample)"}
              </div>
            </div>
            <div className="bg-[#f5c400] rounded-[50%] w-[68px] h-[68px] flex items-center justify-center [font:800_15px_Arial,sans-serif] text-essi-paid border-4 border-solid border-essi-paid box-border">
              {"1LINK"}
            </div>
          </div>
          <div className="flex flex-wrap justify-between items-center gap-y-2 gap-x-5 mt-4.5 mx-0 mb-3.5 text-[15px]">
            <span>
              {"Date: "}
              <b>
                {v.lv.paidOn}
              </b>
            </span>
            <span className="font-bold underline text-center flex-1 min-w-[240px]">
              {"ACKNOWLEDGMENT RECEIPT OF SOCIAL SECURITY CONTRIBUTIONS RECEIVED LATE (F-5)"}
            </span>
            <span>
              {"Voucher No. "}
              <b>
                {v.lv.voucher}
              </b>
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse"><tbody>
              <tr>
                <th className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px] bg-[#ececec] font-bold">
                  {"Month for which Contribution paid"}
                </th>
                <th className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px] bg-[#ececec] font-bold">
                  {"Regd. No. of Establishment"}
                </th>
                <th className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px] bg-[#ececec] font-bold">
                  {"Number of Workers"}
                </th>
                <th className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px] bg-[#ececec] font-bold">
                  {"Name of Establishment"}
                </th>
                <th className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px] bg-[#ececec] font-bold">
                  {"Contribution paid under section 20(1)"}
                </th>
                <th className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px] bg-[#ececec] font-bold">
                  {"Service Charges"}
                </th>
                <th className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px] bg-[#ececec] font-bold">
                  {"Amount of any increase under section 24"}
                </th>
                <th className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px] bg-[#ececec] font-bold">
                  {"Total Paid"}
                </th>
              </tr>
              <tr>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px]">
                  {v.lv.month}
                </td>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px]">
                  {P.empNo}
                </td>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px]">
                  {v.lv.emp}
                </td>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px]">
                  {P.coName.toUpperCase()}
                </td>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px]">
                  {"Rs. "}{v.lv.contrib}
                </td>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px]">
                  {"Rs. 40"}
                </td>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px]">
                  {"Rs. "}{v.lv.inc}
                </td>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px]">
                  {"Rs. "}{v.lv.total}
                </td>
              </tr>
            </tbody></table>
          </div>
          <div className="overflow-x-auto mt-3.5">
            <table className="w-full border-collapse"><tbody>
              <tr>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-[14px] text-left bg-[#f4f4f4] font-bold w-[34%]">
                  {"Payment status"}
                </td>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-[14px] text-left">
                  <b className="text-essi-paid">
                    {"PAID"}
                  </b>
                </td>
              </tr>
              <tr>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-[14px] text-left bg-[#f4f4f4] font-bold w-[34%]">
                  {"Payment channel"}
                </td>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-[14px] text-left">
                  {v.lv.channel}
                </td>
              </tr>
              <tr>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-[14px] text-left bg-[#f4f4f4] font-bold w-[34%]">
                  {"1Bill Payment No."}
                </td>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-[14px] text-left">
                  {"1009801"}{v.lv.voucher}
                </td>
              </tr>
              <tr>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-[14px] text-left bg-[#f4f4f4] font-bold w-[34%]">
                  {"Transaction / Reference ID"}
                </td>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-[14px] text-left">
                  {v.lv.txn}
                </td>
              </tr>
              <tr>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-[14px] text-left bg-[#f4f4f4] font-bold w-[34%]">
                  {"Paid on"}
                </td>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-[14px] text-left">
                  {v.lv.paidOn}{", 11:20 AM"}
                </td>
              </tr>
              <tr>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-[14px] text-left bg-[#f4f4f4] font-bold w-[34%]">
                  {"Due date"}
                </td>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-[14px] text-left">
                  {v.lv.due}
                </td>
              </tr>
              <tr>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-[14px] text-left bg-[#f4f4f4] font-bold w-[34%]">
                  {"Days late"}
                </td>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-[14px] text-left">
                  {v.lv.days}
                </td>
              </tr>
              <tr>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-[14px] text-left bg-[#f4f4f4] font-bold w-[34%]">
                  {"Increase under section 24(1)"}
                </td>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-[14px] text-left">
                  {"Rs. "}{v.lv.contrib}{" × 0.5% × "}{v.lv.days}{" days = "}{v.lv.pct}{"% = Rs. "}{v.lv.inc}{" (maximum 50% of the contribution)"}
                </td>
              </tr>
              <tr>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-[14px] text-left bg-[#f4f4f4] font-bold w-[34%]">
                  {"Amount paid"}
                </td>
                <td className="border border-solid border-ink-print py-2 px-2.5 text-[14px] text-left">
                  {"Rs. "}{v.lv.total}{" (Rupees "}{v.lv.words}{" ONLY)"}
                </td>
              </tr>
            </tbody></table>
          </div>
          <div className="flex flex-wrap justify-between items-end gap-4 mt-4">
            <div className="text-[13px] max-w-[560px]">
              {"This receipt is generated by the portal once 1LINK confirms the payment. Keep it with your records together with the bank or app payment slip. Officers of the Institution may inspect employers’ records under section 23."}
            </div>
            <div className="flex gap-2.5 items-center border border-solid border-[#6aa7e0] rounded-[10px] py-2 px-3 font-arial">
              <div className="text-[12px] text-[#1a4f9c] font-bold">
                {"Scan to verify"}
                <br />
                {"(sample)"}
              </div>
              <svg width={"84"} height={"84"} viewBox={"0 0 90 90"} role={"img"} aria-label={"Sample verification QR code"}>
                <path fillRule={"evenodd"} d={"M30 0h6v6h-6zM48 0h6v6h-6zM36 6h6v6h-6zM30 12h6v6h-6zM36 12h6v6h-6zM42 12h6v6h-6zM30 18h6v6h-6zM30 24h6v6h-6zM36 24h6v6h-6zM48 24h6v6h-6zM54 24h6v6h-6zM0 30h6v6h-6zM6 30h6v6h-6zM12 30h6v6h-6zM18 30h6v6h-6zM42 30h6v6h-6zM54 30h6v6h-6zM60 30h6v6h-6zM0 36h6v6h-6zM6 36h6v6h-6zM12 36h6v6h-6zM18 36h6v6h-6zM30 36h6v6h-6zM42 36h6v6h-6zM60 36h6v6h-6zM66 36h6v6h-6zM78 36h6v6h-6zM0 42h6v6h-6zM6 42h6v6h-6zM24 42h6v6h-6zM30 42h6v6h-6zM36 42h6v6h-6zM54 42h6v6h-6zM60 42h6v6h-6zM66 42h6v6h-6zM72 42h6v6h-6zM84 42h6v6h-6zM6 48h6v6h-6zM12 48h6v6h-6zM24 48h6v6h-6zM36 48h6v6h-6zM42 48h6v6h-6zM48 48h6v6h-6zM54 48h6v6h-6zM72 48h6v6h-6zM84 48h6v6h-6zM0 54h6v6h-6zM18 54h6v6h-6zM30 54h6v6h-6zM36 54h6v6h-6zM48 54h6v6h-6zM54 54h6v6h-6zM60 54h6v6h-6zM66 54h6v6h-6zM78 54h6v6h-6zM30 60h6v6h-6zM36 60h6v6h-6zM48 60h6v6h-6zM66 60h6v6h-6zM72 60h6v6h-6zM30 66h6v6h-6zM36 66h6v6h-6zM54 66h6v6h-6zM78 66h6v6h-6zM84 66h6v6h-6zM30 72h6v6h-6zM42 72h6v6h-6zM54 72h6v6h-6zM72 72h6v6h-6zM78 72h6v6h-6zM30 78h6v6h-6zM36 78h6v6h-6zM60 78h6v6h-6zM72 78h6v6h-6zM78 78h6v6h-6zM84 78h6v6h-6zM30 84h6v6h-6zM36 84h6v6h-6zM42 84h6v6h-6zM48 84h6v6h-6zM60 84h6v6h-6zM66 84h6v6h-6zM0 0h30v30h-30zM6 6v18h18v-18zM60 0h30v30h-30zM66 6v18h18v-18zM0 60h30v30h-30zM6 66v18h18v-18z"} fill={"#111"}>
                </path>
              </svg>
            </div>
          </div>
          <div className="font-arial text-[12px] text-[#555] mt-3">
            {"Increase is calculated at ½% per day, up to 50% of the contribution (section 24(1), SESS Act 2016, Amendment Act 2018);"}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <ActionButton variant="primary" onClick={v.printDoc} icon={<PrintIcon />}>
            Print Receipt
          </ActionButton>
          <button onClick={v.goF5} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-5 rounded-lg text-[14px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
            {"F-5 List"}
          </button>
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
