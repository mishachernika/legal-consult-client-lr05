import { z } from 'zod';

// Схеми валідації форм аутентифікації (Zod 4: z.email(), текст помилки — параметр error)
// Мінімальна довжина пароля (8) збігається з перевіркою на сервері (ЛР02)
export const loginSchema = z.object({
  email: z.email({ error: 'Невірний формат email' }),
  password: z.string().min(8, { error: 'Пароль має містити мінімум 8 символів' }),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, { error: "Ім'я має містити мінімум 2 символи" }),
    email: z.email({ error: 'Невірний формат email' }),
    // Поле форми завжди рядок: '' перетворюємо на undefined до перевірки регулярного виразу
    phone: z
      .string()
      .refine((v) => v === '' || /^\+380\d{9}$/.test(v), {
        error: 'Формат телефону: +380XXXXXXXXX',
      })
      .transform((v) => (v === '' ? undefined : v))
      .optional(),
    password: z.string().min(8, { error: 'Пароль має містити мінімум 8 символів' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Паролі не збігаються',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormInput = z.input<typeof registerSchema>;
export type RegisterFormData = z.output<typeof registerSchema>;
