import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  hint?: string;
}

// Підпис + поле + повідомлення про помилку: прибирає дублювання розмітки в усіх формах
export default function FormField({ label, error, children, hint }: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
      {error && (
        <span role="alert" className="mt-1 block text-sm text-red-500">
          {error}
        </span>
      )}
    </label>
  );
}
