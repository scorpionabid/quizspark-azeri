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
import { ArrowUpDown, ArrowUp, ArrowDown, Edit, Trash2, Copy, MoreHorizontal, Eye, Image, Star, Share2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { QuestionBankItem, SortParams } from '@/hooks/useQuestionBank';
import { Skeleton } from '@/components/ui/skeleton';
import { SubscriptionGate } from '@/components/subscription/SubscriptionGate';
import { Sparkles } from 'lucide-react';
import { QUESTION_TYPES } from '@/types/question';

interface QuestionTableProps {
  questions: QuestionBankItem[];
  selectedIds: Set<string>;
  onSelectChange: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onEdit: (question: QuestionBankItem) => void;
  onDelete: (id: string) => void;
  onDuplicate: (question: QuestionBankItem) => void;
  onView: (question: QuestionBankItem) => void;
  onEnhance: (question: QuestionBankItem) => void;
  onShare?: (question: QuestionBankItem) => void;
  onSort: (column: string) => void;
  sort?: SortParams;
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

function getTypeInfo(type: string) {
  const typeObj = QUESTION_TYPES.find(t => t.value === type);
  if (typeObj) {
    return { label: typeObj.label, icon: typeObj.icon };
  }
  return { label: type, icon: 'help-circle' };
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
  onEnhance,
  onShare,
  onSort,
  sort,
  isLoading,
}: QuestionTableProps) {
  const allSelected = questions.length > 0 && questions.every((q) => selectedIds.has(q.id));
  const someSelected = questions.some((q) => selectedIds.has(q.id)) && !allSelected;

  const SortButton = ({ column, label }: { column: string; label: string }) => {
    const isActive = sort?.column === column;
    return (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[active=true]:text-primary"
        data-active={isActive}
        onClick={() => onSort(column)}
      >
        <span>{label}</span>
        {isActive ? (
          sort.direction === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
        )}
      </Button>
    );
  };

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
                checked={someSelected ? "indeterminate" : allSelected}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
              />
            </TableHead>
            <TableHead className="min-w-[300px]">Başlıq & Sual</TableHead>
            <TableHead className="w-20 text-center">Xal/Çəki</TableHead>
            <TableHead className="w-24 text-center">
              <SortButton column="quality_score" label="Keyfiyyət" />
            </TableHead>
            <TableHead className="w-32">
              <SortButton column="category" label="Kateqoriya" />
            </TableHead>
            <TableHead className="w-24">
              <SortButton column="difficulty" label="Çətinlik" />
            </TableHead>
            <TableHead className="w-32">
              <SortButton column="question_type" label="Tip" />
            </TableHead>
            <TableHead className="w-32">
              <SortButton column="created_at" label="Tarix" />
            </TableHead>
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
                    <div>
                      {question.title && <p className="font-semibold text-sm mb-1">{question.title}</p>}
                      <p className="font-medium line-clamp-2 text-muted-foreground text-sm">
                        {truncateText(question.question_text, 120)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-wrap mt-1">
                    {question.media_type && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Image className="h-3 w-3" />
                        {question.media_type === 'image' ? 'Şəkil' : question.media_type === 'video' ? 'Video' : 'Audio'}
                      </Badge>
                    )}
                    {question.video_url && (
                      <Badge variant="outline" className="text-xs gap-1 border-red-200 text-red-700 bg-red-50">Video Klip</Badge>
                    )}
                    {question.model_3d_url && (
                      <Badge variant="outline" className="text-xs gap-1 border-blue-200 text-blue-700 bg-blue-50">3D Model</Badge>
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
              <TableCell className="text-center">
                <Badge variant="outline" className="font-mono">
                  ×{question.weight ?? 1.0}
                </Badge>
              </TableCell>
              <TableCell className="text-center whitespace-nowrap">
                {question.quality_score ? (
                  <span className="flex justify-center items-center text-sm font-medium gap-1 text-yellow-600">
                    <Star className="w-3 h-3 fill-current" /> {Number(question.quality_score).toFixed(1)}
                    <span className="text-xs text-muted-foreground ml-1">({question.usage_count || 0})</span>
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
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
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  {getTypeInfo(question.question_type).label}
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
                    <SubscriptionGate feature="ai_question_generation" variant="inline">
                      <DropdownMenuItem
                        onClick={() => onEnhance(question)}
                        className="text-primary hover:text-primary focus:text-primary group"
                      >
                        <Sparkles className="h-4 w-4 mr-2 animate-pulse group-hover:scale-110 transition-transform" />
                        AI Asistent
                      </DropdownMenuItem>
                    </SubscriptionGate>
                    {onShare && (
                      <DropdownMenuItem onClick={() => onShare(question)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Paylaş
                      </DropdownMenuItem>
                    )}
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
