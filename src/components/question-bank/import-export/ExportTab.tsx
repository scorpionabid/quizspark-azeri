import { Button } from '@/components/ui/button';
import { FileJson, FileSpreadsheet } from 'lucide-react';
import { QuestionBankItem } from '@/hooks/useQuestionBank';
import { escapeCsvValue, downloadFile } from './utils';

interface ExportTabProps {
  questions: QuestionBankItem[];
}

export function ExportTab({ questions }: ExportTabProps) {
  const handleExportJson = () => {
    const exportData = questions.map((q) => ({
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      category: q.category,
      difficulty: q.difficulty,
      bloom_level: q.bloom_level,
      tags: q.tags,
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    downloadFile(blob, `sual-banki-${new Date().toISOString().split('T')[0]}.json`);
  };

  const handleExportCsv = () => {
    const headers = [
      'question_text', 'question_type', 'variant_a', 'variant_b', 'variant_c',
      'variant_d', 'correct_answer', 'explanation', 'category', 'difficulty',
      'bloom_level', 'tags',
    ];
    const rows = questions.map((q) => {
      const options = Array.isArray(q.options) ? q.options : Object.values(q.options ?? {});
      return [
        escapeCsvValue(q.question_text),
        q.question_type,
        escapeCsvValue(options[0] ?? ''),
        escapeCsvValue(options[1] ?? ''),
        escapeCsvValue(options[2] ?? ''),
        escapeCsvValue(options[3] ?? ''),
        escapeCsvValue(q.correct_answer),
        escapeCsvValue(q.explanation ?? ''),
        q.category ?? '',
        q.difficulty ?? '',
        q.bloom_level ?? '',
        q.tags?.join(';') ?? '',
      ].join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `sual-banki-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-4 mt-4">
      <p className="text-sm text-muted-foreground">
        Hal-hazırda <strong>{questions.length}</strong> sual export üçün mövcuddur
      </p>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={handleExportJson}
          disabled={questions.length === 0}
          className="h-auto py-4 flex-col"
        >
          <FileJson className="h-8 w-8 mb-2" />
          <span>JSON Export</span>
          <span className="text-xs text-muted-foreground mt-1">Tam data strukturu</span>
        </Button>
        <Button
          variant="outline"
          onClick={handleExportCsv}
          disabled={questions.length === 0}
          className="h-auto py-4 flex-col"
        >
          <FileSpreadsheet className="h-8 w-8 mb-2" />
          <span>CSV Export</span>
          <span className="text-xs text-muted-foreground mt-1">Excel uyğun format</span>
        </Button>
      </div>
    </div>
  );
}
