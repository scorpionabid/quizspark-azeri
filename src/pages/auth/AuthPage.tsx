import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { GraduationCap, Loader2, ArrowLeft, UserCircle, CheckCircle2, ArrowRight, Sparkles, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginFormData, SignupFormData } from '@/lib/validations/auth';
import { AppRole } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { QuickJoinPinCard } from '@/components/student/QuickJoinPinCard';
import { translateAuthError } from '@/utils/auth-error-translator';

export default function AuthPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [showEmailAuth, setShowEmailAuth] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AppRole>('student');
  const { signIn, signUp, resetPassword, isAuthenticated, isLoading, role, profile, isProfileComplete, selectOAuthRole, signInWithOAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle automatic role selection for OAuth users returning with an intent
    const handleReturningOAuthUser = async () => {
      if (isAuthenticated && !isProfileComplete && !isSubmitting) {
        const pendingRole = localStorage.getItem('pending_role') as AppRole | null;
        if (pendingRole === 'student') {
          // Automatic for students
          setIsSubmitting(true);
          try {
            const { error } = await selectOAuthRole('student');
            if (error) toast.error(error.message);
          } finally {
            setIsSubmitting(false);
            localStorage.removeItem('pending_role');
          }
        }
      }
    };

    handleReturningOAuthUser();
  }, [isAuthenticated, isProfileComplete, selectOAuthRole, isSubmitting]);

  useEffect(() => {
    // Regular redirection after auth and profile setup
    if (isAuthenticated && !isLoading && role !== null && isProfileComplete) {
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'teacher' && profile?.status === 'active') {
        navigate('/teacher/dashboard');
      } else if (role === 'teacher' && profile?.status === 'pending') {
        navigate('/pending-approval');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, isLoading, role, profile, isProfileComplete, navigate]);

  const handleSocialLogin = async (targetRole: AppRole) => {
    localStorage.setItem('pending_role', targetRole);
    const { error } = await signInWithOAuth('google');
    if (error) toast.error(translateAuthError(error));
  };

  const handleLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        toast.error(translateAuthError(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await signUp(data.email, data.password, data.fullName, data.phone || '', data.role);
      if (error) {
        toast.error(translateAuthError(error));
      } else {
        toast.success(data.role === 'teacher'
          ? 'Qeydiyyat uğurla tamamlandı! Təsdiq gözlənilir.'
          : 'Qeydiyyat uğurla tamamlandı!');
        setActiveTab('login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || (isAuthenticated && !isProfileComplete)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-medium animate-pulse">Giriş tamamlanır, zəhmət olmasa gözləyin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-background">
      {/* Left Decoration (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-primary items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-900 to-slate-950 opacity-95" />
        <div className="relative z-10 text-center text-white space-y-8 max-w-md">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-black tracking-tight leading-tight">
              Biliklərini <br /> <span className="text-amber-400">Zirvəyə Daşı!</span>
            </h1>
            <p className="text-primary-foreground/75 font-medium text-sm leading-relaxed">
              Dövlət Qulluğu, Konstitusiya və Fənn İmtahanlarına ən müasir interaktiv quiz platforması ilə hazırlaş.
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <Sparkles className="h-5 w-5 text-amber-300 mb-2" />
              <p className="font-bold text-sm">500+ Sınaq Sualı</p>
              <p className="text-[11px] text-white/60">Dəqiq izahlar və açarlar</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <UserCircle className="h-5 w-5 text-cyan-300 mb-2" />
              <p className="font-bold text-sm">Fərdi Analitika</p>
              <p className="text-[11px] text-white/60">Zəif mövzularını kəşf et</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-y-auto">
        <AnimatePresence mode="wait">
          {!showEmailAuth ? (
            <motion.div
              key="main-auth"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              className="w-full max-w-xl space-y-6"
            >
              {/* Top Role Selector Tabs */}
              <div className="text-center space-y-2 mb-2">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                  Quiz Portalına Xoş Gəldiniz
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground font-medium">
                  İştirak etmək üçün daxil olun və ya birbaşa koda qoşulun
                </p>
              </div>

              {/* ── Student / Teacher Segment Switcher ── */}
              <div className="flex p-1 bg-muted/60 rounded-xl sm:rounded-2xl border border-border/40 w-full">
                <button
                  onClick={() => setSelectedRole('student')}
                  className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    selectedRole === 'student'
                      ? 'bg-background text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <UserCircle className="h-4 w-4 shrink-0" />
                  <span>Şagird / Abituriyent</span>
                </button>
                <button
                  onClick={() => setSelectedRole('teacher')}
                  className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    selectedRole === 'teacher'
                      ? 'bg-background text-secondary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <GraduationCap className="h-4 w-4 shrink-0" />
                  <span>Müəllim</span>
                </button>
              </div>

              {/* ── Student View ── */}
              {selectedRole === 'student' && (
                <div className="space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-200 w-full min-w-0">
                  {/* Primary 1-Click Google Button */}
                  <Button
                    onClick={() => handleSocialLogin('student')}
                    className="w-full h-13 sm:h-15 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-black gap-3 shadow-lg hover:shadow-primary/25 transition-all active:scale-[0.98]"
                  >
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                    </svg>
                    Google ilə Şagird Girişi
                  </Button>

                  {/* Quick PIN Join Card Embedded */}
                  <QuickJoinPinCard variant="card" />

                  {/* Guest Play Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1 w-full">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/quizzes')}
                      className="w-full sm:flex-1 h-11 rounded-xl text-xs sm:text-sm font-bold gap-2 border-2 hover:bg-muted/50 justify-center"
                    >
                      <Compass className="h-4 w-4 text-primary shrink-0" />
                      Qonaq Kimi Sınaqlara Bax
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => setShowEmailAuth(true)}
                      className="w-full sm:flex-1 h-11 rounded-xl text-xs sm:text-sm font-bold text-muted-foreground hover:text-primary justify-center"
                    >
                      Email ilə Daxil Ol
                    </Button>
                  </div>
                </div>
              )}

              {/* ── Teacher View ── */}
              {selectedRole === 'teacher' && (
                <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                  <Card className="border-2 border-primary/20 rounded-3xl p-6 bg-card/60">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center mx-auto shadow-md">
                        <GraduationCap className="h-8 w-8" />
                      </div>
                      <h3 className="text-2xl font-black">Müəllim Portalı</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                        Quizlər yaradın, sual bazasını idarə edin və şagirdlərinizin nəticələrini izləyin.
                      </p>

                      <Button
                        variant="secondary"
                        onClick={() => handleSocialLogin('teacher')}
                        className="w-full h-14 rounded-2xl text-base font-black gap-3 shadow-md"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                        </svg>
                        Google ilə Müəllim Girişi
                      </Button>
                    </div>
                  </Card>

                  <div className="text-center">
                    <button
                      onClick={() => setShowEmailAuth(true)}
                      className="px-6 py-2.5 rounded-full text-muted-foreground font-bold hover:text-primary transition-all text-xs"
                    >
                      Və ya email və şifrə ilə daxil olun
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md space-y-6"
            >
              <button
                onClick={() => setShowEmailAuth(false)}
                className="flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-primary transition-all group p-2 rounded-lg hover:bg-muted"
              >
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                Geri qayıt
              </button>

              <div className="space-y-1">
                <h3 className="text-2xl sm:text-3xl font-black">Email ilə Daxil Ol</h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Hesabınız yoxdursa qeydiyyatdan keçin</p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/60 p-1 rounded-2xl h-12">
                  <TabsTrigger value="login" className="rounded-xl font-bold text-sm">Daxil ol</TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-xl font-bold text-sm">Qeydiyyat</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <LoginForm
                    onSubmit={handleLogin}
                    onForgotPassword={async (email) => { await resetPassword(email); }}
                    isSubmitting={isSubmitting}
                  />
                </TabsContent>
                <TabsContent value="signup">
                  <SignupForm onSubmit={handleSignup} isSubmitting={isSubmitting} />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
