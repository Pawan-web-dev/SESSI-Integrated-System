/* Employer dashboard – Placeholder for menu items not built yet (Reports, Alerts, FAQs, ...) (markup taken from the approved design). */
import type { ViewProps } from '@/types/view';

export function ComingSoonSection({ v }: ViewProps) {
  return (
    <>
      <div className="mt-4">
        <div className="bg-essi-green text-white py-2.5 px-5 rounded-lg text-[16px] font-semibold">
          {v.selName}
        </div>
        <div className="bg-white border border-solid border-essi-line rounded-[10px] p-6 mt-3.5 text-[14px] text-ink-soft">
          <div className="text-ink-muted text-[13px]">
            {v.selGroup}{" › "}{v.selName}
          </div>
          <p className="mt-3 mx-0 mb-4.5">
            {"Screen content for “"}{v.selName}{"” appears here."}
          </p>
          <button onClick={v.goHome} className="min-h-[44px] py-0 px-4.5 border-0 rounded-lg bg-essi-dark text-white text-[14px]">
            {"← Back to Dashboard"}
          </button>
        </div>
      </div>
    </>
  );
}
