/* Employer dashboard – left navigation menu (markup taken from the approved design). */
import React from 'react';
import type { Any, ViewProps } from '@/types/view';

export function DashboardSidebar({ v, P }: ViewProps) {
  return (
    <>
      <aside className={`sb ${v.sbOpen} w-[270px] bg-white border-r border-r-essi-line py-4.5 px-0 box-border flex-none`}>
        <div className="pt-0 px-4 pb-2">
          <div className="font-bold text-[17px]">
            {P.coName}
          </div>
          <span className="inline-block mt-1.5 bg-essi-tint text-essi-dark rounded-xl py-0.75 px-2.5 text-[12px] font-semibold">
            {"Approved Employer"}
          </span>
        </div>
        <nav>
          {(v.groups || []).map((g: Any, _i1: number) => (<React.Fragment key={_i1}>
            {g.hasHead ? (<>
              <div className="mt-4.5 mx-4 mb-2 text-[11px] tracking-[.08em] text-ink-muted">
                {g.head}
              </div>
            </>) : null}
            <button onClick={g.toggle} className="flex items-center gap-3 w-full min-h-[44px] py-0 px-4 border-0 text-[14px] text-left" style={{borderBottom: "1px solid #eef5f0", background: g.bg, color: g.fg}}>
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={g.icc} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
                <path d={g.ic}>
                </path>
              </svg>
              <span className="flex-1">
                {g.name}
              </span>
              <span className="text-[20px] leading-[1] w-[20px] text-center">
                {g.sign}
              </span>
            </button>
            {g.isOpen ? (<>
              <div className="bg-[#f6fbf8]">
                {(g.subs || []).map((s: Any, _i2: number) => (<React.Fragment key={_i2}>
                  <button onClick={s.pick} className="block w-full min-h-[40px] pt-0 pr-4 pb-0 pl-11 border-0 text-left text-[13px]" style={{background: s.bg, color: s.fg, fontWeight: s.fw}}>
                    {s.name}
                  </button>
                </React.Fragment>))}
              </div>
            </>) : null}
          </React.Fragment>))}
        </nav>
        <div className="mt-5.5 mx-3.5 mb-0 bg-[#eaf6ee] border border-solid border-essi-line rounded-[10px] p-3.5 text-[13px]">
          <b>
            {"Need assistance?"}
          </b>
          <p className="mt-1.5 mx-0 mb-2.5 text-ink-soft">
            {"Contact ESSI support for help with your employer account."}
          </p>
          <a href={"#"} onClick={(e: Any) => e.preventDefault()} className="text-essi-green font-bold no-underline">
            {"Contact Support →"}
          </a>
        </div>
        <div className="mt-3.5 mx-3.5 mb-0">
          <button type={"button"} onClick={v.logout} className="flex items-center justify-center gap-2 w-full min-h-[44px] border border-solid border-danger rounded-lg bg-white text-danger [font:inherit] cursor-pointer" style={{fontWeight: "600"}}>
            <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
              <path d={"M9 4H5a1 1 0 00-1 1v14a1 1 0 001 1h4M16 8l4 4-4 4M20 12H9"}>
              </path>
            </svg>
            {"Log out"}
          </button>
        </div>
      </aside>
    </>
  );
}
