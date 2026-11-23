import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import toast from 'react-hot-toast';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Button from '@/components/common/Button';
import ErrorMessage from '@/components/common/ErrorMessage';
import FormField from '@/components/common/FormField';
import Input from '@/components/common/Input';
import { PageSkeleton } from '@/components/common/Skeleton';
import Textarea from '@/components/common/Textarea';
import {
  specializationSchema,
  type SpecializationFormData,
  type SpecializationFormInput,
} from '@/schemas/specialization.schema';
import { specializationsService } from '@/services/specializations.service';
import { getErrorMessage } from '@/utils/errors';

// Форма сфери права (лише ADMIN): створення та редагування за одним маршрутом
export default function SpecializationFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const specializationId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: existing, isPending } = useQuery({
    queryKey: ['specializations', specializationId],
    queryFn: () => specializationsService.getById(specializationId),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<SpecializationFormInput, unknown, SpecializationFormData>({
    resolver: zodResolver(specializationSchema),
    defaultValues: { name: '', description: '' },
  });

  useEffect(() => {
    if (existing) {
      reset({ name: existing.name, description: existing.description ?? '' });
    }
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (data: SpecializationFormData) =>
      isEdit
        ? specializationsService.update(specializationId, data)
        : specializationsService.create(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['specializations'] });
      toast.success(isEdit ? 'Сферу оновлено' : 'Сферу створено');
      navigate('/specializations');
    },
    onError: (error) => setError('root', { message: getErrorMessage(error, 'Помилка збереження') }),
  });

  if (isEdit && isPending) return <PageSkeleton />;

  return (
    <div className="mx-auto max-w-2xl">
      <Breadcrumbs
        items={[
          { label: 'Кабінет', to: '/dashboard' },
          { label: 'Сфери права', to: '/specializations' },
          { label: isEdit ? `Редагування #${specializationId}` : 'Нова сфера' },
        ]}
      />
      <h1 className="mb-6 text-3xl font-bold">
        {isEdit ? `Редагування сфери #${specializationId}` : 'Нова сфера права'}
      </h1>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4 rounded-lg bg-white p-6 shadow dark:bg-gray-900"
        noValidate
      >
        <FormField label="Назва" error={errors.name?.message}>
          <Input placeholder="Цивільне право" {...register('name')} />
        </FormField>
        <FormField label="Опис (необов'язково)" error={errors.description?.message}>
          <Textarea rows={4} placeholder="Короткий опис сфери..." {...register('description')} />
        </FormField>

        {errors.root && <ErrorMessage message={errors.root.message ?? 'Помилка збереження'} />}

        <div className="flex gap-4">
          <Button type="submit" isLoading={mutation.isPending}>
            {isEdit ? 'Зберегти' : 'Створити'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/specializations')}>
            Скасувати
          </Button>
        </div>
      </form>
    </div>
  );
}
