import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email tələb olunur')
    .email('Düzgün email daxil edin')
    .max(255, 'Email çox uzundur'),
  password: z
    .string()
    .min(1, 'Parol tələb olunur')
    .min(6, 'Parol ən azı 6 simvol olmalıdır')
    .max(72, 'Parol çox uzundur'),
});

export const signupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Ad tələb olunur')
    .min(2, 'Ad ən azı 2 simvol olmalıdır')
    .max(100, 'Ad çox uzundur'),
  email: z
    .string()
    .trim()
    .min(1, 'Email tələb olunur')
    .email('Düzgün email daxil edin')
    .max(255, 'Email çox uzundur'),
  phone: z
    .string()
    .trim()
    .min(1, 'Telefon nömrəsi tələb olunur')
    .regex(/^\+?[0-9\s-]{7,15}$/, 'Düzgün telefon nömrəsi daxil edin'),
  password: z
    .string()
    .min(1, 'Parol tələb olunur')
    .min(6, 'Parol ən azı 6 simvol olmalıdır')
    .max(72, 'Parol çox uzundur'),
  confirmPassword: z
    .string()
    .min(1, 'Parolu təsdiqləyin'),
  role: z.enum(['teacher', 'student'], {
    required_error: 'İstifadəçi tipi seçilməlidir',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Parollar uyğun gəlmir',
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
