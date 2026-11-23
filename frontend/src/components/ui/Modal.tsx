import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** id of the element that names the dialog */
  labelledBy: string;
  /** extra Tailwind classes for the dialog box, e.g. "max-w-[640px]" */
  boxClassName?: string;
  children: ReactNode;
}

/** Dialog with a dark backdrop. Closes on backdrop click and on Escape. */
export function Modal({ open, onClose, labelledBy, boxClassName = '', children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div
      className={'modal' + (open ? ' on' : '')}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`box ${boxClassName}`}>
        {children}
      </div>
    </div>
  );
}
