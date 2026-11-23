import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ListProps {
  children: ReactNode;
  className?: string;
}

// Повторно використовуваний список елементів (розділювачі між пунктами)
export default function List({ children, className = '' }: ListProps) {
  return (
    <ul
      className={cn(
        'divide-y divide-gray-200 rounded-lg bg-white shadow dark:divide-gray-700 dark:bg-gray-900',
        className
      )}
    >
      {children}
    </ul>
  );
}
