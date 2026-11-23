import api from './api';
import type { Review, SingleResponse } from '@/types/api.types';

export interface ReviewPayload {
  consultationId: number;
  rating: number;
  text?: string;
}

export const reviewsService = {
  create: async (payload: ReviewPayload) => {
    const { data } = await api.post<SingleResponse<Review>>('/reviews', payload);
    return data.data;
  },
};
