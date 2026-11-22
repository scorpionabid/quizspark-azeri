import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export function PWAInstallBanner() {
  const { canInstall, isIOS, isNativePromptReady, installApp, dismissPrompt } = usePWAInstall();
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  if (!canInstall) return null;

  const handleInstall = async () => {
    if (isNativePromptReady) {
      setIsInstalling(true);
      await installApp();
      setIsInstalling(false);
    } else if (isIOS) {
      setShowIosGuide(true);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="relative z-30 border-b border-primary/20 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 px-4 py-3 shadow-sm backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Sınaq Tətbiqini Telefona Quraşdırın
              </p>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Daha sürətli giriş, rahat istifadə və xüsusi bildirişlər üçün tətbiqi əsas ekrana əlavə edin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isNativePromptReady ? (
              <Button
                size="sm"
                onClick={handleInstall}
                disabled={isInstalling}
                className="h-8 gap-1.5 rounded-lg font-medium shadow-sm"
              >
                <Download className="h-4 w-4" />
                <span>Quraşdır</span>
              </Button>
            ) : isIOS ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowIosGuide(!showIosGuide)}
                className="h-8 gap-1.5 rounded-lg border-primary/30 text-primary hover:bg-primary/10"
              >
                <Share className="h-3.5 w-3.5" />
                <span>Necə quraşdırılır?</span>
              </Button>
            ) : null}

            <Button
              variant="ghost"
              size="icon"
              onClick={dismissPrompt}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Bağla"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* iOS Step Guide */}
        {showIosGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 rounded-xl border border-border/60 bg-card/80 p-3 text-xs text-foreground/90 backdrop-blur-md"
          >
            <p className="font-semibold text-primary mb-1">iPhone və iPad üçün təlimat:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Safari brauzerinin altındakı <span className="font-medium text-foreground">Paylaş (Share <Share className="inline h-3 w-3" />)</span> düyməsinə toxunun.</li>
              <li>Aşağı sürüşdürün və <span className="font-medium text-foreground">&quot;Əsas Ekrana Əlavə Et&quot; (Add to Home Screen)</span> seçimini vurun.</li>
              <li>Yuxarı sağdakı <span className="font-medium text-foreground">&quot;Əlavə et&quot; (Add)</span> düyməsini təsdiqləyin.</li>
            </ol>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
