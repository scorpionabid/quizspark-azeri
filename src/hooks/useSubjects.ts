import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DEFAULT_SUBJECTS } from '@/lib/constants/subjects';

const CUSTOM_SUBJECTS_KEY = 'quiz_custom_subjects';

export function getStoredCustomSubjects(): string[] {
  try {
    const raw = localStorage.getItem(CUSTOM_SUBJECTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(s => String(s).trim()).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function saveStoredCustomSubject(subject: string): string[] {
  const trimmed = subject.trim();
  if (!trimmed || trimmed === 'Digər' || trimmed === 'custom') return getStoredCustomSubjects();

  const current = getStoredCustomSubjects();
  const lower = trimmed.toLowerCase();
  
  // Check if already in stored list (case-insensitive)
  if (!current.some(s => s.toLowerCase() === lower)) {
    const updated = [...current, trimmed];
    try {
      localStorage.setItem(CUSTOM_SUBJECTS_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage error
    }
    return updated;
  }
  return current;
}

export function removeStoredCustomSubject(subject: string): string[] {
  const trimmed = subject.trim().toLowerCase();
  const current = getStoredCustomSubjects();
  const updated = current.filter(s => s.toLowerCase() !== trimmed);
  try {
    localStorage.setItem(CUSTOM_SUBJECTS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

export function useSubjects() {
  const queryClient = useQueryClient();
  const [customSubjects, setCustomSubjects] = useState<string[]>(getStoredCustomSubjects);

  const { data: dbSubjects = [], isLoading } = useQuery({
    queryKey: ['subjects', 'distinct-from-quizzes'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('quizzes')
          .select('subject')
          .not('subject', 'is', null);

        if (error) throw error;

        const distinct = Array.from(
          new Set(
            (data || [])
              .map(q => q.subject?.trim())
              .filter((s): s is string => Boolean(s) && s !== 'Digər')
          )
        );
        return distinct;
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 dəqiqə keş
  });

  // Bütün mənbələri birləşdir və dublikatları təmizlə
  const allUniqueMap = new Map<string, string>();

  // 1. Standart baza fənnləri
  DEFAULT_SUBJECTS.forEach(s => {
    const trimmed = s.trim();
    if (trimmed) allUniqueMap.set(trimmed.toLowerCase(), trimmed);
  });

  // 2. Bazadakı mövcud quizlərin fənnləri
  dbSubjects.forEach(s => {
    const trimmed = s.trim();
    if (trimmed && !allUniqueMap.has(trimmed.toLowerCase())) {
      allUniqueMap.set(trimmed.toLowerCase(), trimmed);
    }
  });

  // 3. İstifadəçinin əvvəllər yazdığı xüsusi fənnlər
  customSubjects.forEach(s => {
    const trimmed = s.trim();
    if (trimmed && !allUniqueMap.has(trimmed.toLowerCase())) {
      allUniqueMap.set(trimmed.toLowerCase(), trimmed);
    }
  });

  const subjects = Array.from(allUniqueMap.values());

  const addCustomSubject = (newSubject: string) => {
    const trimmed = newSubject.trim();
    if (!trimmed || trimmed === 'Digər' || trimmed === 'custom') return;

    const updated = saveStoredCustomSubject(trimmed);
    setCustomSubjects(updated);
    queryClient.invalidateQueries({ queryKey: ['subjects'] });
  };

  const removeCustomSubject = (subjectToRemove: string) => {
    const updated = removeStoredCustomSubject(subjectToRemove);
    setCustomSubjects(updated);
    queryClient.invalidateQueries({ queryKey: ['subjects'] });
  };

  return {
    subjects,
    customSubjects,
    isLoading,
    addCustomSubject,
    removeCustomSubject,
  };
}
