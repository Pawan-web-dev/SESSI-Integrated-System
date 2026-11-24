/* Employer dashboard – Challans & Payments > Generate Challan (markup taken from the approved design). */
import logo from '@/assets/images/essi-logo.png';
import type { ViewProps } from '@/types/view';

export function GenerateChallanSection({ v, P }: ViewProps) {
  return (
    <>
      <div className="mt-4">
        <div className="bg-essi-green text-white py-2.5 px-5 rounded-lg text-[16px] font-semibold">
          {"CHALLAN / ACKNOWLEDGMENT RECEIPT"}
        </div>
        {v.noChallan ? (<>
          <div className="bg-white border border-solid border-essi-line rounded-[10px] mt-3.5 py-9 px-4 text-center">
            <div className="font-bold text-[18px] text-essi-dark">
              {"No challan yet"}
            </div>
            <p className="text-ink-soft text-[14px] mt-2 mx-0 mb-0">
              {"A challan is generated after your monthly contribution is submitted and approved by ESSI."}
            </p>
          </div>
        </>) : null}
        {v.hasChallan ? (<>
          <div>
            <div className="flex items-center gap-2.5 mt-3.5 bg-[#e8f6ec] border border-solid border-[#9fd3ae] rounded-lg py-3 px-4 text-[14px] text-essi-dark">
              <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                <path d={"M5 12l5 5 9-10"}>
                </path>
              </svg>
              <span>
                {"Your contribution for "}
                <b>
                  {v.ch.month}
                </b>
                {" has been "}
                <b>
                  {"approved"}
                </b>
                {" on " + v.ch.approvedOn + ". Challan " + v.ch.challanNo + " is due by " + v.ch.due + ". Status: "}
                <b>
                  {v.payStatus}
                </b>
              </span>
            </div>
            <div className="mt-3.5 bg-white border border-solid border-[#bbb] rounded-md p-5 font-document text-ink-print">
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
                    {v.ch.date}
                  </b>
                </span>
                <span className="font-bold underline text-center flex-1 min-w-[240px]">
                  {"ACKNOWLEDGMENT RECEIPT OF C1 SCHEDULE (UNDER SECTION 20)"}
                </span>
                <span>
                  {"Voucher No. "}
                  <b>
                    {v.ch.voucher}
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
                      {"Contribution payable under section 20(1)"}
                    </th>
                    <th className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px] bg-[#ececec] font-bold">
                      {"Service Charges"}
                    </th>
                    <th className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px] bg-[#ececec] font-bold">
                      {"Amount of any increase under section 24"}
                    </th>
                    <th className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px] bg-[#ececec] font-bold">
                      {"Total"}
                    </th>
                  </tr>
                  <tr>
                    <td className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px]">
                      {v.ch.month}
                    </td>
                    <td className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px]">
                      {P.empNo}
                    </td>
                    <td className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px]">
                      {v.ch.workers}
                    </td>
                    <td className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px]">
                      {P.coName.toUpperCase()}
                    </td>
                    <td className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px]">
                      {"Rs. " + v.ch.contribution}
                    </td>
                    <td className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px]">
                      {"Rs. " + v.ch.svc}
                    </td>
                    <td className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px]">
                      {"Rs. " + v.ch.increase}
                    </td>
                    <td className="border border-solid border-ink-print py-2 px-2.5 text-center text-[14px]">
                      {"Rs. " + v.ch.total}
                    </td>
                  </tr>
                </tbody></table>
              </div>
              <p className="text-[14px] my-2.5 mx-0">
                {"Amount payable within due date: Rupees "}
                <u>
                  {v.ch.words + " ONLY"}
                </u>
                {". Made up as shown above"}
              </p>
              <div className="text-[14px]">
                <div>
                  <b>
                    {"1."}
                  </b>
                  {" "}
                  <b>
                    {"SESSI"}
                  </b>
                  {" is pleased to inform that besides the payment channels of MCB, you can now also pay your monthly contribution using 1LINK payment channels for payment. Please follow the below instructions:"}
                </div>
                <div className="mt-1.5 mr-0 mb-2 ml-7">
                  <div className="my-0.75 mx-0">
                    <b>
                      {"Step-1:"}
                    </b>
                    {" Go to Bill Payment"}
                  </div>
                  <div className="my-0.75 mx-0">
                    <b>
                      {"Step-2:"}
                    </b>
                    {" Select 1Bill"}
                  </div>
                  <div className="my-0.75 mx-0">
                    <b>
                      {"Step-3:"}
                    </b>
                    {" Select Voucher/Invoice"}
                  </div>
                  <div className="my-0.75 mx-0">
                    <b>
                      {"Step-4:"}
                    </b>
                    {" Enter eight-digit 1BILL prefix "}
                    <b>
                      {"“1009801”"}
                    </b>
                    {" followed by ten-digit SESSI Voucher No. e.g. "}
                    <b>
                      {"10098012611004512"}
                    </b>
                  </div>
                  <div className="my-0.75 mx-0">
                    <b>
                      {"Step-5:"}
                    </b>
                    {" Verify bill details"}
                  </div>
                  <div className="my-0.75 mx-0">
                    <b>
                      {"Step-6:"}
                    </b>
                    {" Enter Pin/OTP"}
                  </div>
                  <div className="my-0.75 mx-0">
                    <b>
                      {"Step-7:"}
                    </b>
                    {" Pay amount"}
                  </div>
                </div>
                <div className="my-1 mx-0">
                  <b>
                    {"2."}
                  </b>
                  {" The deadline for payment submission will be the last day of the month. Kindly pay before the last date to avoid penalty."}
                </div>
                <div className="my-1 mx-0">
                  <b>
                    {"3."}
                  </b>
                  {" Service Charges Amounting PKR " + v.ch.svc + " + 1Link Standard Charges will be paid by depositor/employer."}
                </div>
              </div>
              <div className="flex flex-wrap justify-between items-end gap-4 mt-4">
                <div className="text-[14px]">
                  <div className="font-bold underline text-[16px]">
                    {"STANDARD CHARGES OF 1LINK"}
                  </div>
                  <div className="italic font-bold underline mt-0.75 mx-0 mb-1.5">
                    {"Transaction fee is managed in light of SBP FD Circular # 4 of 2019"}
                  </div>
                  <div>
                    {"• Upto 100k          Rs. 10/- per transaction"}
                  </div>
                  <div>
                    {"• 100k to 1 Million    Rs. 20/- per transaction"}
                  </div>
                  <div>
                    {"• 1 Million +        Rs. 50/- per transaction"}
                  </div>
                </div>
                <div className="flex gap-3 items-center border border-solid border-[#6aa7e0] rounded-[10px] py-2.5 px-3.5 font-arial">
                  <div>
                    <div className="font-bold text-[#1a4f9c] text-[13px]">
                      {"FBR Digital Invoicing System"}
                    </div>
                    <div className="text-[12px] mt-1.5 text-[#1a4f9c] font-bold">
                      {"FBR Invoice Number"}
                    </div>
                    <div className="text-[12px]">
                      {"SAMPLE-0000000000000000"}
                    </div>
                  </div>
                  <svg width={"90"} height={"90"} viewBox={"0 0 90 90"} role={"img"} aria-label={"Sample QR code"}>
                    <path fillRule={"evenodd"} d={"M30 0h6v6h-6zM36 0h6v6h-6zM48 0h6v6h-6zM30 6h6v6h-6zM36 6h6v6h-6zM48 6h6v6h-6zM54 6h6v6h-6zM30 12h6v6h-6zM36 12h6v6h-6zM42 12h6v6h-6zM54 12h6v6h-6zM30 18h6v6h-6zM54 18h6v6h-6zM36 24h6v6h-6zM48 24h6v6h-6zM54 24h6v6h-6zM0 30h6v6h-6zM6 30h6v6h-6zM18 30h6v6h-6zM36 30h6v6h-6zM48 30h6v6h-6zM54 30h6v6h-6zM60 30h6v6h-6zM72 30h6v6h-6zM78 30h6v6h-6zM0 36h6v6h-6zM6 36h6v6h-6zM24 36h6v6h-6zM54 36h6v6h-6zM66 36h6v6h-6zM72 36h6v6h-6zM84 36h6v6h-6zM0 42h6v6h-6zM6 42h6v6h-6zM36 42h6v6h-6zM60 42h6v6h-6zM78 42h6v6h-6zM0 48h6v6h-6zM30 48h6v6h-6zM36 48h6v6h-6zM48 48h6v6h-6zM54 48h6v6h-6zM60 48h6v6h-6zM66 48h6v6h-6zM72 48h6v6h-6zM84 48h6v6h-6zM0 54h6v6h-6zM6 54h6v6h-6zM18 54h6v6h-6zM24 54h6v6h-6zM54 54h6v6h-6zM60 54h6v6h-6zM66 54h6v6h-6zM84 54h6v6h-6zM30 60h6v6h-6zM36 60h6v6h-6zM42 60h6v6h-6zM48 60h6v6h-6zM60 60h6v6h-6zM66 60h6v6h-6zM72 60h6v6h-6zM78 60h6v6h-6zM60 66h6v6h-6zM30 72h6v6h-6zM36 72h6v6h-6zM42 72h6v6h-6zM54 72h6v6h-6zM60 72h6v6h-6zM66 72h6v6h-6zM72 72h6v6h-6zM78 72h6v6h-6zM84 72h6v6h-6zM30 78h6v6h-6zM36 78h6v6h-6zM42 78h6v6h-6zM48 78h6v6h-6zM54 78h6v6h-6zM72 78h6v6h-6zM78 78h6v6h-6zM84 78h6v6h-6zM30 84h6v6h-6zM36 84h6v6h-6zM54 84h6v6h-6zM60 84h6v6h-6zM66 84h6v6h-6zM72 84h6v6h-6zM78 84h6v6h-6zM84 84h6v6h-6zM0 0h30v30h-30zM6 6v18h18v-18zM60 0h30v30h-30zM66 6v18h18v-18zM0 60h30v30h-30zM6 66v18h18v-18z"} fill={"#111"}>
                    </path>
                  </svg>
                </div>
              </div>
              <div className="font-arial text-[12px] text-[#555] mt-3">
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2.5 items-center">
              {v.notPaidNow ? (<>
                <button onClick={v.goPay} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-5 rounded-lg text-[14px] font-semibold bg-essi-dark text-white border-0">
                  <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                    <path d={"M3 6h18v12H3zM3 10h18M7 15h3"}>
                    </path>
                  </svg>
                  {v.paying ? "Processing payment…" : "Pay via 1Bill"}
                </button>
              </>) : null}
              {v.isPaidNow ? (<>
                <span className="text-essi-green font-bold">
                  {"Payment received."}
                </span>
                <button onClick={v.goReceipt} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-5 rounded-lg text-[14px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
                  {"View Receipt"}
                </button>
              </>) : null}
              <button onClick={v.goHome} className="inline-flex items-center gap-2 min-h-[44px] py-0 px-5 rounded-lg text-[14px] font-semibold bg-white text-essi-green border border-solid border-essi-green">
                <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                  <path d={"M15 6l-6 6 6 6"}>
                  </path>
                </svg>
                {"Back to Dashboard"}
              </button>
            </div>
          </div>
        </>) : null}
      </div>
    </>
  );
}
