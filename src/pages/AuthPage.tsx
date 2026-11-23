import { useState, type FormEvent } from 'react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import { APP_NAME, STORAGE_KEYS } from '@/constants';
import { authService } from '@/services/auth.service';
import { normalizeApiError } from '@/services/api';

type Mode = 'login' | 'register';

interface FormState {
  name: string;
  email: string;
  password: string;
}

const initialForm: FormState = { name: '', email: '', password: '' };

/**
 * Невелика, але повноцінна форма авторизації: демонструє роботу Axios-сервісів,
 * типів API, Button/Input та станів loading/error. Повний кабінет з'явиться в ЛР05.
 */
export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [form, setForm] = useState<FormState>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isRegister = mode === 'register';

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setError(null);
    setSuccess(null);
  }

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = isRegister
        ? await authService.register({
            name: form.name,
            email: form.email,
            password: form.password,
          })
        : await authService.login({ email: form.email, password: form.password });
      const { accessToken, refreshToken } = response.data.tokens;
      localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
      localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
      setSuccess(`Вітаємо, ${response.data.user.name}! Токени збережено локально.`);
      setForm(initialForm);
    } catch (requestError) {
      setError(normalizeApiError(requestError).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 py-8">
      <div className="text-center">
        <Badge variant="info">Початок роботи</Badge>
        <h1 className="mt-3 text-3xl font-bold">{isRegister ? 'Створити акаунт' : 'Увійти'}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {isRegister
            ? `Зареєструйтеся, щоб звернутися до юриста на ${APP_NAME}.`
            : 'Увійдіть, щоб продовжити роботу з консультаціями.'}
        </p>
      </div>

      <Card>
        <div className="mb-6 grid grid-cols-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          {(['login', 'register'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => switchMode(item)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                mode === item
                  ? 'bg-white text-primary-700 shadow-sm dark:bg-gray-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {item === 'login' ? 'Вхід' : 'Реєстрація'}
            </button>
          ))}
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {isRegister && (
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Ім’я
              <Input
                required
                minLength={2}
                autoComplete="name"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Ваше ім’я"
              />
            </label>
          )}
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Email
            <Input
              required
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="name@example.com"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Пароль
            <Input
              required
              type="password"
              minLength={8}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="Щонайменше 8 символів"
            />
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200"
            >
              {error}
            </p>
          )}
          {success && (
            <p
              role="status"
              className="rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200"
            >
              {success}
            </p>
          )}

          <Button type="submit" size="lg" isLoading={isLoading} className="mt-2 w-full">
            {isRegister ? 'Створити акаунт' : 'Увійти'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
