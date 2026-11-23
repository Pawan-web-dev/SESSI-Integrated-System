import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white border border-[#cfe4d5] rounded-[16px] shadow-[0_4px_18px_rgba(6,122,53,0.12)] p-[28px] ${className}`}>
      {children}
    </div>
  );
};
