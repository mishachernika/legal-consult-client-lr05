import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

// Адаптивна сітка карток: 1 колонка на mobile, 2 на sm, 3 на lg
interface GridProps {
  children: ReactNode;
  className?: string;
}

export default function Grid({ children, className = '' }: GridProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {children}
    </div>
  );
}
