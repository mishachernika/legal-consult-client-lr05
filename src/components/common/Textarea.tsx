import type { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

// Багаторядкове текстове поле (ref як проп у React 19 — підходить для register() RHF)
export default function Textarea({ className = '', ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800',
        className
      )}
      {...props}
    />
  );
}
