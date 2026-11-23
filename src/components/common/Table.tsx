import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface TableColumn<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  emptyMessage?: string;
  /** Рядок таблиці клікабельний (наприклад, веде на сторінку деталей) */
  onRowClick?: (row: T) => void;
}

// Повторно використовувана таблиця: колонки описуються даними, порожній стан — вбудований
export default function Table<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = 'Нічого не знайдено',
  onRowClick,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto overflow-hidden rounded-lg bg-white shadow dark:bg-gray-900">
      <table className="min-w-full">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                className={cn(
                  onRowClick && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60'
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-6 py-4', col.className)}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
