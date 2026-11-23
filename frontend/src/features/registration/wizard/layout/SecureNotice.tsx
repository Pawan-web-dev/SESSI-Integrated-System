/* Registration – "Secure & Trusted" note in the left column (markup taken from the approved design). */

export function SecureNotice() {
  return (
    <>
      <div className="mt-5 p-3 rounded-[10px] bg-[#e8f2ec] flex gap-2.5 items-center text-[13px]">
        <svg width={"26"} height={"26"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#067a35"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} className="flex-none">
          <path d={"M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5"}>
          </path>
        </svg>
        <div>
          <b>
            {"Secure & Trusted"}
          </b>
          <br />
          <span className="text-ink-muted">
            {"Your data is safe with ESSI"}
          </span>
        </div>
      </div>
    </>
  );
}
