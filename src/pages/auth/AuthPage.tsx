import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { RoleSelection } from '@/components/auth/RoleSelection';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { GraduationCap, Loader2, ArrowLeft, UserCircle, CheckCircle2, ArrowRight, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginFormData, SignupFormData } from '@/lib/validations/auth';
import { AppRole } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AuthPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [showEmailAuth, setShowEmailAuth] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phone, setPhone] = useState('');
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
        } else if (pendingRole === 'teacher') {
          // Show phone modal for teachers
          setShowPhoneModal(true);
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

  const handleSocialLogin = async (selectedRole: AppRole) => {
    localStorage.setItem('pending_role', selectedRole);
    const { error } = await signInWithOAuth('google');
    if (error) toast.error(error.message);
  };

  const handleLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email və ya parol yanlışdır');
        } else {
          toast.error(error.message);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await signUp(data.email, data.password, data.fullName, data.phone, data.role);
      if (error) {
        toast.error(error.message);
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

  const handleTeacherPhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast.error('Zəhmət olmasa telefon nömrənizi daxil edin');
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await selectOAuthRole('teacher', phone);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Profiliniz təsdiqə göndərildi!');
        localStorage.removeItem('pending_role');
        setShowPhoneModal(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || (isAuthenticated && !isProfileComplete && isSubmitting && !showPhoneModal)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-medium animate-pulse">Giriş tamamlanır, zəhmət olmasa gözləyin...</p>
        </div>
      </div>
    );
  }

  // If user is returning as teacher, show phone modal
  if (isAuthenticated && !isProfileComplete && showPhoneModal) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-10 space-y-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black">Müəllim Hesabı</h3>
                <p className="text-muted-foreground font-medium">
                  Təsdiq üçün zəhmət olmasa mobil nömrənizi daxil edin. Admin sizinlə əlaqə saxlayacaq.
                </p>
              </div>

              <form onSubmit={handleTeacherPhoneSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-bold ml-1">Telefon Nömrəsi</Label>
                  <Input
                    id="phone"
                    placeholder="+994 50 000 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-14 rounded-2xl text-lg font-medium border-2 focus:border-primary transition-all px-6"
                    disabled={isSubmitting}
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>Təsdiqə Göndər <ArrowRight className="ml-2 h-5 w-5" /></>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // If user is logged in via OAuth but somehow lost the intent, show role selection as backup
  if (isAuthenticated && !isProfileComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <RoleSelection
            onSelect={async (r) => {
              setIsSubmitting(true);
              try {
                await selectOAuthRole(r);
              } finally {
                setIsSubmitting(false);
              }
            }}
            isSubmitting={isSubmitting}
          />
        </motion.div>
      </div>
    );
  }

  const roleChoices = [
    {
      id: 'teacher' as AppRole,
      title: 'Müəllim',
      description: 'Quizlər yaratmaq və şagirdləri idarə etmək üçün.',
      icon: GraduationCap,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      id: 'student' as AppRole,
      title: 'Şagird',
      description: 'Quizlərdə iştirak etmək və nəticələri görmək üçün.',
      icon: UserCircle,
      color: 'from-blue-500 to-cyan-600',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-background">
      {/* Left Decoration (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/3 relative bg-primary items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-indigo-900 opacity-95" />
        <div className="relative z-10 text-center text-white space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 mb-4">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter leading-tight">
            Biliklərinizi <br /> <span className="text-blue-200">Kəşf Edin</span>
          </h1>
          <p className="text-primary-foreground/60 font-medium">
            Azərbaycanın ən innovativ quiz platformasına xoş gəlmisiniz.
          </p>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
        <AnimatePresence mode="wait">
          {!showEmailAuth ? (
            <motion.div
              key="roles"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full max-w-4xl space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl lg:text-5xl font-black tracking-tight">Kimi daxil olmaq istəyirsiniz?</h2>
                <p className="text-xl text-muted-foreground font-medium">Böyük bir öyrənmə macərasına başlamaq üçün profilinizi seçin</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-stretch">
                {/* Student Card - More Prominent */}
                <motion.div
                  whileHover={{ y: -8 }}
                  className="md:col-span-3 group"
                >
                  <Card className="h-full border-[3px] border-primary/10 hover:border-primary/40 transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-primary/10 bg-gradient-to-br from-card to-blue-50/20 backdrop-blur-sm relative">
                    <div className="absolute top-4 right-4 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Ən çox seçilən</div>
                    <CardContent className="p-10 flex flex-col h-full text-center">
                      <div className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${roleChoices[1].color} text-white flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                        <UserCircle className="h-12 w-12" />
                      </div>
                      <h3 className="text-3xl font-black mb-4">Şagird Olarak Başla</h3>
                      <p className="text-xl text-muted-foreground font-medium mb-12 flex-grow max-w-sm mx-auto">
                        Quizlərdə iştirak et, biliklərini yoxla və dostlarınla rəqabət apar.
                      </p>

                      <Button
                        onClick={() => handleSocialLogin('student')}
                        className="w-full h-16 rounded-2xl text-xl font-black gap-4 shadow-xl hover:shadow-primary/30 transition-all active:scale-95"
                      >
                        <svg className="h-7 w-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                        </svg>
                        Google ilə Şagird Girişi
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Teacher Card - Less Prominent but Premium */}
                <motion.div
                  whileHover={{ y: -8 }}
                  className="md:col-span-2 group"
                >
                  <Card className="h-full border-2 border-transparent hover:border-primary/20 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-xl bg-card/40 backdrop-blur-sm">
                    <CardContent className="p-8 flex flex-col h-full text-center">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${roleChoices[0].color} text-white flex items-center justify-center mx-auto mb-6 shadow-md opacity-80 group-hover:opacity-100 transition-all`}>
                        <GraduationCap className="h-8 w-8" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Müəllim</h3>
                      <p className="text-muted-foreground font-medium mb-10 flex-grow text-sm">
                        Quizlər yarat, şagirdlərin nəticələrini izlə.
                      </p>

                      <Button
                        variant="secondary"
                        onClick={() => handleSocialLogin('teacher')}
                        className="w-full h-14 rounded-2xl text-base font-bold gap-3 shadow-md hover:bg-secondary/80 transition-all"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                        </svg>
                        Müəllim Girişi
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowEmailAuth(true)}
                  className="px-8 py-3 rounded-full text-muted-foreground font-bold hover:text-primary hover:bg-primary/5 transition-all text-sm"
                >
                  Və ya email/şifrə ilə daxil olun
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-sm space-y-8"
            >
              <button
                onClick={() => setShowEmailAuth(false)}
                className="flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-primary transition-all group p-2 rounded-lg hover:bg-muted"
              >
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                Geri qayıt
              </button>

              <div className="space-y-2">
                <h3 className="text-3xl font-black">Məlumatları daxil edin</h3>
                <p className="text-muted-foreground font-medium italic">Hesabınız yoxdursa qeydiyyatdan keçin</p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-2xl h-14">
                  <TabsTrigger value="login" className="rounded-xl font-black text-base data-[state=active]:bg-background shadow-none">Daxil ol</TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-xl font-black text-base data-[state=active]:bg-background shadow-none">Qeydiyyat</TabsTrigger>
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
