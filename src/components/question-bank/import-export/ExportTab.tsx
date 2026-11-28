import { Button } from '@/components/ui/button';
import { FileJson, FileSpreadsheet, FileText } from 'lucide-react';
import { QuestionBankItem } from '@/hooks/useQuestionBank';
import { escapeCsvValue, downloadFile, formatQuestionsToMarkdown } from './utils';

interface ExportTabProps {
  questions: QuestionBankItem[];
}

export function ExportTab({ questions }: ExportTabProps) {
  const handleExportMarkdown = () => {
    const md = formatQuestionsToMarkdown(questions);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    downloadFile(blob, `sual-banki-${new Date().toISOString().split('T')[0]}.md`);
  };

  const handleExportJson = () => {
    const exportData = questions.map((q) => ({
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      subject: q.subject ?? null,
      grade: q.grade ?? null,
      topic: q.topic ?? null,
      curriculum_standard: q.curriculum_standard ?? null,
      category: q.category,
      difficulty: q.difficulty,
      difficulty_level: q.difficulty_level ?? null,
      weight: q.weight ?? 1,
      bloom_level: q.bloom_level,
      tags: q.tags,
      essay_rubric: q.essay_rubric ?? null,
      sample_answer: q.sample_answer ?? null,
      answer_lines: q.answer_lines ?? null,
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    downloadFile(blob, `sual-banki-${new Date().toISOString().split('T')[0]}.json`);
  };

  const handleExportCsv = () => {
    const headers = [
      'question_text', 'question_type', 'variant_a', 'variant_b', 'variant_c',
      'variant_d', 'correct_answer', 'explanation', 'subject', 'grade', 'topic',
      'curriculum_standard', 'category', 'difficulty', 'difficulty_level', 'weight',
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
        escapeCsvValue(q.subject ?? ''),
        escapeCsvValue(q.grade ?? ''),
        escapeCsvValue(q.topic ?? ''),
        escapeCsvValue(q.curriculum_standard ?? ''),
        escapeCsvValue(q.category ?? ''),
        q.difficulty ?? '',
        q.difficulty_level ?? '',
        q.weight != null ? String(q.weight) : '',
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          variant="outline"
          onClick={handleExportMarkdown}
          disabled={questions.length === 0}
          className="h-auto py-4 flex-col border-academic-line hover:border-academic-accent"
        >
          <FileText className="h-8 w-8 mb-2 text-academic-accent" />
          <span>Markdown (.md)</span>
          <span className="text-xs text-muted-foreground mt-1">Fənn, sinif, mövzu, standart, bal ilə</span>
        </Button>
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
