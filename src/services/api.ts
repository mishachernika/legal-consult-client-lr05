import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types/api.types';
import type { RefreshResponse } from '@/types/auth.types';
import { useAuthStore } from '@/stores/authStore';

// Єдиний екземпляр Axios для всього застосунку: baseURL із змінних середовища (VITE_API_URL)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Interceptor запиту: додає access-токен зі сховища Zustand до кожного запиту
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Одночасно лише один refresh-запит: усі 401 під час нього чекають на ту саму промISE
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken, setTokens, logout } = useAuthStore.getState();
  if (!refreshToken) return null;
  refreshPromise ??= axios
    .post<RefreshResponse>(
      `${api.defaults.baseURL}/auth/refresh`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then((res) => {
      setTokens(res.data.tokens);
      return res.data.tokens.accessToken;
    })
    .catch(() => {
      logout();
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

// Interceptor відповіді: при 401 пробуємо оновити пару токенів через refresh і повторюємо
// запит; якщо refresh не вдався — сесію завершено (logout), а ProtectedRoute сам
// перенаправить на /login, тому перезавантаження сторінки не потрібне.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const config = error.config as
      (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
    if (error.response?.status === 401 && config && !config._retried) {
      config._retried = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`;
        return api.request(config);
      }
    }
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
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
