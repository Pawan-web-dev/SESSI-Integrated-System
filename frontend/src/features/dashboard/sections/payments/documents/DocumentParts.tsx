/* Building blocks shared by the printable payment documents (receipt, F-4 return). */
import type { ReactNode } from 'react';
import logo from '@/assets/images/essi-logo.png';

/** Table cell classes for printed documents. */
export const DOC_TH = 'border border-solid border-ink-print px-2.5 py-2 text-center text-[14px] bg-[#ececec] font-bold';
export const DOC_TD = 'border border-solid border-ink-print px-2.5 py-2 text-center text-[14px]';
export const DOC_LABEL = 'border border-solid border-ink-print px-2.5 py-2 text-left text-[14px] bg-[#f4f4f4] font-bold w-[34%]';
export const DOC_VALUE = 'border border-solid border-ink-print px-2.5 py-2 text-left text-[14px]';

/** Paper sheet. Everything inside is what gets printed. */
export function DocumentSheet({ children }: { children: ReactNode }) {
  return <div className="print-area relative mt-3.5 overflow-hidden rounded-md border border-solid border-[#bbb] bg-white p-5 font-document text-ink-print">{children}</div>;
}

/** Diagonal "PAID" stamp. */
export function PaidStamp() {
  return (
    <div className="pointer-events-none absolute right-[6%] top-[150px] rotate-[-14deg] rounded-[10px] border-4 border-solid border-essi-paid px-[18px] py-0.5 font-arial text-[38px] font-extrabold tracking-[.1em] text-essi-paid opacity-35">
      PAID
    </div>
  );
}

/** Logo, institution name, directorate and the 1LINK badge. */
export function DocumentHeader({ directorate }: { directorate: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-center">
      <img src={logo} alt="ESSI logo" className="h-[78px] w-auto" />
      <div className="min-w-[220px] flex-1">
        <div className="text-[clamp(15px,2.2vw,22px)] font-bold leading-[1.25]">
          SINDH EMPLOYEES&apos; SOCIAL SECURITY INSTITUTION
          <br />
          {directorate.toUpperCase()}
        </div>
        <div className="mt-2.5 text-[12px] font-bold">ACCOUNT TITLE: SESSI COLLECTION ACCOUNT, ACCOUNT NUMBER: 0100000000000001 (sample)</div>
      </div>
      <div className="box-border flex h-[68px] w-[68px] items-center justify-center rounded-full border-4 border-solid border-essi-paid bg-[#f5c400] font-arial text-[15px] font-extrabold text-essi-paid">1LINK</div>
    </div>
  );
}

/** "Date / title / number" line under the header. */
export function DocumentTitleRow({ left, title, right }: { left: ReactNode; title: string; right: ReactNode }) {
  return (
    <div className="mb-3.5 mt-[18px] flex flex-wrap items-center justify-between gap-x-5 gap-y-2 text-[15px]">
      <span>{left}</span>
      <span className="min-w-[240px] flex-1 text-center font-bold underline">{title}</span>
      <span>{right}</span>
    </div>
  );
}

/** Footer note with the sample verification QR code. */
export function DocumentFooter({ note }: { note: string }) {
  return (
    <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-[560px] text-[13px]">{note}</div>
      <div className="flex items-center gap-2.5 rounded-[10px] border border-solid border-[#6aa7e0] px-3 py-2 font-arial">
        <div className="text-[12px] font-bold text-[#1a4f9c]">
          Scan to verify
          <br />
          (sample)
        </div>
        <svg width="84" height="84" viewBox="0 0 90 90" role="img" aria-label="Sample verification QR code">
          <path fillRule="evenodd" d="M30 0h6v6h-6zM48 0h6v6h-6zM36 6h6v6h-6zM30 12h6v6h-6zM36 12h6v6h-6zM42 12h6v6h-6zM30 18h6v6h-6zM30 24h6v6h-6zM36 24h6v6h-6zM48 24h6v6h-6zM54 24h6v6h-6zM0 30h6v6h-6zM6 30h6v6h-6zM12 30h6v6h-6zM18 30h6v6h-6zM42 30h6v6h-6zM54 30h6v6h-6zM60 30h6v6h-6zM0 36h6v6h-6zM6 36h6v6h-6zM12 36h6v6h-6zM18 36h6v6h-6zM30 36h6v6h-6zM42 36h6v6h-6zM60 36h6v6h-6zM66 36h6v6h-6zM78 36h6v6h-6zM0 42h6v6h-6zM6 42h6v6h-6zM24 42h6v6h-6zM30 42h6v6h-6zM36 42h6v6h-6zM54 42h6v6h-6zM60 42h6v6h-6zM66 42h6v6h-6zM72 42h6v6h-6zM84 42h6v6h-6zM6 48h6v6h-6zM12 48h6v6h-6zM24 48h6v6h-6zM36 48h6v6h-6zM42 48h6v6h-6zM48 48h6v6h-6zM54 48h6v6h-6zM72 48h6v6h-6zM84 48h6v6h-6zM0 54h6v6h-6zM18 54h6v6h-6zM30 54h6v6h-6zM36 54h6v6h-6zM48 54h6v6h-6zM54 54h6v6h-6zM60 54h6v6h-6zM66 54h6v6h-6zM78 54h6v6h-6zM30 60h6v6h-6zM36 60h6v6h-6zM48 60h6v6h-6zM66 60h6v6h-6zM72 60h6v6h-6zM30 66h6v6h-6zM36 66h6v6h-6zM54 66h6v6h-6zM78 66h6v6h-6zM84 66h6v6h-6zM30 72h6v6h-6zM42 72h6v6h-6zM54 72h6v6h-6zM72 72h6v6h-6zM78 72h6v6h-6zM30 78h6v6h-6zM36 78h6v6h-6zM60 78h6v6h-6zM72 78h6v6h-6zM78 78h6v6h-6zM84 78h6v6h-6zM30 84h6v6h-6zM36 84h6v6h-6zM42 84h6v6h-6zM48 84h6v6h-6zM60 84h6v6h-6zM66 84h6v6h-6zM0 0h30v30h-30zM6 6v18h18v-18zM60 0h30v30h-30zM66 6v18h18v-18zM0 60h30v30h-30zM6 66v18h18v-18z" fill="#111" />
        </svg>
      </div>
    </div>
  );
}
