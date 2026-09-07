import { describe, it, expect } from 'vitest';
import { translateAuthError } from '../auth-error-translator';

describe('translateAuthError', () => {
  it('should translate invalid credentials error', () => {
    expect(translateAuthError('Invalid login credentials')).toBe('Email və ya parol yanlışdır.');
    expect(translateAuthError(new Error('invalid_grant'))).toBe('Email və ya parol yanlışdır.');
  });

  it('should translate user already exists error', () => {
    expect(translateAuthError('User already registered')).toBe('Bu email ünvanı ilə artıq qeydiyyatdan keçilib.');
  });

  it('should translate rate limit errors', () => {
    expect(translateAuthError('Email rate limit exceeded')).toBe(
      'Təhlükəsizlik məqsədilə çox sayda cəhd edildi. Zəhmət olmasa bir neçə dəqiqə sonra yenidən cəhd edin.'
    );
  });

  it('should translate network connection errors', () => {
    expect(translateAuthError('Failed to fetch')).toBe('İnternet bağlantınızı yoxlayın və yenidən cəhd edin.');
  });

  it('should translate access denied OAuth errors', () => {
    expect(translateAuthError('access_denied')).toBe('Giriş ləğv edildi və ya icazə verilmədi.');
  });

  it('should handle null/empty errors', () => {
    expect(translateAuthError(null)).toBe('Bilinməyən xəta baş verdi.');
  });
});
