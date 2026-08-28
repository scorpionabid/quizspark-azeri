import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface TopicMasteryItem {
  id: string;
  category: string;
  topic: string;
  bloom_level: string | null;
  correct_count: number;
  attempt_count: number;
  mastery_level: number;
  last_practiced: string | null;
  next_review_at: string | null;
  status: 'strong' | 'developing' | 'weak';
}

export interface BloomMasteryStat {
  level: string;
  label: string;
  total: number;
  correct: number;
  percentage: number;
}

export interface CategoryMasteryStat {
  category: string;
  totalAttempts: number;
  totalCorrect: number;
  accuracy: number;
  topicsCount: number;
}

export interface StudentMasteryData {
  items: TopicMasteryItem[];
  strengths: TopicMasteryItem[];
  developing: TopicMasteryItem[];
  weaknesses: TopicMasteryItem[];
  overallMastery: number;
  bloomStats: BloomMasteryStat[];
  categoryStats: CategoryMasteryStat[];
  needsReviewItems: TopicMasteryItem[];
}

const BLOOM_LABELS: Record<string, string> = {
  remembering: 'Xatırlama',
  understanding: 'Anlama',
  applying: 'Tətbiq',
  analyzing: 'Analiz',
  evaluating: 'Qiymətləndirmə',
  creating: 'Yaratma',
  xatırlama: 'Xatırlama',
  anlama: 'Anlama',
  tətbiq: 'Tətbiq',
  analiz: 'Analiz',
  qiymətləndirmə: 'Qiymətləndirmə',
  yaratma: 'Yaratma',
};

export const STUDENT_MASTERY_KEYS = {
  all: ['student_mastery'] as const,
  byUser: (userId: string | undefined) => [...STUDENT_MASTERY_KEYS.all, userId] as const,
};

export function useStudentMastery(targetUserId?: string) {
  const { user } = useAuth();
  const userId = targetUserId || user?.id;

  return useQuery({
    queryKey: STUDENT_MASTERY_KEYS.byUser(userId),
    queryFn: async (): Promise<StudentMasteryData> => {
      if (!userId) {
        return {
          items: [],
          strengths: [],
          developing: [],
          weaknesses: [],
          overallMastery: 0,
          bloomStats: [],
          categoryStats: [],
          needsReviewItems: [],
        };
      }

      // student_mastery_with_level görünüşündən və ya birbaşa student_mastery cədvəlindən oxuyuruq
      const { data, error } = await supabase
        .from('student_mastery')
        .select('*')
        .eq('student_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const rawItems = data || [];
      const items: TopicMasteryItem[] = rawItems.map((item) => {
        const attempts = item.attempt_count || 0;
        const correct = item.correct_count || 0;
        const mastery = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
        let status: 'strong' | 'developing' | 'weak' = 'developing';
        if (mastery >= 75 && attempts >= 2) {
          status = 'strong';
        } else if (mastery < 50 || (attempts >= 3 && mastery < 60)) {
          status = 'weak';
        }

        return {
          id: item.id,
          category: item.category || 'Ümumi',
          topic: item.topic || 'Əsas anlayışlar',
          bloom_level: item.bloom_level,
          correct_count: correct,
          attempt_count: attempts,
          mastery_level: mastery,
          last_practiced: item.last_practiced,
          next_review_at: item.next_review_at,
          status,
        };
      });

      const strengths = items.filter((i) => i.status === 'strong').sort((a, b) => b.mastery_level - a.mastery_level);
      const weaknesses = items.filter((i) => i.status === 'weak').sort((a, b) => a.mastery_level - b.mastery_level);
      const developing = items.filter((i) => i.status === 'developing').sort((a, b) => b.attempt_count - a.attempt_count);

      // Ümumi mənimsəmə
      const totalAttempts = items.reduce((acc, i) => acc + i.attempt_count, 0);
      const totalCorrect = items.reduce((acc, i) => acc + i.correct_count, 0);
      const overallMastery = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

      // Bloom İdrak Səviyyəsi statistikası
      const bloomMap: Record<string, { total: number; correct: number }> = {};
      items.forEach((item) => {
        if (!item.bloom_level) return;
        const key = item.bloom_level.toLowerCase();
        if (!bloomMap[key]) {
          bloomMap[key] = { total: 0, correct: 0 };
        }
        bloomMap[key].total += item.attempt_count;
        bloomMap[key].correct += item.correct_count;
      });

      const bloomStats: BloomMasteryStat[] = Object.entries(bloomMap).map(([key, val]) => ({
        level: key,
        label: BLOOM_LABELS[key] || key,
        total: val.total,
        correct: val.correct,
        percentage: val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0,
      }));

      // Kateqoriya / Fənn statistikası
      const catMap: Record<string, { total: number; correct: number; topics: Set<string> }> = {};
      items.forEach((item) => {
        const cat = item.category;
        if (!catMap[cat]) {
          catMap[cat] = { total: 0, correct: 0, topics: new Set() };
        }
        catMap[cat].total += item.attempt_count;
        catMap[cat].correct += item.correct_count;
        catMap[cat].topics.add(item.topic);
      });

      const categoryStats: CategoryMasteryStat[] = Object.entries(catMap).map(([cat, val]) => ({
        category: cat,
        totalAttempts: val.total,
        totalCorrect: val.correct,
        accuracy: val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0,
        topicsCount: val.topics.size,
      }));

      // Vaxtı çatmış təkrarlar (Spaced repetition)
      const now = new Date();
      const needsReviewItems = items.filter((i) => {
        if (!i.next_review_at) return false;
        return new Date(i.next_review_at) <= now;
      });

      return {
        items,
        strengths,
        developing,
        weaknesses,
        overallMastery,
        bloomStats,
        categoryStats,
        needsReviewItems,
      };
    },
    enabled: !!userId,
    staleTime: 30 * 1000,
  });
}

/**
 * Quiz tamamlandıqda sualların mövzu və idrak səviyyələri üzrə şagirdin mənimsəmə göstəricilərini yeniləyir.
 */
export async function syncStudentMasteryAfterQuiz(params: {
  userId: string;
  quizId: string;
  answers: Array<{
    questionId: string;
    isCorrect?: boolean;
    pointsEarned?: number;
  }>;
}) {
  const { userId, quizId, answers } = params;
  if (!userId || !quizId || !answers.length) return;

  try {
    // 1. Quiz və sual məlumatlarını çəkirik
    const [{ data: quizData }, { data: questionsData }] = await Promise.all([
      supabase.from('quizzes').select('title, category').eq('id', quizId).maybeSingle(),
      supabase.from('questions').select('id, category, topic, bloom_level, weight').eq('quiz_id', quizId),
    ]);

    const defaultCategory = quizData?.category || 'Ümumi';
    const questionsMap = new Map((questionsData || []).map((q) => [q.id, q]));

    // 2. Mövcud qeydləri toplayırıq
    const aggregations: Record<string, {
      category: string;
      topic: string;
      bloom_level: string | null;
      correct_delta: number;
      attempt_delta: number;
    }> = {};

    answers.forEach((ans) => {
      const q = questionsMap.get(ans.questionId);
      const category = q?.category || defaultCategory;
      const topic = q?.topic || 'Əsas mövzu';
      const bloom_level = q?.bloom_level || null;
      const isCorrect = Boolean(ans.isCorrect || (ans.pointsEarned && ans.pointsEarned > 0));

      const key = `${category}:::${topic}:::${bloom_level || 'none'}`;
      if (!aggregations[key]) {
        aggregations[key] = {
          category,
          topic,
          bloom_level,
          correct_delta: 0,
          attempt_delta: 0,
        };
      }
      aggregations[key].attempt_delta += 1;
      if (isCorrect) {
        aggregations[key].correct_delta += 1;
      }
    });

    // 3. Hər bir qrupu student_mastery cədvəlinə yazırıq
    for (const item of Object.values(aggregations)) {
      // Mövcud qeydi yoxlayırıq
      let query = supabase
        .from('student_mastery')
        .select('id, correct_count, attempt_count')
        .eq('student_id', userId)
        .eq('category', item.category)
        .eq('topic', item.topic);

      if (item.bloom_level) {
        query = query.eq('bloom_level', item.bloom_level);
      } else {
        query = query.is('bloom_level', null);
      }

      const { data: existing } = await query.maybeSingle();

      const now = new Date();
      // Sadə Spaced Repetition məntiqi: zəifdirsə 2 gün sonra, güclüdürsə 7 gün sonra təkrar
      const isOverallCorrect = item.correct_delta === item.attempt_delta;
      const daysToAdd = isOverallCorrect ? 7 : 2;
      const nextReview = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

      if (existing) {
        await supabase
          .from('student_mastery')
          .update({
            correct_count: (existing.correct_count || 0) + item.correct_delta,
            attempt_count: (existing.attempt_count || 0) + item.attempt_delta,
            last_practiced: now.toISOString(),
            next_review_at: nextReview,
            updated_at: now.toISOString(),
          })
          .eq('id', existing.id);
      } else {
        await supabase.from('student_mastery').insert({
          student_id: userId,
          category: item.category,
          topic: item.topic,
          bloom_level: item.bloom_level,
          correct_count: item.correct_delta,
          attempt_count: item.attempt_delta,
          last_practiced: now.toISOString(),
          next_review_at: nextReview,
        });
      }
    }
  } catch (err) {
    console.error('student_mastery yenilənməsində xəta:', err);
  }
}
