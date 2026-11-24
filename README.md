# LegalConsult — клієнтська частина (ЛР04 + ЛР05)

## Автор

Чернік Михайло Богданович, група ІПЗ-41, Волинський фаховий коледж НУХТ

## Опис проєкту

React-клієнт для **онлайн-платформи юридичних консультацій**. Серверна частина — окремий репозиторій `legal-consult-api-lr03` (Node.js + Express + Prisma + PostgreSQL + Socket.io). ЛР04 — базова архітектура (Vite + TS + Tailwind 4 + роутинг + UI-компоненти + темна тема); ЛР05 — повнофункціональний інтерфейс: аутентифікація, захищені маршрути, CRUD сутностей, валідація форм, пошук/пагінація/сортування, сповіщення.

## Функціональність

- Аутентифікація JWT (login/register, refresh-on-401), сесія у Zustand з `persist` (localStorage `auth-storage`)
- Захищені маршрути (`ProtectedRoute`, редірект на `/login` із поверненням на `state.from`)
- Панель керування (Dashboard) з адаптивною бічною панеллю (згортання на desktop, overlay на mobile)
- CRUD консультацій: список (пошук + фільтр за статусом + пагінація), створення/редагування (форма з вибором юриста), детальна сторінка (зміна статусу за роллю, чат, відгук, видалення з модальним підтвердженням)
- Каталог юристів: пошук, фільтр за сферою права, сортування (рейтинг/ціна/досвід), пагінація, детальна сторінка з відгуками
- Сфери права: список усім, адмін-операції (create/edit/delete) лише для ролі ADMIN
- Сповіщення: список, фільтр непрочитаних, «прочитати все», видалення
- Валідація форм: React Hook Form + Zod 4 (`zodResolver`, `z.input`/`z.output`)
- Дані сервера: TanStack Query (`useQuery`/`useMutation`, `invalidateQueries`, `keepPreviousData`); клієнтський стан сесії: Zustand
- Сповіщення про успіх/помилки: react-hot-toast; централізована помилка Axios (interceptors + `getErrorMessage`)
- UX: скелетні індикатори (Skeleton/TableSkeleton/CardGridSkeleton), debounce-пошук, breadcrumbs, порожні стани, темна тема

## Технології

- React 19 + TypeScript 6
- Vite 8 (Rolldown)
- Tailwind CSS 4 (`@theme`, `@custom-variant dark`)
- React Router 8
- Axios (interceptors: токен із store, refresh-on-401, нормалізація помилок)
- React Hook Form 7 + Zod 4 + @hookform/resolvers
- Zustand 5 (persist) — сесія користувача
- TanStack Query 5 — дані сервера (кеш за queryKey, інвалідація)
- react-hot-toast — toast-сповіщення
- ESLint 10 (flat config) + Prettier

## API-ендпоінти серверної частини (legal-consult-api-lr03)

| Метод | Шлях | Призначення |
|---|---|---|
| POST | `/api/auth/register` · `/api/auth/login` · `/api/auth/refresh` · `/api/auth/logout` · `/api/auth/me` | аутентифікація, сесія |
| GET/POST | `/api/consultations` · GET/PUT/DELETE `/api/consultations/:id` | CRUD консультацій |
| GET/POST | `/api/consultations/:id/messages` | чат консультації |
| GET | `/api/lawyers` (search, specializationId, minPrice/maxPrice, sortBy, order, page, limit) · GET `/api/lawyers/:id` | каталог юристів |
| GET | `/api/specializations` · POST/PUT/DELETE (ADMIN) | сфери права |
| GET | `/api/notifications` (unread, page, limit) · POST `/:id/read`, `/read-all` · DELETE `/:id` | сповіщення |
| POST | `/api/reviews` | відгук після завершеної консультації |
| GET | `/api/users` (лише ADMIN) | вибір клієнта у формі (адмін) |

## Встановлення та запуск

### Вимоги

- Node.js 24 LTS
- Запущена серверна частина з ЛР03 на `http://localhost:3000`

### Інструкції

```bash
git clone https://github.com/mishachernika/legal-consult-client-lr05.git
cd legal-consult-client-lr05
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:3000/api
npm run dev                  # http://localhost:5173
npm run lint                 # ESLint
npm run format:check         # Prettier
npm run build                # typecheck + продакшен-збірка
npm run preview              # перегляд збірки на :4173
```

### Тестовий обліковий запис (seed сервера ЛР03)

```
Email: admin@legal.ua   (також юристи *@legal.ua, клієнти *@example.com)
Password: password123
```

## Структура проєкту

```
src/
├── components/
│   ├── common/        # Button, Input, Select, Textarea, Card, Badge, Loading, FormField,
│   │                  # ErrorMessage, Skeleton-и, Modal, Table, Grid, List, Pagination,
│   │                  # Breadcrumbs, EmptyState, ErrorBoundary
│   ├── layout/        # Header, Footer, Layout (публічні) + DashboardLayout (sidebar кабінету)
│   └── ProtectedRoute.tsx
├── pages/             # Home, About, NotFound, Login, Register, Dashboard, Consultations*,
│                      # Lawyers*, Specializations*, Notifications
├── services/          # api.ts (Axios + інтерцептори) + auth/users/lawyers/consultations/
│                      # specializations/notifications/reviews сервіси
├── stores/            # authStore.ts (Zustand persist — сесія)
├── schemas/           # Zod-схеми форм (auth, consultation, specialization)
├── types/             # типи API (api.types.ts, auth.types.ts) — під схему Prisma сервера
├── hooks/             # useTheme, useDebounce
├── utils/             # format.ts, cn.ts, errors.ts
└── constants/         # APP_NAME, ROUTES, DASHBOARD_NAV, CONTACTS, лейбли enum'ів
```

Абсолютні імпорти `@/` — у `tsconfig.app.json` (`paths`) і `vite.config.ts` (`resolve.alias`).

## Скріншоти (ЛР05)

| Файл у `reports/screenshots/` | Зміст |
|---|---|
| `lab5-login.png` / `lab5-login-validation.png` | сторінка входу; помилки Zod при порожньому submit |
| `lab5-register.png` | сторінка реєстрації |
| `lab5-dashboard.png` / `lab5-dashboard-dark.png` | панель керування, світла/темна тема |
| `lab5-consultations.png` | список консультацій (пошук, фільтр, таблиця) |
| `lab5-delete-modal.png` | модальне підтвердження видалення |
| `lab5-consultation-detail.png` / `lab5-consultation-chat.png` | деталі консультації + чат із повідомленнями |
| `lab5-consultation-form-validation.png` | помилки валідації форми створення |
| `lab5-consultation-created.png` | створена консультація (після submit → деталі) |
| `lab5-consultations-after-delete.png` | список після видалення тестової консультації |
| `lab5-lawyers.png` / `lab5-lawyer-detail.png` | каталог юристів (сітка, фільтри, сортування) і профіль |
| `lab5-specializations.png` | сфери права (у адміна — кнопки редагування) |
| `lab5-notifications.png` | сповіщення зі значками пріоритетів |
| `lab5-mobile-dashboard.png` / `lab5-mobile-sidebar.png` | мобільна версія + відкрита бічна панель |
| `lab5-terminal-lint.png` / `lab5-terminal-build.png` | `npm run lint`/`format:check` і `npm run build` у Terminal |

## CI

`.github/workflows/ci.yml` — на кожен push у `main`: `npm ci` → `npm run lint` → `npm run format:check` → `npm run build` (Node 24).
