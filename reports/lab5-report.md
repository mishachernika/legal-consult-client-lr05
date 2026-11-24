# Звіт з лабораторної роботи №5

**Дисципліна:** вебтехнології та розробка вебзастосунків
**Тема:** Розроблення основного інтерфейсу та функціоналу
**Предметна область:** онлайн-платформа для юридичних консультацій (клієнт до сервера з ЛР01–ЛР03)
**Виконав:** Чернік Михайло Богданович, група ІПЗ-41, ВФК НУХТ
**Викладач:** Юхта О.А.
**Репозиторій:** https://github.com/mishachernika/legal-consult-client-lr05
**Локальний запуск:** `npm install && cp .env.example .env && npm run dev` → http://localhost:5173 (API сервера — http://localhost:3000)

---

## 1. Мета роботи

Здобути практичні навички створення повнофункціонального інтерфейсу із системою аутентифікації, керуванням станом, валідацією форм та CRUD-операціями для взаємодії з API серверної частини.

## 2. Завдання

### Рівень 1 — аутентифікація та Dashboard

1. Сторінки Login/Register із формами — `src/pages/LoginPage.tsx`, `RegisterPage.tsx` (React Hook Form + Zod) — **виконано**;
2. Аутентифікація через Zustand — `src/stores/authStore.ts` (persist у localStorage `auth-storage`: user + access/refresh токени) — **виконано**;
3. Захищені маршрути — `src/components/ProtectedRoute.tsx` (без токена → `<Navigate to="/login" state={{ from }}>`; є перевірка ролей `roles={['ADMIN']}` для сторінок сфер права) — **виконано**;
4. Dashboard із навігаційним меню — `DashboardPage` + `DashboardLayout` із бічною панеллю — **виконано**;
5. Logout — кнопка у topbar: `authService.logout(refreshToken)` (відкликання на сервері) + `logout()` у store + toast + navigate на `/login` — **виконано**;
6. Індикатори завантаження — `isSubmitting`/`isPending` у кнопках (Button `isLoading`), скелети при завантаженні списків — **виконано**;
7. Базовий компонент помилки — `ErrorMessage` (`role="alert"`) + помилка форми `errors.root` + toast.error у мутаціях — **виконано**.

### Рівень 2 — CRUD та валідація

8. Сторінки списків основних сутностей — консультації (`/consultations`), юристи (`/lawyers`), сфери права (`/specializations`), сповіщення (`/notifications`) — **виконано**;
9. Створення записів із формами — `/consultations/create`, `/specializations/create` — **виконано**;
10. Редагування — `/consultations/:id/edit`, `/specializations/:id/edit` (дані підтягуються у форму через `reset`) — **виконано**;
11. Підтвердження та видалення — модальне вікно `Modal` замість `confirm()`, `useMutation` + `invalidateQueries` — **виконано**;
12. Валідація React Hook Form + Zod — `src/schemas/*.schema.ts` (Zod 4: `z.email()`, `error`-параметр, `z.coerce` для select/number, transform `''`→`undefined`; типи `z.input`/`z.output` у `useForm<Input, unknown, Output>`) — **виконано**;
13. Повторні компоненти Table, List, Grid — `components/common/Table.tsx` (колонки даними), `List.tsx`, `Grid.tsx` — **виконано**;
14. Пагінація — `Pagination` поверх формату відповіді сервера `{ data, pagination: { page, limit, total, totalPages, hasMore } }` для консультацій, каталогу юристів і сповіщень — **виконано**. Довідник сфер права API повертає одним невеликим масивом, тому для нього застосовано локальний пошук без штучної пагінації.

### Рівень 3 — розширений UI/UX та стан

15. Глобальний стан: Zustand — лише сесія (`authStore`); TanStack Query — усі дані сервера (`useQuery`/`useMutation`, `QueryClientProvider` у `main.tsx`, `staleTime: 30_000`) — **виконано**;
16. Toast-сповіщення — `react-hot-toast` (`Toaster` у `main.tsx`, `toast.success/error` у мутаціях і логіні) — **виконано**;
17. Пошук і фільтрація у списках — debounce-пошук (`useDebounce`) + фільтр за статусом/ сферою/ непрочитаними — **виконано**;
18. Сортування — у каталозі юристів (rating/pricePerHour/experienceYears × asc/desc, на сервері `sortBy`/`order` зі білим списком) — **виконано**;
19. Детальні сторінки записів — `/consultations/:id` (інфо, статуси, чат, відгук), `/lawyers/:id` (профіль + відгуки) — **виконано**;
20. Breadcrumbs — `components/common/Breadcrumbs.tsx` на всіх сторінках кабінету — **виконано**;
21. Сkeleton loaders — `Skeleton`, `TableSkeleton`, `CardGridSkeleton`, `PageSkeleton` (`animate-pulse`, `aria-busy`) — **виконано**;
22. Адаптивна бічна панель — `DashboardLayout`: на desktop згортається до іконок (кнопка-«чеврон»), на mobile — overlay по бургер-кнопці — **виконано**.

## 3. Хід роботи

1. **Стан:** скопійовано актуальний клієнт після ЛР04 ( гілка main `legal-consult-client-lr04`) у новий репозиторій `legal-consult-client-lr05` (своя історія комітів). Встановлено `zustand @tanstack/react-query react-hook-form @hookform/resolvers zod@4 react-hot-toast`.
2. **Сесія (Zustand):** `authStore` із `persist` (`auth-storage`) — там живуть `user`, `accessToken`, `refreshToken`; `login/logout/setTokens`. `api.ts` переписано: request-інтерцептор бере токен зі store; response-інтерцептор на 401 робить single-flight `POST /auth/refresh` (нову пару кладе в store) і повторює оригінальний запит, а якщо refresh не вдався — `logout()` (ProtectedRoute сам веде на `/login`, сторінка не перезавантажується).
3. **Форми аутентифікації:** Zod-схеми (`loginSchema`, `registerSchema` із refine для confirmPassword і optional phone `+380...`); `LoginPage`/`RegisterPage` на RHF + `zodResolver`, помилка сервера — в `errors.root`; після login — `navigate(state.from ?? '/dashboard')`.
4. **Роутинг:** публічні `/`, `/about`, `/login`, `/register`; захищений блок на `DashboardLayout` через `ProtectedRoute` (окремо `roles={['ADMIN']}` для створення/редагування сфер права).
5. **TanStack Query:** `QueryClientProvider` + `Toaster` у `main.tsx`; сервіси (`consultations/lawyers/specializations/notifications/reviews/users/auth`) — тонкі HTTP-обгортки; у сторінках `useQuery` із ключами на кшталт `['consultations', { page, search, status }]` і `placeholderData: keepPreviousData`; після мутацій — `invalidateQueries`.
6. **CRUD consultation:** список (Table + пошук із debounce + фільтр статусу + пагінація + видалення через Modal), форма create/edit (для ADMIN додатково вибір клієнта зі списку `/api/users?role=CLIENT` — сервер вимагає `clientId` від адміна), детальна сторінка: картка деталей, кнопки зміни статусу за роллю, чат (список повідомлень + форма відправки), форма відгуку (клієнт, COMPLETED, якщо ще не лишав), видалення з модалкою.
7. **Юристи:** каталог картками (Grid) із пошуком, фільтром за сферою, сортуванням і пагінацією; детальна сторінка з відгуками; кнопка «Замовити консультацію» веде на `/consultations/create?lawyerId=…` (prefill).
8. **Сфери права:** API ЛР03 повертає невеликий довідник одним масивом, тому пошук виконано локально; адмін бачить CRUD (create/edit сторінки + видалення з модалкою).
9. **Сповіщення:** список (List) із бейджами типу/пріоритету, фільтр «Лише непрочитані», «Прочитати всі», видалення, лічильник unreadCount.
10. **UX:** Breadcrumbs, EmptyState, ErrorMessage, Skeleton-и, debounce, темна тема (з ЛР04), адаптивний sidebar.
11. **Перевірка e2e (headless Chrome + живий сервер :3000):** login → dashboard; валідація порожньої форми; список консультацій; відкриття деталі; відправка повідомлення в чат; створення консультації через форму (як адмін із вибором клієнта); перехід на сторінку створеної; видалення її через модалку; каталог юристів, деталі юриста, сфери, сповіщення; темна тема; mobile + sidebar. Усе знято на скріншоти (див. §6).
12. **Якість:** `npm run lint` чистий, `npm run format:check` ок, `npm run build` (`tsc -b && vite build`) збирає. Зауваження build про chunk size >500 kB — некритичне (розбиття на lazy-маршрути заплановано на ЛР06).

## 4. Ключові лістинги

**`src/stores/authStore.ts`** — єдине сховище сесії (persist → localStorage `auth-storage`):

```ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      login: (user, tokens) => set({ user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }),
      setTokens: (tokens) => set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    { name: 'auth-storage' },
  ),
);
```

**`src/services/api.ts`** — інтерцептори: токен зі store; 401 → single-flight refresh і повтор запиту:

```ts
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// у response-інтерцепторі: if (401 && !config._retried) { const t = await refreshAccessToken(); ... return api.request(config); }
```

**`src/components/ProtectedRoute.tsx`**:

```tsx
if (!accessToken) return <Navigate to="/login" replace state={{ from: location }} />;
if (roles && (!user || !roles.includes(user.role))) return <Navigate to="/dashboard" replace />;
```

**Список із TanStack Query** (`ConsultationsListPage`): ключ містить параметри, `keepPreviousData`, інвалідація після видалення:

```ts
const { data, isPending, isError } = useQuery({
  queryKey: ['consultations', { page, search: debouncedSearch, status }],
  queryFn: () => consultationsService.getAll({ page, limit: 10, search: debouncedSearch || undefined, status: status || undefined }),
  placeholderData: keepPreviousData,
});
// у мутації видалення: onSuccess → queryClient.invalidateQueries({ queryKey: ['consultations'] })
```

**Zod 4 + RHF** (`consultation.schema.ts`, фрагмент): `z.email({ error })`, `z.coerce.number()` для select, `transform('' → undefined)` для необов'язкових полів; у формі `useForm<ConsultationFormInput, unknown, ConsultationFormData>({ resolver: zodResolver(consultationSchema) })`.

## 5. Структура проєкту

```
src/
├── components/common/   Button Input Select Textarea Card Badge Loading FormField ErrorMessage
│                        Skeleton(+Table/CardGrid/Page) Modal Table Grid List Pagination Breadcrumbs EmptyState ErrorBoundary
├── components/layout/   Header Footer Layout DashboardLayout(sidebar)
├── components/ProtectedRoute.tsx
├── pages/               Home About NotFound Login Register Dashboard ConsultationsList
│                        ConsultationForm ConsultationDetail LawyersList LawyerDetail
│                        SpecializationsList SpecializationForm Notifications
├── services/            api.ts + auth/users/lawyers/consultations/specializations/notifications/reviews
├── stores/authStore.ts  # Zustand persist
├── schemas/             auth.schema.ts consultation.schema.ts specialization.schema.ts
├── types/               api.types.ts auth.types.ts
├── hooks/               useTheme.ts useDebounce.ts
├── utils/               format.ts cn.ts errors.ts
└── constants/index.ts
```

## 6. Тестування

- `npm run lint` — без помилок; `npm run format:check` — чисто; `npm run build` — `tsc -b && vite build` збирає (скріншоти терміналу: `lab5-terminal-lint.png`, `lab5-terminal-build.png`, логи `lab5-lint.txt`, `lab5-format-check.txt`, `lab5-build.txt`).
- e2e проти живого API (headless Chrome, сесія admin): логін/реєстрація (incl. помилки валідації), dashboard, списки, деталі, чат, створення+видалення консультації, каталог юристів, сповіщення, темна тема, мобільний sidebar — скріншоти нижче.
- CI (`.github/workflows/ci.yml`, Node 24): `npm ci → lint → format:check → build` — зелений на `main`.

### Скріншоти (`reports/screenshots/`)

| Файл | Зміст |
|---|---|
| `lab5-login.png`, `lab5-login-validation.png` | вхід; помилки Zod при порожньому submit |
| `lab5-register.png` | реєстрація |
| `lab5-dashboard.png`, `lab5-dashboard-dark.png` | панель, світла/темна |
| `lab5-consultations.png` | таблиця консультацій із пошуком/фільтром/бейджами статусів |
| `lab5-delete-modal.png` | модалка підтвердження видалення |
| `lab5-consultation-detail.png`, `lab5-consultation-chat.png` | деталі #14 + чат із повідомленнями |
| `lab5-consultation-form-validation.png` | помилки валідації форми створення |
| `lab5-consultation-created.png` | сторінка щойно створеної консультації |
| `lab5-consultations-after-delete.png` | список після видалення тестової |
| `lab5-lawyers.png`, `lab5-lawyer-detail.png` | каталог (пошук/фільтр/сорт) і профіль юриста |
| `lab5-specializations.png`, `lab5-notifications.png` | сфери права, сповіщення |
| `lab5-mobile-dashboard.png`, `lab5-mobile-sidebar.png` | 390px + відкритий sidebar |
| `lab5-terminal-lint.png`, `lab5-terminal-build.png` | lint/format:check і build у Terminal |

## 7. Контрольні запитання

1. **Контрольовані vs неконтрольовані компоненти:** у контрольованих значення поля живе у стані React і кожне натискання → ре-рендер; у неконтрольованих значення читається з DOM лише при події (ref). React Hook Form використовує неконтрольований підхід (`register` повертає `ref` на нативний input), тому складні форми майже не ре-рендеряться — сторінка не гальмує при введенні.
2. **JWT на клієнті:** сервер повертає пару токенів (`{ user, tokens: { accessToken, refreshToken } }`); access (15 хв) додаємо в `Authorization: Bearer` і тримаємо у Zustand+persist (localStorage `auth-storage`); refresh — для продовження сесії. Ризик localStorage: токен доступний будь-якому JS (XSS → викрадення). Альтернатива: refresh у `httpOnly`-кукі (недоступна JS), access — лише в пам'яті процесу; тоді XSS не вкраде refresh. Компроміс нашого навчального проєкту — короткий access + refresh у localStorage, бо це простіше й достатньо для курсу.
3. **Zod:** схема = правила валідації + джерело типів (`z.infer`), тому форма й типи не розходяться; ручна валідація дублює правила. `z.input` — що ввів користувач (рядки з полів), `z.output` — після transform/coerce (числа, undefined); тому `useForm<Input, C, Output>`. `z.preprocess`/transform для необов'язкового числа потрібен, бо порожнє поле — це `''`, а не `undefined`, і `z.coerce.number()` дав би NaN.
4. **Protected Routes:** обгортка перевіряє сесію і або рендерить дочірні елементи, або `<Navigate to="/login" state={{ from: location }}>`; після входу читаємо `location.state.from` і повертаємо користувача назад. Клієнтський захист — лише UX: JS у браузері можна змінити, тому справжня безпека — перевірка токена на сервері (401/403), що в нас і є (middleware з ЛР02).
5. **Context vs Zustand:** Context перемальовує всіх споживачів при будь-якій зміні; Zustand — підписка селектором на частину стану, перемальовуються лише ті компоненти, чиї дані змінились, провайдер не потрібен. Дані сервера (списки) не варто тримати в Zustand: доводилось би вручну писати кеш, повторні запити, скасування застарілих відповідей і синхронізацію після мутацій — TanStack Query робить це за нас через queryKey + invalidateQueries.
6. **queryKey і кеш:** масив-ідентифікатор запиту (`['consultations', { page, search }]`); TanStack Query зберігає результат за цим ключем, повертає з кешу, якщо дані свіжі (staleTime), і перезапитує при зміні ключа/монтуванні. `invalidateQueries({ queryKey: ['consultations'] })` позначає всі підходящі ключі застарілими — активні запити перезавантажуються, тож після мутації UI сам підтягує актуальні дані з сервера (сервер — єдине джерело істини).
7. **Оптимістичні оновлення:** UI змінюємо одразу, до відповіді сервера (`onMutate` → `cancelQueries` + `setQueryData`), при помилці — відкат (`onError` через збережений snapshot). Доцільно для дій, що майже завжди успішні (лайк, перемикач статусу); недоцільно для критичних операцій (оплата, видалення без скасування) — у нас видалення робимо песимістично: спочатку DELETE, потім інвалідація.
8. **Централізована обробка помилок:** (а) interceptor Axios — 401 → refresh/logout, решту нормалізує `normalizeApiError` у `Error` із текстом сервера `{ error }`; (б) `getErrorMessage` + `errors.root` у формах і `toast.error` у мутаціях; (в) `ErrorBoundary` ловить помилки рендеру; (г) `ErrorMessage` показує стан помилки запиту. Разом покриваємо мережу, сервер і рендер.
9. **Debounce для пошуку:** без нього запит летів би на кожну клавішу (N запитів за слово), сервер і мережа перевантажувались би, а результати «миготіли». `useDebounce` віддає значення лише після паузи 300 мс — один запит на введене слово. У нас ще й `setPage(1)` при новому пошуку.
10. **Скелетони:** замість порожнього екрана/спінера показуємо «заглушки» форми майбутнього контенту з `animate-pulse` — мозок сприймає сторінку як таку, що вже грузиться, і контент «не стрибає», коли приїжджає. У нас `TableSkeleton`/`CardGridSkeleton`/`PageSkeleton` із `aria-busy` для екранних читачів.

## 8. Висновки

Клієнт із ЛР04 перетворено на повнофункціональний інтерфейс: вхід/реєстрація з JWT-сесією у Zustand (persist) і refresh-on-401 в інтерцепторах Axios, захищені маршрути з поверненням на початкову сторінку, кабінет із адаптивним sidebar, CRUD консультацій (список/форма/деталі/чат/відгук/видалення з модалкою), каталог юристів із пошуком-фільтрами-сортуванням, адмін-CRUD сфер права, сповіщення. Форми — на React Hook Form + Zod 4, дані сервера — через TanStack Query з інвалідацією кешу, UX — toast, breadcrumbs, скелетони, debounce-пошук, темна тема, mobile-версія. Усе перевірено e2e проти живого API (скріншоти в `reports/screenshots/`), lint/format/build зелені, CI у GitHub Actions зелений.
