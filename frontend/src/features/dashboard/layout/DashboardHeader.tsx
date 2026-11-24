/* Employer dashboard – top banner (logo, notifications, user menu) (markup taken from the approved design). */
import logo from '@/assets/images/essi-logo.png';
import type { ViewProps } from '@/types/view';

export function DashboardHeader({ v, P }: ViewProps) {
  return (
    <>
      <header className="hd relative @container aspect-[1536/208] w-full text-white">
        <img className="hl absolute left-[20.8%] top-[5.5%] h-[70%] w-auto" src={logo} alt={"ESSI Sindh logo"} />
        <div className="hv absolute left-[31.8%] top-[16%] h-[46%] w-[2px] bg-essi-deep">
        </div>
        <div className="ht absolute left-[33.4%] top-[21%] font-bold [font-size:max(15px,1.75cqw)] leading-[1.3] text-essi-deep">
          {"Employees’ Social Security Institution"}
          <br />
          {"Sindh"}
        </div>
        <div className="hr absolute right-[1.6%] top-0 h-[50%] flex items-center gap-3.5 [font-size:max(12px,.95cqw)]">
          <svg width={"26"} height={"26"} viewBox={"0 0 24 24"} fill={"#fff"} aria-label={"Home"} role={"img"}>
            <path d={"M12 3l10 9h-3v9h-5v-6h-4v6H5v-9H2z"}>
            </path>
          </svg>
          <span className="w-[2px] h-[28px] bg-white">
          </span>
          <button className="relative min-w-[44px] min-h-[44px] bg-transparent border-0 text-white p-0" aria-label={"Notifications"}>
            <svg width={"26"} height={"26"} viewBox={"0 0 24 24"} fill={"#fff"} aria-hidden={"true"}>
              <path d={"M12 22a2.2 2.2 0 002.2-2.2H9.8A2.2 2.2 0 0012 22zm7-6V11a7 7 0 00-5.5-6.8V3.5a1.5 1.5 0 00-3 0v.7A7 7 0 005 11v5l-2 2v1h18v-1z"}>
              </path>
            </svg>
            <span className="absolute top-0.5 right-0.5 bg-[#e11] rounded-[10px] text-[11px] font-bold py-px px-1.5">
              {v.notifCount}
            </span>
          </button>
          <span className="hn relative">
            <button type={"button"} aria-haspopup={"true"} onClick={v.umToggle} className="bg-transparent border-0 text-white [font:inherit] cursor-pointer min-h-[44px] py-0 px-1">
              {P.coName}{" ▾"}
            </button>
            {v.umOpen ? (<>
              <div id={"essi-um"} className="absolute right-0 top-11.5 min-w-[190px] bg-white text-ink border border-solid border-essi-line rounded-lg shadow-menu z-[60] overflow-hidden text-left">
                <div className="py-2.5 px-3.5 text-[12px] text-ink-muted border-b border-b-[#eef5f0]">
                  {"Employer No. "}{P.empNo}
                </div>
                <button type={"button"} onClick={v.logout} className="block w-full text-left bg-white border-0 py-3 px-3.5 [font:inherit] text-danger cursor-pointer" style={{fontWeight: "600"}}>
                  {"Log out"}
                </button>
              </div>
            </>) : null}
          </span>
        </div>
      </header>
    </>
  );
}
