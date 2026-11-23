import type { User } from './api.types';

// Пара токенів, яку повертає сервер (access — у заголовку, refresh — у тілі/body)
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// POST /api/auth/login та /api/auth/register
export interface AuthResponse {
  message: string;
  user: User;
  tokens: TokenPair;
}

// POST /api/auth/refresh (ротація: старий refresh відкликається, повертається нова пара)
export interface RefreshResponse {
  tokens: TokenPair;
}

// GET /api/auth/me — обгортка { data: ... } у форматі спискових ендпоінтів
export interface MeResponse {
  data: User & { _count?: { consultationsAsClient: number; consultationsAsLawyer: number } };
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  /** TOTP-код, якщо для акаунта увімкнено 2FA (інакше сервер поверне 401) */
  totp?: string;
}

export interface Enable2faResponse {
  secret: string;
  otpauthUrl: string;
  qrCodeDataUrl: string;
}
