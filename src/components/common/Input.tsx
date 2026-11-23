import type { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

// У React 19 ref передається як звичайний проп, тому forwardRef не потрібен.
// Це важливо для React Hook Form, який зберігає ref поля через register() (ЛР05).
export default function Input({ className = '', ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800',
        className
      )}
      {...props}
    />
  );
}
