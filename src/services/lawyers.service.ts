import api from './api';
import type {
  LawyerDetail,
  LawyerProfile,
  PaginatedResponse,
  SingleResponse,
} from '@/types/api.types';

export interface LawyersQuery {
  page?: number;
  limit?: number;
  search?: string;
  specializationId?: number | '';
  minPrice?: number | '';
  maxPrice?: number | '';
  /** Сервер сортує за rating | pricePerHour | experienceYears */
  sortBy?: 'rating' | 'pricePerHour' | 'experienceYears';
  order?: 'asc' | 'desc';
}

export const lawyersService = {
  getAll: async (params: LawyersQuery = {}) => {
    const { data } = await api.get<PaginatedResponse<LawyerProfile>>('/lawyers', { params });
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get<SingleResponse<LawyerDetail>>(`/lawyers/${id}`);
    return data.data;
  },
};
