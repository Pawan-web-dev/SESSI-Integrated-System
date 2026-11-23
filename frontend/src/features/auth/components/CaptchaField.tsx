import type { Ref } from 'react';
import type { CaptchaChar } from '../utils/captcha';

interface CaptchaFieldProps {
  code: CaptchaChar[];
  value: string;
  onChange: (value: string) => void;
  onRefresh: () => void;
  inputRef?: Ref<HTMLInputElement>;
}

/** "Security code" row: code image, refresh button and input. */
export function CaptchaField({ code, value, onChange, onRefresh, inputRef }: CaptchaFieldProps) {
  return (
    <div className="f">
      <label htmlFor="lg-cap">
        Security code <i>*</i>
      </label>
      <div className="cap">
        <div className="capimg" id="lg-capimg" aria-label="Captcha image">
          {code.map((x, i) => (
            <span key={i} style={{ transform: x.transform }}>
              {x.char}
            </span>
          ))}
        </div>
        <button type="button" className="rf" id="lg-rf" aria-label="New code" title="New code" onClick={onRefresh}>
          ↻
        </button>
        <input ref={inputRef} className="inp flex-1 min-w-0" id="lg-cap" autoComplete="off" maxLength={5} placeholder="Type the code" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}
