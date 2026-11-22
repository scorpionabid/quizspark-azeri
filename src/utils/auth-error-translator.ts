/**
 * Universal error message translator for Supabase authentication and network errors.
 * Converts technical English messages into user-friendly Azerbaijani.
 */
export function translateAuthError(error: Error | string | null | undefined): string {
  if (!error) return 'Bilinməyən xəta baş verdi.';

  const rawMessage = typeof error === 'string' ? error : error.message || '';
  const message = rawMessage.toLowerCase();

  // Invalid credentials
  if (
    message.includes('invalid login credentials') ||
    message.includes('invalid_grant') ||
    message.includes('wrong password') ||
    message.includes('invalid email or password')
  ) {
    return 'Email və ya parol yanlışdır.';
  }

  // User already exists
  if (
    message.includes('user already registered') ||
    message.includes('already exists') ||
    message.includes('unique constraint')
  ) {
    return 'Bu email ünvanı ilə artıq qeydiyyatdan keçilib.';
  }

  // Email confirmation
  if (
    message.includes('email not confirmed') ||
    message.includes('email_not_confirmed')
  ) {
    return 'Zəhmət olmasa email ünvanınıza göndərilən təsdiq linkinə klikləyin.';
  }

  // Weak password
  if (
    message.includes('password should be at least') ||
    message.includes('weak_password')
  ) {
    return 'Parol ən azı 6 simvol uzunluğunda olmalıdır.';
  }

  // Rate limiting / Too many attempts
  if (
    message.includes('rate limit') ||
    message.includes('over_email_send_rate_limit') ||
    message.includes('too many requests') ||
    message.includes('security purposes')
  ) {
    return 'Təhlükəsizlik məqsədilə çox sayda cəhd edildi. Zəhmət olmasa bir neçə dəqiqə sonra yenidən cəhd edin.';
  }

  // OAuth access denied / canceled
  if (
    message.includes('access_denied') ||
    message.includes('user cancelled') ||
    message.includes('popup closed') ||
    message.includes('user_declined')
  ) {
    return 'Giriş ləğv edildi və ya icazə verilmədi.';
  }

  // Session / Token expired
  if (
    message.includes('jwt expired') ||
    message.includes('token is expired') ||
    message.includes('auth session missing') ||
    message.includes('invalid refresh token')
  ) {
    return 'Sessiyanın vaxtı bitib. Zəhmət olmasa yenidən daxil olun.';
  }

  // Network / Connection issues
  if (
    message.includes('failed to fetch') ||
    message.includes('network error') ||
    message.includes('networkrequestfailed') ||
    message.includes('load failed')
  ) {
    return 'İnternet bağlantınızı yoxlayın və yenidən cəhd edin.';
  }

  // Default fallback: return clean message or generic
  return rawMessage || 'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.';
}
