import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMyQuizzes } from './useQuizzes';

export interface ClassTopicGap {
  category: string;
  topic: string;
  totalAttempts: number;
  totalCorrect: number;
  accuracy: number;
  studentsAffected: number;
  status: 'critical' | 'moderate' | 'mastered';
}

export interface ClassAnalyticsSummary {
  totalTopics: number;
  criticalGaps: ClassTopicGap[];
  moderateGaps: ClassTopicGap[];
  masteredTopics: ClassTopicGap[];
  overallClassAccuracy: number;
  activeLearnersCount: number;
}

export function useClassTopicAnalysis() {
  const { data: myQuizzes = [] } = useMyQuizzes();
  const quizIds = myQuizzes.map((q) => q.id);

  return useQuery({
    queryKey: ['class-topic-gap-analysis', quizIds],
    queryFn: async (): Promise<ClassAnalyticsSummary> => {
      // 1. Müəllimin quizlərindəki sualların mövzularını və kateqoriyalarını çəkirik
      const { data: questions } = await supabase
        .from('questions')
        .select('id, quiz_id, category, topic, bloom_level')
        .in('quiz_id', quizIds.length > 0 ? quizIds : ['00000000-0000-0000-0000-000000000000']);

      const distinctCategories = Array.from(new Set((questions || []).map((q) => q.category).filter(Boolean)));

      // 2. student_mastery cədvəlindən bu kateqoriyalar üzrə bütün tələbə qeydlərini alırıq
      let query = supabase.from('student_mastery').select('*');
      if (distinctCategories.length > 0) {
        query = query.in('category', distinctCategories as string[]);
      }

      const { data: masteryRecords } = await query;

      // 3. Mövzular üzrə qruplaşdırma və aqreqasiya
      const topicMap: Record<string, {
        category: string;
        topic: string;
        totalAttempts: number;
        totalCorrect: number;
        students: Set<string>;
      }> = {};

      (masteryRecords || []).forEach((rec) => {
        const cat = rec.category || 'Ümumi';
        const top = rec.topic || 'Əsas anlayışlar';
        const key = `${cat}:::${top}`;

        if (!topicMap[key]) {
          topicMap[key] = {
            category: cat,
            topic: top,
            totalAttempts: 0,
            totalCorrect: 0,
            students: new Set(),
          };
        }

        topicMap[key].totalAttempts += rec.attempt_count || 0;
        topicMap[key].totalCorrect += rec.correct_count || 0;
        if (rec.student_id) {
          topicMap[key].students.add(rec.student_id);
        }
      });

      const allGaps: ClassTopicGap[] = Object.values(topicMap).map((item) => {
        const accuracy = item.totalAttempts > 0 
          ? Math.round((item.totalCorrect / item.totalAttempts) * 100) 
          : 0;

        let status: 'critical' | 'moderate' | 'mastered' = 'moderate';
        if (accuracy < 55 && item.totalAttempts >= 3) {
          status = 'critical';
        } else if (accuracy >= 75 && item.totalAttempts >= 3) {
          status = 'mastered';
        }

        return {
          category: item.category,
          topic: item.topic,
          totalAttempts: item.totalAttempts,
          totalCorrect: item.totalCorrect,
          accuracy,
          studentsAffected: item.students.size,
          status,
        };
      });

      const criticalGaps = allGaps.filter((g) => g.status === 'critical').sort((a, b) => a.accuracy - b.accuracy);
      const moderateGaps = allGaps.filter((g) => g.status === 'moderate').sort((a, b) => a.accuracy - b.accuracy);
      const masteredTopics = allGaps.filter((g) => g.status === 'mastered').sort((a, b) => b.accuracy - a.accuracy);

      const totalAttempts = allGaps.reduce((sum, g) => sum + g.totalAttempts, 0);
      const totalCorrect = allGaps.reduce((sum, g) => sum + g.totalCorrect, 0);
      const overallClassAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

      const uniqueStudents = new Set<string>();
      (masteryRecords || []).forEach((r) => {
        if (r.student_id) uniqueStudents.add(r.student_id);
      });

      return {
        totalTopics: allGaps.length,
        criticalGaps,
        moderateGaps,
        masteredTopics,
        overallClassAccuracy,
        activeLearnersCount: uniqueStudents.size,
      };
    },
    enabled: true,
    staleTime: 60 * 1000,
  });
}
