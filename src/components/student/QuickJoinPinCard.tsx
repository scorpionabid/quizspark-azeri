import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Sparkles, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface QuickJoinPinCardProps {
  className?: string;
  variant?: 'card' | 'compact' | 'hero';
}

export const QuickJoinPinCard: React.FC<QuickJoinPinCardProps> = ({
  className,
  variant = 'card',
}) => {
  const navigate = useNavigate();
  const [pinCode, setPinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleJoin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPin = pinCode.trim().replace(/\s+/g, '');

    if (!cleanPin) {
      setErrorMsg('Zəhmət olmasa PIN kodu və ya linki daxil edin');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      // 1. If user pasted a full URL like /quiz/UUID or https://.../quiz/UUID
      const urlMatch = cleanPin.match(/quiz\/([a-zA-Z0-9-]+)/i);
      const targetId = urlMatch ? urlMatch[1] : cleanPin;

      // 2. Exact UUID match check
      const isFullUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);

      if (isFullUUID) {
        const { data: quiz } = await supabase
          .from('quizzes')
          .select('id, title, is_published')
          .eq('id', targetId)
          .maybeSingle();

        if (quiz && (quiz.is_published || quiz.is_published === null)) {
          toast.success(`"${quiz.title}" imtahanına qoşulursunuz!`);
          navigate(`/quiz/${quiz.id}`);
          return;
        }
      }

      // 3. Search by ID prefix (e.g. 6-8 hex character PIN) or search query
      const { data: matchedQuizzes } = await supabase
        .from('quizzes')
        .select('id, title, is_published')
        .limit(25);

      if (matchedQuizzes && matchedQuizzes.length > 0) {
        // Find matching quiz by ID starting with the PIN (case-insensitive)
        const found = matchedQuizzes.find(
          (q) =>
            q.id.toLowerCase().startsWith(targetId.toLowerCase()) ||
            q.id.replace(/-/g, '').toLowerCase().startsWith(targetId.toLowerCase())
        );

        if (found) {
          toast.success(`"${found.title}" imtahanına qoşulursunuz!`);
          navigate(`/quiz/${found.id}`);
          return;
        }
      }

      setErrorMsg('Bu kod ilə aktiv quiz tapılmadı. Kodu yenidən yoxlayın.');
      toast.error('Quiz tapılmadı');
    } catch (err) {
      console.error('Join quiz error:', err);
      setErrorMsg('Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleJoin} className={cn('flex items-center gap-2 w-full min-w-0', className)}>
        <div className="relative flex-1 min-w-0">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary shrink-0 pointer-events-none" />
          <Input
            value={pinCode}
            onChange={(e) => {
              setPinCode(e.target.value.toUpperCase());
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder="PIN KOD (məs: A7F39B)"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            className="pl-9 pr-3 h-11 font-mono font-bold uppercase tracking-wider text-xs sm:text-sm rounded-xl border-2 border-primary/30 bg-background text-foreground placeholder:text-muted-foreground/60 w-full"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="h-11 px-4 sm:px-5 rounded-xl font-bold gap-1.5 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
          <span>Qoşul</span>
        </Button>
      </form>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-primary/20 p-4 sm:p-6 lg:p-7 shadow-md w-full min-w-0',
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 w-full min-w-0">
        <div className="space-y-1.5 text-center md:text-left flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-black uppercase tracking-wider">
            <Sparkles className="h-3 w-3 shrink-0" />
            <span>Sürətli İmtahana Giriş</span>
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-foreground break-words leading-tight">
            Müəllimin verdiyi <span className="text-primary italic">PIN Kod</span> var?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
            Kodu daxil et və birbaşa sınaq imtahanına başla.
          </p>
        </div>

        <form onSubmit={handleJoin} className="w-full md:w-[320px] lg:w-[360px] shrink-0 space-y-2 min-w-0">
          <div className="flex items-center gap-2 w-full min-w-0">
            <div className="relative flex-1 min-w-0">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary shrink-0 pointer-events-none" />
              <Input
                value={pinCode}
                onChange={(e) => {
                  setPinCode(e.target.value.toUpperCase());
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="PIN KODU DAXİL ET"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                className="h-11 sm:h-12 pl-10 pr-3 rounded-xl font-mono text-sm sm:text-base font-black tracking-wider uppercase border-2 border-primary/30 focus:border-primary bg-background text-foreground placeholder:text-muted-foreground/60 w-full shadow-inner"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 sm:h-12 px-4 sm:px-6 rounded-xl text-sm sm:text-base font-black shadow-md gap-1.5 sm:gap-2 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current shrink-0" />
                  <span>Başla</span>
                </>
              )}
            </Button>
          </div>

          {errorMsg && (
            <p className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium pl-1 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {errorMsg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
