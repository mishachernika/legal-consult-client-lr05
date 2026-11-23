import axios, { AxiosError } from 'axios';
import type { ApiError } from '@/types/api.types';
import { ROUTES, STORAGE_KEYS } from '@/constants';

// Єдиний екземпляр Axios для всього застосунку: baseURL із змінних середовища (VITE_API_URL)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Interceptor запиту: додає access-токен (ЛР02) до кожного запиту
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.accessToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor відповіді: централізована обробка помилок.
// 401 — токен протермінований/відкликаний: чистимо сховище й повертаємося на сторінку входу
// (у ЛР05 тут буде автоматичний refresh через /api/auth/refresh замість редіректу).
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.accessToken);
      localStorage.removeItem(STORAGE_KEYS.refreshToken);
      if (window.location.pathname !== ROUTES.login) {
        window.location.href = ROUTES.login;
      }
    }
    return Promise.reject(normalizeApiError(error));
  }
);

// Перетворює помилку Axios у звичайну Error із повідомленням сервера ({ error: '...' })
export function normalizeApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object' && 'error' in data) {
      return new Error(String((data as ApiError).error));
    }
    if (error.code === 'ECONNABORTED') return new Error('Сервер не відповідає (timeout)');
    return new Error(error.message);
  }
  return error instanceof Error ? error : new Error('Невідома помилка');
}

export default api;
