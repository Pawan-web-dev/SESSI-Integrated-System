import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'btn inline-flex items-center justify-center gap-2 min-h-[46px] px-6 rounded-lg text-[15px] font-semibold transition-colors duration-200';
  const variants = {
    primary: 'bg-[#0b4d24] text-white hover:bg-[#08401e] disabled:opacity-55',
    ghost: 'bg-white text-[#067a35] border border-[#067a35] hover:bg-[#f1faf4]',
    danger: 'bg-[#b00020] text-white hover:bg-[#8e001a]',
  };
  
  const combinedClasses = `${baseClasses} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`;
  
  return (
    <button className={combinedClasses} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
