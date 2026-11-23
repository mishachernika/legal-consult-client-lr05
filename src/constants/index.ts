// Глобальні константи застосунку

export const APP_NAME: string = import.meta.env.VITE_APP_NAME ?? 'LegalConsult';

// Ключі localStorage (у ЛР05 сховище токенів переїде у стан застосунку)
export const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  theme: 'theme',
} as const;

export const ROUTES = {
  home: '/',
  about: '/about',
  login: '/login',
} as const;

export const CONTACTS = {
  email: 'info@legalconsult.ua',
  phone: '095 839 4692',
  phoneHref: '+380958394692',
  address: 'м. Луцьк, вул. Кафедральна, 6',
  addressUrl: 'https://www.google.com/search?kgmid=%2Fg%2F11c6y_7nfs',
} as const;

// Людинозчитущі підписи для enum'ів сервера (див. prisma/schema.prisma)
export const ROLE_LABELS: Record<string, string> = {
  CLIENT: 'Клієнт',
  LAWYER: 'Юрист',
  ADMIN: 'Адміністратор',
};

export const CONSULTATION_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Очікує підтвердження',
  CONFIRMED: 'Підтверджена',
  IN_PROGRESS: 'Триває',
  COMPLETED: 'Завершена',
  CANCELLED: 'Скасована',
};
