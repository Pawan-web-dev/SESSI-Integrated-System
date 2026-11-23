import type { ButtonHTMLAttributes, ReactNode } from 'react';

const BASE = 'inline-flex items-center gap-2 min-h-11 px-5 rounded-lg text-[14px] font-semibold cursor-pointer font-[inherit]';
const VARIANTS = {
  /** dark green, for the main action */
  primary: 'bg-essi-dark text-white border-0 hover:bg-[#08401e]',
  /** white with green outline */
  outline: 'bg-white text-essi-green border border-solid border-essi-green hover:bg-[#f1faf4]',
} as const;

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS;
  icon?: ReactNode;
}

/** Dashboard action button (Print, Back, ...). */
export function ActionButton({ variant = 'outline', icon, className = '', children, ...rest }: ActionButtonProps) {
  return (
    <button type="button" className={`${BASE} ${VARIANTS[variant]} ${className}`} {...rest}>
      {icon}
      {children}
    </button>
  );
}

/** Icons used on action buttons. */
export const PrintIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none">
    <path d="M6 9V3h12v6M6 18H4v-7h16v7h-2M6 14h12v7H6z" />
  </svg>
);
export const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none">
    <path d="M15 6l-6 6 6 6" />
  </svg>
);
// testing by ashar
