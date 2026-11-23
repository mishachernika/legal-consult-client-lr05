import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}

export default function Card({ title, children, className = '', footer }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900',
        className
      )}
    >
      {title && <h3 className="mb-3 text-lg font-semibold">{title}</h3>}
      <div className="text-gray-600 dark:text-gray-300">{children}</div>
      {footer && (
        <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">{footer}</div>
      )}
    </div>
  );
}
