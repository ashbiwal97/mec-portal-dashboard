'use client';

import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
  selectClassName?: string;
}

export function Select({ value, onChange, options, className, selectClassName }: SelectProps) {
  return (
    <div className={clsx('relative', className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(
          'appearance-none h-8 w-full cursor-pointer rounded-xl border border-[#E5E7EB] bg-white pl-3 pr-8 text-sm text-[#363553] focus:outline-none focus:ring-2 focus:ring-[#3AA2B7]',
          selectClassName
        )}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6A7282] pointer-events-none" />
    </div>
  );
}
