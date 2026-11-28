import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  FileCheck2,
  BookOpen,
  Sparkles,
  Printer,
  Globe,
  Plus,
  Trash2,
  Loader2,
  Upload,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Check,
  ChevronDown,
  KeyRound,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  CORE_SUBJECTS,
  OTHER_SUBJECTS,
  ALL_SCHOOL_SUBJECTS,
  SCHOOL_GRADES,
  QUESTION_TYPES,
} from '@/lib/constants/subjects';
import {
  useTextbooks,
  useCurriculumTopics,
  useAddCurriculumTopic,
  useUploadTextbookPdf,
  CurriculumTopicRecord,
} from '@/hooks/useTextbooks';
import {
  PrintableAssessmentView,
  PrintableQuestion,
} from '@/components/quiz/PrintableAssessmentView';
import { AssessmentSpecificationCard } from '@/components/quiz/AssessmentSpecificationCard';
import {
  getQuestionTypeLabelAz,
  normalizeDifficultyLevel,
  normalizeMatchingPairs,
  isOpenEndedQuestionType,
  getDefaultAnswerLines,
} from '@/utils/assessmentSpec';
import { MathRenderer } from '@/components/question-bank/MathRenderer';
import { Switch } from '@/components/ui/switch';

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

type AssessmentType = 'ksq' | 'bsq' | 'sinaq';

interface GeneratedRawQuestion {
  question: string;
  options?: string[];
  correctAnswer?: number;
  correct_answer?: string;
  explanation?: string;
  questionType?: string;
  difficulty?: string;
  level?: string;
  bloomLevel?: string;
  rubric?: string[];
  sample_answer?: string;
  answer_lines?: number;
  fill_blank_template?: string;
  matching_pairs?: Array<{ left: string; right: string }>;
  numerical_answer?: number;
}

interface SubjectTopicBucket {
  subject: string;
  questionCount: number;
  selectedTopicIds: string[];
  customTopics: string[];
}

interface TypeAllocation {
  type: string;
  label: string;
  count: number;
  pointsPerQuestion: number;
}

const DEFAULT_MIXED_ALLOCATIONS: TypeAllocation[] = [
  { type: 'multiple_choice', label: 'Çoxseçimli (Qapalı)', count: 5, pointsPerQuestion: 10 },
  { type: 'short_answer', label: 'Qısa Cavab (Açıq)', count: 3, pointsPerQuestion: 10 },
  { type: 'essay', label: 'Ətraflı Açıq / Esse', count: 0, pointsPerQuestion: 20 },
  { type: 'true_false', label: 'Doğru / Yanlış', count: 2, pointsPerQuestion: 10 },
  { type: 'fill_blank', label: 'Boşluq Doldur', count: 0, pointsPerQuestion: 10 },
  { type: 'numerical', label: 'Rəqəmsal Cavab', count: 0, pointsPerQuestion: 10 },
];

const PRESET_COUNTS = [10, 15, 20, 25];

function formatGeneratedQuestions(
  rawList: GeneratedRawQuestion[],
  fallbackType: string,
  subjectLabel?: string,
  weightPerQuestion = 10
): PrintableQuestion[] {
  return rawList.map((q) => {
    let correctAnswer = q.correct_answer ?? '';
    if (!correctAnswer && Array.isArray(q.options) && typeof q.correctAnswer === 'number') {
      correctAnswer = q.options[q.correctAnswer] ?? q.options[0] ?? '';
    }
    if (!correctAnswer && q.numerical_answer !== undefined) {
      correctAnswer = String(q.numerical_answer);
    }
    const resolvedType = q.questionType || fallbackType;
    const isOpen = isOpenEndedQuestionType(resolvedType);
    return {
      question_text: q.question,
      question_type: resolvedType,
      options: isOpen ? null : (q.options ?? null),
      correct_answer: correctAnswer,
      explanation: q.explanation ?? null,
      fill_blank_template: q.fill_blank_template ?? null,
      matching_pairs: q.matching_pairs ?? null,
      subjectLabel,
      weight: weightPerQuestion,
      difficulty: q.difficulty ?? null,
      level: q.level ?? q.bloomLevel ?? null,
      bloomLevel: q.bloomLevel ?? null,
      rubric: Array.isArray(q.rubric) && q.rubric.length > 0 ? q.rubric : null,
      sample_answer: q.sample_answer ?? (isOpen ? correctAnswer || null : null),
      answer_lines:
        typeof q.answer_lines === 'number' && q.answer_lines > 0
          ? Math.max(1, Math.min(12, Math.round(q.answer_lines)))
          : isOpen
            ? getDefaultAnswerLines(resolvedType)
            : null,
    };
  });
}

function SubjectTopicSelectorPanel({
  grade,
  subject,
  assessmentType,
  selectedTopicIds,
  customTopics,
  onToggleTopicId,
  onAddCustomTopic,
  onRemoveCustomTopic,
}: {
  grade: number;
  subject: string;
  assessmentType: AssessmentType;
  selectedTopicIds: string[];
  customTopics: string[];
  onToggleTopicId: (id: string) => void;
  onAddCustomTopic: (topic: string) => void;
  onRemoveCustomTopic: (idx: number) => void;
}) {
  const [newTopicInput, setNewTopicInput] = useState('');
  const [semesterFilter, setSemesterFilter] = useState<'all' | '1' | '2'>('all');

  const { data: textbooks = [] } = useTextbooks(grade, subject);
  const { data: dbTopics = [], isLoading: topicsLoading } = useCurriculumTopics(grade, subject);
  const addTopicMutation = useAddCurriculumTopic();
  const uploadPdfMutation = useUploadTextbookPdf();

  const readyBook = textbooks.find((b) => b.status === 'ready');
  const isCoreSubject = (CORE_SUBJECTS as readonly string[]).includes(subject);

  const filteredTopics = useMemo(() => {
    if (semesterFilter === 'all') return dbTopics;
    return dbTopics.filter((t) => String(t.semester) === semesterFilter);
  }, [dbTopics, semesterFilter]);

  const groupedTopics = useMemo(() => {
    const groups = new Map<string, CurriculumTopicRecord[]>();
    for (const t of filteredTopics) {
      const key = t.unit_name || 'Ümumi bölmə';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(t);
    }
    return Array.from(groups.entries());
  }, [filteredTopics]);

  const handleAdd = async () => {
    const trimmed = newTopicInput.trim();
    if (!trimmed) return;
    onAddCustomTopic(trimmed);
    setNewTopicInput('');
    try {
      await addTopicMutation.mutateAsync({
        grade,
        subject,
        unit_name: assessmentType === 'bsq' ? 'Yarımil mövzuları' : 'Mövzular',
        topic_name: trimmed,
        semester: semesterFilter === 'all' ? 1 : Number(semesterFilter),
      });
    } catch {
      // Keep local custom topic
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadPdfMutation.mutateAsync({
        file,
        grade,
        subject,
        title: `${grade}-ci sinif ${subject} Dərsliyi`,
        sourceType: 'teacher_upload',
      });
      toast.success(`${subject} dərsliyi bazamıza yükləndi!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'PDF yükləmə xətası');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-border/50 bg-background/40 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg bg-muted/30 p-3">
        <div className="flex items-start gap-2.5">
          <BookOpen className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium">
              {grade}-ci sinif {subject}
            </p>
            {readyBook ? (
              <p className="text-xs text-emerald-500 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Dərslik bazada hazırdır ({readyBook.title})
              </p>
            ) : (
              <p className="text-xs text-muted-foreground mt-0.5">
                {isCoreSubject
                  ? 'Mövzuları seçin və ya aşağıdan əlavə edin.'
                  : 'Digər fənn: Məcburiyyət olduqda PDF yükləyə və ya mövzu yaza bilərsiniz.'}
              </p>
            )}
          </div>
        </div>

        {!readyBook && (
          <label className="cursor-pointer shrink-0">
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handlePdfUpload}
              disabled={uploadPdfMutation.isPending}
            />
            <Button type="button" variant="outline" size="sm" asChild>
              <span className="gap-1.5">
                <Upload className="h-3.5 w-3.5" />
                {uploadPdfMutation.isPending ? 'Yüklənir...' : 'PDF Yüklə'}
              </span>
            </Button>
          </label>
        )}
      </div>

      {assessmentType === 'bsq' && (
        <div className="flex items-center gap-2">
          <Label className="text-xs">Yarımil:</Label>
          {(['all', '1', '2'] as const).map((sem) => (
            <Button
              key={sem}
              size="sm"
              variant={semesterFilter === sem ? 'default' : 'outline'}
              onClick={() => setSemesterFilter(sem)}
            >
              {sem === 'all' ? 'Hamısı' : `${sem}-ci yarımil`}
            </Button>
          ))}
        </div>
      )}

      {topicsLoading ? (
        <p className="text-xs text-muted-foreground">Mövzular yüklənir...</p>
      ) : groupedTopics.length > 0 ? (
        <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
          {groupedTopics.map(([unitName, items]) => (
            <div key={unitName} className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {unitName}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {items.map((t) => (
                  <label
                    key={t.id}
                    className="flex items-center gap-2 rounded-lg border border-border/50 p-2 cursor-pointer hover:bg-muted/40"
                  >
                    <Checkbox
                      checked={selectedTopicIds.includes(t.id)}
                      onCheckedChange={() => onToggleTopicId(t.id)}
                    />
                    <span className="text-xs">{t.topic_name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Hazır mövzu siyahısı boşdur — aşağıdan mövzu daxil edin.
        </p>
      )}

      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder={`${subject} üzrə mövzu adı yazın...`}
            value={newTopicInput}
            onChange={(e) => setNewTopicInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          />
          <Button type="button" variant="outline" size="sm" onClick={handleAdd} className="gap-1 shrink-0">
            <Plus className="h-4 w-4" /> Əlavə et
          </Button>
        </div>
        {customTopics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {customTopics.map((ct, idx) => (
              <Badge key={idx} variant="secondary" className="gap-1 py-0.5 text-xs">
                {ct}
                <button
                  type="button"
                  onClick={() => onRemoveCustomTopic(idx)}
                  className="hover:text-destructive ml-0.5"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreateAssessmentPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const paramType = searchParams.get('type');
  const initialType: AssessmentType =
    paramType === 'bsq' ? 'bsq' : paramType === 'sinaq' ? 'sinaq' : 'ksq';

  const [assessmentType, setAssessmentType] = useState<AssessmentType>(initialType);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Grade & Subject(s)
  const [grade, setGrade] = useState<number>(6);
  const [subject, setSubject] = useState<string>(CORE_SUBJECTS[1]); // Riyaziyyat (for KSQ/BSQ)
  const [title, setTitle] = useState<string>('');

  // Multi-subject buckets for Sinaq
  const [sinaqBuckets, setSinaqBuckets] = useState<SubjectTopicBucket[]>([
    { subject: 'Azərbaycan dili', questionCount: 10, selectedTopicIds: [], customTopics: [] },
    { subject: 'Riyaziyyat', questionCount: 10, selectedTopicIds: [], customTopics: [] },
    { subject: 'İngilis dili', questionCount: 10, selectedTopicIds: [], customTopics: [] },
  ]);

  // Single-subject topic state (KSQ/BSQ)
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [customTopics, setCustomTopics] = useState<string[]>([]);

  // Step 3: Question Parameters
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [customCount, setCustomCount] = useState<string>('');
  const [questionType, setQuestionType] = useState<string>('multiple_choice');
  const [useMixedTypes, setUseMixedTypes] = useState<boolean>(false);
  const [mixedAllocations, setMixedAllocations] = useState<TypeAllocation[]>(DEFAULT_MIXED_ALLOCATIONS);
  const [difficulty, setDifficulty] = useState<string>('balanced');
  const [duration, setDuration] = useState<number>(
    initialType === 'sinaq' ? 90 : initialType === 'bsq' ? 60 : 45
  );

  // Step 4: Generated Questions & Actions
  const [questions, setQuestions] = useState<PrintableQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [generatingImgIdx, setGeneratingImgIdx] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showAnswers, setShowAnswers] = useState(true);
  const [rubricDrafts, setRubricDrafts] = useState<Record<number, string>>({});
  const [savedQuizId, setSavedQuizId] = useState<string | null>(null);

  const mixedTotalCount = mixedAllocations.reduce((s, a) => s + a.count, 0);
  const mixedTotalPoints = mixedAllocations.reduce((s, a) => s + a.count * a.pointsPerQuestion, 0);
  const totalStep4Points = questions.reduce((s, q) => s + (q.weight ?? 10), 0);

  const effectiveCount = useMixedTypes
    ? mixedTotalCount
    : customCount
      ? Math.max(1, Math.min(50, Number(customCount) || 10))
      : questionCount;

  const totalSinaqQuestions = sinaqBuckets.reduce((sum, b) => sum + b.questionCount, 0);

  const effectiveTitle =
    title.trim() ||
    (assessmentType === 'sinaq'
      ? `${grade}-ci sinif Ümumi Sınaq (${sinaqBuckets.map((b) => b.subject).join(', ')})`
      : `${grade}-ci sinif ${subject} — ${assessmentType.toUpperCase()}`);

  const effectiveSubjectLabel =
    assessmentType === 'sinaq'
      ? sinaqBuckets.map((b) => b.subject).join(', ')
      : subject;

  const handleTypeChange = (type: AssessmentType) => {
    setAssessmentType(type);
    setDuration(type === 'sinaq' ? 90 : type === 'bsq' ? 60 : 45);
    setSearchParams({ type });
  };

  const toggleSinaqSubject = (subj: string) => {
    setSinaqBuckets((prev) => {
      const exists = prev.some((b) => b.subject === subj);
      if (exists) {
        if (prev.length <= 2) {
          toast.error('Ümumi sınaq üçün ən azı 2 fənn seçilməlidir');
          return prev;
        }
        return prev.filter((b) => b.subject !== subj);
      }
      if (prev.length >= 6) {
        toast.error('Maksimum 6 fənn seçə bilərsiniz');
        return prev;
      }
      return [...prev, { subject: subj, questionCount: 10, selectedTopicIds: [], customTopics: [] }];
    });
  };

  const updateBucket = (subj: string, updater: (b: SubjectTopicBucket) => SubjectTopicBucket) => {
    setSinaqBuckets((prev) => prev.map((b) => (b.subject === subj ? updater(b) : b)));
  };

  const resolveTopicNames = async (ids: string[], custom: string[]): Promise<string[]> => {
    if (ids.length === 0) return custom;
    const { data } = await supabase
      .from('curriculum_topics')
      .select('topic_name')
      .in('id', ids);
    const dbNames = (data ?? []).map((r) => r.topic_name);
    return [...dbNames, ...custom];
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSavedQuizId(null);

    try {
      if (assessmentType === 'sinaq') {
        const allGenerated: PrintableQuestion[] = [];
        for (let i = 0; i < sinaqBuckets.length; i++) {
          const bucket = sinaqBuckets[i];
          const topicNames = await resolveTopicNames(bucket.selectedTopicIds, bucket.customTopics);
          const effectiveTopicNames =
            topicNames.length > 0 ? topicNames : [`${grade}-ci sinif ${bucket.subject} ümumi mövzular`];

          setGenerationStatus(
            `${bucket.subject} (${i + 1}/${sinaqBuckets.length}) — ${bucket.questionCount} sual hazırlanır...`
          );

          const { data, error } = await supabase.functions.invoke('generate-quiz', {
            body: {
              topic: effectiveTopicNames.join(', '),
              topics: effectiveTopicNames,
              topicIds: bucket.selectedTopicIds,
              subject: bucket.subject,
              grade,
              assessmentType: 'sinaq',
              difficulty,
              questionCount: bucket.questionCount,
              questionType,
              agentId: 'assessment-expert',
            },
          });

          if (error) throw error;
          const raw = (data?.questions ?? []) as GeneratedRawQuestion[];
          allGenerated.push(...formatGeneratedQuestions(raw, questionType, bucket.subject));
        }

        if (allGenerated.length === 0) {
          throw new Error('Sınaq sualları yaradıla bilmədi.');
        }

        setQuestions(allGenerated);
        setStep(4);
        toast.success(`${allGenerated.length} suallıq ümumi sınaq imtahanı hazırdır!`);
      } else {
        const topicNames = await resolveTopicNames(selectedTopicIds, customTopics);
        if (topicNames.length === 0) {
          toast.error('Ən azı 1 mövzu seçin və ya əlavə edin');
          setIsGenerating(false);
          return;
        }

        const formatted: PrintableQuestion[] = [];
        if (useMixedTypes) {
          const activeAllocations = mixedAllocations.filter((a) => a.count > 0);
          if (activeAllocations.length === 0) {
            toast.error('Ən azı 1 sual tipi və sayı seçin');
            setIsGenerating(false);
            return;
          }
          for (const alloc of activeAllocations) {
            setGenerationStatus(`${alloc.label} (${alloc.count} sual) hazırlanır...`);
            const { data, error } = await supabase.functions.invoke('generate-quiz', {
              body: {
                topic: topicNames.join(', '),
                topics: topicNames,
                topicIds: selectedTopicIds,
                subject,
                grade,
                assessmentType,
                difficulty,
                questionCount: alloc.count,
                questionType: alloc.type,
                agentId: 'assessment-expert',
              },
            });
            if (error) throw error;
            const raw = (data?.questions ?? []) as GeneratedRawQuestion[];
            formatted.push(
              ...formatGeneratedQuestions(raw, alloc.type, undefined, alloc.pointsPerQuestion)
            );
          }
        } else {
          setGenerationStatus(`${effectiveCount} sual hazırlanır...`);
          const { data, error } = await supabase.functions.invoke('generate-quiz', {
            body: {
              topic: topicNames.join(', '),
              topics: topicNames,
              topicIds: selectedTopicIds,
              subject,
              grade,
              assessmentType,
              difficulty,
              questionCount: effectiveCount,
              questionType,
              agentId: 'assessment-expert',
            },
          });

          if (error) throw error;
          const raw = (data?.questions ?? []) as GeneratedRawQuestion[];
          const defaultWeight = effectiveCount > 0 ? Math.max(1, Math.round(100 / effectiveCount)) : 10;
          formatted.push(...formatGeneratedQuestions(raw, questionType, undefined, defaultWeight));
        }

        if (formatted.length === 0) {
          throw new Error('AI sual yarada bilmədi. Yenidən cəhd edin.');
        }

        setQuestions(formatted);
        setStep(4);
        toast.success(`${formatted.length} ədəd ${assessmentType.toUpperCase()} sualı hazırdır!`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Sual yaratma xətası');
    } finally {
      setIsGenerating(false);
      setGenerationStatus('');
    }
  };

  const handleSaveOnline = async () => {
    if (!user) {
      toast.error('Yadda saxlamaq üçün daxil olmalısınız');
      return;
    }
    if (questions.length === 0) return;

    setIsSaving(true);
    try {
      const resolvedTopics =
        assessmentType === 'sinaq'
          ? sinaqBuckets.map((b) => ({ subject: b.subject, count: b.questionCount }))
          : await resolveTopicNames(selectedTopicIds, customTopics);

      const { data: quiz, error: quizErr } = await supabase
        .from('quizzes')
        .insert({
          creator_id: user.id,
          title: effectiveTitle,
          description: `${grade}-ci sinif üzrə avtomatik hazırlanmış ${assessmentType.toUpperCase()}`,
          subject: effectiveSubjectLabel,
          grade: `${grade}-ci sinif`,
          difficulty: difficulty === 'balanced' ? 'medium' : difficulty,
          duration,
          is_public: false,
          is_published: true,
          assessment_type: assessmentType,
          topics: resolvedTopics,
        })
        .select('id')
        .single();

      if (quizErr) throw quizErr;

      const questionRows = questions.map((q, idx) => {
        const explanationParts: string[] = [];
        if (q.rubric && q.rubric.length > 0) {
          explanationParts.push(`Qiymətləndirmə meyarları:\n- ${q.rubric.join('\n- ')}`);
        }
        if (q.sample_answer && q.sample_answer !== q.correct_answer) {
          explanationParts.push(`Nümunə cavab: ${q.sample_answer}`);
        }
        if (q.explanation) {
          explanationParts.push(q.explanation);
        }
        return {
          quiz_id: quiz.id,
          title: q.subjectLabel ?? null,
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: explanationParts.length > 0 ? explanationParts.join('\n\n') : null,
          fill_blank_template: q.fill_blank_template,
          weight: q.weight ?? 10,
          question_image_url: q.question_image_url ?? null,
          order_index: idx,
        };
      });

      const { error: qErr } = await supabase.from('questions').insert(questionRows);
      if (qErr) throw qErr;

      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      setSavedQuizId(quiz.id);
      toast.success('Qiymətləndirmə yadda saxlanıldı və onlayn istifadəyə hazırdır!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Yadda saxlama xətası');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNormalizeTo100 = () => {
    if (questions.length === 0) return;
    const base = Math.floor(100 / questions.length);
    let remainder = 100 - base * questions.length;
    setQuestions((prev) =>
      prev.map((q) => {
        const extra = remainder > 0 ? 1 : 0;
        if (remainder > 0) remainder--;
        return { ...q, weight: base + extra };
      })
    );
    toast.success('Sual balları cəmi 100 bala bölündü');
  };

  const handleGenerateImageForQuestion = async (idx: number) => {
    const q = questions[idx];
    if (!q) return;
    setGeneratingImgIdx(idx);
    try {
      const { data, error } = await supabase.functions.invoke('generate-question-image', {
        body: {
          prompt: `Clean educational diagram or illustration for school exam question (${subject}, grade ${grade}): ${q.question_text}`,
        },
      });
      if (error) throw error;
      const imageUrl = data?.imageUrl || data?.url;
      if (!imageUrl) throw new Error('Şəkil yaradıla bilmədi');
      setQuestions((prev) =>
        prev.map((item, i) => (i === idx ? { ...item, question_image_url: imageUrl } : item))
      );
      toast.success(`Sual ${idx + 1} üçün şəkil əlavə edildi`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Şəkil yaratma xətası');
    } finally {
      setGeneratingImgIdx(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
              <FileCheck2 className="h-7 w-7 text-primary" />
              {assessmentType === 'ksq'
                ? 'KSQ Yarat'
                : assessmentType === 'bsq'
                  ? 'BSQ Yarat'
                  : 'Ümumi Sınaq İmtahanı'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {assessmentType === 'sinaq'
                ? '3–4 fənn və mövzular seçin — sistem vahid sınaq imtahanı hazırlasın.'
                : 'Sinif, fənn və mövzuları seçin — sistem sualları avtomatik hazırlasın.'}
            </p>
          </div>

          <div className="flex flex-wrap rounded-xl bg-muted/60 p-1 gap-1">
            <Button
              size="sm"
              variant={assessmentType === 'ksq' ? 'default' : 'ghost'}
              onClick={() => handleTypeChange('ksq')}
            >
              KSQ
            </Button>
            <Button
              size="sm"
              variant={assessmentType === 'bsq' ? 'default' : 'ghost'}
              onClick={() => handleTypeChange('bsq')}
            >
              BSQ
            </Button>
            <Button
              size="sm"
              variant={assessmentType === 'sinaq' ? 'default' : 'ghost'}
              onClick={() => handleTypeChange('sinaq')}
            >
              Sınaq (3–4 Fənn)
            </Button>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { num: 1, label: assessmentType === 'sinaq' ? '1. Sinif & Fənlər' : '1. Sinif & Fənn' },
            { num: 2, label: '2. Mövzular' },
            { num: 3, label: '3. Parametrlər' },
            { num: 4, label: '4. Nəticə & Çap' },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => (s.num < 4 || questions.length > 0) && setStep(s.num as 1 | 2 | 3 | 4)}
              className={`rounded-xl border px-3 py-2.5 text-xs sm:text-sm font-medium transition-all text-left ${
                step === s.num
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'border-border/50 bg-gradient-card text-muted-foreground'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Step 1: Grade & Subject(s) */}
        {step === 1 && (
          <div className="rounded-2xl bg-gradient-card border border-border/50 p-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-2 block">Qiymətləndirmə Başlığı (istəyə bağlı)</Label>
                <Input
                  placeholder={effectiveTitle}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Label className="mb-2 block">Sinif seçin *</Label>
                <Select value={String(grade)} onValueChange={(v) => setGrade(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHOOL_GRADES.map((g) => (
                      <SelectItem key={g} value={String(g)}>
                        {g}-ci sinif
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {assessmentType === 'sinaq' ? (
              <div className="space-y-3">
                <Label className="block">
                  Sınaq Fənlərini Seçin (seçilən: {sinaqBuckets.length} fənn, cəmi {totalSinaqQuestions} sual)
                </Label>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {ALL_SCHOOL_SUBJECTS.map((subj) => {
                    const bucket = sinaqBuckets.find((b) => b.subject === subj);
                    return (
                      <div
                        key={subj}
                        className={`flex items-center justify-between gap-2 rounded-xl border p-2.5 transition-colors ${
                          bucket ? 'border-primary bg-primary/10' : 'border-border/50'
                        }`}
                      >
                        <label className="flex items-center gap-2 cursor-pointer flex-1">
                          <Checkbox
                            checked={Boolean(bucket)}
                            onCheckedChange={() => toggleSinaqSubject(subj)}
                          />
                          <span className="text-sm font-medium">{subj}</span>
                        </label>
                        {bucket && (
                          <Input
                            type="number"
                            min={3}
                            max={30}
                            value={bucket.questionCount}
                            onChange={(e) =>
                              updateBucket(subj, (b) => ({
                                ...b,
                                questionCount: Math.max(1, Math.min(30, Number(e.target.value) || 5)),
                              }))
                            }
                            className="h-7 w-16 text-xs text-center"
                            title="Sual sayı"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                <Label className="mb-2 block">Fənn seçin *</Label>
                <Select
                  value={subject}
                  onValueChange={(v) => {
                    setSubject(v);
                    setSelectedTopicIds([]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CORE_SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s} (Əsas fənn)
                      </SelectItem>
                    ))}
                    {OTHER_SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex justify-end">
              <Button variant="game" onClick={() => setStep(2)} className="gap-2">
                Növbəti: Mövzular <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Topics & Textbook */}
        {step === 2 && (
          <div className="rounded-2xl bg-gradient-card border border-border/50 p-6 space-y-5">
            {assessmentType === 'sinaq' ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Hər fənn üçün imtahana düşəcək mövzuları seçin (boş buraxılan fənlərdə sinif üzrə ümumi suallar hazırlanacaq):
                </p>
                {sinaqBuckets.map((bucket) => (
                  <SubjectTopicSelectorPanel
                    key={bucket.subject}
                    grade={grade}
                    subject={bucket.subject}
                    assessmentType={assessmentType}
                    selectedTopicIds={bucket.selectedTopicIds}
                    customTopics={bucket.customTopics}
                    onToggleTopicId={(id) =>
                      updateBucket(bucket.subject, (b) => ({
                        ...b,
                        selectedTopicIds: b.selectedTopicIds.includes(id)
                          ? b.selectedTopicIds.filter((x) => x !== id)
                          : [...b.selectedTopicIds, id],
                      }))
                    }
                    onAddCustomTopic={(topic) =>
                      updateBucket(bucket.subject, (b) => ({
                        ...b,
                        customTopics: [...b.customTopics, topic],
                      }))
                    }
                    onRemoveCustomTopic={(idx) =>
                      updateBucket(bucket.subject, (b) => ({
                        ...b,
                        customTopics: b.customTopics.filter((_, i) => i !== idx),
                      }))
                    }
                  />
                ))}
              </div>
            ) : (
              <SubjectTopicSelectorPanel
                grade={grade}
                subject={subject}
                assessmentType={assessmentType}
                selectedTopicIds={selectedTopicIds}
                customTopics={customTopics}
                onToggleTopicId={(id) =>
                  setSelectedTopicIds((prev) =>
                    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                  )
                }
                onAddCustomTopic={(topic) => setCustomTopics((prev) => [...prev, topic])}
                onRemoveCustomTopic={(idx) =>
                  setCustomTopics((prev) => prev.filter((_, i) => i !== idx))
                }
              />
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Geri
              </Button>
              <Button variant="game" onClick={() => setStep(3)} className="gap-2">
                Növbəti: Parametrlər <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Question Parameters */}
        {step === 3 && (
          <div className="rounded-2xl bg-gradient-card border border-border/50 p-6 space-y-6">
            {assessmentType === 'sinaq' ? (
              <div className="rounded-xl bg-muted/40 p-4 text-sm">
                <p className="font-medium mb-2">Fənlər üzrə sual bölgüsü (Cəmi: {totalSinaqQuestions} sual):</p>
                <div className="flex flex-wrap gap-2">
                  {sinaqBuckets.map((b) => (
                    <Badge key={b.subject} variant="secondary">
                      {b.subject}: {b.questionCount} sual
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 p-3">
                  <div>
                    <p className="text-sm font-medium">Qarışıq Sual Tipləri (Konstruktor)</p>
                    <p className="text-xs text-muted-foreground">
                      Məsələn: 5 qapalı + 3 açıq sual və hər birinin öz balı
                    </p>
                  </div>
                  <Switch checked={useMixedTypes} onCheckedChange={setUseMixedTypes} />
                </div>

                {useMixedTypes ? (
                  <div className="space-y-2.5 rounded-xl border border-border/50 p-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Sual Tipi</span>
                      <span>Say × Bal = Cəm</span>
                    </div>
                    {mixedAllocations.map((alloc) => (
                      <div key={alloc.type} className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-medium min-w-[170px]">{alloc.label}</span>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            max={40}
                            value={alloc.count}
                            onChange={(e) =>
                              setMixedAllocations((prev) =>
                                prev.map((a) =>
                                  a.type === alloc.type
                                    ? { ...a, count: Math.max(0, Math.min(40, Number(e.target.value) || 0)) }
                                    : a
                                )
                              )
                            }
                            className="h-8 w-16 text-center text-xs"
                          />
                          <span className="text-xs text-muted-foreground">×</span>
                          <Input
                            type="number"
                            min={1}
                            max={100}
                            value={alloc.pointsPerQuestion}
                            onChange={(e) =>
                              setMixedAllocations((prev) =>
                                prev.map((a) =>
                                  a.type === alloc.type
                                    ? { ...a, pointsPerQuestion: Math.max(1, Math.min(100, Number(e.target.value) || 1)) }
                                    : a
                                )
                              )
                            }
                            className="h-8 w-16 text-center text-xs"
                          />
                          <span className="text-xs text-muted-foreground w-16 text-right">
                            = {alloc.count * alloc.pointsPerQuestion} bal
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-border/40 flex items-center justify-between text-sm font-semibold">
                      <span>Cəmi: {mixedTotalCount} sual</span>
                      <span className={mixedTotalPoints === 100 ? 'text-emerald-500' : 'text-primary'}>
                        {mixedTotalPoints} bal
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label className="mb-2 block">Sual sayı *</Label>
                    <div className="flex flex-wrap items-center gap-2">
                      {PRESET_COUNTS.map((cnt) => (
                        <Button
                          key={cnt}
                          type="button"
                          variant={!customCount && questionCount === cnt ? 'default' : 'outline'}
                          onClick={() => {
                            setQuestionCount(cnt);
                            setCustomCount('');
                          }}
                        >
                          {cnt} sual
                        </Button>
                      ))}
                      <Input
                        type="number"
                        min={1}
                        max={50}
                        placeholder="Fərdi say..."
                        value={customCount}
                        onChange={(e) => setCustomCount(e.target.value)}
                        className="w-32"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              {(!useMixedTypes || assessmentType === 'sinaq') && (
                <div>
                  <Label className="mb-2 block">Sual tipi</Label>
                  <Select value={questionType} onValueChange={setQuestionType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {QUESTION_TYPES.map((qt) => (
                        <SelectItem key={qt.value} value={qt.value}>
                          {qt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label className="mb-2 block">Çətinlik səviyyəsi</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">KSQ/BSQ Standartı (Balanslı)</SelectItem>
                    <SelectItem value="easy">Asan</SelectItem>
                    <SelectItem value="medium">Orta</SelectItem>
                    <SelectItem value="hard">Çətin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">Müddət (dəqiqə)</Label>
                <Input
                  type="number"
                  min={5}
                  max={240}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value) || 45)}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Geri
              </Button>
              <Button
                variant="game"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {generationStatus || 'Suallar hazırlanır...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {assessmentType === 'sinaq'
                      ? `${totalSinaqQuestions} Suallıq Sınaq Hazırla`
                      : `${effectiveCount} Sual Hazırla`}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Preview, Online Save & Print */}
        {step === 4 && (
          <div className="mx-auto max-w-[960px] space-y-6">
            {/* Academic Exam Header & Actions */}
            <div className="academic-card p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2.5">
                  <ul className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <li className="rounded-lg bg-academic-accent px-2.5 py-1 text-white uppercase tracking-wide">
                      {assessmentType.toUpperCase()}
                    </li>
                    <li className="rounded-lg bg-academic-soft px-2.5 py-1 text-academic-accent">
                      {grade}-ci sinif
                    </li>
                    <li className="rounded-lg bg-academic-soft px-2.5 py-1 text-academic-accent">
                      {effectiveSubjectLabel}
                    </li>
                    <li className="rounded-lg bg-academic-soft px-2.5 py-1 text-academic-accent tabular-nums">
                      {questions.length} sual
                    </li>
                    <li className="rounded-lg bg-academic-soft px-2.5 py-1 text-academic-accent tabular-nums">
                      Cəmi: {totalStep4Points} bal
                    </li>
                  </ul>
                  <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-academic-ink">
                    {effectiveTitle}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {totalStep4Points !== 100 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNormalizeTo100}
                      className="rounded-xl border-academic-line"
                    >
                      100 bala böl
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setShowPrint(true)}
                    className="gap-2 rounded-xl border-academic-line"
                  >
                    <Printer className="h-4 w-4" />
                    Çap Et / PDF
                  </Button>

                  {savedQuizId ? (
                    <Button
                      onClick={() => navigate(`/quiz/${savedQuizId}`)}
                      className="gap-2 rounded-xl bg-academic-accent text-white hover:bg-academic-accent-deep"
                    >
                      <Globe className="h-4 w-4" />
                      Onlayn Aç
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSaveOnline}
                      disabled={isSaving || questions.length === 0}
                      className="gap-2 rounded-xl bg-academic-accent text-white hover:bg-academic-accent-deep"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Globe className="h-4 w-4" />
                      )}
                      Yadda Saxla (Onlayn)
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Specification Bar & Breakdown Table */}
            <AssessmentSpecificationCard
              questions={questions}
              title="İmtahan spesifikasiyası"
              subtitle="Sual sayı və bal bölgüsü redaktələrə uyğun canlı yenilənir"
            />

            {/* Questions Section Header + Teacher Mode Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <h3 className="font-display text-lg font-bold text-academic-ink tabular-nums">
                Suallar ({questions.length})
              </h3>
              <Button
                type="button"
                variant="outline"
                aria-pressed={showAnswers}
                onClick={() => setShowAnswers((prev) => !prev)}
                className="h-10 gap-2 rounded-xl border-academic-line bg-card px-4 text-sm font-semibold text-academic-ink hover:border-academic-accent"
              >
                {showAnswers ? (
                  <>
                    <EyeOff className="h-4 w-4 text-academic-accent" />
                    Cavabları gizlət
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 text-academic-accent" />
                    Cavabları göstər
                  </>
                )}
              </Button>
            </div>

            {/* Academic Question Cards */}
            <div className="space-y-4">
              {questions.map((q, idx) => {
                const diffLevel = normalizeDifficultyLevel(q.level ?? q.difficulty ?? q.bloomLevel);
                const matchingList = normalizeMatchingPairs(q.matching_pairs);
                const isOpenEnded = isOpenEndedQuestionType(q.question_type);
                const answerLines = q.answer_lines ?? getDefaultAnswerLines(q.question_type);
                const rubricItems = q.rubric ?? [];
                const sampleAnswerText = q.sample_answer || q.correct_answer || '';

                const handleAddRubricItem = () => {
                  const text = (rubricDrafts[idx] || '').trim();
                  if (!text) return;
                  setQuestions((prev) =>
                    prev.map((item, i) =>
                      i === idx ? { ...item, rubric: [...(item.rubric ?? []), text] } : item
                    )
                  );
                  setRubricDrafts((prev) => ({ ...prev, [idx]: '' }));
                };

                const handleRemoveRubricItem = (rIdx: number) => {
                  setQuestions((prev) =>
                    prev.map((item, i) =>
                      i === idx
                        ? { ...item, rubric: (item.rubric ?? []).filter((_, ri) => ri !== rIdx) }
                        : item
                    )
                  );
                };

                return (
                  <article
                    key={idx}
                    className="academic-card p-4 sm:p-5 space-y-3"
                  >
                    {/* 3-Part Card Header: Index + Pills + Editable Weight/Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-academic-line/60">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-base font-extrabold text-academic-ink tabular-nums">
                          {idx + 1}.
                        </span>
                        {diffLevel && (
                          <span className="rounded-full bg-academic-soft px-2.5 py-0.5 text-xs font-semibold text-academic-accent">
                            {diffLevel} səviyyə
                          </span>
                        )}
                        <span className="rounded-full bg-academic-surface px-2.5 py-0.5 text-xs font-medium text-muted-foreground border border-academic-line/70">
                          {getQuestionTypeLabelAz(q.question_type)}
                        </span>
                        {q.subjectLabel && (
                          <Badge variant="outline" className="text-[11px] border-academic-line">
                            {q.subjectLabel}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Input
                          type="number"
                          min={1}
                          max={100}
                          value={q.weight ?? 10}
                          onChange={(e) => {
                            const val = Math.max(1, Math.min(100, Number(e.target.value) || 1));
                            setQuestions((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, weight: val } : item))
                            );
                          }}
                          className="h-7 w-14 text-xs text-center tabular-nums border-academic-line"
                          title="Sualın balı"
                          aria-label={`Sual ${idx + 1} balı`}
                        />
                        <span className="text-xs text-muted-foreground">bal</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground hover:text-academic-accent"
                          onClick={() => handleGenerateImageForQuestion(idx)}
                          disabled={generatingImgIdx === idx}
                          title="AI ilə sxem/şəkil yarat"
                          aria-label={`Sual ${idx + 1} üçün şəkil yarat`}
                        >
                          {generatingImgIdx === idx ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <ImageIcon className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() => setQuestions((prev) => prev.filter((_, i) => i !== idx))}
                          title="Sualı sil"
                          aria-label={`Sual ${idx + 1}-i sil`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Question Stem */}
                    <div className="text-[15px] leading-relaxed font-semibold text-foreground whitespace-pre-line [overflow-wrap:anywhere]">
                      <MathRenderer text={q.fill_blank_template || q.question_text} />
                    </div>

                    {q.question_image_url && (
                      <img
                        src={q.question_image_url}
                        alt={`Sual ${idx + 1}`}
                        className="mt-2 max-h-48 rounded-xl border border-academic-line object-contain"
                      />
                    )}

                    {/* Matching 2-column sub-grid */}
                    {matchingList.length > 0 && (
                      <div className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2 rounded-xl border border-academic-line bg-academic-surface/60 p-3 text-sm">
                        <div className="space-y-1">
                          {matchingList.map((pair, pIdx) => (
                            <div key={`left-${pIdx}`} className="flex gap-2 tabular-nums">
                              <span className="font-semibold text-academic-ink">{pIdx + 1}.</span>
                              <MathRenderer text={pair.left} />
                            </div>
                          ))}
                        </div>
                        <div className="space-y-1">
                          {matchingList.map((pair, pIdx) => (
                            <div key={`right-${pIdx}`} className="flex gap-2">
                              <span className="font-semibold text-muted-foreground">
                                {String.fromCharCode(97 + pIdx)})
                              </span>
                              <MathRenderer text={pair.right} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Multiple Choice / True-False Options */}
                    {!isOpenEnded && Array.isArray(q.options) && q.options.length > 0 && (
                      <div className="grid gap-1.5">
                        {q.options.map((opt, oIdx) => {
                          const isCorrect = showAnswers && opt === q.correct_answer;
                          const letter = OPTION_LETTERS[oIdx] ?? String(oIdx + 1);
                          return (
                            <div
                              key={oIdx}
                              className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                                isCorrect
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-200 dark:ring-emerald-800 text-emerald-900 dark:text-emerald-200 font-medium'
                                  : 'text-foreground/90 hover:bg-academic-surface/60'
                              }`}
                            >
                              <div className="flex items-start gap-2.5 min-w-0">
                                <span
                                  className={`font-semibold shrink-0 tabular-nums ${
                                    isCorrect
                                      ? 'text-emerald-700 dark:text-emerald-400'
                                      : 'text-muted-foreground'
                                  }`}
                                >
                                  {letter})
                                </span>
                                <div className="min-w-0">
                                  <MathRenderer text={opt} />
                                </div>
                              </div>
                              {isCorrect && (
                                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Open-Ended Rubric ("Qiymətləndirmə meyarları"), Writing Lines & Sample Answer ("Nümunə cavab") */}
                    {(isOpenEnded || !Array.isArray(q.options) || q.options.length === 0) && (
                      <div className="space-y-2.5 text-sm">
                        {showAnswers && (
                          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-200 dark:ring-emerald-800 px-3 py-2.5 text-emerald-900 dark:text-emerald-200 space-y-2">
                            <p className="font-semibold text-xs uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                              Qiymətləndirmə meyarları
                            </p>
                            {rubricItems.length > 0 ? (
                              <ul className="list-disc space-y-1 pl-5 text-sm">
                                {rubricItems.map((criterion, rIdx) => (
                                  <li key={rIdx} className="group/item pr-1">
                                    <div className="flex items-start justify-between gap-2">
                                      <span className="leading-snug">
                                        <MathRenderer text={criterion} />
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveRubricItem(rIdx)}
                                        className="text-emerald-700/60 hover:text-destructive text-xs px-1 shrink-0"
                                        title="Meyarı sil"
                                        aria-label="Meyarı sil"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-emerald-800/75 dark:text-emerald-300/75">
                                Hələ meyar əlavə edilməyib. Aşağıdan bal bölgüsü meyarı əlavə edə bilərsiniz.
                              </p>
                            )}
                            <div className="flex items-center gap-1.5 pt-1">
                              <Input
                                value={rubricDrafts[idx] ?? ''}
                                onChange={(e) =>
                                  setRubricDrafts((prev) => ({ ...prev, [idx]: e.target.value }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddRubricItem();
                                  }
                                }}
                                placeholder="Meyar əlavə et (məs: Düstur düzgün yazılır: 4 bal)"
                                className="h-7 text-xs bg-white/80 dark:bg-background/60 border-emerald-200 dark:border-emerald-800"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={handleAddRubricItem}
                                className="h-7 px-2 text-xs border-emerald-300 dark:border-emerald-800 shrink-0"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                          <span>Cavab üçün {answerLines} sətir</span>
                          <label className="inline-flex items-center gap-1.5">
                            <span>Çap sətir sayı:</span>
                            <Input
                              type="number"
                              min={1}
                              max={12}
                              value={answerLines}
                              onChange={(e) => {
                                const val = Math.max(1, Math.min(12, Number(e.target.value) || 1));
                                setQuestions((prev) =>
                                  prev.map((item, i) =>
                                    i === idx ? { ...item, answer_lines: val } : item
                                  )
                                );
                              }}
                              className="h-6 w-12 px-1 text-center text-xs tabular-nums border-academic-line"
                              aria-label={`Sual ${idx + 1} cavab sətir sayı`}
                            />
                          </label>
                        </div>

                        {showAnswers && sampleAnswerText && (
                          <div className="whitespace-pre-line rounded-lg border border-academic-line/70 bg-academic-surface px-3 py-2 text-sm text-foreground/85 leading-relaxed">
                            <span className="font-semibold text-academic-ink">Nümunə cavab: </span>
                            <MathRenderer text={sampleAnswerText} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Collapsible Step-by-Step Solution / Explanation */}
                    {showAnswers && q.explanation && (
                      <details className="group rounded-lg border border-academic-line bg-academic-surface/60 px-3 py-2 text-sm">
                        <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-academic-ink select-none">
                          <span>Həll / İzah</span>
                          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="mt-2 pt-2 border-t border-academic-line/70 text-muted-foreground leading-relaxed">
                          <MathRenderer text={q.explanation} />
                        </div>
                      </details>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Bottom Compact Answer Key Section */}
            {questions.length > 0 && (
              <section className="academic-card p-5 space-y-4" aria-label="Cavab açarı">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-academic-accent" />
                    <h3 className="font-display text-base font-bold text-academic-ink">
                      Cavab açarı
                    </h3>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-pressed={showAnswers}
                    onClick={() => setShowAnswers((prev) => !prev)}
                    className="rounded-xl border-academic-line text-xs font-semibold"
                  >
                    {showAnswers ? 'Cavabları gizlət' : 'Cavabları göstər'}
                  </Button>
                </div>

                {showAnswers ? (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[15px] sm:grid-cols-3 lg:grid-cols-4 tabular-nums">
                    {questions.map((q, idx) => {
                      const isRubricOpen =
                        q.question_type === 'essay' || (q.rubric && q.rubric.length > 0);
                      let compactAns = q.correct_answer?.trim() || '—';
                      if (!isOpenEndedQuestionType(q.question_type) && Array.isArray(q.options) && q.options.length > 0) {
                        const matchIdx = q.options.indexOf(q.correct_answer);
                        if (matchIdx !== -1) {
                          compactAns = OPTION_LETTERS[matchIdx] ?? compactAns;
                        }
                      } else if (isRubricOpen && compactAns.length > 16) {
                        compactAns = '—';
                      } else if (compactAns.length > 24) {
                        compactAns = `${compactAns.slice(0, 22)}…`;
                      }
                      return (
                        <div
                          key={idx}
                          className="flex items-baseline gap-2 border-b border-academic-line/60 pb-1"
                          title={compactAns === '—' ? 'Meyar üzrə qiymətləndirilir' : undefined}
                        >
                          <span className="font-bold text-muted-foreground w-6 text-right shrink-0">
                            {idx + 1}.
                          </span>
                          <span className="font-semibold text-academic-ink truncate">
                            {compactAns}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Cavab açarını görmək üçün &ldquo;Cavabları göstər&rdquo; düyməsini klikləyin.
                  </p>
                )}
              </section>
            )}
          </div>
        )}
      </div>

      {showPrint && (
        <PrintableAssessmentView
          quizId={savedQuizId}
          title={effectiveTitle}
          assessmentType={assessmentType}
          grade={grade}
          subject={effectiveSubjectLabel}
          questions={questions}
          onClose={() => setShowPrint(false)}
        />
      )}
    </div>
  );
}
