import React from 'react';
import { useLanguage, SUPPORTED_LANGUAGES } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'compact' | 'full' | 'dropdown';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className,
  variant = 'compact',
}) => {
  const { language, setLanguage } = useLanguage();
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-9 px-2.5 gap-1.5 font-bold text-xs text-muted-foreground hover:text-foreground rounded-xl",
              className
            )}
            title="Dili dəyiş / Change language"
          >
            <Globe className="h-4 w-4" />
            <span className="font-semibold">{currentLang.label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 rounded-xl p-1.5 shadow-lg">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={cn(
                  "flex items-center justify-between px-2.5 py-2 text-xs rounded-lg font-medium cursor-pointer transition-colors",
                  isSelected
                    ? "bg-primary/10 text-primary font-bold"
                    : "hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  <span>{lang.nativeLabel}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center p-1 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 shadow-sm backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-center gap-1.5 px-1.5 py-0.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <Globe className="w-3.5 h-3.5" />
        {variant === 'full' && (
          <span className="hidden md:inline text-[11px] font-semibold">Dil / Language:</span>
        )}
      </div>

      <div className="flex items-center gap-0.5">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              title={lang.nativeLabel}
              className={cn(
                "px-2 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1",
                isActive
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
              )}
            >
              <span>{lang.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
