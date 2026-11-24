import api from './api';
import type { SingleResponse, Specialization } from '@/types/api.types';

// Сервіс сфер права: публічний каталог + адмін-операції (POST/PUT/DELETE — лише ADMIN)
export const specializationsService = {
  // API ЛР03 повертає довідник одним масивом у { data }, без серверної пагінації чи пошуку.
  // Пошук на сторінці виконується локально: перелік сфер невеликий і кешується сервером.
  getAll: () =>
    api.get<SingleResponse<Specialization[]>>('/specializations').then((r) => r.data.data),
  getById: (id: number) =>
    api.get<SingleResponse<Specialization>>(`/specializations/${id}`).then((r) => r.data.data),
  create: (payload: { name: string; description?: string }) =>
    api.post<SingleResponse<Specialization>>('/specializations', payload).then((r) => r.data.data),
  update: (id: number, payload: { name?: string; description?: string }) =>
    api
      .put<SingleResponse<Specialization>>(`/specializations/${id}`, payload)
      .then((r) => r.data.data),
  remove: (id: number) => api.delete(`/specializations/${id}`),
};
