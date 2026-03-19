export const QUESTION_TYPES = [
    { value: 'multiple_choice', label: 'Çoxseçimli (Tək cavab)', icon: 'list' },
    { value: 'multiple_select', label: 'Çoxseçimli (Çoxlu cavab)', icon: 'list-checks' },
    { value: 'true_false', label: 'Doğru/Yanlış', icon: 'toggle-left' },
    { value: 'short_answer', label: 'Qısa cavab', icon: 'type' },
    { value: 'essay', label: 'Esse', icon: 'file-text' },
    { value: 'fill_blank', label: 'Boşluq doldurun', icon: 'underline' },
    { value: 'matching', label: 'Uyğunlaşdırma', icon: 'git-merge' },
    { value: 'ordering', label: 'Ardıcıllıq', icon: 'list-ordered' },
    { value: 'hotspot', label: 'Hotspot (şəkil)', icon: 'crosshair' },
    { value: 'numerical', label: 'Rəqəmsal cavab', icon: 'hash' },
    { value: 'code', label: 'Kod sualı', icon: 'code' },
    { value: 'video', label: 'Video sual', icon: 'video' },
    { value: 'model_3d', label: '3D Model sual', icon: 'box' },
] as const;

export type QuestionType = typeof QUESTION_TYPES[number]['value'];

export interface PerOptionExplanation {
    [optionIndex: string]: string; // "0" → "A niyə yanlışdır"
}

export interface HotspotPoint {
    x: number;        // 0-100 (faiz)
    y: number;        // 0-100 (faiz)
    label: string;    // Nöqtənin etiketi
    isCorrect: boolean;
}

export interface MatchingPair {
    id: string;       // Unikal ID (shuffle üçün)
    left: string;     // Sol sütun
    right: string;    // Sağ sütun
}

export interface QuestionRating {
    id: string;
    question_bank_id: string | null;
    quiz_question_id: string | null;
    user_id: string;
    rating: 1 | 2 | 3 | 4 | 5;
    issue_type: 'confusing' | 'error' | 'too_easy' | 'too_hard' | 'great' | null;
    comment: string | null;
    created_at: string;
}

// Quiz-taking zamanı istifadəçi cavabı
export interface QuestionAnswer {
    questionId: string;
    questionType: QuestionType;
    // tip-ə görə cavab:
    selectedOptionIndex?: number;      // multiple_choice, true_false
    textAnswer?: string;               // short_answer, essay, fill_blank, code
    numericalAnswer?: number;          // numerical
    matchingAnswer?: { leftId: string; rightId: string }[]; // matching
    orderingAnswer?: string[];         // ordering (item-lərin ID-ləri sıra ilə)
    hotspotAnswer?: { x: number; y: number }; // hotspot
    isCorrect: boolean;
    pointsEarned: number; // weight * isCorrect
    needsReview?: boolean; // essay tipli suallar üçün — müəllim yoxlaması tələb olunur
}
