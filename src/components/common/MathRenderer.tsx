import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

type MathPart =
  | { type: 'text'; content: string }
  | { type: 'math-inline'; content: string }
  | { type: 'math-block'; content: string };

/**
 * Mətni riyazi ifadə hissələrinə ayırır.
 * Dəstəklənən formatlar:
 * - `$$...$$` və ya `\[...\]` → Block formula
 * - `$...$` və ya `\(...\)`   → Inline formula
 */
function parseMathParts(text: string): MathPart[] {
  const parts: MathPart[] = [];
  const regex = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$(?!\$)[^$\n]+?\$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    const raw = match[0];
    if (raw.startsWith('$$') && raw.endsWith('$$')) {
      parts.push({ type: 'math-block', content: raw.slice(2, -2).trim() });
    } else if (raw.startsWith('\\[') && raw.endsWith('\\]')) {
      parts.push({ type: 'math-block', content: raw.slice(2, -2).trim() });
    } else if (raw.startsWith('\\(') && raw.endsWith('\\)')) {
      parts.push({ type: 'math-inline', content: raw.slice(2, -2).trim() });
    } else if (raw.startsWith('$') && raw.endsWith('$')) {
      parts.push({ type: 'math-inline', content: raw.slice(1, -1).trim() });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return parts;
}

export interface MathRendererProps {
  text?: string | null;
  className?: string;
}

/**
 * Mətni KaTeX ilə render edir.
 * `$...$` inline, `$$...$$` block formula kimi render olunur.
 * Riyazi simvol yoxdursa plain text qaytarır (maksimum performans üçün).
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ text, className }) => {
  if (!text) return null;

  // Əgər riyazi ayrıcılar yoxdursa sadə mətn kimi göstər
  if (!text.includes('$') && !text.includes('\\(') && !text.includes('\\[')) {
    return <span className={className}>{text}</span>;
  }

  const parts = parseMathParts(text);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.type === 'text') {
          return <span key={i}>{part.content}</span>;
        }
        try {
          const html = katex.renderToString(part.content, {
            throwOnError: false,
            output: 'html',
            displayMode: part.type === 'math-block',
            strict: false,
            trust: true,
          });
          return (
            <span
              key={i}
              dangerouslySetInnerHTML={{ __html: html }}
              className={part.type === 'math-block' ? 'block my-1.5' : 'inline mx-0.5'}
            />
          );
        } catch {
          // Render xətasında orijinal mətni göstər
          return (
            <span key={i} className="font-mono text-amber-500 text-xs">
              {part.type === 'math-block' ? `$$${part.content}$$` : `$${part.content}$`}
            </span>
          );
        }
      })}
    </span>
  );
};

export default MathRenderer;
