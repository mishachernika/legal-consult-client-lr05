import api from './api';
import type { NotificationsResponse } from '@/types/api.types';

export interface NotificationsQuery {
  page?: number;
  limit?: number;
  unread?: boolean;
}

export const notificationsService = {
  getAll: async (params: NotificationsQuery = {}) => {
    const { data } = await api.get<NotificationsResponse>('/notifications', {
      params: { ...params, unread: params.unread ? 'true' : undefined },
    });
    return data;
  },
  markRead: (id: number) => api.post(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/read-all'),
  remove: (id: number) => api.delete(`/notifications/${id}`),
};
