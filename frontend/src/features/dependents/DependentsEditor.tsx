/**
 * Editable list of an employee's dependents. Every value can be corrected (OCR is never 100% right), rows can be
 * added by hand ("+ Add dependent") or removed, and each person can get a photo. Used by the employer's
 * registration form and by the admin's worker screen.
 */
import { useState } from 'react';
import { resizePhoto } from '@/features/dashboard/logic/photo';
import { emptyDraft, formatCnicInput, genderOf, RELATIONS, type DependentDraft } from './dependentDraft';

const INPUT = 'w-full min-h-[38px] px-2 border border-solid rounded-md text-[13px] bg-white box-border';
const OK = ' border-essi-line focus:border-essi-teal';
const MISSING = ' border-[#e0a800] bg-[#fff8e1]';
const TH = 'py-2 px-2 font-semibold border-0 border-b border-solid border-essi-line text-left whitespace-nowrap';
const TD = 'py-1.5 px-2 border-0 border-b border-solid border-essi-line align-middle';

const SOURCE_STYLE: Record<string, string> = {
  FRC: 'bg-[#e6f4ea] text-[#1d6b3a]',
  Manual: 'bg-[#e8eefc] text-[#2b4c9a]',
  NADRA: 'bg-[#fff3e0] text-[#8a5300]',
};

function Avatar({ photo, name }: { photo?: string; name: string }) {
  return photo ? (
    <img src={photo} alt={'Photo of ' + (name || 'dependent')} width="40" height="40" className="w-10 h-10 rounded-full object-cover border border-solid border-essi-green flex-none" />
  ) : (
    <svg width="40" height="40" viewBox="0 0 44 44" aria-hidden="true" className="rounded-full flex-none">
      <rect width="44" height="44" fill="#d9d9d9" />
      <circle cx="22" cy="17" r="8" fill="#fff" />
      <path d="M6 44c0-10 7-14 16-14s16 4 16 14z" fill="#fff" />
    </svg>
  );
}

const LISTED = RELATIONS.filter((r) => r !== 'Other');
const OTHER = '__other__';

/**
 * Relationship dropdown. "Other (type it)" opens a text box for a relationship that is not in the list
 * (e.g. Nephew, Mother-in-law); a value read from the FRC that is not in the list also shows in that box.
 */
function RelationPicker({ label, value, onChange, className, disabled }: { label: string; value: string; onChange: (v: string) => void; className: string; disabled: boolean }) {
  const [typing, setTyping] = useState(false);
  const listed = LISTED.find((r) => r.toLowerCase() === value.trim().toLowerCase());
  const other = typing || (!!value.trim() && !listed);
  return (
    <div className="flex flex-col gap-1">
      <select
        aria-label={label}
        className={className}
        disabled={disabled}
        value={other ? OTHER : listed || ''}
        onChange={(e) => {
          if (e.target.value === OTHER) {
            setTyping(true);
            onChange('');
          } else {
            setTyping(false);
            onChange(e.target.value);
          }
        }}
      >
        <option value="">-- Select --</option>
        {LISTED.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
        <option value={OTHER}>Other (type it)</option>
      </select>
      {other ? (
        <input
          aria-label={label + ' (other)'}
          className={className}
          value={value}
          disabled={disabled}
          placeholder="Type relationship"
          autoFocus={typing && !value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : null}
    </div>
  );
}

export function DependentsEditor({
  rows,
  onChange,
  disabled = false,
  emptyText = 'No dependents yet. Upload the FRC or click “+ Add dependent” to enter them by hand.',
}: {
  rows: DependentDraft[];
  onChange: (rows: DependentDraft[]) => void;
  disabled?: boolean;
  emptyText?: string;
}) {
  const [photoError, setPhotoError] = useState('');

  const update = (key: string, patch: Partial<DependentDraft>) =>
    onChange(
      rows.map((r) => {
        if (r.key !== key) return r;
        const next = { ...r, ...patch };
        // a field the scan missed stops being highlighted once the user fills it in
        if (next.missing) next.missing = next.missing.filter((f) => !String(next[f] ?? '').trim());
        return next;
      }),
    );
  const remove = (key: string) => onChange(rows.filter((r) => r.key !== key));
  const add = () => onChange([...rows, emptyDraft()]);

  const pickPhoto = (key: string, file: File | undefined) => {
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) return setPhotoError('A dependent photo must be a JPG, PNG or WebP image.');
    if (file.size > 5 * 1024 * 1024) return setPhotoError('The photo is larger than 5 MB.');
    resizePhoto(file, (url) => { update(key, { photo: url }); setPhotoError(''); }, setPhotoError);
  };

  const cls = (r: DependentDraft, f: 'name' | 'relation' | 'cnic' | 'dob') => INPUT + (r.missing?.includes(f) ? MISSING : OK);
  const anyMissing = rows.some((r) => r.missing?.length);

  return (
    <div>
      {anyMissing ? (
        <div className="mb-2 text-[12px] text-[#6b5300] bg-[#fff8e1] border border-solid border-[#f0d78a] rounded-md py-1.5 px-2.5">
          Boxes highlighted in yellow could not be read from the certificate. Please type them in.
        </div>
      ) : null}
      {photoError ? (
        <div role="alert" className="mb-2 text-danger text-[12px]">
          {photoError}
        </div>
      ) : null}
      <div className="relative overflow-x-auto rounded-lg border border-solid border-essi-line bg-white">
        <table className="w-full border-collapse text-[13px] min-w-[980px]">
          <thead>
            <tr className="bg-[#f1f7f4]">
              <th className={TH + ' w-8'}>#</th>
              <th className={TH + ' w-[110px]'}>Photo</th>
              <th className={TH + ' min-w-[200px]'}>
                Name <span className="text-[#c00]">*</span>
              </th>
              <th className={TH + ' w-[140px]'}>
                Relationship <span className="text-[#c00]">*</span>
              </th>
              <th className={TH + ' w-[170px]'}>CNIC / B-Form</th>
              <th className={TH + ' w-[125px]'}>Date of Birth</th>
              <th className={TH + ' w-[110px]'}>Gender</th>
              <th className={TH + ' w-[70px]'}>Source</th>
              <th className={TH + ' w-10'}>
                <span className="sr-only">Remove</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((r, i) => (
                <tr key={r.key}>
                  <td className={TD}>{i + 1}</td>
                  <td className={TD}>
                    <div className="flex items-center gap-2">
                      <Avatar photo={r.photo} name={r.name} />
                      {!disabled ? (
                        <div className="flex flex-col items-start gap-0.5">
                          <label className="text-essi-green font-semibold underline cursor-pointer text-[12px]">
                            {r.photo ? 'Change' : 'Upload'}
                            <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => { pickPhoto(r.key, e.target.files?.[0]); e.target.value = ''; }} />
                          </label>
                          {r.photo ? (
                            <button type="button" onClick={() => update(r.key, { photo: undefined })} className="bg-transparent border-0 p-0 text-danger text-[12px] cursor-pointer">
                              Remove
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </td>
                  <td className={TD}>
                    <input aria-label={`Dependent ${i + 1} name`} className={cls(r, 'name')} value={r.name} disabled={disabled} placeholder="Full name" onChange={(e) => update(r.key, { name: e.target.value })} />
                  </td>
                  <td className={TD}>
                    <RelationPicker
                      label={`Dependent ${i + 1} relationship`}
                      className={cls(r, 'relation')}
                      value={r.relation}
                      disabled={disabled}
                      onChange={(relation) =>
                        // fill the gender from the relationship unless the user already chose a different one
                        update(r.key, { relation, gender: !r.gender || r.gender === genderOf(r.relation) ? genderOf(relation) || r.gender : r.gender })
                      }
                    />
                  </td>
                  <td className={TD}>
                    <input
                      aria-label={`Dependent ${i + 1} CNIC or B-Form`}
                      className={cls(r, 'cnic')}
                      value={r.cnic}
                      disabled={disabled}
                      placeholder="00000-0000000-0"
                      onChange={(e) => update(r.key, { cnic: formatCnicInput(e.target.value) })}
                    />
                  </td>
                  <td className={TD}>
                    <input aria-label={`Dependent ${i + 1} date of birth`} className={cls(r, 'dob')} value={r.dob} disabled={disabled} placeholder="DD/MM/YYYY" inputMode="numeric" onChange={(e) => update(r.key, { dob: e.target.value })} />
                  </td>
                  <td className={TD}>
                    <select aria-label={`Dependent ${i + 1} gender`} className={INPUT + OK} value={r.gender} disabled={disabled} onChange={(e) => update(r.key, { gender: e.target.value })}>
                      <option value="">—</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="TRANSGENDER">Transgender</option>
                    </select>
                  </td>
                  <td className={TD}>
                    <span className={'inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ' + (SOURCE_STYLE[r.source] || '')}>{r.source}</span>
                  </td>
                  <td className={TD}>
                    {!disabled ? (
                      <button type="button" aria-label={'Remove ' + (r.name || `dependent ${i + 1}`)} title="Remove" onClick={() => remove(r.key)} className="bg-transparent border-0 text-danger text-[20px] cursor-pointer leading-none">
                        ×
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-4 px-3 text-center text-ink-soft">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!disabled ? (
        <button
          type="button"
          onClick={add}
          className="mt-2.5 inline-flex items-center gap-1.5 min-h-[38px] px-3.5 rounded-lg border border-dashed border-essi-green bg-white text-essi-green font-semibold text-[13px] cursor-pointer"
        >
          <span className="text-[18px] leading-none">+</span> Add dependent
        </button>
      ) : null}
    </div>
  );
}
