import React from 'react';

interface SafeExamWatermarkProps {
  identifier?: string;
  fullName?: string;
}

export const SafeExamWatermark: React.FC<SafeExamWatermarkProps> = ({
  identifier,
  fullName,
}) => {
  const text = [
    identifier ? `FİN/KOD: ${identifier}` : '',
    fullName,
    new Date().toLocaleDateString('az-AZ'),
    'QuizSpark Safe Exam',
  ].filter(Boolean).join(' • ');

  // Create repeating rows to cover the viewport
  const rows = Array.from({ length: 12 });
  const cols = Array.from({ length: 4 });

  return (
    <div 
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-30 overflow-hidden flex flex-col justify-around opacity-[0.035] dark:opacity-[0.055]"
    >
      {rows.map((_, rIdx) => (
        <div 
          key={rIdx} 
          className="flex justify-around whitespace-nowrap transform -rotate-12 translate-x-4"
        >
          {cols.map((_, cIdx) => (
            <span 
              key={cIdx} 
              className="text-xs md:text-sm font-mono font-bold tracking-widest text-foreground px-8 py-4"
            >
              {text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};
