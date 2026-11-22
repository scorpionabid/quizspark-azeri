import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  formatTimeSpent,
  computeResultMetrics,
  exportQuizResultsToExcel,
} from '../exportQuizResultsExcel';
import * as XLSX from 'xlsx';

vi.mock('xlsx', () => ({
  utils: {
    json_to_sheet: vi.fn(() => ({})),
    book_new: vi.fn(() => ({ Sheets: {}, SheetNames: [] })),
    book_append_sheet: vi.fn(),
  },
  writeFile: vi.fn(),
}));

describe('exportQuizResultsExcel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('formatTimeSpent', () => {
    it('should format seconds into mm:ss', () => {
      expect(formatTimeSpent(65)).toBe('1:05');
      expect(formatTimeSpent(0)).toBe('0:00');
      expect(formatTimeSpent(3600)).toBe('60:00');
    });

    it('should return — for null or undefined', () => {
      expect(formatTimeSpent(null)).toBe('—');
      expect(formatTimeSpent(undefined)).toBe('—');
    });
  });

  describe('computeResultMetrics', () => {
    it('should convert percentage-encoded score (e.g. 80 on 10 questions) into 8 correct and 2 wrong', () => {
      const metrics = computeResultMetrics(
        {
          id: 'r1',
          quiz_id: 'q1',
          user_id: 'u1',
          score: 80,
          total_questions: 10,
          percentage: 80,
          time_spent: 100,
          completed_at: '2026-11-19T00:00:00Z',
          profiles: null,
        },
        60
      );

      expect(metrics.correctCount).toBe(8);
      expect(metrics.wrongAndBlankCount).toBe(2);
      expect(metrics.totalQuestions).toBe(10);
      expect(metrics.percentage).toBe(80);
      expect(metrics.isPassed).toBe(true);
    });

    it('should use exact attemptAnswers breakdown when available', () => {
      const metrics = computeResultMetrics(
        {
          id: 'r2',
          quiz_id: 'q1',
          user_id: 'u1',
          score: 75,
          total_questions: 4,
          percentage: 75,
          time_spent: 120,
          completed_at: '2026-11-19T00:00:00Z',
          profiles: null,
        },
        60,
        [
          { isCorrect: true, textAnswer: 'A' },
          { isCorrect: true, textAnswer: 'B' },
          { isCorrect: false, textAnswer: 'C' },
          { isCorrect: false, textAnswer: '' },
        ]
      );

      expect(metrics.hasExactBreakdown).toBe(true);
      expect(metrics.correctCount).toBe(2);
      expect(metrics.incorrectCount).toBe(1);
      expect(metrics.unansweredCount).toBe(1);
      expect(metrics.wrongAndBlankCount).toBe(2);
    });
  });

  describe('exportQuizResultsToExcel', () => {
    it('should throw error if results array is empty', () => {
      expect(() =>
        exportQuizResultsToExcel({
          quizTitle: 'Riyaziyyat KSQ 1',
          results: [],
        })
      ).toThrow('İxrac etmək üçün nəticə tapılmadı.');
    });

    it('should structure data and invoke XLSX.writeFile', () => {
      const mockResults = [
        {
          id: 'res-1',
          quiz_id: 'quiz-1',
          user_id: 'user-1',
          score: 18,
          total_questions: 20,
          percentage: 90,
          time_spent: 720,
          completed_at: '2026-11-19T03:00:00Z',
          profiles: {
            full_name: 'Nəzrin Qasımova',
            avatar_url: null,
            utis_code: '2892613',
            school: '287 saylı lisey',
            grade: '8A',
            fin: '2892613',
          },
        },
      ];

      const fileName = exportQuizResultsToExcel({
        quizTitle: 'Riyaziyyat KSQ 1',
        results: mockResults,
        passPercentage: 60,
      });

      expect(XLSX.utils.json_to_sheet).toHaveBeenCalledTimes(1);
      const passedData = (XLSX.utils.json_to_sheet as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(passedData).toHaveLength(1);
      expect(passedData[0]).toMatchObject({
        '№': 1,
        'UTİS Kodu': '2892613',
        'Şagirdin Adı, Soyadı': 'Nəzrin Qasımova',
        'Məktəb': '287 saylı lisey',
        'Sinif': '8A',
        'Toplanan Bal': 18,
        'Maksimal Bal': 20,
        'Düzgün Cavab': 18,
        'Səhv / Boş': 2,
        'Nəticə (%)': 90,
        'Status': 'Keçdi',
        'Sərf Olunan Vaxt': '12:00',
      });

      expect(XLSX.writeFile).toHaveBeenCalledTimes(1);
      expect(fileName).toContain('Riyaziyyat_KSQ_1_Şagird_Nəticələri_');
      expect(fileName.endsWith('.xlsx')).toBe(true);
    });
  });
});
