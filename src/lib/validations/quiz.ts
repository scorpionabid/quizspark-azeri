import { z } from 'zod';

export const quizMetadataSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, 'Quiz başlığı tələb olunur')
        .max(200, 'Başlıq 200 simvoldan az olmalıdır'),
    description: z
        .string()
        .trim()
        .max(1000, 'Təsvir 1000 simvoldan az olmalıdır')
        .optional()
        .or(z.literal('')),
    subject: z.string().min(1, 'Fənn seçilməlidir'),
    grade: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional().nullable(),
    duration: z
        .number({ invalid_type_error: 'Müddət rəqəm olmalıdır' })
        .int()
        .min(1, 'Minimum 1 dəqiqə')
        .max(300, 'Maksimum 300 dəqiqə'),
    is_public: z.boolean(),
});

export type QuizMetadataFormData = z.infer<typeof quizMetadataSchema>;
