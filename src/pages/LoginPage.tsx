import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';
import FormField from '@/components/common/FormField';
import Input from '@/components/common/Input';
import { ROUTES } from '@/constants';
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';
import { getErrorMessage } from '@/utils/errors';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  // Куди повернути користувача після входу (його зберіг ProtectedRoute у state.from)
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard';

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginFormData) {
    try {
      const { data: res } = await authService.login(data);
      login(res.user, res.tokens);
      toast.success(`Вітаємо, ${res.user.name}!`);
      navigate(from, { replace: true });
    } catch (error) {
      // Помилку сервера (401 невірні дані, 401 код 2FA тощо) показуємо над формою через root
      setError('root', { message: getErrorMessage(error, 'Помилка входу') });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900">
        <h1 className="mb-6 text-center text-3xl font-bold">Вхід</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Email" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              {...register('email')}
            />
          </FormField>

          <FormField label="Пароль" error={errors.password?.message}>
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password')}
            />
          </FormField>

          {errors.root && (
            <p role="alert" className="text-sm text-red-500">
              {errors.root.message}
            </p>
          )}

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Увійти
          </Button>
        </form>

        <p className="mt-4 text-center text-sm">
          Немає акаунта?{' '}
          <Link to={ROUTES.register} className="text-primary-600 hover:underline">
            Зареєструватися
          </Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link to={ROUTES.home} className="text-gray-500 hover:underline dark:text-gray-400">
            На головну
          </Link>
        </p>
      </div>
    </div>
  );
}
