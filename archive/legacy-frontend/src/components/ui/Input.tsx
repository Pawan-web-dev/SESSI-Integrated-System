import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className = '', ...props }, ref) => {
    return (
      <div className='flex flex-col gap-1.5 mb-4'>
        {label && (
          <label className='font-semibold text-sm text-[#17321f]'>
            {label} {required && <span className='text-red-600'>*</span>}
          </label>
        )}
        <input
          ref={(el) => {
            if (typeof ref === 'function') ref(el);
            else if (ref) ref.current = el;
          }}
          className={`w-full min-h-[46px] px-3 border rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f] ${
            error ? 'border-red-500' : 'border-[#b9d6c4]'
          } ${className}`}
          {...props}
        />
        {error && <span className='text-red-500 text-xs mt-1'>{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
