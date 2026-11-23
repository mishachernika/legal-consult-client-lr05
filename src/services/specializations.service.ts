import api from './api';
import type { PaginatedResponse, SingleResponse, Specialization } from '@/types/api.types';

// Сервіс сфер права: публічний каталог + адмін-операції (POST/PUT/DELETE — лише ADMIN)
export interface SpecializationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export const specializationsService = {
  getAll: (params: SpecializationQuery = {}) =>
    api.get<PaginatedResponse<Specialization>>('/specializations', { params }).then((r) => r.data),
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
