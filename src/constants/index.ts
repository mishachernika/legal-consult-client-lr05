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
  register: '/register',
  dashboard: '/dashboard',
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

export const CONSULTATION_STATUS_VARIANTS: Record<
  string,
  'neutral' | 'info' | 'success' | 'warning' | 'danger'
> = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  CANCELLED: 'danger',
};

// Розділи особистого кабінету (бічна панель): adminOnly — лише для ролі ADMIN
export const DASHBOARD_NAV = [
  { to: '/dashboard', label: 'Панель', icon: 'home' },
  { to: '/consultations', label: 'Консультації', icon: 'chat' },
  { to: '/lawyers', label: 'Юристи', icon: 'scale' },
  { to: '/specializations', label: 'Сфери права', icon: 'tag', adminOnly: true },
  { to: '/notifications', label: 'Сповіщення', icon: 'bell' },
] as const;
