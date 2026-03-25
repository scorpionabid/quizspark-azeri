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
    // Yeni sahələr
    shuffle_questions: z.boolean().default(false),
    show_feedback: z.boolean().default(true),
    pass_percentage: z.number().int().min(0).max(100).default(60),
    cover_image_url: z.string().url().optional().nullable().or(z.literal('')),
    attempts_limit: z.number().int().min(1).max(100).default(1),
    // Scheduling & Timing
    available_from: z.string().optional().nullable().or(z.literal('')),
    available_to: z.string().optional().nullable().or(z.literal('')),
    time_bonus_enabled: z.boolean().default(false),
    time_penalty_enabled: z.boolean().default(false),
    auto_advance: z.boolean().default(false),
    // Advanced Features
    access_password: z.string().max(50).optional().nullable().or(z.literal('')),
    strict_mode: z.boolean().default(false),
    allow_backtracking: z.boolean().default(true),
    questions_per_page: z.number().int().default(1),
    allow_bookmarks: z.boolean().default(true),
    show_question_nav: z.boolean().default(true),
    background_image_url: z.string().optional().nullable().or(z.literal('')),
}).refine(
    (data) => {
        // M2.3: available_from < available_to cross-field validasiyası
        if (data.available_from && data.available_to) {
            return new Date(data.available_from) < new Date(data.available_to);
        }
        return true;
    },
    {
        message: 'Bitmə tarixi başlama tarixindən sonra olmalıdır',
        path: ['available_to'],
    }
);

export type QuizMetadataFormData = z.infer<typeof quizMetadataSchema>;
