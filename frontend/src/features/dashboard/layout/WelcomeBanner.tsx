/* Employer dashboard – green welcome strip above every section (markup taken from the approved design). */
import type { ViewProps } from '@/types/view';

export function WelcomeBanner({ v, P }: ViewProps) {
  return (
    <>
      <div className="bg-[linear-gradient(90deg,#067a35,#2fae5f)] text-white py-4 px-5.5 rounded-xl flex flex-wrap items-center justify-between gap-y-2 gap-x-5">
        <div>
          <div className="text-[20px] font-bold">
            {"Welcome, "}{v.co.employer}
          </div>
          <div className="text-[13px] opacity-[.95] mt-0.5">
            {"Employer No. "}{P.empNo}{"  |  Approved Employer"}
          </div>
        </div>
        <div className="text-[13px] opacity-[.95]">
          {"Social Security Contribution Portal"}
        </div>
      </div>
    </>
  );
}
