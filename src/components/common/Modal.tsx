import { useEffect, type ReactNode } from 'react';
import Button from './Button';

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

// Універсальне модальне вікно (підтвердження видалення тощо):
// закривається по Escape і кліку на тло, фокус-ловушка не потрібна для навчального проєкту
export default function Modal({
  open,
  title,
  children,
  confirmText = 'Підтвердити',
  cancelText = 'Скасувати',
  isLoading = false,
  onConfirm,
  onClose,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-3 text-xl font-semibold">{title}</h2>
        <div className="mb-5 text-gray-600 dark:text-gray-300">{children}</div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
