import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, User, Loader2, Clock, Phone, ArrowRight, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { AppRole } from '@/types/auth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function OAuthRoleDialog() {
  const navigate = useNavigate();
  const { selectOAuthRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<AppRole | null>(null);
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!selectedRole) return;

    if (selectedRole === 'teacher' && !phone.trim()) {
      toast.error('Zəhmət olmasa təsdiq üçün mobil telefon nömrənizi daxil edin');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await selectOAuthRole(selectedRole, selectedRole === 'teacher' ? phone : undefined);
      if (error) {
        toast.error('Rol seçimi zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
      } else if (selectedRole === 'teacher') {
        toast.success('Müraciətiniz qeydə alındı! Admin təsdiqindən sonra hesabınız aktivləşəcək.', {
          duration: 6000,
        });
        navigate('/pending-approval');
      } else {
        toast.success('Xoş gəlmisiniz! Şagird profiliniz aktivləşdirildi.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open modal>
      <DialogContent
        className="sm:max-w-md border-2 border-primary/20 shadow-2xl rounded-2xl sm:rounded-3xl"
        // Prevent closing by clicking outside or pressing Escape
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center sm:text-left space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold w-fit mx-auto sm:mx-0">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Hesabın Quraşdırılması</span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-black text-foreground">
            Platformada rolunuzu seçin
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Şagird kimi dərhal testlərə başlaya, müəllim kimi isə öz quizlərinizi yarada bilərsiniz.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 py-2">
          <button
            type="button"
            onClick={() => setSelectedRole('student')}
            className={cn(
              'flex flex-col items-center justify-center rounded-2xl border-2 border-muted bg-popover p-4 sm:p-5 hover:bg-accent/50 cursor-pointer transition-all duration-200 text-center',
              selectedRole === 'student'
                ? 'border-primary bg-primary/5 ring-2 ring-primary shadow-sm'
                : 'hover:border-border'
            )}
          >
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-colors', selectedRole === 'student' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
              <User className="h-6 w-6" />
            </div>
            <span className={cn('text-sm font-black', selectedRole === 'student' ? 'text-primary' : 'text-foreground')}>
              Şagirdəm
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5">Dərhal testlərə başla</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('teacher')}
            className={cn(
              'flex flex-col items-center justify-center rounded-2xl border-2 border-muted bg-popover p-4 sm:p-5 hover:bg-accent/50 cursor-pointer transition-all duration-200 text-center',
              selectedRole === 'teacher'
                ? 'border-secondary bg-secondary/5 ring-2 ring-secondary shadow-sm'
                : 'hover:border-border'
            )}
          >
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-colors', selectedRole === 'teacher' ? 'bg-secondary/10 text-secondary' : 'bg-muted text-muted-foreground')}>
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className={cn('text-sm font-black', selectedRole === 'teacher' ? 'text-secondary' : 'text-foreground')}>
              Müəlliməm
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5">Quiz yarat və idarə et</span>
          </button>
        </div>

        {selectedRole === 'teacher' && (
          <div className="space-y-3 p-3.5 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-2 text-xs text-amber-800 dark:text-amber-200">
              <Clock className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Müəllim hesabları təhlükəsizlik məqsədilə admin tərəfindən təsdiqlənir.</span>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="teacher-dialog-phone" className="text-xs font-bold text-foreground flex items-center gap-1">
                <Phone className="h-3 w-3 text-primary" />
                <span>Mobil Telefon Nömrəniz:</span>
              </Label>
              <Input
                id="teacher-dialog-phone"
                placeholder="+994 50 000 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 text-sm font-semibold rounded-xl bg-background"
                autoFocus
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleConfirm}
          disabled={!selectedRole || isSubmitting}
          className="w-full h-11 sm:h-12 rounded-xl font-bold text-sm sm:text-base gap-2 shadow-md mt-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Gözləyin...
            </>
          ) : selectedRole === 'teacher' ? (
            <>
              Təsdiqə Göndər <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            'Davam et'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
