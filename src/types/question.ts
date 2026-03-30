export const QUESTION_TYPES = [
    { value: 'multiple_choice',  label: 'Çoxseçimli (Tək cavab)',    icon: 'list' },
    { value: 'multiple_select',  label: 'Çoxseçimli (Çoxlu cavab)',  icon: 'list-checks' },
    { value: 'true_false',       label: 'Doğru/Yanlış',              icon: 'toggle-left' },
    { value: 'short_answer',     label: 'Qısa cavab',                icon: 'type' },
    { value: 'essay',            label: 'Esse',                      icon: 'file-text' },
    { value: 'fill_blank',       label: 'Boşluq doldurun',           icon: 'underline' },
    { value: 'matching',         label: 'Uyğunlaşdırma',             icon: 'git-merge' },
    { value: 'ordering',         label: 'Ardıcıllıq',                icon: 'list-ordered' },
    { value: 'hotspot',          label: 'Hotspot (şəkil)',           icon: 'crosshair' },
    { value: 'numerical',        label: 'Rəqəmsal cavab',            icon: 'hash' },
    { value: 'code',             label: 'Kod sualı',                 icon: 'code' },
    { value: 'video',            label: 'Video sual',                icon: 'video' },
    { value: 'model_3d',         label: '3D Model sual',             icon: 'box' },
    { value: 'diagram_label',    label: 'Diaqram etiketləmə',        icon: 'tag' },
    { value: 'matrix_choice',    label: 'Matris seçimi',             icon: 'grid' },
    { value: 'likert',           label: 'Likert şkalası',            icon: 'sliders' },
    { value: 'audio',            label: 'Audio sual',                icon: 'volume-2' },
] as const;

export type QuestionType = typeof QUESTION_TYPES[number]['value'];

// Qiymətləndirilməyən sual tipləri
export const UNGRADED_QUESTION_TYPES: QuestionType[] = ['likert'];

// Manuel yoxlama tələb edən sual tipləri
export const REVIEW_REQUIRED_TYPES: QuestionType[] = ['essay', 'code'];

export interface PerOptionExplanation {
    [optionIndex: string]: string; // "0" → "A niyə yanlışdır"
}

export interface HotspotPoint {
    x: number;            // 0-100 (faiz)
    y: number;            // 0-100 (faiz)
    label: string;        // Nöqtənin etiketi
    isCorrect: boolean;
    shape?: 'point' | 'circle' | 'rect';
    radius?: number;      // shape='circle' üçün (faiz)
    width?: number;       // shape='rect' üçün (faiz)
    height?: number;      // shape='rect' üçün (faiz)
}

export interface MatchingPair {
    id: string;           // Unikal ID (shuffle üçün)
    left: string;         // Sol sütun mətn
    right: string;        // Sağ sütun mətn
}

export interface DiagramLabel {
    id: string;           // Unikal ID
    x: number;            // 0-100 (faiz)
    y: number;            // 0-100 (faiz)
    expectedLabel: string; // Gözlənilən etiket
}

export interface MatrixAnswer {
    [rowIndex: string]: string; // "0" → "2" (sıra indeksi → sütun indeksi)
}

export interface EssayRubricCriterion {
    criterion: string;    // "Məzmun", "Dil", "Struktur"
    maxPoints: number;
    description?: string;
}

export interface CodeTestCase {
    input: string;
    expectedOutput: string;
    description?: string;
    isHidden?: boolean;   // Şagirdə göstərilmir
}

export interface PartialCreditConfig {
    type: 'proportional' | 'per_option';
    deductPerWrong?: number; // type='per_option' üçün
}

// Cavab uyğunluq tipi (short_answer üçün)
export type AnswerMatchType = 'exact' | 'contains' | 'startswith' | 'regex';

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
    selectedOptionIndex?: number;           // multiple_choice, true_false
    selectedOptionIndices?: number[];       // multiple_select
    textAnswer?: string;                    // short_answer, essay, fill_blank, code
    numericalAnswer?: number;              // numerical
    matchingAnswer?: { leftId: string; rightId: string }[]; // matching
    orderingAnswer?: string[];             // ordering (item-lərin ID-ləri sıra ilə)
    hotspotAnswer?: { x: number; y: number }; // hotspot
    fillBlankAnswers?: Record<string, string>; // fill_blank çox boşluq: {"1":"Bakı","2":"10"}
    matrixAnswer?: MatrixAnswer;           // matrix_choice
    likertAnswer?: number;                 // likert (1-5 və ya 1-7)
    diagramAnswers?: Record<string, string>; // diagram_label: {"id1":"Ürək"}
    isCorrect: boolean;
    pointsEarned: number;                  // weight * (isCorrect? 1 : partialCredit)
    needsReview?: boolean;                 // essay, code — müəllim yoxlaması tələb olunur
    reviewId?: string;                     // answer_reviews.id (yoxlandıqdan sonra)
}
