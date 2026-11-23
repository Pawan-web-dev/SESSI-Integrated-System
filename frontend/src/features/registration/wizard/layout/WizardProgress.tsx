/* Registration – step list shown in the left column (markup taken from the approved design). */
import React from 'react';
import type { Any, ViewProps } from '@/types/view';

export function WizardProgress({ v }: ViewProps) {
  return (
    <>
      <div>
        {(v.stepItems || []).map((p: Any, _i1: number) => (<React.Fragment key={_i1}>
          <div className="flex gap-3.5 py-3 px-0">
            <div className="w-[38px] h-[38px] rounded-[50%] flex items-center justify-center font-bold flex-none" style={{border: `2px solid ${p.bd}`, background: p.bg, color: p.fg}}>
              {p.mark}
            </div>
            <div>
              <div className="font-bold" style={{color: p.tc}}>
                {p.title}
              </div>
              <div className="text-[13px] text-ink-muted">
                {p.sub}
              </div>
            </div>
          </div>
        </React.Fragment>))}
      </div>
    </>
  );
}
