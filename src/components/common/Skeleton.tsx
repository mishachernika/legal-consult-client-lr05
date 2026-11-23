import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
}

// Скелетний індикатор завантаження: анімовані «заглушки» замість спінера покращують
// сприйняття швидкості (content не «стрибає», коли дані приїжджають)
export default function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded bg-gray-200 dark:bg-gray-700', className)} />;
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Завантаження таблиці">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 w-12" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-24" />
        </div>
      ))}
    </div>
  );
}

export function CardGridSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Завантаження карток"
    >
      {Array.from({ length: cards }, (_, i) => (
        <Skeleton key={i} className="h-44 w-full" />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Завантаження сторінки">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
