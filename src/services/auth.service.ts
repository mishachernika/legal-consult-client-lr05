import api from './api';
import type {
  AuthResponse,
  Enable2faResponse,
  LoginRequest,
  MeResponse,
  RefreshResponse,
  RegisterRequest,
} from '@/types/auth.types';

// Сервіси auth: тонкі обгортки над ендпоінтами /api/auth серверної частини (ЛР02)
export const authService = {
  register: (body: RegisterRequest) => api.post<AuthResponse>('/auth/register', body),
  login: (body: LoginRequest) => api.post<AuthResponse>('/auth/login', body),
  refresh: (refreshToken: string) => api.post<RefreshResponse>('/auth/refresh', { refreshToken }),
  logout: (refreshToken?: string) => api.post('/auth/logout', { refreshToken }),
  me: () => api.get<MeResponse>('/auth/me'),
  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', body),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (body: { token: string; newPassword: string }) =>
    api.post('/auth/reset-password', body),
  enable2fa: () => api.post<Enable2faResponse>('/auth/2fa/enable'),
  confirm2fa: (code: string) => api.post('/auth/2fa/confirm', { code }),
  disable2fa: (code: string) => api.post('/auth/2fa/disable', { code }),
};
