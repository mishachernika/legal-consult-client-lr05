import { z } from 'zod';

export const specializationSchema = z.object({
  name: z.string().min(2, { error: 'Назва має містити мінімум 2 символи' }).max(100, {
    error: 'Назва має містити не більше 100 символів',
  }),
  description: z
    .string()
    .max(1000, { error: 'Опис має містити не більше 1000 символів' })
    .transform((v) => (v === '' ? undefined : v))
    .optional(),
});

export type SpecializationFormInput = z.input<typeof specializationSchema>;
export type SpecializationFormData = z.output<typeof specializationSchema>;
