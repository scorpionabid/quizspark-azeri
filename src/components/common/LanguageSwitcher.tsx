import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className,
  variant = 'compact',
}) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={cn("inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm", className)}>
      <div className="flex items-center gap-1.5 px-2 py-0.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <Globe className="w-3.5 h-3.5" />
        {variant === 'full' && (
          <span className="hidden sm:inline">Dil / ენა:</span>
        )}
      </div>

      <button
        type="button"
        onClick={() => setLanguage('az')}
        className={cn(
          "px-2.5 py-1 text-xs font-bold rounded-lg transition-all",
          language === 'az'
            ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        )}
      >
        AZ
      </button>

      <button
        type="button"
        onClick={() => setLanguage('ka')}
        className={cn(
          "px-2.5 py-1 text-xs font-bold rounded-lg transition-all",
          language === 'ka'
            ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        )}
      >
        ქარ
      </button>
    </div>
  );
};
