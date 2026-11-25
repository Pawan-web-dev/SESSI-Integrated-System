/* Employer dashboard – Employee Management > Register / Edit Employee. */
import { useState, type ReactNode } from 'react';
import type { Any, ViewProps } from '@/types/view';
import { BulkImportPanel } from './BulkImportPanel';
import { DependentsPanel } from './DependentsPanel';
import { DuplicateCheck, ICONS, SectionTitle, UploadMethodCards, type UploadMethod } from './EmployeeRegistrationParts';

const INPUT = 'py-0 px-2.5 min-h-[44px] border border-solid border-essi-teal rounded-md text-[14px] box-border w-full bg-white';
const BTN_OUTLINE = 'inline-flex items-center justify-center gap-2 min-h-[44px] py-0 px-6 rounded-lg border border-solid border-essi-green bg-white text-essi-green font-semibold text-[14px] cursor-pointer';
const BTN_SOLID = 'inline-flex items-center justify-center gap-2 min-h-[44px] py-0 px-7 rounded-lg border-0 bg-essi-dark text-white font-semibold text-[14px] cursor-pointer';
const GRID = 'grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-4.5';
const FIELDSET = 'border border-solid border-essi-line rounded-lg pt-4 px-5 pb-5.5 mt-0 mx-0 mb-4.5 bg-white';

const SELECT_PLACEHOLDER = '--- Please Select ---';

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 text-[13px]">
      <label htmlFor={id}>
        {label} <span className="text-[#c00]">*</span>
      </label>
      {children}
    </div>
  );
}

function Select({ id, value, onChange, options }: { id: string; value: string; onChange: (e: Any) => void; options: string[] }) {
  return (
    <select id={id} value={value} onChange={onChange} className={INPUT}>
      {[SELECT_PLACEHOLDER, ...options].map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

/** Registration screen: choose an upload method; Manual Entry shows the employee form. */
export function RegisterEmployeeSection({ v }: ViewProps) {
  const [method, setMethod] = useState<UploadMethod>('manual');
  const editing = v.regTitle === 'EDIT EMPLOYEE';

  return (
    <div className="mt-4 rounded-2xl border border-solid border-essi-line bg-white p-5 sm:p-7 shadow-[0_4px_18px_rgba(6,122,53,.10)]">
      <SectionTitle icon={ICONS.people}>{editing ? 'Edit Employee' : 'Employee Registration'}</SectionTitle>
      <UploadMethodCards value={method} onChange={setMethod} />
      {method !== 'manual' ? <BulkImportPanel method={method} v={v} /> : null}

      {method === 'manual' ? (
        <>
          <fieldset className={FIELDSET}>
            <legend className="text-[18px] py-0 px-2 text-essi-dark">Personal Info</legend>
            <div className={GRID}>
              <div className="flex flex-col gap-1.5 text-[13px]">
                <span>Employee Photo</span>
                <div className="flex gap-3.5 items-center min-h-[44px]">
                  {v.hasFormPhoto ? (
                    <img src={v.formPhoto} alt="Employee photo preview" width="72" height="72" className="w-[72px] h-[72px] rounded-full object-cover border-2 border-solid border-essi-green" />
                  ) : (
                    <svg width="72" height="72" viewBox="0 0 44 44" aria-hidden="true" className="rounded-full flex-none">
                      <rect width="44" height="44" fill="#d9d9d9" />
                      <circle cx="22" cy="17" r="8" fill="#fff" />
                      <path d="M6 44c0-10 7-14 16-14s16 4 16 14z" fill="#fff" />
                    </svg>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="empPhoto" className="inline-flex items-center justify-center min-h-[40px] px-3.5 border border-solid border-essi-green rounded-md text-essi-green font-semibold cursor-pointer bg-white">
                      Upload photo
                    </label>
                    <input id="empPhoto" type="file" accept="image/png,image/jpeg,image/webp" onChange={v.in_photo} className="absolute w-px h-px opacity-0" />
                    {v.hasFormPhoto ? (
                      <button type="button" onClick={v.rmPhoto} className="bg-transparent border-0 text-danger text-left p-0 text-[12px] cursor-pointer">
                        Remove photo
                      </button>
                    ) : null}
                    <span className="text-[11px] text-ink-muted">JPG, PNG or WebP, up to 5 MB</span>
                  </div>
                </div>
              </div>
              <Field id="fn" label="Full Name">
                <input id="fn" className={INPUT} placeholder="Enter full name" value={v.fv_fn} onChange={v.in_fn} />
              </Field>
              <Field id="fa" label="Father’s Name">
                <input id="fa" className={INPUT} placeholder="Enter father’s name" value={v.fv_fa} onChange={v.in_fa} />
              </Field>
              <div className="flex flex-col gap-2.5 text-[13px]">
                <span>
                  Gender <span className="text-[#c00]">*</span>
                </span>
                <div className="flex gap-4.5 min-h-[44px] items-center flex-wrap">
                  {(
                    [
                      ['MALE', v.gcM, v.gM],
                      ['FEMALE', v.gcF, v.gF],
                      ['TRANSGENDER', v.gcT, v.gT],
                    ] as [string, boolean, () => void][]
                  ).map(([label, checked, pick]) => (
                    <label key={label} className="flex items-center gap-1.5 text-[13px]">
                      <input type="radio" name="gender" checked={!!checked} onChange={pick} /> {label}
                    </label>
                  ))}
                </div>
              </div>
              <Field id="cn" label="CNIC No.">
                <input id="cn" className={INPUT} placeholder="00000-0000000-0" value={v.fv_cn} onChange={v.in_cn} inputMode="numeric" />
              </Field>
              <Field id="dob" label="Date of Birth">
                <input id="dob" className={INPUT} placeholder="DD/MM/YYYY" value={v.fv_dob} onChange={v.in_dob} inputMode="numeric" />
              </Field>
              <Field id="mb" label="Mobile No.">
                <input id="mb" className={INPUT} placeholder="03XX-XXXXXXX" value={v.fv_mb} onChange={v.in_mb} inputMode="tel" />
              </Field>
            </div>
          </fieldset>

          <fieldset className={FIELDSET}>
            <legend className="text-[18px] py-0 px-2 text-essi-dark">Employment Detail</legend>
            <div className={GRID}>
              <Field id="ds" label="Designation">
                <input id="ds" className={INPUT} placeholder="Enter designation" value={v.fv_ds} onChange={v.in_ds} />
              </Field>
              <Field id="sk" label="Skill Level">
                <Select id="sk" value={v.fv_sk} onChange={v.in_sk} options={['Unskilled', 'Semi-Skilled', 'Skilled', 'Highly Skilled']} />
              </Field>
              <Field id="et" label="Employment Type">
                <Select id="et" value={v.fv_et} onChange={v.in_et} options={['Permanent', 'Contractual', 'Daily Wages', 'Piece Rated', 'Others']} />
              </Field>
              <Field id="wt" label="Wage Type">
                <Select id="wt" value={v.fv_wt} onChange={v.in_wt} options={['Monthly', 'Daily', 'Piece Rate']} />
              </Field>
              <Field id="pf" label="Payment Frequency">
                <Select id="pf" value={v.fv_pf} onChange={v.in_pf} options={['Monthly', 'Weekly', 'Daily']} />
              </Field>
              <Field id="dj" label="Date of Joining">
                <input id="dj" className={INPUT} placeholder="DD/MM/YYYY" value={v.fv_dj} onChange={v.in_dj} inputMode="numeric" />
              </Field>
              <Field id="mw" label="Monthly Wages">
                <input id="mw" className={INPUT} placeholder="Enter monthly wages" value={v.fv_mw} onChange={v.in_mw} inputMode="numeric" />
              </Field>
              <Field id="ba" label="Bank Account">
                <input id="ba" className={INPUT} placeholder="Enter bank account number" value={v.fv_ba} onChange={v.in_ba} />
              </Field>
            </div>
          </fieldset>

          <DependentsPanel cnic={v.fv_cn} onApply={v.applyFrc} />

          {v.hasErr ? (
            <div role="alert" className="mt-4 text-danger text-[14px] bg-danger-bg border border-solid border-[#f3b9b3] rounded-lg py-2.5 px-3.5">
              {v.formErr}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <DuplicateCheck state={v.cnicState} />
            <button type="button" onClick={v.resetEmpForm} className={BTN_OUTLINE}>
              Reset
            </button>
            <button type="button" onClick={v.cancelEmp} className={BTN_OUTLINE}>
              Cancel
            </button>
            <button type="button" onClick={v.saveEmp} className={BTN_SOLID}>
              {v.saveLabel}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
