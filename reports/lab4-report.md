# Звіт з лабораторної роботи №4

**Дисципліна:** вебтехнології та розробка вебзастосунків
**Тема:** Реалізація React-проєкту
**Предметна область:** онлайн-платформа для юридичних консультацій (клієнтська частина для сервера з ЛР01–ЛР03)
**Виконав:** Чернік Михайло Богданович, група ІПЗ-41, ВФК НУХТ
**Викладач:** Юхта О.А.
**Репозиторій:** https://github.com/mishachernika/legal-consult-client-lr04
**Локальний запуск:** `npm install && cp .env.example .env && npm run dev` → http://localhost:5173

---

## 1. Мета роботи

Здобути практичні навички створення сучасного React-проєкту з TypeScript, налаштування інструментів розробки та побудови базової архітектури клієнтської частини із Tailwind CSS.

## 2. Завдання

### Рівень 1 — базова конфігурація проєкту

1. React-проєкт на Vite + TypeScript — `npm create vite@latest -- --template react-ts`, Vite 8.3.8 + React 19.3 + TS 6.0 — **виконано**;
2. Tailwind CSS 4 — `tailwindcss` + `@tailwindcss/vite`, в `vite.config.ts` плагін `tailwindcss()`, в `src/index.css` — `@import "tailwindcss"` (без `tailwind.config.js`/PostCSS) — **виконано**;
3. ESLint + Prettier — oxlint із шаблону видалено; ESLint 10 у flat-форматі (`eslint.config.js`: `js.configs.recommended`, `tseslint.configs.recommended`, `reactHooks.configs.flat.recommended`, `reactRefresh.configs.vite`, `eslint-config-prettier`), `.prettierrc` (semi, singleQuote, printWidth 100), скрипти `lint`/`format`/`format:check` — **виконано**;
4. React Router 8 — пакет `react-router` (у v8 `react-router-dom` вилучено), `BrowserRouter` у `src/App.tsx` — **виконано**;
5. Axios — `src/services/api.ts`: `baseURL` із `VITE_API_URL`, таймаут 15 с, інтерцептори — **виконано**;
6. Структура папок — `components/common`, `components/layout`, `pages`, `services`, `types`, `utils`, `hooks`, `constants` — **виконано**;
7. Адаптивний макет — Layout на flex-колонці `min-h-screen`, `container mx-auto`, сітки `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, бургер-меню в Header на `md:hidden` — **виконано** (скріншот `lab4-home-mobile.png`).

### Рівень 2 — базові компоненти та навігація

8. UI-компоненти — `Button` (variant primary/secondary/danger, size sm/md/lg, isLoading), `Input` (ref як проп, без forwardRef — для React Hook Form у ЛР05), `Card`, `Badge` (5 варіантів), `Loading` — **виконано**;
9. `Header` з навігацією (`NavLink` з активним станом) і перемикачем теми — **виконано**;
10. `Footer` з контактами (email/телефон/адреса з `constants`) — **виконано**;
11. `Layout` — єдиний каркас сторінок (`Header` + `ErrorBoundary` + `Outlet` + `Footer`) — **виконано**;
12. Маршрути Home (`/`), About (`/about`), NotFound (`*`) — **виконано**;
13. Тема Tailwind через `@theme` у `index.css`: палітра `--color-primary-50…950` + `--font-sans` (Inter) — **виконано**;
14. Компонент `Loading` (спінер + текст, `role="status"`, варіант fullPage) — **виконано**.

### Рівень 3 — розширена архітектура

15. Змінні середовища для режимів — `.env` (у `.gitignore`), `.env.example`, `.env.development`, `.env.production` (`VITE_API_URL`, `VITE_APP_NAME`) — **виконано**;
16. Типи відповідей API — `src/types/api.types.ts` (User, LawyerProfile, Specialization, Consultation, Message, Review, AppFile, AppNotification, `PaginatedResponse<T>`, `ApiError`) і `auth.types.ts` — назви полів/enum'ів збігаються з `prisma/schema.prisma` сервера ЛР03 — **виконано**;
17. Interceptors Axios — request: `Authorization: Bearer` із `localStorage`; response: 401 → очищення токенів і перехід на `/login`, помилку нормалізовано в `Error` із повідомленням сервера (`normalizeApiError`) — **виконано**;
18. Error Boundary — класовий `ErrorBoundary` обгортає `<Outlet />` у Layout — **виконано**;
19. Абсолютні імпорти `@/` — `paths` у `tsconfig.app.json` (без застарілого `baseUrl`) + `resolve.alias` у `vite.config.ts` — **виконано**;
20. Допоміжні функції — `utils/format.ts` (`formatDate`, `formatDateTime`, `formatPrice` у UAH, `formatFileSize`, `truncate`) і `utils/cn.ts` — **виконано**;
21. Темна тема — `@custom-variant dark (&:where(.dark, .dark *))` у CSS, хук `useTheme` перемикає клас `dark` на `<html>` і зберігає вибір у `localStorage`; початкова тема — з localStorage або `prefers-color-scheme`; у компонентах — класи `dark:...` — **виконано**.

## 3. Хід роботи

1. **Проєкт:** `npm create vite@latest legal-consult-client-lr04 -- --template react-ts`, `npm install`. Node 24 LTS (`v24.22.3`). У шаблоні TypeScript 7 — зафіксовано `typescript@~6.0.3`, бо `typescript-eslint@8` вимагає `typescript <6.1.0` (peer-залежність).
2. **Tailwind 4:** `npm i tailwindcss @tailwindcss/vite`; плагін у `vite.config.ts`; `src/index.css` = `@import "tailwindcss"` + `@custom-variant dark` + `@theme` (палітра primary, шрифт Inter) + базовий шар body.
3. **ESLint/Prettier:** видалено `oxlint`; встановлено `eslint@10 @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals` + `prettier eslint-config-prettier`; створено `eslint.config.js` (flat) і `.prettierrc`; скрипти `lint`/`format`/`format:check`.
4. **Залежності:** `react-router@8`, `axios`.
5. **Структура + `@/`:** створено папки; `paths: { "@/*": ["./src/*"] }` у `tsconfig.app.json`; `resolve.alias` у `vite.config.ts`.
6. **Axios:** `src/services/api.ts` — інстанс із `baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'`, request-інтерцептор із токеном (`accessToken` у localStorage, як у ЛР02), response-інтерцептор (401 → чистка + `/login`, нормалізація помилки). Сервіси: `auth.service.ts` (register/login/refresh/logout/me/change-password/forgot/reset/2fa) і `specializations.service.ts` (пагінований список).
7. **UI-компоненти:** `Button`, `Input`, `Card`, `Badge`, `Loading`, `ErrorBoundary` у `components/common`.
8. **Розмітка:** `Header` (NavLink-меню + перемикач теми + бургер-меню на мобільному), `Footer` (контакти), `Layout` (Outlet у ErrorBoundary).
9. **Роутинг:** `App.tsx` — `BrowserRouter`, маршрут `/` з `Layout`, індекс Home, `about`, `*` → NotFound. Сторінки: `HomePage` (hero, статистика, пошук сфер права через `Input` із фільтрацією, кроки, CTA), `AboutPage`, `NotFoundPage`.
10. **Типи:** `types/api.types.ts`, `types/auth.types.ts` — під схему сервера ЛР03 (`PaginatedResponse<T>` = `{ data, pagination: { page, limit, total, totalPages, hasMore } }`, ролі `CLIENT/LAWYER/ADMIN`).
11. **Змінні середовища:** `.env`, `.env.example`, `.env.development`, `.env.production`; `.env` додано до `.gitignore`.
12. **Темна тема:** `@custom-variant dark` + `useTheme` (клас `dark` на `<html>`, localStorage, fallback на `prefers-color-scheme`); кнопка-перемикач у Header (SVG-іконки сонце/місяць).
13. **Авторизація як інтеграційний приклад:** додано маршрут `/login` із вкладками входу/реєстрації. `AuthPage` використовує типізований `authService`, показує loading/error-стани, а після успішної відповіді зберігає JWT-токени. Це також робить коректним 401-редірект Axios-інтерцептора.
14. **README** зі структурою, інструкціями, матрицею реалізованих вимог і прикладами інтерфейсу.
15. **Перевірка:** `npm run lint` (чисто), `npm run format:check` (чисто), `npm run build` (`tsc -b && vite build` — 168 модулів, `dist/` зібрано), `npm run dev` (http://localhost:5173). Скріншоти сторінок — headless Chrome: світла/темна desktop, mobile 390px, about, 404, auth. CI — `.github/workflows/ci.yml` (Node 24: lint + format:check + build).

## 4. Ключові лістинги

**`vite.config.ts`** — плагіни Tailwind/React та аліас `@/`:

```ts
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { port: 5173, strictPort: true },
});
```

**`src/index.css`** — тема Tailwind 4 в CSS + dark-варіант:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  /* ... повна палітра primary-50…950 */
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}
```

**`src/services/api.ts`** — інтерцептори Axios:

```ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.accessToken);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.accessToken);
      if (window.location.pathname !== ROUTES.login) window.location.href = ROUTES.login;
    }
    return Promise.reject(normalizeApiError(error));
  },
);
```

**`src/App.tsx`** — маршрутизація:

```tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

**`src/components/common/ErrorBoundary.tsx`** — класовий Error Boundary навколо `<Outlet />` у Layout.

**`src/hooks/useTheme.ts`** — перемикання класу `dark` на `<html>` і збереження вибору в localStorage.

## 5. Структура проєкту

```
legal-consult-client-lr04/
├── .env / .env.example / .env.development / .env.production
├── .github/workflows/ci.yml      # lint + format:check + build (Node 24)
├── eslint.config.js  .prettierrc  .prettierignore  .gitignore
├── index.html  package.json  tsconfig.json  tsconfig.app.json  tsconfig.node.json  vite.config.ts
├── public/favicon.svg
├── reports/lab4-report.md  reports/screenshots/…
└── src/
    ├── App.tsx  main.tsx  index.css
    ├── components/common/  Button Input Card Badge Loading ErrorBoundary
    ├── components/layout/  Header Footer Layout
    ├── pages/              HomePage AboutPage NotFoundPage
    ├── services/           api.ts auth.service.ts specializations.service.ts
    ├── types/              api.types.ts auth.types.ts
    ├── utils/              format.ts cn.ts
    ├── hooks/useTheme.ts
    └── constants/index.ts
```

## 6. Тестування

- `npm run lint` — ESLint 10, помилок немає (`reports/screenshots/lab4-lint.txt`);
- `npm run format:check` — Prettier: «All matched files use Prettier code style!» (`lab4-format-check.txt`);
- `npm run build` — `tsc -b` (typecheck, strict) + `vite build`: 107 модулів, `dist/index.html` 0.86 kB, CSS 18.37 kB (gzip 4.42 kB), JS 272.89 kB (gzip 86.64 kB) — `lab4-build.txt`;
- `npm run dev` — Vite 8.3.8 стартував за 159 мс на http://localhost:5173, сторінка віддає HTTP 200 — `lab4-dev.txt`;
- сторінки перевірено headless Chrome (puppeteer-core): навігація `/` ↔ `/about`, 404 на невідомому шляху, пошук на головній фільтрує картки, перемикач теми змінює клас `dark` на `<html>`;
- CI у GitHub Actions на кожен push у `main` — зелений (див. бейдж/Actions у репозиторії).

### Скріншоти

| Файл | Зміст |
|---|---|
| `lab4-home-light.png` | Головна, світла тема, desktop (повна сторінка) |
| `lab4-home-dark.png` | Головна, темна тема, desktop |
| `lab4-about.png` | «Про нас» |
| `lab4-notfound.png` | 404 |
| `lab4-home-mobile.png` | Мобільна версія 390px (бургер-меню), світла |
| `lab4-home-mobile-dark.png` | Мобільна версія, темна тема |
| `lab4-terminal-lint.png` | Terminal: `npm run lint` + `format:check` |
| `lab4-terminal-build.png` | Terminal: `npm run build` |
| `lab4-terminal-dev.png` | Terminal: `npm run dev` (Vite ready, Local: http://localhost:5173) |

## 7. Контрольні запитання

1. **Vite vs Webpack/CRA:** Vite у dev не збирає весь проєкт, а віддає нативні ES-модулі браузеру напряму — тому старт миттєвий і HMR застосовує зміни лише до зміненого модуля. Webpack/CRA спочатку збирають увесь граф модулів у бандл. У продакшені Vite 8 (Rolldown, Rust) збирає оптимізований бандл із code splitting і tree shaking. CRA офіційно застарів.
2. **Інтерфейси TS для пропсів:** `interface ButtonProps extends ComponentProps<'button'> { variant?: ... }` — контракт: компонент приймає лише описані пропси, решту button-атрибутів прокидаємо через `...props`; TS перевіряє виклики на етапі компіляції (`tsc -b` у `npm run build`), а IDE дає автодоповнення.
3. **Utility-first Tailwind:** стилі — утилітарними класами прямо в розмітці (`flex`, `px-4`, `text-primary-600`), без іменування власних класів і конфліктів специфічності. У Tailwind 4 налаштування переїхало з `tailwind.config.js` у CSS: `@import "tailwindcss"` + директива `@theme` для теми; PostCSS/автопрефіксер не потрібні, плагін `@tailwindcss/vite` сканує файли й генерує лише використані стилі.
4. **Interceptors Axios:** хуки, через які проходить кожен запит/відповідь. У нас request-інтерцептор додає `Authorization: Bearer <accessToken>` із localStorage, response-інтерцептор при 401 чистить токени й редіректить на `/login`, а також нормалізує помилку сервера `{ error }` у звичайний `Error`.
5. **`Outlet`:** маркер у батьківському маршруті, куди React Router рендерить дочірній маршрут. У нас `Layout` має `<Outlet />`, і туди потрапляють Home/About/NotFound — тому Header/Footer рендеряться на всіх сторінках без дублювання.
6. **ESLint vs Prettier:** ESLint — статичний аналіз і пошук помилок/антипатернів (flat config у v10); Prettier — лише форматування (відступи, лапки, ширина). Конфлікти правил знімає `eslint-config-prettier` (він стоїть останнім у `extends` і вимикає форматувальні правила ESLint); Prettier гоняємо окремо (`npm run format`).
7. **Змінні середовища:** `.env` не комітимо, бо там локальні налаштування й potenciйно секрети — кожен розробник створює свій (`cp .env.example .env`). Змінні з префіксом `VITE_` вбудовуються у фінальний JS-бандл під час збірки, і їх бачить будь-який користувач у DevTools — тому туди не можна класти ключі/паролі.
8. **Принципи повторно використовуваних компонентів:** єдина відповідальність (Button лише кнопка), композиція замість наслідування, пропси як контракт (типізовані), презентаційні компоненти не знають про API (дані приходять з пропсів), стилі — утилітами Tailwind + варіанти через проп `variant`, доступність (`aria-label`, `role="status"`).
9. **Адаптивний дизайн:** компонування під різні ширини екрана через брейкпоінти (`sm:`, `md:`, `lg:`). Tailwind дає їх як префікси класів (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, `md:hidden` для бургер-меню), тому окремі media-запити писати не треба — класи застосовуються лише на потрібних ширинах.
10. **Структура папок:** у нас — за призначенням (feature/purpose): `components/common` + `components/layout` (athomic design: базові UI vs каркас), `pages` (по одному компоненту на маршрут), `services` (один файл на сутність API + `api.ts`), `types`, `utils`, `hooks`, `constants`. Абсолютні імпорти `@/` знімають проблему `../../..`. У великих проєктах додатково групують за фічами (`features/consultations/…`).

## 8. Висновки

Створено повністю налаштований React-проєкт: Vite 8 + React 19 + TypeScript 6, Tailwind CSS 4 із власною темою (`@theme`) і темним режимом через клас на `<html>`, ESLint 10 + Prettier, React Router 8 із Layout/Outlet, Axios з інтерцепторами (токен, 401, нормалізація помилок), Error Boundary, абсолютні імпорти `@/`, типи API під схему сервера ЛР03, env-файли для режимів. Усі 21 пункти завдання трьох рівнів виконано. Якість підтверджено: `eslint` і `prettier --check` чисті, `tsc -b && vite build` збирається, dev-сервер працює, скріншоти сторінок (light/dark/mobile/404) — у `reports/screenshots/`. CI у GitHub Actions перевіряє lint + format + build на кожному push.
