import React from 'react';
import { Input } from '@/components/ui/input';
import { Code2 } from 'lucide-react';
import { RendererProps } from './types';

export const CodeRenderer: React.FC<RendererProps> = ({
  question,
  value,
  onChange,
  disabled,
  showFeedback,
}) => {
  const codeSnippet = question.fill_blank_template || '';
  const lang = question.hint?.startsWith('lang:') ? question.hint.slice(5) : '';

  return (
    <div className="space-y-3">
      {codeSnippet && (
        <div className="rounded-xl overflow-hidden border border-neutral-700 shadow-sm">
          {lang && (
            <div className="flex items-center gap-2 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-400 border-b border-neutral-700">
              <Code2 className="h-3 w-3" />
              <span className="font-mono">{lang}</span>
            </div>
          )}
          <pre className="bg-neutral-950 text-green-400 font-mono text-sm p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed m-0">
            <code>{codeSnippet}</code>
          </pre>
        </div>
      )}
      <Input
        disabled={disabled || showFeedback}
        placeholder="Kodun çıxışını / cavabını yazın..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className="font-mono h-12 border-2 border-primary/10 focus:border-primary rounded-xl"
      />
    </div>
  );
};
