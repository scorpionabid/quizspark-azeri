import { useState } from 'react';
import { GraduationCap, User, Loader2, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { AppRole } from '@/types/auth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function OAuthRoleDialog() {
  const { selectOAuthRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<AppRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!selectedRole) return;
    setIsSubmitting(true);
    const { error } = await selectOAuthRole(selectedRole);
    setIsSubmitting(false);
    if (error) {
      toast.error('Rol seçimi zamanı xəta baş verdi. Yenidən cəhd edin.');
    } else if (selectedRole === 'teacher') {
      toast.success('Müraciətiniz qeydə alındı! Admin təsdiqindən sonra hesabınız aktivləşəcək.', {
        duration: 6000,
      });
    } else {
      toast.success('Xoş gəlmisiniz!');
    }
  };

  return (
    <Dialog open modal>
      <DialogContent
        className="sm:max-w-md"
        // Prevent closing by clicking outside or pressing Escape
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Mən ...</DialogTitle>
          <DialogDescription>
            Platformada rolunuzu seçin. Bu seçim hesabınızın funksiyalarını müəyyən edər.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <button
            type="button"
            onClick={() => setSelectedRole('student')}
            className={cn(
              'flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-200',
              selectedRole === 'student' && 'border-primary bg-primary/5 ring-1 ring-primary'
            )}
          >
            <User className={cn('mb-3 h-8 w-8', selectedRole === 'student' ? 'text-primary' : 'text-muted-foreground')} />
            <span className={cn('text-sm font-semibold', selectedRole === 'student' ? 'text-primary' : 'text-muted-foreground')}>
              Şagirdəm
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('teacher')}
            className={cn(
              'flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-200',
              selectedRole === 'teacher' && 'border-primary bg-primary/5 ring-1 ring-primary'
            )}
          >
            <GraduationCap className={cn('mb-3 h-8 w-8', selectedRole === 'teacher' ? 'text-primary' : 'text-muted-foreground')} />
            <span className={cn('text-sm font-semibold', selectedRole === 'teacher' ? 'text-primary' : 'text-muted-foreground')}>
              Müəlliməm
            </span>
          </button>
        </div>

        {selectedRole === 'teacher' && (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-sm text-amber-800 dark:text-amber-200">
            <Clock className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Müəllim hesabları admin tərəfindən təsdiqlənməlidir. Təsdiqə qədər giriş məhdudlaşdırılacaq.</span>
          </div>
        )}

        <Button
          onClick={handleConfirm}
          disabled={!selectedRole || isSubmitting}
          className="w-full mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gözləyin...
            </>
          ) : (
            'Davam et'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
