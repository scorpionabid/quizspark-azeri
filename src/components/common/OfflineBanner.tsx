import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, CheckCircle2 } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function OfflineBanner() {
  const { isOnline, wasOffline } = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          key="offline"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="relative z-50 flex items-center justify-center gap-2 bg-destructive px-4 py-2 text-center text-xs sm:text-sm font-medium text-destructive-foreground shadow-md"
        >
          <WifiOff className="h-4 w-4 shrink-0 animate-bounce" />
          <span>İnternet bağlantısı kəsildi. Bəzi funksiyalar məhdudlaşa bilər.</span>
        </motion.div>
      )}

      {isOnline && wasOffline && (
        <motion.div
          key="restored"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="relative z-50 flex items-center justify-center gap-2 bg-green-600 px-4 py-2 text-center text-xs sm:text-sm font-medium text-white shadow-md"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>İnternet bağlantısı uğurla bərpa olundu.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
