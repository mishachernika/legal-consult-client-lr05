import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import toast from 'react-hot-toast';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Button from '@/components/common/Button';
import ErrorMessage from '@/components/common/ErrorMessage';
import FormField from '@/components/common/FormField';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { PageSkeleton } from '@/components/common/Skeleton';
import Textarea from '@/components/common/Textarea';
import {
  consultationSchema,
  type ConsultationFormData,
  type ConsultationFormInput,
} from '@/schemas/consultation.schema';
import { consultationsService } from '@/services/consultations.service';
import { lawyersService } from '@/services/lawyers.service';
import { usersService } from '@/services/users.service';
import { useAuthStore } from '@/stores/authStore';
import { getErrorMessage } from '@/utils/errors';

// Одна форма для створення (/consultations/create) і редагування (/consultations/:id/edit):
// при редагуванні дані запису завантажуємо через useQuery і заповнюємо ними форму (reset)
export default function ConsultationFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const consultationId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'ADMIN';
  // /consultations/create?lawyerId=26 — prefill вибраного юриста з каталогу
  const [searchParams] = useSearchParams();
  const preselectedLawyerId = searchParams.get('lawyerId') ?? '';

  const { data: lawyers, isPending: lawyersLoading } = useQuery({
    queryKey: ['lawyers', { limit: 100, sortBy: 'rating', order: 'desc' }],
    queryFn: () => lawyersService.getAll({ limit: 100, sortBy: 'rating', order: 'desc' }),
  });

  const { data: existing, isPending: existingLoading } = useQuery({
    queryKey: ['consultations', consultationId],
    queryFn: () => consultationsService.getById(consultationId),
    enabled: isEdit,
  });

  // Список клієнтів потрібен лише адміну (він вибирає, від імені кого створити консультацію)
  const { data: clients } = useQuery({
    queryKey: ['users', { role: 'CLIENT', limit: 100 }],
    queryFn: () => usersService.getAll({ role: 'CLIENT', limit: 100 }),
    enabled: isAdmin && !isEdit,
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ConsultationFormInput, unknown, ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      lawyerId: preselectedLawyerId,
      clientId: '',
      topic: '',
      description: '',
      scheduledAt: '',
    },
  });

  // Коли запис завантажився — заповнюємо форму його значеннями
  useEffect(() => {
    if (existing) {
      reset({
        lawyerId: String(existing.lawyerId), // у відповіді lawyerId — це userId
        clientId: String(existing.clientId),
        topic: existing.topic,
        description: existing.description,
        scheduledAt: existing.scheduledAt ? existing.scheduledAt.slice(0, 16) : '',
      } as ConsultationFormInput);
    }
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (data: ConsultationFormData) => {
      const payload: {
        lawyerId: number;
        topic: string;
        description: string;
        scheduledAt?: string;
        clientId?: number;
      } = {
        lawyerId: data.lawyerId,
        topic: data.topic,
        description: data.description,
        scheduledAt: data.scheduledAt,
      };
      // clientId передаємо лише адмін (для клієнта сервер підставляє req.user.userId сам)
      if (isAdmin && data.clientId) payload.clientId = data.clientId;
      return isEdit
        ? consultationsService.update(consultationId, payload)
        : consultationsService.create(payload);
    },
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: ['consultations'] });
      toast.success(isEdit ? 'Консультацію оновлено' : 'Консультацію створено');
      navigate(`/consultations/${created.id}`);
    },
    onError: (error) => {
      setError('root', { message: getErrorMessage(error, 'Помилка збереження') });
    },
  });

  if (isEdit && existingLoading) return <PageSkeleton />;

  return (
    <div className="mx-auto max-w-2xl">
      <Breadcrumbs
        items={[
          { label: 'Кабінет', to: '/dashboard' },
          { label: 'Консультації', to: '/consultations' },
          { label: isEdit ? `Редагування #${consultationId}` : 'Нова консультація' },
        ]}
      />

      <h1 className="mb-6 text-3xl font-bold">
        {isEdit ? `Редагування консультації #${consultationId}` : 'Нова консультація'}
      </h1>

      <form
        onSubmit={handleSubmit((data) => {
          // адмін має явно обрати клієнта (сам сервер для ролі CLIENT підставляє req.user.userId)
          if (isAdmin && !isEdit && !data.clientId) {
            setError('clientId', { message: 'Оберіть клієнта' });
            return;
          }
          mutation.mutate(data);
        })}
        className="space-y-4 rounded-lg bg-white p-6 shadow dark:bg-gray-900"
        noValidate
      >
        {isAdmin && !isEdit && (
          <FormField label="Клієнт (від імені кого створюємо)" error={errors.clientId?.message}>
            <Select {...register('clientId')}>
              <option value="">Оберіть клієнта...</option>
              {clients?.data.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </Select>
          </FormField>
        )}

        <FormField label="Юрист" error={errors.lawyerId?.message}>
          {lawyersLoading ? (
            <Input disabled placeholder="Завантаження списку юристів..." />
          ) : (
            <Select {...register('lawyerId')}>
              <option value="">Оберіть юриста...</option>
              {lawyers?.data.map((l) => (
                // createConsultation чекає lawyerId = userId юриста (findByUserId), не id профілю
                <option key={l.id} value={l.userId}>
                  {l.user?.name ?? `Юрист #${l.userId}`} —{' '}
                  {l.specializations?.map((s) => s.name).join(', ') ?? 'сфери не вказано'}
                </option>
              ))}
            </Select>
          )}
        </FormField>

        <FormField label="Тема" error={errors.topic?.message} hint="5–200 символів">
          <Input placeholder="Наприклад: оскарження штрафу поліції" {...register('topic')} />
        </FormField>

        <FormField
          label="Опис ситуації"
          error={errors.description?.message}
          hint="10–5000 символів"
        >
          <Textarea
            rows={6}
            placeholder="Опишіть деталі вашого питання..."
            {...register('description')}
          />
        </FormField>

        <FormField label="Запланований час (необов'язково)" error={errors.scheduledAt?.message}>
          <Input type="datetime-local" {...register('scheduledAt')} />
        </FormField>

        {errors.root && <ErrorMessage message={errors.root.message ?? 'Помилка збереження'} />}

        <div className="flex gap-4">
          <Button type="submit" isLoading={mutation.isPending}>
            {isEdit ? 'Зберегти' : 'Створити'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Скасувати
          </Button>
          <Link
            to="/lawyers"
            className="ml-auto self-center text-sm text-primary-600 hover:underline"
          >
            Спочатку обрати юриста в каталозі →
          </Link>
        </div>
      </form>
    </div>
  );
}
