import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface TeacherClass {
  id: string;
  teacher_id: string;
  name: string;
  grade: number;
  academic_year: string;
  created_at: string;
}

export interface ClassStudent {
  id: string;
  class_id: string;
  full_name: string;
  student_number: number;
  created_at: string;
}

export interface StudentAssessmentResult {
  id: string;
  teacher_id: string;
  class_id: string | null;
  student_id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  score_10: number;
  grade_mark: number;
  variant: string | null;
  source: string;
  created_at: string;
}

/**
 * 100 ballıq sistemdə balı (0 – 100) və qiyməti (2, 3, 4, 5) hesablayır.
 */
export function calculateHundredPointGrade(correct: number, total: number) {
  if (total <= 0) {
    return { percentage: 0, score100: 0, gradeMark: 2 };
  }
  const score100 = Math.round((correct / total) * 100);
  const gradeMark =
    score100 <= 30 ? 2 : score100 <= 60 ? 3 : score100 <= 80 ? 4 : 5;
  return { percentage: score100, score100, gradeMark };
}

export function useTeacherClasses() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['teacher-classes', user?.id ?? 'anon'],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teacher_classes')
        .select('*')
        .order('grade', { ascending: true })
        .order('name', { ascending: true });
      if (error) throw error;
      return (data ?? []) as TeacherClass[];
    },
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (payload: { name: string; grade: number; academic_year?: string }) => {
      if (!user) throw new Error('Giriş tələb olunur');
      const { data, error } = await supabase
        .from('teacher_classes')
        .insert({
          teacher_id: user.id,
          name: payload.name.trim(),
          grade: payload.grade,
          academic_year: payload.academic_year || '2025-2026',
        })
        .select()
        .single();
      if (error) throw error;
      return data as TeacherClass;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-classes'] });
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (classId: string) => {
      const { error } = await supabase.from('teacher_classes').delete().eq('id', classId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-classes'] });
    },
  });
}

export function useClassStudents(classId?: string) {
  return useQuery({
    queryKey: ['class-students', classId ?? 'none'],
    enabled: Boolean(classId),
    queryFn: async () => {
      if (!classId) return [];
      const { data, error } = await supabase
        .from('class_students')
        .select('*')
        .eq('class_id', classId)
        .order('student_number', { ascending: true })
        .order('full_name', { ascending: true });
      if (error) throw error;
      return (data ?? []) as ClassStudent[];
    },
  });
}

export function useBulkAddStudents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { classId: string; names: string[]; startNumber?: number }) => {
      const start = payload.startNumber ?? 1;
      const rows = payload.names
        .map((n) => n.trim())
        .filter(Boolean)
        .map((full_name, idx) => ({
          class_id: payload.classId,
          full_name,
          student_number: start + idx,
        }));
      if (rows.length === 0) return [];
      const { data, error } = await supabase.from('class_students').insert(rows).select();
      if (error) throw error;
      return (data ?? []) as ClassStudent[];
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['class-students', vars.classId] });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { studentId: string; classId: string }) => {
      const { error } = await supabase.from('class_students').delete().eq('id', payload.studentId);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['class-students', vars.classId] });
    },
  });
}

export function useClassAssessmentResults(classId?: string, quizId?: string) {
  return useQuery({
    queryKey: ['student-assessment-results', classId ?? 'none', quizId ?? 'all'],
    enabled: Boolean(classId),
    queryFn: async () => {
      if (!classId) return [];
      let query = supabase
        .from('student_assessment_results')
        .select('*')
        .eq('class_id', classId)
        .order('created_at', { ascending: false });
      if (quizId && quizId !== 'all') {
        query = query.eq('quiz_id', quizId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as StudentAssessmentResult[];
    },
  });
}

export function useSaveStudentResult() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (payload: {
      classId: string | null;
      studentId: string;
      quizId: string;
      score: number;
      totalQuestions: number;
      variant?: string;
      source?: 'camera_omr' | 'online' | 'manual';
    }) => {
      if (!user) throw new Error('Giriş tələb olunur');
      const { score100, gradeMark } = calculateHundredPointGrade(
        payload.score,
        payload.totalQuestions
      );

      const { data, error } = await supabase
        .from('student_assessment_results')
        .upsert(
          {
            teacher_id: user.id,
            class_id: payload.classId,
            student_id: payload.studentId,
            quiz_id: payload.quizId,
            score: payload.score,
            total_questions: payload.totalQuestions,
            percentage: score100,
            score_10: Number((score100 / 10).toFixed(1)),
            grade_mark: gradeMark,
            variant: payload.variant ?? 'A',
            source: payload.source ?? 'camera_omr',
          },
          { onConflict: 'student_id,quiz_id' }
        )
        .select()
        .single();

      if (error) throw error;
      return data as StudentAssessmentResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-assessment-results'] });
    },
  });
}
