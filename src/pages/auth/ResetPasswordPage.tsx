import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PasswordField } from '@/components/auth/PasswordField';
import { toast } from 'sonner';
import { GraduationCap, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const resetSchema = z
  .object({
    password: z.string().min(6, 'Parol ən azı 6 simvol olmalıdır'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Parollar uyğun gəlmir',
    path: ['confirmPassword'],
  });

type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const form = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    // Supabase detects the recovery token from the URL hash automatically
    // and fires a PASSWORD_RECOVERY event on auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true);
        setIsChecking(false);
      }
    });

    // Give Supabase time to process the URL hash token
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 2000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async (data: ResetFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: data.password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Parol uğurla yeniləndi! Zəhmət olmasa daxil olun.');
        navigate('/auth');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isChecking) {
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
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative z-10 max-w-lg text-center text-white space-y-6">
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
          >
            <h1 className="text-4xl font-black tracking-tight">Parolunuzu <br /><span className="text-blue-200">Yeniləyin</span></h1>
            <p className="text-lg text-primary-foreground/80 font-medium mt-4">
              Yeni parol təyin edin və hesabınıza daxil olun.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background/50 backdrop-blur-sm p-4 sm:p-8 lg:p-12 relative">
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
            <h2 className="text-3xl font-bold tracking-tight">Yeni Parol</h2>
            <p className="text-muted-foreground">Hesabınız üçün güclü bir parol seçin</p>
          </div>

          {!isValidSession ? (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="h-8 w-8 text-destructive" />
              </div>
              <p className="text-muted-foreground">
                Keçərli sıfırlama linki tapılmadı. Zəhmət olmasa yenidən "Parolu unut" prosesini keçin.
              </p>
              <Button variant="outline" onClick={() => navigate('/auth')}>
                Giriş səhifəsinə qayıt
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <PasswordField field={field} label="Yeni Parol" autoComplete="new-password" />
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <PasswordField field={field} label="Parolu Təsdiqlə" autoComplete="new-password" />
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gözləyin...
                    </>
                  ) : (
                    'Parolu Yenilə'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate('/auth')}
                >
                  Giriş səhifəsinə qayıt
                </Button>
              </form>
            </Form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
