import api from './api';
import type { PaginatedResponse, Specialization } from '@/types/api.types';

// Приклад сервісу сутності: пагінований список сфер права з пошуком (формат відповіді — ЛР02)
export interface SpecializationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export const specializationsService = {
  getAll: (params: SpecializationQuery = {}) =>
    api.get<PaginatedResponse<Specialization>>('/specializations', { params }),
  getById: (id: number) => api.get<{ data: Specialization }>(`/specializations/${id}`),
};
