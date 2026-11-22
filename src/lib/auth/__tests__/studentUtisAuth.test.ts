import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  cleanUtisCode,
  isValidUtisCode,
  lookupStudentByUtis,
  loginOrRegisterStudentByUtis,
} from '../studentUtisAuth';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    rpc: vi.fn(),
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
    from: vi.fn(() => ({
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
}));

describe('studentUtisAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('cleanUtisCode', () => {
    it('should strip non-digit characters and truncate to 7 digits', () => {
      expect(cleanUtisCode('123-4567')).toBe('1234567');
      expect(cleanUtisCode('  987 654 3 ')).toBe('9876543');
      expect(cleanUtisCode('UTIS123456789')).toBe('1234567');
      expect(cleanUtisCode('')).toBe('');
    });
  });

  describe('isValidUtisCode', () => {
    it('should validate strictly 7 digit numbers', () => {
      expect(isValidUtisCode('1234567')).toBe(true);
      expect(isValidUtisCode('123456')).toBe(false);
      expect(isValidUtisCode('12345678')).toBe(false);
      expect(isValidUtisCode('123456a')).toBe(false);
      expect(isValidUtisCode('')).toBe(false);
    });
  });

  describe('lookupStudentByUtis', () => {
    it('should return found: false for invalid utis code', async () => {
      const res = await lookupStudentByUtis('123');
      expect(res.found).toBe(false);
      expect(supabase.rpc).not.toHaveBeenCalled();
    });

    it('should call get_student_by_utis and return student details if found', async () => {
      (supabase.rpc as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: {
          found: true,
          full_name: 'Əli Məmmədov',
          school: '287 saylı Zəkalar liseyi',
          grade: '8A',
        },
        error: null,
      });

      const res = await lookupStudentByUtis('2892613');
      expect(res.found).toBe(true);
      expect(res.fullName).toBe('Əli Məmmədov');
      expect(res.school).toBe('287 saylı Zəkalar liseyi');
      expect(res.grade).toBe('8A');
      expect(supabase.rpc).toHaveBeenCalledWith('get_student_by_utis', {
        p_utis: '2892613',
      });
    });

    it('should return found: false when RPC returns found: false', async () => {
      (supabase.rpc as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { found: false },
        error: null,
      });

      const res = await lookupStudentByUtis('9999999');
      expect(res.found).toBe(false);
    });
  });

  describe('loginOrRegisterStudentByUtis', () => {
    it('should throw error for invalid utis', async () => {
      await expect(
        loginOrRegisterStudentByUtis({
          utis: '123',
          fullName: 'Test Student',
        })
      ).rejects.toThrow('UTİS kodu 7 rəqəmdən ibarət olmalıdır.');
    });

    it('should throw error for short name', async () => {
      await expect(
        loginOrRegisterStudentByUtis({
          utis: '1234567',
          fullName: 'A',
        })
      ).rejects.toThrow('Zəhmət olmasa ad və soyadınızı daxil edin.');
    });

    it('should sign in successfully if user already exists', async () => {
      (supabase.auth.signInWithPassword as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { user: { id: 'student-uuid-123' } },
        error: null,
      });

      const result = await loginOrRegisterStudentByUtis({
        utis: '1234567',
        fullName: 'Əli Əliyev',
        school: 'Məktəb 1',
        grade: '7A',
      });

      expect(result.userId).toBe('student-uuid-123');
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'utis_1234567@imtahan.store',
        password: 'Utis2026_1234567!',
      });
    });

    it('should fall back to sign up if sign in fails', async () => {
      (supabase.auth.signInWithPassword as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid login credentials' },
      });
      (supabase.auth.signUp as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { user: { id: 'new-student-uuid' } },
        error: null,
      });

      const result = await loginOrRegisterStudentByUtis({
        utis: '7654321',
        fullName: 'Aygün Həsənova',
        school: 'Məktəb 5',
        grade: '9B',
      });

      expect(result.userId).toBe('new-student-uuid');
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'utis_7654321@imtahan.store',
        password: 'Utis2026_7654321!',
        options: {
          data: {
            role: 'student',
            full_name: 'Aygün Həsənova',
            utis: '7654321',
            grade: '9B',
            school: 'Məktəb 5',
          },
        },
      });
    });
  });
});
