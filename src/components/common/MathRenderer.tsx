import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';

type MathPart =
  | { type: 'text'; content: string }
  | { type: 'math-inline'; content: string }
  | { type: 'math-block'; content: string };

interface TableBlock {
  type: 'table';
  headers: string[];
  alignments: ('left' | 'center' | 'right')[];
  rows: string[][];
}

interface TextBlock {
  type: 'text';
  content: string;
}

interface QuoteBlock {
  type: 'quote';
  content: string;
}

type ContentBlock = TextBlock | TableBlock | QuoteBlock;

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

function normalizeImageUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (trimmed.startsWith('./images/')) {
    return '/images/' + trimmed.slice(9);
  }
  if (trimmed.startsWith('images/')) {
    return '/images/' + trimmed.slice(7);
  }
  return trimmed;
}

/**
 * Mətn hissələrində tünd-qara (**bold**), altından xətt (<u>underline</u>),
 * kursiv (*italic*) və Markdown şəkilləri (![alt](url)) render edir.
 */
function renderFormattedText(text: string): React.ReactNode {
  if (!text) return null;
  if (
    !text.includes('**') &&
    !text.includes('<u>') &&
    !text.includes('*') &&
    !text.includes('![')
  ) {
    return text;
  }

  const tokenRegex =
    /(!\[[\s\S]*?\]\([\s\S]*?\))|(\*\*[\s\S]+?\*\*)|(<u>[\s\S]+?<\/u>)|(\*(?!\*)[\s\S]+?\*)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    const key = `fmt-${match.index}`;

    if (token.startsWith('![') && token.endsWith(')')) {
      const imgMatch = token.match(/^!\[([\s\S]*?)\]\(([\s\S]*?)\)$/);
      if (imgMatch) {
        const alt = imgMatch[1]?.trim() || 'Sual şəkli';
        const src = normalizeImageUrl(imgMatch[2] || '');
        elements.push(
          <img
            key={key}
            src={src}
            alt={alt}
            loading="lazy"
            className="my-3 mx-auto max-h-80 sm:max-h-96 w-auto max-w-full rounded-2xl border-2 border-primary/10 shadow-md object-contain bg-background/50 block"
          />
        );
      } else {
        elements.push(token);
      }
    } else if (token.startsWith('**') && token.endsWith('**')) {
      elements.push(
        <strong
          key={key}
          className="font-black text-primary underline decoration-primary/40 underline-offset-2"
        >
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('<u>') && token.endsWith('</u>')) {
      elements.push(
        <u key={key} className="underline font-bold decoration-2 underline-offset-4 text-foreground">
          {token.slice(3, -4)}
        </u>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      elements.push(
        <em key={key} className="italic font-medium">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements.length > 0 ? elements : text;
}

/**
 * Sətir daxilindəki inline mətn, formatlama və KaTeX riyazi formulları render edir.
 */
const RenderInline: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;
  if (!content.includes('$') && !content.includes('\\(') && !content.includes('\\[')) {
    return <>{renderFormattedText(content)}</>;
  }

  const parts = parseMathParts(content);

  return (
    <>
      {parts.map((part, i) => {
        if (part.type === 'text') {
          return <span key={i}>{renderFormattedText(part.content)}</span>;
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
              className={part.type === 'math-block' ? 'block my-1' : 'inline mx-0.5'}
            />
          );
        } catch {
          return (
            <span key={i} className="font-mono text-amber-500 text-xs">
              ${part.content}$
            </span>
          );
        }
      })}
    </>
  );
};

function parseCells(line: string): string[] {
  let trimmed = line.trim();
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
  if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
  return trimmed.split('|').map((c) => c.trim());
}

const SEP_REGEX = /^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/;

function parseBlocks(rawText: string): ContentBlock[] {
  const lines = rawText.split('\n');
  const blocks: ContentBlock[] = [];
  let currentTextLines: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blockquote handling (lines starting with >)
    if (line.trim().startsWith('>')) {
      if (currentTextLines.length > 0) {
        blocks.push({ type: 'text', content: currentTextLines.join('\n') });
        currentTextLines = [];
      }
      const quoteLines: string[] = [];
      while (
        i < lines.length &&
        (lines[i].trim().startsWith('>') ||
          (!lines[i].trim() && i + 1 < lines.length && lines[i + 1].trim().startsWith('>')))
      ) {
        if (!lines[i].trim()) {
          quoteLines.push('');
        } else {
          quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        }
        i++;
      }
      blocks.push({ type: 'quote', content: quoteLines.join('\n') });
      continue;
    }

    const nextLine = lines[i + 1];
    const isSep = nextLine ? SEP_REGEX.test(nextLine.trim()) : false;
    const isHeaderCandidate = line.includes('|');

    if (isSep && isHeaderCandidate) {
      if (currentTextLines.length > 0) {
        blocks.push({ type: 'text', content: currentTextLines.join('\n') });
        currentTextLines = [];
      }

      const headers = parseCells(line);
      const sepCells = parseCells(nextLine);
      const alignments: ('left' | 'center' | 'right')[] = sepCells.map((c) => {
        const tr = c.trim();
        if (tr.startsWith(':') && tr.endsWith(':')) return 'center';
        if (tr.endsWith(':')) return 'right';
        return 'left';
      });

      while (alignments.length < headers.length) {
        alignments.push('left');
      }

      const rows: string[][] = [];
      i += 2;

      while (i < lines.length) {
        const rowLine = lines[i];
        const trimmedRow = rowLine.trim();
        if (!trimmedRow || !trimmedRow.includes('|')) {
          break;
        }
        const cells = parseCells(rowLine);
        while (cells.length < headers.length) {
          cells.push('');
        }
        rows.push(cells.slice(0, headers.length));
        i++;
      }

      blocks.push({
        type: 'table',
        headers,
        alignments,
        rows,
      });
      continue;
    }

    currentTextLines.push(line);
    i++;
  }

  if (currentTextLines.length > 0) {
    blocks.push({ type: 'text', content: currentTextLines.join('\n') });
  }

  return blocks;
}

function getAlignmentClass(align: 'left' | 'center' | 'right' | undefined): string {
  switch (align) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
}

export interface MathRendererProps {
  text?: string | null;
  content?: string | null;
  className?: string;
}

/**
 * Mətni KaTeX və Markdown Cədvəl dəstəyi ilə render edir.
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ text, content, className }) => {
  const rawText = text ?? content;
  if (!rawText) return null;

  const blocks = parseBlocks(rawText);
  const hasComplex = blocks.some((b) => b.type === 'table' || b.type === 'quote');

  if (!hasComplex) {
    const hasNewlines = rawText.includes('\n');
    const hasImages = rawText.includes('![');
    if (hasImages || hasNewlines) {
      return (
        <div className={cn('whitespace-pre-line leading-relaxed', className)}>
          <RenderInline content={rawText} />
        </div>
      );
    }
    return (
      <span className={className}>
        <RenderInline content={rawText} />
      </span>
    );
  }

  return (
    <div className={cn('space-y-3.5 w-full', className)}>
      {blocks.map((block, bIdx) => {
        if (block.type === 'text') {
          if (!block.content.trim()) return null;
          return (
            <div key={bIdx} className="whitespace-pre-line leading-relaxed text-foreground/95">
              <RenderInline content={block.content} />
            </div>
          );
        }

        if (block.type === 'quote') {
          return (
            <blockquote
              key={bIdx}
              className="my-3 border-l-4 border-blue-600/80 bg-blue-50/70 dark:bg-blue-950/30 p-3.5 rounded-r-xl text-foreground/95 text-xs sm:text-sm whitespace-pre-line leading-relaxed shadow-xs"
            >
              <RenderInline content={block.content} />
            </blockquote>
          );
        }

        return (
          <div
            key={bIdx}
            className="my-3.5 overflow-x-auto rounded-xl border border-border/80 bg-card shadow-sm"
          >
            <table className="w-full text-left text-sm sm:text-base border-collapse whitespace-normal">
              <thead className="bg-muted/70 text-foreground font-bold border-b border-border/80">
                <tr>
                  {block.headers.map((h, hIdx) => {
                    const isNumCol = h.trim() === '№' || h.trim().toLowerCase() === 'no';
                    return (
                      <th
                        key={hIdx}
                        className={cn(
                          'px-3.5 py-2.5 font-bold tracking-wide text-xs sm:text-sm text-foreground/80 uppercase',
                          isNumCol ? 'w-14 text-center' : getAlignmentClass(block.alignments[hIdx]),
                          hIdx < block.headers.length - 1 && 'border-r border-border/50'
                        )}
                      >
                        <RenderInline content={h} />
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {block.rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="transition-colors hover:bg-muted/30 even:bg-muted/15"
                  >
                    {row.map((cell, cIdx) => {
                      const isNumCol =
                        block.headers[cIdx]?.trim() === '№' ||
                        block.headers[cIdx]?.trim().toLowerCase() === 'no';
                      return (
                        <td
                          key={cIdx}
                          className={cn(
                            'px-3.5 py-2.5 text-foreground/90 font-medium text-sm sm:text-base',
                            isNumCol
                              ? 'w-14 text-center font-bold text-primary'
                              : getAlignmentClass(block.alignments[cIdx]),
                            cIdx < row.length - 1 && 'border-r border-border/40'
                          )}
                        >
                          <RenderInline content={cell} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default MathRenderer;
