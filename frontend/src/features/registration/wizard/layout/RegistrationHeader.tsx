/* Registration – top banner (markup taken from the approved design). */
import logo from '@/assets/images/essi-logo.png';
import type { Any, ViewProps } from '@/types/view';

export function RegistrationHeader({ P }: ViewProps) {
  return (
    <>
      <header className="hd relative @container aspect-[1536/208] w-full text-white">
        <img className="hl absolute left-[20.8%] top-[5.5%] h-[70%] w-auto" src={logo} alt={"ESSI Sindh logo"} />
        <div className="hv absolute left-[31.8%] top-[16%] h-[46%] w-[2px] bg-essi-deep">
        </div>
        <div className="ht absolute left-[33.4%] top-[17%] font-bold [font-size:max(15px,1.75cqw)] leading-[1.3] text-essi-deep">
          {"Employees’ Social Security Institution"}
          <br />
          {"Sindh"}
          <div className="mt-[.35em] [font-size:1.1em]">
            {"Employer Registration Portal"}
          </div>
        </div>
        <div className="hr absolute right-[1.6%] top-0 h-[50%] flex items-center gap-3.5 [font-size:max(12px,.95cqw)]">
          <span className={"hn"}>
            {"Already registered?"}
          </span>
          <a href={"#/login"} onClick={(e: Any) => { e.preventDefault(); P.nav('login'); }} className="text-white font-bold underline min-h-[44px] inline-flex items-center">
            {"Log in"}
          </a>
        </div>
      </header>
    </>
  );
}
