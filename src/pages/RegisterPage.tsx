import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';
import FormField from '@/components/common/FormField';
import Input from '@/components/common/Input';
import { ROUTES } from '@/constants';
import {
  registerSchema,
  type RegisterFormData,
  type RegisterFormInput,
} from '@/schemas/auth.schema';
import { authService } from '@/services/auth.service';
import { getErrorMessage } from '@/utils/errors';

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput, unknown, RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit({ name, email, password, phone }: RegisterFormData) {
    try {
      // confirmPassword — лише клієнтська перевірка, на сервер не надсилаємо
      await authService.register({ name, email, password, phone });
      toast.success('Обліковий запис створено. Тепер увійдіть.');
      navigate('/login');
    } catch (error) {
      setError('root', { message: getErrorMessage(error, 'Помилка реєстрації') });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900">
        <h1 className="mb-6 text-center text-3xl font-bold">Реєстрація</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Ім'я" error={errors.name?.message}>
            <Input placeholder="Іван Петренко" autoComplete="name" {...register('name')} />
          </FormField>
          <FormField label="Email" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="ivan@example.com"
              autoComplete="email"
              {...register('email')}
            />
          </FormField>
          <FormField
            label="Телефон (необов'язково)"
            error={errors.phone?.message}
            hint="Формат: +380XXXXXXXXX"
          >
            <Input placeholder="+380123456789" autoComplete="tel" {...register('phone')} />
          </FormField>
          <FormField label="Пароль" error={errors.password?.message} hint="Мінімум 8 символів">
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register('password')}
            />
          </FormField>
          <FormField label="Підтвердження пароля" error={errors.confirmPassword?.message}>
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
          </FormField>

          {errors.root && (
            <p role="alert" className="text-sm text-red-500">
              {errors.root.message}
            </p>
          )}

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Зареєструватися
          </Button>
        </form>

        <p className="mt-4 text-center text-sm">
          Вже є акаунт?{' '}
          <Link to={ROUTES.login} className="text-primary-600 hover:underline">
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}
