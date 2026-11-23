/* Employer dashboard – "Menu" button shown on small screens (markup taken from the approved design). */
import type { ViewProps } from '@/types/view';

export function MobileMenuButton({ v }: ViewProps) {
  return (
    <>
      <button className="mb min-h-[44px] py-0 px-4 border border-solid border-essi-green rounded-lg bg-white text-essi-green text-[14px] mb-3 items-center gap-2" onClick={v.toggleMenu} aria-label={"Open menu"}>
        <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} aria-hidden={"true"}>
          <path d={"M4 6h16M4 12h16M4 18h16"}>
          </path>
        </svg>
        {"Menu"}
      </button>
    </>
  );
}
