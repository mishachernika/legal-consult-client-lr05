import Button from './Button';
import type { Pagination as PaginationMeta } from '@/types/api.types';

interface PaginationProps {
  meta: PaginationMeta;
  page: number;
  onPageChange: (page: number) => void;
}

// Пагінація списків: попередня/наступна + індикатор сторінки (дані — у форматі сервера ЛР02)
export default function Pagination({ meta, page, onPageChange }: PaginationProps) {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-center gap-4" aria-label="Пагінація">
      <Button
        variant="secondary"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Назад
      </Button>
      <span className="text-sm text-gray-600 dark:text-gray-300">
        Сторінка {meta.page} з {meta.totalPages} (усього: {meta.total})
      </span>
      <Button
        variant="secondary"
        size="sm"
        disabled={!meta.hasMore}
        onClick={() => onPageChange(page + 1)}
      >
        Далі
      </Button>
    </div>
  );
}
