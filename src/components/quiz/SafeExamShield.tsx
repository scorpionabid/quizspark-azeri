import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Shield, AlertTriangle, Maximize2, Lock, EyeOff, XCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Quiz, getSafeExamConfig } from '@/hooks/useQuizzes';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { SafeExamWatermark } from './SafeExamWatermark';
import { cn } from '@/lib/utils';

interface SafeExamShieldProps {
  quiz: Quiz;
  attemptId?: string | null;
  currentPage: number;
  onFinalSubmit: () => void;
  children: React.ReactNode;
}

export const SafeExamShield: React.FC<SafeExamShieldProps> = ({
  quiz,
  attemptId,
  currentPage,
  onFinalSubmit,
  children,
}) => {
  const { user, profile } = useAuth();
  const config = getSafeExamConfig(quiz);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [hasAcknowledgedIntro, setHasAcknowledgedIntro] = useState(false);

  const violationCountRef = useRef(0);
  const isLockedOutRef = useRef(false);
  const onFinalSubmitRef = useRef(onFinalSubmit);

  useEffect(() => {
    onFinalSubmitRef.current = onFinalSubmit;
  }, [onFinalSubmit]);

  // 1. Fullscreen change listener
  useEffect(() => {
    if (!config.enabled) return;
    const handleFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
    };

    handleFullscreenChange();
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [config.enabled]);

  const requestFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
        setHasAcknowledgedIntro(true);
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
      // Fallback for devices that restrict requestFullscreen without user gesture
      setHasAcknowledgedIntro(true);
    }
  };

  // 2. Tab switch & window blur detection
  const handleViolation = useCallback(async (reason: string) => {
    if (isLockedOutRef.current) return;

    violationCountRef.current += 1;
    const count = violationCountRef.current;
    setViolationCount(count);
    setIsWindowBlurred(true);

    const maxLimit = config.max_violations ?? 3;

    // Log to audit_logs in Supabase
    if (user?.id) {
      try {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: 'safe_exam_violation',
          entity_type: 'quiz_attempt',
          entity_id: attemptId || null,
          description: `Safe Exam pozuntusu (${count}/${maxLimit > 0 ? maxLimit : 'Limitsiz'}): ${reason}`,
          new_values: {
            reason,
            violation_count: count,
            max_limit: maxLimit,
            current_page: currentPage + 1,
            timestamp: new Date().toISOString(),
          },
        });
      } catch (err) {
        console.warn('Could not record safe exam audit log:', err);
      }
    }

    // Check if violation limit exceeded
    if (maxLimit > 0 && count >= maxLimit) {
      isLockedOutRef.current = true;
      setIsLockedOut(true);
      setShowWarningModal(false);

      toast.error(`İmtahan qaydaları ${count} dəfə pozulduğu üçün imtahanınız yekunlaşdırılır!`, {
        duration: 8000,
      });

      // Automatically submit after a brief pause so user sees why it was submitted
      setTimeout(() => {
        onFinalSubmitRef.current();
      }, 3500);
    } else {
      setShowWarningModal(true);
    }
  }, [user?.id, attemptId, currentPage, config.max_violations]);

  useEffect(() => {
    if (!config.enabled) return;

    let blurTimeout: NodeJS.Timeout | null = null;

    const onVisibilityChange = () => {
      if (document.hidden) {
        void handleViolation('Pəncərə və ya tab dəyişdirildi');
      } else {
        // Returned to window
        if (!isLockedOutRef.current) {
          setShowWarningModal(true);
        }
      }
    };

    const onWindowBlur = () => {
      // Small debounce to avoid false triggers during browser prompt interactions
      blurTimeout = setTimeout(() => {
        if (!document.hasFocus() || document.hidden) {
          void handleViolation('İmtahan pəncərəsi fokusunu itirdi');
        }
      }, 150);
    };

    const onWindowFocus = () => {
      if (blurTimeout) clearTimeout(blurTimeout);
      if (config.blur_on_leave && !isLockedOutRef.current) {
        setIsWindowBlurred(false);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onWindowBlur);
    window.addEventListener('focus', onWindowFocus);

    return () => {
      if (blurTimeout) clearTimeout(blurTimeout);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onWindowBlur);
      window.removeEventListener('focus', onWindowFocus);
    };
  }, [config.enabled, handleViolation, config.blur_on_leave]);

  // 3. Prevent Copy, Cut, Paste, Right Click, PrintScreen, DevTools
  useEffect(() => {
    if (!config.enabled || !config.prevent_copy_paste) return;

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.warning('Sağ klik menyusu imtahan rejimində deaktivdir.', { duration: 2000 });
    };

    const onCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.warning('Sual mətnini kopyalamaq qadağandır.', { duration: 2500 });
    };

    const onCut = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    const onPaste = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // 1) PrintScreen
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault();
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('');
          }
        } catch {
          // Ignore
        }
        toast.error('Ekran şəkli (Screenshot) çəkmək qadağandır!', { duration: 3000 });
        void handleViolation('PrintScreen / Ekran şəkli cəhdi');
      }

      // 2) F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        toast.warning('Developer alətləri imtahan rejimində bloklanıb.', { duration: 2000 });
      }

      // 3) Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Inspect Element)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) {
        e.preventDefault();
        toast.warning('İnspekt alətləri imtahan rejimində bloklanıb.', { duration: 2000 });
      }

      // 4) Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
      }

      // 5) Ctrl+P (Print)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        toast.warning('Səhifəni çap etmək qadağandır.', { duration: 2000 });
      }
    };

    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('copy', onCopy);
    document.addEventListener('cut', onCut);
    document.addEventListener('paste', onPaste);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('cut', onCut);
      document.removeEventListener('paste', onPaste);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [config.enabled, config.prevent_copy_paste, handleViolation]);

  if (!config.enabled) {
    return <>{children}</>;
  }

  const maxLimit = config.max_violations ?? 3;
  const isEnforceFullscreen = Boolean(config.enforce_fullscreen);
  const showFullscreenBlock = isEnforceFullscreen && !isFullscreen && !isLockedOut;

  const candidateIdentifier = profile?.fin || profile?.utis_code || user?.email || undefined;
  const candidateName = profile?.full_name || user?.user_metadata?.full_name || undefined;

  return (
    <div className="relative w-full min-h-screen">
      {/* Print protection & text selection lock styles */}
      <style>{`
        @media print {
          body { display: none !important; }
        }
        .safe-exam-locked {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }
      `}</style>

      {/* Candidate Watermark overlay */}
      {config.watermark_enabled && (
        <SafeExamWatermark
          identifier={candidateIdentifier}
          fullName={candidateName}
        />
      )}

      {/* Main Question Area with Blur on leave */}
      <div
        className={cn(
          'transition-all duration-300 w-full min-h-screen',
          config.prevent_copy_paste && 'safe-exam-locked',
          (isWindowBlurred || showFullscreenBlock) && config.blur_on_leave && 'filter blur-2xl pointer-events-none select-none opacity-40'
        )}
      >
        {children}
      </div>

      {/* 1. Fullscreen Entry & Recovery Modal */}
      <Dialog open={showFullscreenBlock} onOpenChange={() => {}}>
        <DialogContent
          className={cn(
            "sm:max-w-lg p-6 sm:p-8 backdrop-blur-xl [&>button]:hidden shadow-2xl transition-all",
            hasAcknowledgedIntro
              ? "border-4 border-red-600 dark:border-red-500 bg-gradient-to-b from-red-50 via-card to-card dark:from-red-950/50 dark:via-card dark:to-card shadow-red-600/30"
              : "border-amber-300 dark:border-amber-800 bg-card/95"
          )}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="text-center space-y-4">
            <div className={cn(
              "w-20 h-20 rounded-3xl flex items-center justify-center mx-auto transition-transform",
              hasAcknowledgedIntro
                ? "bg-red-600/15 border-2 border-red-600/40 text-red-600 animate-pulse"
                : "bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400"
            )}>
              <Shield className="w-10 h-10 animate-pulse" />
            </div>
            <DialogTitle className={cn(
              "text-2xl font-black tracking-tight",
              hasAcknowledgedIntro ? "text-red-600 dark:text-red-400" : "text-foreground"
            )}>
              {hasAcknowledgedIntro ? '⚠️ TAM EKRAN REJİMİ TƏRK EDİLDİ!' : 'Təhlükəsiz İmtahan Rejimi (Safe Exam)'}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              {hasAcknowledgedIntro ? (
                <div className="space-y-3">
                  <p className="text-foreground font-medium">
                    İmtahan qaydalarına əsasən sualları görmək üçün səhifə mütləq <strong className="text-red-600 dark:text-red-400 font-bold">Tam Ekran</strong> rejimində olmalıdır.
                  </p>
                  <div className="p-3 rounded-xl bg-red-600/10 border border-red-600/20 text-xs text-red-700 dark:text-red-300 font-semibold">
                    Ekrandan kənara çıxış və pəncərəni bağlamaq cəhdləri sistem tərəfindən qeydə alınır.
                  </div>
                </div>
              ) : (
                <>
                  Bu imtahan Təhlükəsiz İmtahan Qaydaları (Anti-cheat) ilə qorunur:
                  <ul className="text-left text-xs space-y-1.5 mt-3 p-3 rounded-xl bg-muted/50 border">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>İmtahan yalnız Tam Ekran rejimində verilir</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Ekran şəkli çəkmək və pəncərəni tərk etmək qadağandır</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Kopyalama və sağ klik menyusu məhdudlaşdırılıb</span>
                    </li>
                  </ul>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-5 sm:justify-center">
            <Button
              type="button"
              size="lg"
              onClick={requestFullscreen}
              className={cn(
                "w-full h-13 rounded-2xl font-black text-base shadow-xl text-white",
                hasAcknowledgedIntro
                  ? "bg-red-600 hover:bg-red-700 shadow-red-600/30"
                  : "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
              )}
            >
              <Maximize2 className="w-5 h-5 mr-2" />
              <span>{hasAcknowledgedIntro ? 'Dərhal Tam Ekrana Qayıt' : 'Tam Ekrana Keç və Başla'}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Violation Warning Modal (When candidate returns from tab/window switch) */}
      <Dialog open={showWarningModal && !showFullscreenBlock && !isLockedOut} onOpenChange={setShowWarningModal}>
        <DialogContent
          className="sm:max-w-xl md:max-w-2xl border-4 border-red-600 dark:border-red-500 bg-gradient-to-b from-red-50 via-card to-card dark:from-red-950/60 dark:via-card dark:to-card p-6 sm:p-8 shadow-2xl shadow-red-600/30 [&>button]:hidden"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="text-center space-y-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-red-600/15 border-2 border-red-600/40 flex items-center justify-center mx-auto text-red-600 shadow-inner animate-pulse">
              <AlertTriangle className="w-14 h-14 sm:w-16 sm:h-16 text-red-600" />
            </div>

            <DialogTitle className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400 tracking-tight">
              ⚠️ DİQQƏT: QAYDA POZUNTUSU QEYDƏ ALINDI!
            </DialogTitle>

            <DialogDescription asChild>
              <div className="space-y-4 text-sm text-foreground">
                <p className="text-base sm:text-lg font-semibold text-foreground/90">
                  İmtahan pəncərəsini və ya tabı tərk etdiniz.
                </p>

                {/* Big Red Warning Counter Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-red-600 text-white shadow-xl shadow-red-600/30 text-center">
                  <div className="text-xs uppercase tracking-widest text-red-100 font-bold mb-1">
                    Cari Pozuntu Göstəricisi
                  </div>
                  <div className="text-2xl sm:text-3xl font-black tracking-wide">
                    XƏBƏRDARLIQ: {violationCount} {maxLimit > 0 ? `/ ${maxLimit}` : ''}
                  </div>
                </div>

                {maxLimit > 0 ? (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-900 dark:text-red-200 text-xs sm:text-sm leading-relaxed text-center font-medium">
                    ⚠️ Qeyd: <strong className="text-red-600 dark:text-red-400 font-extrabold">{maxLimit} xəbərdarlıq həddinə çatdıqda</strong> imtahanınız avtomatik dayandırılacaq və nəticəniz yekunlaşacaqdır!
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center">
                    Bu pozuntu audit jurnalında qeydə alındı və imtahan nəzarətçisinə təqdim olunacaq.
                  </p>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 sm:justify-center">
            <Button
              type="button"
              size="lg"
              className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-base sm:text-lg shadow-xl shadow-red-600/30 transition-all hover:scale-[1.01]"
              onClick={() => {
                setShowWarningModal(false);
                setIsWindowBlurred(false);
              }}
            >
              <span>Qaydaları Başa Düşdüm, İmtahana Qayıt</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Final Lockdown Modal (When violation limit is reached) */}
      <Dialog open={isLockedOut} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-md border-destructive bg-destructive/5 dark:bg-destructive/10 backdrop-blur-2xl shadow-2xl [&>button]:hidden"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-destructive flex items-center justify-center mx-auto text-destructive-foreground shadow-lg shadow-destructive/30">
              <XCircle className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-black text-destructive">
              İmtahan Dayandırıldı!
            </DialogTitle>
            <DialogDescription className="text-sm text-foreground leading-relaxed">
              İcazə verilən maksimum <strong className="font-bold text-destructive">{maxLimit} xəbərdarlıq həddi aşıldığı</strong> üçün imtahanınız avtomatik dayandırıldı.
              <div className="mt-3 p-3 rounded-xl bg-background/80 border text-xs text-muted-foreground text-center font-mono">
                Cavablarınız qeydə alındı və nəticələr nəzarətçiyə göndərilir...
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 sm:justify-center">
            <Button
              type="button"
              size="lg"
              variant="outline"
              disabled
              className="w-full h-11 rounded-xl font-bold"
            >
              <Lock className="w-4 h-4 mr-2" />
              <span>Nəticələr Hesablanır...</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
