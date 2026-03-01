import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { GraduationCap, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginFormData, SignupFormData } from '@/lib/validations/auth';

export default function AuthPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { signIn, signUp, resetPassword, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

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
      } else {
        toast.success('Uğurla daxil oldunuz!');
        navigate('/');
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
        if (error.message.includes('User already registered')) {
          toast.error('Bu email artıq qeydiyyatdan keçib');
        } else {
          toast.error(error.message);
        }
      } else {
        const successMessage = data.role === 'teacher'
          ? 'Qeydiyyat uğurla tamamlandı! Hesabınız admin tərəfindən təsdiqləndikdən sonra aktivləşəcək.'
          : 'Qeydiyyat uğurla tamamlandı! Zəhmət olmasa emailinizi təsdiqləyin.';

        toast.success(successMessage, {
          duration: 6000,
        });
        setActiveTab('login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    if (!email) {
      toast.error('Zəhmət olmasa email ünvanınızı daxil edin');
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await resetPassword(email);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Şifrə sıfırlama linki emailinizə göndərildi');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side: Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-600 opacity-90" />

        {/* Decorative Circles */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 max-w-lg text-center text-white space-y-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 mb-4 shadow-2xl"
          >
            <GraduationCap className="h-12 w-12 text-white" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-5xl font-black tracking-tight leading-tight">
              Biliklərinizi <br />
              <span className="text-blue-200">Kəşf Edin</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 font-medium">
              Sınaq ilə hər gün yeni bir şey öyrənin, biliklərinizi yoxlayın və zirvəyə qalxın.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-2 gap-6 pt-8"
          >
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-left">
              <div className="text-2xl font-bold mb-1">1000+</div>
              <div className="text-sm text-primary-foreground/70">Aktiv Quiz</div>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-left">
              <div className="text-2xl font-bold mb-1">50k+</div>
              <div className="text-sm text-primary-foreground/70">İstifadəçi</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Auth Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background/50 backdrop-blur-sm p-4 sm:p-8 lg:p-12 relative">
        {/* Background blobs for mobile */}
        <div className="lg:hidden absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="lg:hidden absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="text-center lg:text-left mb-8 space-y-2">
            <div className="lg:hidden flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Xoş gəlmisiniz</h2>
            <p className="text-muted-foreground">İstifadəçi məlumatlarınızı daxil edərək davam edin</p>
          </div>

          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all py-2.5">
                    Daxil ol
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all py-2.5">
                    Qeydiyyat
                  </TabsTrigger>
                </TabsList>

                <div className="relative min-h-[400px]">
                  <AnimatePresence mode="wait">
                    {activeTab === 'login' ? (
                      <motion.div
                        key="login"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <LoginForm
                          onSubmit={handleLogin}
                          onForgotPassword={handleForgotPassword}
                          isSubmitting={isSubmitting}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="signup"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <SignupForm onSubmit={handleSignup} isSubmitting={isSubmitting} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Tabs>

              <div className="mt-8">
                <SocialAuth />
              </div>
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Davam etməklə siz bizim{' '}
            <a href="#" className="underline underline-offset-4 hover:text-primary transition-colors">İstifadəçi Şərtləri</a>{' '}
            və{' '}
            <a href="#" className="underline underline-offset-4 hover:text-primary transition-colors">Məxfilik Siyasətimiz</a>
            lə razılaşırsınız.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
