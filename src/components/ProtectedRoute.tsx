import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from '@/stores/authStore';
import type { Role } from '@/types/api.types';

interface ProtectedRouteProps {
  children: ReactNode;
  /** Якщо задано — доступ лише для цих ролей (наприклад, лише ADMIN) */
  roles?: Role[];
}

// Захищений маршрут: без сесії — редірект на /login, а поточне розташування зберігається
// в state.from, щоб після входу повернути користувача на потрібну сторінку.
// NB: захист на клієнті — лише зручність UI; справжню безпеку дає перевірка токена на сервері.
export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (roles && (!user || !roles.includes(user.role))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
