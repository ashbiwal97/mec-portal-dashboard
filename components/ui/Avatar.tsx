'use client';

import { User } from 'lucide-react';
import clsx from 'clsx';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const initials = name
    ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : null;

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-white',
        'bg-[#25676E] text-white font-medium',
        sizeMap[size],
        className
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name || 'User'} className="w-full h-full object-cover" />
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <User className="w-4 h-4" />
      )}
    </div>
  );
}
