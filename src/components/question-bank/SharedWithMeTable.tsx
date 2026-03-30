import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Copy } from 'lucide-react';
import { QuestionBankItem } from '@/hooks/useQuestionBank';
import { QUESTION_TYPES } from '@/types/question';

interface SharedWithMeTableProps {
  questions: QuestionBankItem[];
  isLoading: boolean;
  onView: (question: QuestionBankItem) => void;
  onCopy: (question: QuestionBankItem) => void;
}

function getDifficultyColor(difficulty: string | null) {
  switch (difficulty?.toLowerCase()) {
    case 'asan':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'orta':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'çətin':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getTypeLabel(type: string) {
  return QUESTION_TYPES.find((t) => t.value === type)?.label ?? type;
}

function truncateText(text: string, max = 100) {
  return text.length <= max ? text : text.slice(0, max) + '...';
}

function getInitials(name: string | null) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('az-AZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function SharedWithMeTable({
  questions,
  isLoading,
  onView,
  onCopy,
}: SharedWithMeTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-base font-medium">Sizinlə hələ sual paylaşılmayıb</p>
        <p className="text-sm mt-1">
          Digər müəllimlər suallarını paylaşdıqda burada görünəcək.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Sual</TableHead>
            <TableHead>Tip</TableHead>
            <TableHead>Çətinlik</TableHead>
            <TableHead>Kateqoriya</TableHead>
            <TableHead>Paylaşan</TableHead>
            <TableHead>Tarix</TableHead>
            <TableHead className="text-right">Əməliyyat</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((q) => (
            <TableRow key={q.id}>
              <TableCell className="font-medium">
                {truncateText(q.question_text)}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs whitespace-nowrap">
                  {getTypeLabel(q.question_type)}
                </Badge>
              </TableCell>
              <TableCell>
                {q.difficulty ? (
                  <Badge
                    variant="secondary"
                    className={`text-xs ${getDifficultyColor(q.difficulty)}`}
                  >
                    {q.difficulty}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-xs">-</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {q.category ?? '-'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6 shrink-0">
                    <AvatarImage src={q.shared_by_avatar ?? undefined} />
                    <AvatarFallback className="text-[10px]">
                      {getInitials(q.shared_by_name ?? null)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm truncate max-w-[120px]">
                    {q.shared_by_name ?? 'Müəllim'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(q.shared_at)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onView(q)}
                    title="Bax"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onCopy(q)}
                    title="Bankıma kopyala"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
