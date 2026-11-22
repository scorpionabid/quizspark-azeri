import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDuplicateQuiz } from '../useQuizzes';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    profile: { subscription_tier: 'vip' },
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useDuplicateQuiz', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should duplicate quiz with stripped share_code and appended (Kopya) title', async () => {
    const mockSourceQuiz = {
      id: 'quiz-original',
      title: 'AR Konstitusiyası',
      description: 'Test imtahanı',
      share_code: '999888',
      question_count: 74,
      play_count: 50,
      created_at: '2026-01-01',
      updated_at: '2026-01-02',
    };

    const mockInsertedQuiz = {
      id: 'quiz-new-copy',
      title: 'AR Konstitusiyası (Kopya)',
      creator_id: 'test-user-id',
    };

    let insertedQuizPayload: any = null;

    // Setup supabase mocks
    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'quizzes') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ data: mockSourceQuiz, error: null })),
            })),
          })),
          insert: vi.fn((payload: any) => {
            insertedQuizPayload = payload;
            return {
              select: vi.fn(() => ({
                single: vi.fn(() => Promise.resolve({ data: mockInsertedQuiz, error: null })),
              })),
            };
          }),
        } as any;
      }
      if (table === 'questions') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: [], error: null })),
            })),
          })),
          insert: vi.fn(() => Promise.resolve({ error: null })),
        } as any;
      }
      return {} as any;
    });

    const { result } = renderHook(() => useDuplicateQuiz(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.mutateAsync('quiz-original');
    });

    expect(insertedQuizPayload).toBeDefined();
    // Verify title has (Kopya)
    expect(insertedQuizPayload.title).toBe('AR Konstitusiyası (Kopya)');
    // Verify share_code is null (to let trigger generate a fresh unique PIN)
    expect(insertedQuizPayload.share_code).toBeNull();
    // Verify question_count is not carried over from source
    expect(insertedQuizPayload.question_count).toBeUndefined();
    // Verify play_count reset
    expect(insertedQuizPayload.play_count).toBe(0);
  });
});
