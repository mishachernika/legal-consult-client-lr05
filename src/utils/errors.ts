import { isAxiosError } from 'axios';
import type { ApiError } from '@/types/api.types';

// Централізоване отримання тексту помилки з відповіді сервера ({ error: '...' })
export function getErrorMessage(error: unknown, fallback = 'Сталася помилка'): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;
    return data?.error ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
