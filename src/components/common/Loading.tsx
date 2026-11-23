import { cn } from '@/utils/cn';

interface LoadingProps {
  text?: string;
  /** На всю сторінку (центрування по вертикалі) */
  fullPage?: boolean;
  className?: string;
}

export default function Loading({
  text = 'Завантаження...',
  fullPage = false,
  className = '',
}: LoadingProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex items-center justify-center gap-3 text-gray-500 dark:text-gray-400',
        fullPage && 'flex-grow py-24',
        className
      )}
    >
      <svg
        className="h-6 w-6 animate-spin text-primary-600"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
        />
      </svg>
      <span>{text}</span>
    </div>
  );
}
