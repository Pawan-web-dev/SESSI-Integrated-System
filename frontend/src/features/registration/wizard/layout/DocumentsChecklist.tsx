/* Registration – "Keep these ready" checklist in the left column (markup taken from the approved design). */

export function DocumentsChecklist() {
  return (
    <>
      <div>
        <div className="font-bold text-essi-dark text-[18px]">
          {"Employer registration"}
        </div>
        <div className="text-[13px] text-ink-muted mt-1">
          {"Takes about 10 minutes. Your progress is saved on this device."}
        </div>
        <div className="mt-4 p-3.5 bg-essi-pale border border-solid border-essi-line rounded-[10px] text-[13px]">
          <div className="font-bold text-essi-dark mb-1.5">
            {"Keep these ready"}
          </div>
          <div className="leading-[1.7]">
            {"CNIC of the owner or authorized person"}
            <br />
            {"NTN certificate"}
            <br />
            {"SECP certificate (companies)"}
            <br />
            {"SRB registration"}
            <br />
            {"Recent electricity bill"}
            <br />
            {"Bank account letter"}
          </div>
        </div>
      </div>
    </>
  );
}
