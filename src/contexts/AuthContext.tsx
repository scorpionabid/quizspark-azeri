import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
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
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, phone: string, role: AppRole) => Promise<{ error: Error | null }>;
  signInWithOAuth: (provider: Provider) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  selectOAuthRole: (role: AppRole, phone?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const fetchUserData = useCallback(async (userId: string) => {
    setIsDataLoading(true);
    try {
      // Parallel fetch — role and profile at the same time for speed
      const [roleResult, profileResult] = await Promise.all([
        supabase.from('user_roles').select('role').eq('user_id', userId).maybeSingle(),
        supabase.from('profiles').select('full_name, avatar_url, status, is_profile_complete, subscription_tier').eq('user_id', userId).maybeSingle(),
      ]);

      if (roleResult.data) {
        setRole(roleResult.data.role as AppRole);
      } else if (roleResult.error) {
        console.error('[Auth] Failed to fetch role:', roleResult.error.message);
      }

      if (profileResult.data) {
        setProfile({
          full_name: profileResult.data.full_name,
          avatar_url: profileResult.data.avatar_url,
          status: profileResult.data.status as Profile['status'],
          isProfileComplete: profileResult.data.is_profile_complete ?? true,
          subscription_tier: (profileResult.data.subscription_tier as Profile['subscription_tier']) ?? 'quest',
        });
      } else if (profileResult.error) {
        console.error('[Auth] Failed to fetch profile:', profileResult.error.message);
      }
    } catch (error) {
      console.error('[Auth] fetchUserData exception:', error);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Defer fetching additional data with setTimeout to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setRole(null);
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserData(session.user.id);
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
      const { error } = await supabase.rpc('select_oauth_role', {
        p_role: selectedRole,
        p_phone: phone
      });
      if (error) return { error };
      // Refresh profile to reflect new role and status
      if (user) await fetchUserData(user.id);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserData(user.id);
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
