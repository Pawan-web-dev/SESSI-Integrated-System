/* Employer dashboard – Employee Management > Register / Edit Employee. */
import { useState } from 'react';
import type { Any, ViewProps } from '@/types/view';
import { BulkUploadPanel, DateInput, DependentsPanel, DuplicateCheck, Field, ICONS, inputClass, SectionTitle, UploadMethodCards, type UploadMethod } from './EmployeeRegistrationParts';

const DESIGNATIONS = ['Production Supervisor', 'Quality Inspector', 'Machine Operator', 'Store Keeper', 'Accounts Clerk', 'Helper', 'Driver', 'Security Guard', 'Manager', 'Other'];

const BTN_OUTLINE = 'inline-flex items-center justify-center gap-2 min-h-[46px] py-0 px-6 rounded-lg border border-solid border-essi-green bg-white text-essi-green font-semibold text-[15px] cursor-pointer';
const BTN_SOLID = 'inline-flex items-center justify-center gap-2 min-h-[46px] py-0 px-7 rounded-lg border-0 bg-essi-dark text-white font-semibold text-[15px] cursor-pointer';

const fire = (handler: (e: Any) => void, value: string) => handler({ target: { value } });

/** Two-step form: 1) identity and pay, 2) employment terms and photo. */
export function RegisterEmployeeSection({ v }: ViewProps) {
  const [method, setMethod] = useState<UploadMethod>('manual');
  const [step, setStep] = useState<1 | 2>(1);

  const gender = v.gcM ? 'MALE' : v.gcF ? 'FEMALE' : v.gcT ? 'TRANSGENDER' : '';
  const setGender = (g: string) => (g === 'MALE' ? v.gM() : g === 'FEMALE' ? v.gF() : g === 'TRANSGENDER' ? v.gT() : undefined);
  const designations = v.fv_ds && !DESIGNATIONS.includes(v.fv_ds) ? [v.fv_ds, ...DESIGNATIONS] : DESIGNATIONS;

  const next = () => {
    const missing: string[] = [];
    if (!v.fv_cn.trim()) missing.push('CNIC');
    if (!v.fv_fn.trim()) missing.push('Name');
    if (!v.fv_fa.trim()) missing.push('Father’s Name');
    if (!v.fv_dob.trim()) missing.push('Date of Birth');
    if (!gender) missing.push('Gender');
    if (!v.fv_dj.trim()) missing.push('Date of Joining');
    if (!v.fv_ds.trim()) missing.push('Designation');
    if (!v.fv_mw.trim()) missing.push('Monthly Wages');
    if (!v.fv_ba.trim()) missing.push('Bank Account');
    if (!v.fv_mb.trim()) missing.push('Mobile Number');
    if (missing.length) return v.setFormError('Please fill in: ' + missing.join(', ') + '.');
    if (v.cnicState === 'dup') return v.setFormError('An employee with this CNIC is already registered.');
    v.setFormError('');
    setStep(2);
    window.scrollTo(0, 0);
  };

  const reset = () => {
    v.resetEmpForm();
    setStep(1);
  };

  return (
    <div className="mt-4 rounded-2xl border border-solid border-essi-line bg-white p-5 sm:p-7 shadow-[0_4px_18px_rgba(6,122,53,.10)]">
      <SectionTitle icon={ICONS.people}>{v.regTitle === 'EDIT EMPLOYEE' ? 'Edit Employee' : 'Employee Registration'}</SectionTitle>

      {step === 1 ? (
        <>
          <UploadMethodCards value={method} onChange={setMethod} />
          {method !== 'manual' ? <BulkUploadPanel method={method} /> : null}

          <SectionTitle icon={ICONS.person} size={18}>
            Employee Details
          </SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-3.5">
            <Field id="cn" label="CNIC">
              <div className="flex gap-2.5">
                <input id="cn" className={inputClass} placeholder="Enter CNIC Number" value={v.fv_cn} onChange={v.in_cn} inputMode="numeric" />
                <button type="button" disabled title="NADRA verification is not connected yet" className="inline-flex items-center gap-1.5 whitespace-nowrap px-3.5 rounded-md border border-solid border-essi-green bg-essi-tint text-essi-green font-semibold text-[13px] opacity-60 cursor-not-allowed">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={ICONS.shield} />
                  </svg>
                  Verify with NADRA
                </button>
              </div>
            </Field>
            <Field id="fn" label="Name">
              <input id="fn" className={inputClass} placeholder="Enter Employee Name" value={v.fv_fn} onChange={v.in_fn} />
            </Field>
            <Field id="fa" label="Father’s Name">
              <input id="fa" className={inputClass} placeholder="Enter Father’s Name" value={v.fv_fa} onChange={v.in_fa} />
            </Field>
            <Field id="dob" label="Date of Birth">
              <DateInput id="dob" value={v.fv_dob} onText={(t) => fire(v.in_dob, t)} />
            </Field>
            <Field id="gender" label="Gender">
              <select id="gender" className={inputClass} value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="TRANSGENDER">Transgender</option>
              </select>
            </Field>
            <Field id="dj" label="Date of Joining">
              <DateInput id="dj" value={v.fv_dj} onText={(t) => fire(v.in_dj, t)} />
            </Field>
            <Field id="ds" label="Designation">
              <select id="ds" className={inputClass} value={v.fv_ds} onChange={v.in_ds}>
                <option value="">Select Designation</option>
                {designations.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </Field>
            <Field id="mw" label="Monthly Wages">
              <input id="mw" className={inputClass} placeholder="Enter Monthly Wages" value={v.fv_mw} onChange={v.in_mw} inputMode="numeric" />
            </Field>
            <Field id="ba" label="Bank Account">
              <input id="ba" className={inputClass} placeholder="Enter Bank Account Number" value={v.fv_ba} onChange={v.in_ba} />
            </Field>
            <Field id="mb" label="Mobile Number">
              <input id="mb" className={inputClass} placeholder="Enter Mobile Number" value={v.fv_mb} onChange={v.in_mb} inputMode="tel" />
            </Field>
          </div>

          <DependentsPanel />
        </>
      ) : (
        <>
          <SectionTitle icon={ICONS.person} size={18}>
            Employment Terms
          </SectionTitle>
          <p className="text-[13px] text-ink-soft mt-0 mb-4">
            {v.fv_fn} · {v.fv_cn}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-3.5">
            <Field id="et" label="Employment Type">
              <select id="et" className={inputClass} value={v.fv_et} onChange={v.in_et}>
                {['--- Please Select ---', 'Permanent', 'Contractual', 'Daily Wages', 'Piece Rated', 'Others'].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
            <Field id="sk" label="Skill Level" required={false}>
              <select id="sk" className={inputClass} value={v.fv_sk} onChange={v.in_sk}>
                {['--- Please Select ---', 'Unskilled', 'Semi-Skilled', 'Skilled', 'Highly Skilled'].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
            <Field id="wt" label="Wage Type" required={false}>
              <select id="wt" className={inputClass} value={v.fv_wt} onChange={v.in_wt}>
                {['--- Please Select ---', 'Monthly', 'Daily', 'Piece Rate'].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
            <Field id="pf" label="Payment Frequency" required={false}>
              <select id="pf" className={inputClass} value={v.fv_pf} onChange={v.in_pf}>
                {['--- Please Select ---', 'Monthly', 'Weekly', 'Daily'].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="flex items-center gap-4 mt-5">
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
              <label htmlFor="empPhoto" className="inline-flex items-center justify-center min-h-[40px] px-3.5 border border-solid border-essi-green rounded-md text-essi-green font-semibold cursor-pointer bg-white text-[14px]">
                Upload photo (optional)
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
        </>
      )}

      {v.hasErr ? (
        <div role="alert" className="mt-4 text-danger text-[14px] bg-danger-bg border border-solid border-[#f3b9b3] rounded-lg py-2.5 px-3.5">
          {v.formErr}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 mt-5">
        {step === 1 ? <DuplicateCheck state={v.cnicState} /> : <div className="flex-1" />}
        {step === 1 ? (
          <>
            <button type="button" onClick={reset} className={BTN_OUTLINE}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={ICONS.refresh} />
              </svg>
              Reset
            </button>
            <button type="button" onClick={next} className={BTN_SOLID}>
              Next
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={ICONS.arrow} />
              </svg>
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => setStep(1)} className={BTN_OUTLINE}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={ICONS.back} />
              </svg>
              Back
            </button>
            <button type="button" onClick={v.saveEmp} className={BTN_SOLID}>
              {v.saveLabel}
            </button>
          </>
        )}
        <button type="button" onClick={v.cancelEmp} className="bg-transparent border-0 text-ink-muted underline text-[13px] cursor-pointer min-h-[44px]">
          Cancel
        </button>
      </div>
    </div>
  );
}
