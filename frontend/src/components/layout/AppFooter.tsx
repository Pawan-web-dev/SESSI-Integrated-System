/* Green footer used by the registration wizard and the dashboard (markup taken from the approved design). */

export function AppFooter() {
  return (
    <>
      <footer className="bg-essi-footer text-white flex justify-between flex-wrap gap-2 py-5 px-8 text-[14px]">
        <span>
          {"© 2026 Employees’ Social Security Institution, Sindh. All Rights Reserved."}
        </span>
        <span>
          {"Help | Contact Us | Privacy Policy"}
        </span>
      </footer>
    </>
  );
}
