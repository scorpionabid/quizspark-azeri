import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { User, Session, Provider } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

import { AppRole, Profile } from '@/types/auth';
export type { AppRole };

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  profile: Profile | null;
  isLoading: boolean;
  isDataLoading: boolean;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  isPasswordRecovery: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, phone: string, role: AppRole) => Promise<{ error: Error | null }>;
  signInWithOAuth: (provider: Provider) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  selectOAuthRole: (role: AppRole, phone?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const getCachedRole = (userId?: string): AppRole | null => {
  if (typeof window === 'undefined') return null;
  try {
    if (userId) {
      const userRole = localStorage.getItem(`auth_last_role_${userId}`);
      if (userRole) return userRole as AppRole;
    }
    const currentRole = localStorage.getItem('auth_last_role_current');
    return (currentRole as AppRole) || null;
  } catch {
    return null;
  }
};

const setCachedRole = (userId: string, role: AppRole) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`auth_last_role_${userId}`, role);
    localStorage.setItem('auth_last_role_current', role);
  } catch {}
};

const clearCachedRole = (userId?: string | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (userId) {
      localStorage.removeItem(`auth_last_role_${userId}`);
    }
    localStorage.removeItem('auth_last_role_current');
  } catch {}
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(() => getCachedRole());
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const inFlightUserIdRef = useRef<string | null>(null);

  const fetchUserData = useCallback(async (userId: string, force = false) => {
    if (!force && inFlightUserIdRef.current === userId) {
      return;
    }
    inFlightUserIdRef.current = userId;
    setIsDataLoading(true);
    try {
      // Parallel fetch — role (with retry) and profile at the same time for speed
      const fetchRoleWithRetry = async () => {
        let lastError = null;
        for (let attempt = 0; attempt < 3; attempt++) {
          const res = await supabase.from('user_roles').select('role').eq('user_id', userId).maybeSingle();
          if (!res.error) {
            return { data: res.data, error: null };
          }
          lastError = res.error;
          if (attempt < 2) {
            await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
          }
        }
        return { data: null, error: lastError };
      };

      const [roleResult, profileResult] = await Promise.all([
        fetchRoleWithRetry(),
        supabase.from('profiles').select('full_name, avatar_url, status, is_profile_complete, subscription_tier, utis_code, fin, school, grade').eq('user_id', userId).maybeSingle(),
      ]);

      if (roleResult.data?.role) {
        const fetchedRole = roleResult.data.role as AppRole;
        setRole(fetchedRole);
        setCachedRole(userId, fetchedRole);
      } else if (roleResult.error) {
        console.error('[Auth] Failed to fetch role:', roleResult.error.message);
        const fallback = getCachedRole(userId);
        if (fallback) {
          console.warn('[Auth] Preserving cached role after fetch error:', fallback);
          setRole(fallback);
        }
      }

      if (profileResult.data) {
        setProfile({
          full_name: profileResult.data.full_name,
          avatar_url: profileResult.data.avatar_url,
          status: profileResult.data.status as Profile['status'],
          isProfileComplete: profileResult.data.is_profile_complete ?? true,
          subscription_tier: (profileResult.data.subscription_tier as Profile['subscription_tier']) ?? 'quest',
          utis_code: (profileResult.data as { utis_code?: string | null }).utis_code ?? null,
          fin: (profileResult.data as { fin?: string | null }).fin ?? null,
          school: (profileResult.data as { school?: string | null }).school ?? null,
          grade: (profileResult.data as { grade?: string | null }).grade ?? null,
        });
      } else if (profileResult.error) {
        console.error('[Auth] Failed to fetch profile:', profileResult.error.message);
      }
    } catch (error) {
      console.error('[Auth] fetchUserData exception:', error);
    } finally {
      setIsDataLoading(false);
      inFlightUserIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    // 1. Check for URL OAuth errors (e.g. user canceled Google login) or Password recovery
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      const fullUrl = hash + search;

      if (fullUrl.includes('error=') || fullUrl.includes('error_description=')) {
        console.warn('[Auth] OAuth error or cancellation detected in URL');
        localStorage.removeItem('pending_role');
        if (window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }

      if (hash.includes('type=recovery')) {
        setIsPasswordRecovery(true);
      }
    }

    // 2. Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (_event === 'PASSWORD_RECOVERY') {
          setIsPasswordRecovery(true);
        } else if (_event === 'SIGNED_OUT') {
          clearCachedRole(user?.id);
          setRole(null);
          setProfile(null);
          setIsPasswordRecovery(false);
          localStorage.removeItem('pending_role');
        }

        // Defer fetching additional data with setTimeout to prevent deadlock
        if (session?.user) {
          const cached = getCachedRole(session.user.id);
          if (cached) {
            setRole(cached);
          }
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setRole(null);
          setProfile(null);
        }
      }
    );

    // 3. THEN check for existing session
    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const cached = getCachedRole(session.user.id);
          if (cached) {
            setRole(cached);
          }
          await fetchUserData(session.user.id);
        }
      })
      .catch((err) => {
        console.error('[Auth] getSession failed (Supabase əlçatmazdır?):', err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('[Auth] Sign-in failed:', error.message);
        return { error };
      }
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone: string, role: AppRole): Promise<{ error: Error | null }> => {
    try {
      const redirectUrl = `${window.location.origin}/auth`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            phone: phone,
            role: role,
          },
        },
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithOAuth = async (provider: Provider): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const selectOAuthRole = async (selectedRole: AppRole, phone?: string): Promise<{ error: Error | null }> => {
    try {
      const rpcResult = await supabase.rpc('select_oauth_role', {
        p_role: selectedRole,
        p_phone: phone
      });

      if (rpcResult.error) {
        console.warn('[Auth] select_oauth_role RPC failed, running direct fallback:', rpcResult.error.message);
        // Fallback: direct update in database tables
        if (user) {
          const isTeacher = selectedRole === 'teacher';
          await Promise.all([
            supabase.from('user_roles').upsert({
              user_id: user.id,
              role: selectedRole
            }, { onConflict: 'user_id' }),
            supabase.from('profiles').update({
              status: isTeacher ? 'pending' : 'active',
              phone: phone || undefined,
              is_profile_complete: true
            }).eq('user_id', user.id)
          ]);
        }
      }

      // Refresh profile to reflect new role and status immediately with force = true
      if (user) {
        setCachedRole(user.id, selectedRole);
        setRole(selectedRole);
        await fetchUserData(user.id, true);
      }
      return { error: null };
    } catch (error) {
      console.error('[Auth] selectOAuthRole exception:', error);
      return { error: error as Error };
    }
  };

  // Auto-complete student profile if user signed in with 'student' intent from localStorage
  useEffect(() => {
    if (user && profile && profile.isProfileComplete === false) {
      const pendingRole = localStorage.getItem('pending_role') as AppRole | null;
      if (pendingRole === 'student') {
        localStorage.removeItem('pending_role');
        selectOAuthRole('student');
      }
    }
  }, [user, profile]);

  const signOut = async () => {
    inFlightUserIdRef.current = null;
    clearCachedRole(user?.id);
    localStorage.removeItem('pending_role');
    setIsPasswordRecovery(false);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
    setProfile(null);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:signout'));
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserData(user.id, true);
    } else {
      const { data } = await supabase.auth.getSession();
      const curSession = data?.session ?? null;
      if (curSession?.user) {
        setSession(curSession);
        setUser(curSession.user);
        await fetchUserData(curSession.user.id, true);
      }
    }
  };

  const isProfileComplete = profile?.isProfileComplete ?? true;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        profile,
        isLoading,
        isDataLoading,
        isAuthenticated: !!user,
        isProfileComplete,
        isPasswordRecovery,
        signIn,
        signUp,
        signInWithOAuth,
        resetPassword,
        selectOAuthRole,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
