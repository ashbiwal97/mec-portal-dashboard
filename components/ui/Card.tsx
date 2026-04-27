import clsx from 'clsx';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}

export function Card({ children, className, accent }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg border border-[#E5E7EB] overflow-hidden',
        accent && 'bg-gradient-to-br from-white to-[#DCF5FD]/50',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('px-6 py-5 flex items-center justify-between gap-4', className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('px-6 pb-6', className)}>{children}</div>;
}
