import type { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

// Стилізований нативний select (ref як проп у React 19 — підходить для register() RHF)
export default function Select({ className = '', children, ...props }: ComponentProps<'select'>) {
  return (
    <select
      className={cn(
        'w-full rounded border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
