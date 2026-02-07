import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Copy, MoreHorizontal, Eye, Image } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { QuestionBankItem } from '@/hooks/useQuestionBank';
import { Skeleton } from '@/components/ui/skeleton';

interface QuestionTableProps {
  questions: QuestionBankItem[];
  selectedIds: Set<string>;
  onSelectChange: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onEdit: (question: QuestionBankItem) => void;
  onDelete: (id: string) => void;
  onDuplicate: (question: QuestionBankItem) => void;
  onView: (question: QuestionBankItem) => void;
  isLoading?: boolean;
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
  switch (type) {
    case 'multiple_choice':
      return 'Çoxseçimli';
    case 'true_false':
      return 'Doğru/Yanlış';
    case 'short_answer':
      return 'Qısa cavab';
    case 'essay':
      return 'Esse';
    default:
      return type;
  }
}

function truncateText(text: string, maxLength: number = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function QuestionTable({
  questions,
  selectedIds,
  onSelectChange,
  onSelectAll,
  onEdit,
  onDelete,
  onDuplicate,
  onView,
  isLoading,
}: QuestionTableProps) {
  const allSelected = questions.length > 0 && questions.every((q) => selectedIds.has(q.id));
  const someSelected = questions.some((q) => selectedIds.has(q.id)) && !allSelected;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">Sual tapılmadı</p>
        <p className="text-sm mt-1">Filtrlərı dəyişin və ya yeni sual əlavə edin</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                // @ts-ignore - indeterminate is a valid property
                indeterminate={someSelected}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
              />
            </TableHead>
            <TableHead className="min-w-[300px]">Sual</TableHead>
            <TableHead className="w-32">Kateqoriya</TableHead>
            <TableHead className="w-24">Çətinlik</TableHead>
            <TableHead className="w-28">Tip</TableHead>
            <TableHead className="w-32">Tarix</TableHead>
            <TableHead className="w-20 text-right">Əməliyyatlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question) => (
            <TableRow
              key={question.id}
              className={selectedIds.has(question.id) ? 'bg-primary/5' : ''}
            >
              <TableCell>
                <Checkbox
                  checked={selectedIds.has(question.id)}
                  onCheckedChange={(checked) => onSelectChange(question.id, !!checked)}
                />
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-start gap-2">
                    {question.question_image_url && (
                      <img
                        src={question.question_image_url}
                        alt=""
                        className="h-10 w-10 rounded border object-cover flex-shrink-0 mt-0.5"
                      />
                    )}
                    <p className="font-medium line-clamp-2">
                      {truncateText(question.question_text, 120)}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {question.media_type && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Image className="h-3 w-3" />
                        {question.media_type === 'image' ? 'Şəkil' : question.media_type === 'video' ? 'Video' : 'Audio'}
                      </Badge>
                    )}
                    {question.tags && question.tags.length > 0 && question.tags.slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {question.tags && question.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{question.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-normal">
                  {question.category || 'Kateqoriyasız'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getDifficultyColor(question.difficulty)}>
                  {question.difficulty || 'N/A'}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {getTypeLabel(question.question_type)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {new Date(question.created_at).toLocaleDateString('az-AZ')}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(question)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Bax
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(question)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Redaktə et
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(question)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Dublikat et
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(question.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
