import { supabase } from '@/integrations/supabase/client';

export interface SchoolItem {
  id: number;
  name: string;
  district: string;
}

export interface UtisStudentLookupResult {
  found: boolean;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  fatherName?: string;
  school?: string;
  schoolId?: number;
  grade?: string;
  gradeLevel?: number;
  classLetter?: string;
  language?: string;
  isVerified?: boolean;
  isExternal?: boolean;
}

export interface StudentAuthParams {
  utis: string;
  fullName: string;
  school?: string;
  grade?: string;
  gradeLevel?: number;
  classLetter?: string;
  isExternal?: boolean;
}

// In-memory cache for schools list
let cachedSchools: SchoolItem[] | null = null;

/**
 * Normalizes input string to a clean numeric UTIS code (max 7 digits).
 */
export function cleanUtisCode(input: string): string {
  return (input || '').trim().replace(/\D/g, '').slice(0, 7);
}

/**
 * Validates whether string is exactly 7 digits.
 */
export function isValidUtisCode(code: string): boolean {
  return /^\d{7}$/.test(code);
}

/**
 * Fetches the registry of 357 regional schools from database (cached in memory).
 */
export async function fetchSchoolsList(): Promise<SchoolItem[]> {
  if (cachedSchools && cachedSchools.length > 0) {
    return cachedSchools;
  }

  try {
    const { data, error } = await supabase.rpc('get_schools_list');
    if (!error && Array.isArray(data)) {
      cachedSchools = data as SchoolItem[];
      return cachedSchools;
    }
  } catch (err) {
    console.warn('[studentUtisAuth] fetchSchoolsList error:', err);
  }

  return [];
}

/**
 * Looks up existing student info by 7-digit UTIS code using database RPC.
 */
export async function lookupStudentByUtis(utis: string): Promise<UtisStudentLookupResult> {
  const clean = cleanUtisCode(utis);
  if (!isValidUtisCode(clean)) {
    return { found: false };
  }

  try {
    const { data, error } = await supabase.rpc('get_student_by_utis', {
      p_utis: clean,
    });

    if (error || !data || !data.found) {
      return { found: false };
    }

    return {
      found: true,
      fullName: (data.full_name as string) || '',
      firstName: (data.first_name as string) || '',
      lastName: (data.last_name as string) || '',
      fatherName: (data.father_name as string) || '',
      school: (data.school as string) || '',
      schoolId: typeof data.school_id === 'number' ? data.school_id : undefined,
      grade: (data.grade as string) || '',
      gradeLevel: typeof data.grade_level === 'number' ? data.grade_level : undefined,
      classLetter: (data.class_letter as string) || '',
      language: (data.language as string) || 'Azərbaycan',
      isVerified: Boolean(data.is_verified),
      isExternal: Boolean(data.is_external),
    };
  } catch (err) {
    console.warn('[studentUtisAuth] lookupStudentByUtis error:', err);
    return { found: false };
  }
}

/**
 * Logs in or signs up a student deterministically using their 7-digit UTIS code.
 * Ensures an active Supabase session and synchronizes student profile & registry.
 */
export async function loginOrRegisterStudentByUtis(
  params: StudentAuthParams
): Promise<{ userId: string }> {
  const clean = cleanUtisCode(params.utis);
  if (!isValidUtisCode(clean)) {
    throw new Error('UTİS kodu 7 rəqəmdən ibarət olmalıdır.');
  }

  const cleanName = (params.fullName || '').trim();
  if (cleanName.length < 2) {
    throw new Error('Zəhmət olmasa ad və soyadınızı daxil edin.');
  }

  const school = (params.school || '').trim() || 'Ümumtəhsil məktəbi';
  const classLetter = (params.classLetter || '').trim().toUpperCase();

  let gradeFormatted = (params.grade || '').trim();
  if (params.gradeLevel) {
    gradeFormatted = `${params.gradeLevel}${classLetter ? '-' + classLetter : ''}`;
  } else if (!gradeFormatted && classLetter) {
    gradeFormatted = classLetter;
  }

  const gradeLevel = params.gradeLevel ?? (parseInt(gradeFormatted || '0', 10) || null);

  const email = `utis_${clean.toLowerCase()}@imtahan.store`;
  const password = `Utis2026_${clean}!`;

  // 1. Try to sign in first
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  let authUserId: string | null = signInData?.user?.id ?? null;

  // 2. If sign in fails, attempt sign up
  if (signInError || !authUserId) {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'student',
          full_name: cleanName,
          utis: clean,
          grade: gradeFormatted,
          school,
        },
      },
    });

    if (signUpError) {
      // If user already registered, retry sign in once more
      const { data: retrySignIn, error: retryError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (retryError || !retrySignIn?.user?.id) {
        throw new Error(retryError?.message || signUpError.message || 'Şagird girişi təsdiqlənə bilmədi.');
      }
      authUserId = retrySignIn.user.id;
    } else {
      authUserId = signUpData?.user?.id ?? null;
    }
  }

  if (!authUserId) {
    throw new Error('Şagird sessiyası təsdiqlənə bilmədi. Zəhmət olmasa yenidən cəhd edin.');
  }

  // 3. Update profiles row
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      full_name: cleanName,
      utis_code: clean,
      fin: clean,
      grade: gradeFormatted || null,
      school: school || null,
    })
    .eq('user_id', authUserId);

  if (profileError) {
    console.warn('[studentUtisAuth] profile update warning:', profileError);
  }

  // 4. Synchronize with students_registry via RPC
  try {
    await supabase.rpc('confirm_or_update_student_profile', {
      p_utis: clean,
      p_school_name: school,
      p_grade_level: gradeLevel,
      p_class_letter: classLetter,
      p_full_name: cleanName,
      p_user_id: authUserId,
    });
  } catch (rpcErr) {
    console.warn('[studentUtisAuth] confirm_or_update_student_profile RPC warning:', rpcErr);
  }

  return { userId: authUserId };
}
