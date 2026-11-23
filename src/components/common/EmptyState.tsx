import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  text?: string;
  action?: ReactNode;
}

// Порожній стан списку: підказка + заклик до дії замість порожньої таблиці
export default function EmptyState({ title, text, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg bg-white px-6 py-14 text-center shadow dark:bg-gray-900">
      <p className="text-lg font-semibold">{title}</p>
      {text && <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">{text}</p>}
      {action}
    </div>
  );
}
