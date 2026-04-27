'use client';

import clsx from 'clsx';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md';
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className,
  icon,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'inline-flex items-center gap-2 rounded-full font-medium transition-all',
        size === 'sm' ? 'h-8 px-3 text-sm' : 'h-9 px-4 text-sm',
        disabled
          ? 'cursor-not-allowed bg-[#E5E7EB] text-[#9AA4AF] border border-transparent shadow-none'
          : 'cursor-pointer',
        !disabled && variant === 'primary' && 'bg-[#3AA2B7] text-white hover:bg-[#2E8FA2] active:bg-[#25676E]',
        !disabled && variant === 'ghost' && 'text-[#605759] hover:bg-black/5',
        !disabled && variant === 'outline' && 'border border-[#E5E7EB] bg-white text-[#363553] hover:border-[#3AA2B7]',
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
