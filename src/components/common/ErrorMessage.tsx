import { cn } from '@/utils/cn';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

// Базовий компонент відображення помилки (рівень 1): роль alert для екранних читачів
export default function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
        className
      )}
    >
      {message}
    </div>
  );
}
