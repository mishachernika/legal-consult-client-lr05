// Допоміжні функції форматування даних (дата, ціна, розмір файлу тощо)

export function formatDate(iso: string, locale = 'uk-UA'): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(iso));
}

export function formatDateTime(iso: string, locale = 'uk-UA'): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function formatPrice(value: number | string, currency = 'UAH', locale = 'uk-UA'): string {
  const num = typeof value === 'string' ? Number(value) : value;
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(num);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

export function truncate(text: string, maxLength = 100): string {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength).trimEnd()}…`;
}
