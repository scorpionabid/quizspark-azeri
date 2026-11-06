import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Delete, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function safeEvaluateMath(expr: string): number | null {
  try {
    const normalized = expr
      .replace(/,/g, '.')
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/\s+/g, '');

    if (!normalized) return null;
    // Allow only digits, operators, decimal point, and parentheses
    if (!/^[0-9+\-*/().]+$/.test(normalized)) return null;

    // Prevent invalid consecutive operators
    if (/[*/]{2,}/.test(normalized)) return null;

    const fn = new Function(`"use strict"; return (${normalized});`);
    const result = fn();
    if (typeof result !== 'number' || !Number.isFinite(result)) {
      return null;
    }
    return Math.round(result * 1e10) / 1e10;
  } catch {
    return null;
  }
}

function formatDisplayNumber(val: string): string {
  return val.replace(/\./g, ',');
}

export const ExamCalculator: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [justEvaluated, setJustEvaluated] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setJustEvaluated(false);
  }, []);

  const handleBackspace = useCallback(() => {
    if (justEvaluated) {
      setExpression('');
      setJustEvaluated(false);
      return;
    }
    setDisplay(prev => {
      if (prev.length <= 1 || prev === '-0' || prev === 'Xəta') return '0';
      const next = prev.slice(0, -1);
      return next === '-' ? '0' : next;
    });
  }, [justEvaluated]);

  const handleDigit = useCallback(
    (digit: string) => {
      if (justEvaluated) {
        setDisplay(digit);
        setExpression('');
        setJustEvaluated(false);
        return;
      }
      setDisplay(prev => {
        if (prev === '0' || prev === 'Xəta') return digit;
        if (prev.length >= 16) return prev;
        return prev + digit;
      });
    },
    [justEvaluated],
  );

  const handleDecimal = useCallback(() => {
    if (justEvaluated) {
      setDisplay('0.');
      setExpression('');
      setJustEvaluated(false);
      return;
    }
    setDisplay(prev => {
      if (prev === 'Xəta') return '0.';
      // Check the last number token
      const parts = prev.split(/[+\-×÷()]/);
      const lastPart = parts[parts.length - 1] || '';
      if (lastPart.includes('.')) return prev;
      return prev + '.';
    });
  }, [justEvaluated]);

  const handleOperator = useCallback(
    (op: string) => {
      setJustEvaluated(false);
      setDisplay(prev => {
        if (prev === 'Xəta') return '0';
        const trimmed = prev.trim();
        if (/[+\-×÷]$/.test(trimmed)) {
          return trimmed.slice(0, -1) + op;
        }
        return trimmed + op;
      });
    },
    [],
  );

  const handleParen = useCallback(
    (p: '(' | ')') => {
      if (justEvaluated && p === '(') {
        setDisplay('(');
        setExpression('');
        setJustEvaluated(false);
        return;
      }
      setJustEvaluated(false);
      setDisplay(prev => {
        if (prev === '0' || prev === 'Xəta') return p === '(' ? '(' : '0';
        // If user types '(' right after a digit, insert '×('
        if (p === '(' && /\d$/.test(prev)) {
          return prev + '×(';
        }
        return prev + p;
      });
    },
    [justEvaluated],
  );

  const handleEquals = useCallback(() => {
    if (display === 'Xəta') return;
    // Auto-close unclosed parentheses
    const openCount = (display.match(/\(/g) || []).length;
    const closeCount = (display.match(/\)/g) || []).length;
    const balanced =
      openCount > closeCount
        ? display + ')'.repeat(openCount - closeCount)
        : display;

    const res = safeEvaluateMath(balanced);
    if (res === null) {
      setExpression(formatDisplayNumber(balanced) + ' =');
      setDisplay('Xəta');
      setJustEvaluated(true);
      return;
    }
    setExpression(formatDisplayNumber(balanced) + ' =');
    setDisplay(String(res));
    setJustEvaluated(true);
  }, [display]);

  const handleUnary = useCallback(
    (type: 'sqrt' | 'sq' | 'neg' | 'pct') => {
      const val = safeEvaluateMath(display);
      if (val === null) return;
      let nextVal: number | null = null;
      let label = '';

      if (type === 'sqrt') {
        if (val < 0) {
          setDisplay('Xəta');
          setJustEvaluated(true);
          return;
        }
        nextVal = Math.round(Math.sqrt(val) * 1e10) / 1e10;
        label = `√(${formatDisplayNumber(String(val))}) =`;
      } else if (type === 'sq') {
        nextVal = Math.round(val * val * 1e10) / 1e10;
        label = `(${formatDisplayNumber(String(val))})² =`;
      } else if (type === 'neg') {
        nextVal = -val;
        label = '';
      } else if (type === 'pct') {
        nextVal = Math.round((val / 100) * 1e10) / 1e10;
        label = `${formatDisplayNumber(String(val))}% =`;
      }

      if (nextVal !== null) {
        if (label) setExpression(label);
        setDisplay(String(nextVal));
        setJustEvaluated(type !== 'neg');
      }
    },
    [display],
  );

  const handleCopyResult = useCallback(() => {
    if (display === 'Xəta') return;
    const formatted = formatDisplayNumber(display);
    navigator.clipboard?.writeText(formatted);
    setCopied(true);
    toast.success(`Cavab kopyalandı: ${formatted}`);
    setTimeout(() => setCopied(false), 1800);
  }, [display]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Stop propagation so QuizPlaying shortcuts (1-5, A-E, ArrowLeft/Right) don't fire
    e.stopPropagation();

    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault();
      handleDigit(e.key);
    } else if (e.key === '.' || e.key === ',') {
      e.preventDefault();
      handleDecimal();
    } else if (e.key === '+') {
      e.preventDefault();
      handleOperator('+');
    } else if (e.key === '-') {
      e.preventDefault();
      handleOperator('−');
    } else if (e.key === '*') {
      e.preventDefault();
      handleOperator('×');
    } else if (e.key === '/') {
      e.preventDefault();
      handleOperator('÷');
    } else if (e.key === '(' || e.key === ')') {
      e.preventDefault();
      handleParen(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      handleEquals();
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      handleBackspace();
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
      e.preventDefault();
      handleClear();
    }
  };

  return (
    <div
      data-exam-tools="true"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="space-y-2.5 outline-none select-none"
    >
      {/* Calculator Screen */}
      <div className="rounded-xl bg-muted/60 dark:bg-slate-900/90 border border-border/70 p-2.5 text-right shadow-inner">
        <div className="min-h-[16px] text-[11px] font-mono text-muted-foreground truncate">
          {expression || '\u00A0'}
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <button
            type="button"
            onClick={handleCopyResult}
            title="Nəticəni kopyala"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-background/80 hover:bg-primary/10 text-muted-foreground hover:text-primary border border-border/50 text-[10px] font-medium transition-colors shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Kopyala</span>
              </>
            )}
          </button>
          <div className="text-lg font-mono font-bold tracking-tight text-foreground truncate">
            {formatDisplayNumber(display)}
          </div>
        </div>
      </div>

      {/* Scientific / Helper Row */}
      <div className="grid grid-cols-5 gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleParen('(')}
          className="h-7 text-xs font-mono px-0 rounded-lg bg-muted/30"
        >
          (
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleParen(')')}
          className="h-7 text-xs font-mono px-0 rounded-lg bg-muted/30"
        >
          )
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleUnary('sq')}
          className="h-7 text-xs font-mono px-0 rounded-lg bg-muted/30"
          title="Kvadrat (x²)"
        >
          x²
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleUnary('sqrt')}
          className="h-7 text-xs font-mono px-0 rounded-lg bg-muted/30"
          title="Kvadrat kök (√x)"
        >
          √x
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleUnary('pct')}
          className="h-7 text-xs font-mono px-0 rounded-lg bg-muted/30"
          title="Faiz (%)"
        >
          %
        </Button>
      </div>

      {/* Main Keypad */}
      <div className="grid grid-cols-4 gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="h-8 text-xs font-bold rounded-lg text-destructive hover:text-destructive bg-destructive/5 border-destructive/20"
          title="Təmizlə (C)"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          C
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleUnary('neg')}
          className="h-8 text-xs font-mono font-semibold rounded-lg"
          title="İşarəni dəyiş (±)"
        >
          ±
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleBackspace}
          className="h-8 text-xs rounded-lg"
          title="Son rəqəmi sil"
        >
          <Delete className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleOperator('÷')}
          className="h-8 text-sm font-mono font-bold rounded-lg text-primary bg-primary/10 hover:bg-primary/20"
        >
          ÷
        </Button>

        {['7', '8', '9'].map(d => (
          <Button
            key={d}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDigit(d)}
            className="h-8 text-sm font-mono font-semibold rounded-lg bg-background hover:bg-muted"
          >
            {d}
          </Button>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleOperator('×')}
          className="h-8 text-sm font-mono font-bold rounded-lg text-primary bg-primary/10 hover:bg-primary/20"
        >
          ×
        </Button>

        {['4', '5', '6'].map(d => (
          <Button
            key={d}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDigit(d)}
            className="h-8 text-sm font-mono font-semibold rounded-lg bg-background hover:bg-muted"
          >
            {d}
          </Button>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleOperator('−')}
          className="h-8 text-sm font-mono font-bold rounded-lg text-primary bg-primary/10 hover:bg-primary/20"
        >
          −
        </Button>

        {['1', '2', '3'].map(d => (
          <Button
            key={d}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDigit(d)}
            className="h-8 text-sm font-mono font-semibold rounded-lg bg-background hover:bg-muted"
          >
            {d}
          </Button>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleOperator('+')}
          className="h-8 text-sm font-mono font-bold rounded-lg text-primary bg-primary/10 hover:bg-primary/20"
        >
          +
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleDigit('0')}
          className="h-8 text-sm font-mono font-semibold rounded-lg col-span-2 bg-background hover:bg-muted"
        >
          0
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDecimal}
          className="h-8 text-sm font-mono font-bold rounded-lg bg-background hover:bg-muted"
        >
          ,
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleEquals}
          className={cn(
            'h-8 text-sm font-mono font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
          )}
        >
          =
        </Button>
      </div>
    </div>
  );
};
