import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Loader2 } from 'lucide-react';
import { QuestionBankItem, useQuestionBankList } from '@/hooks/useQuestionBank';
import { QUESTION_TYPES } from '@/types/question';

interface QuestionPickerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (items: QuestionBankItem[]) => void;
}

export function QuestionPickerDialog({
    open,
    onOpenChange,
    onConfirm,
}: QuestionPickerDialogProps) {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const [selectedItems, setSelectedItems] = useState<Map<string, QuestionBankItem>>(new Map());

    const { data, isLoading } = useQuestionBankList(
        { page: 0, pageSize: 50 },
        {
            search: search || undefined,
            question_type: typeFilter !== 'all' ? typeFilter : undefined,
            difficulty: difficultyFilter !== 'all' ? difficultyFilter : undefined,
        }
    );

    const questions = data?.questions ?? [];

    const toggleSelect = (item: QuestionBankItem) => {
        setSelectedItems((prev) => {
            const next = new Map(prev);
            if (next.has(item.id)) {
                next.delete(item.id);
            } else {
                next.set(item.id, item);
            }
            return next;
        });
    };

    const handleConfirm = () => {
        onConfirm(Array.from(selectedItems.values()));
        onOpenChange(false);
        setSelectedItems(new Map());
        setSearch('');
        setTypeFilter('all');
        setDifficultyFilter('all');
    };

    const handleClose = () => {
        onOpenChange(false);
        setSelectedItems(new Map());
    };

    const getTypeLabel = (type: string) => {
        return QUESTION_TYPES.find((t) => t.value === type)?.label ?? type;
    };

    const getTypeIcon = (type: string) => {
        return QUESTION_TYPES.find((t) => t.value === type)?.icon ?? '❓';
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Sual Bankından Seç</DialogTitle>
                    <DialogDescription className="sr-only">
                        Sual bankından testinizə əlavə etmək üçün sualları seçin
                    </DialogDescription>
                </DialogHeader>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-2 py-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Sualları axtar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full sm:w-44">
                            <SelectValue placeholder="Tip" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Bütün tiplər</SelectItem>
                            {QUESTION_TYPES.map((t) => (
                                <SelectItem key={t.value} value={t.value}>
                                    {t.icon} {t.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                        <SelectTrigger className="w-full sm:w-36">
                            <SelectValue placeholder="Çətinlik" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Hamısı</SelectItem>
                            <SelectItem value="asan">Asan</SelectItem>
                            <SelectItem value="orta">Orta</SelectItem>
                            <SelectItem value="çətin">Çətin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Question List */}
                <ScrollArea className="flex-1 -mx-6 px-6 max-h-[50vh]">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">
                            <p className="text-sm">Sual tapılmadı</p>
                        </div>
                    ) : (
                        <div className="space-y-2 pb-4">
                            {questions.map((question) => {
                                const isSelected = selectedItems.has(question.id);
                                return (
                                    <div
                                        key={question.id}
                                        onClick={() => toggleSelect(question)}
                                        className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${isSelected
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50 hover:bg-muted/30'
                                            }`}
                                    >
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => toggleSelect(question)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="mt-0.5 shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <Badge variant="secondary" className="text-xs shrink-0">
                                                    {getTypeIcon(question.question_type)}{' '}
                                                    {getTypeLabel(question.question_type)}
                                                </Badge>
                                                {question.difficulty && (
                                                    <Badge variant="outline" className="text-xs shrink-0">
                                                        {question.difficulty}
                                                    </Badge>
                                                )}
                                                {question.weight && question.weight !== 1 && (
                                                    <Badge variant="outline" className="text-xs font-mono shrink-0">
                                                        {question.weight} xal
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-foreground line-clamp-2">
                                                {question.question_text}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleClose}>
                        Ləğv Et
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={selectedItems.size === 0}
                    >
                        Əlavə Et ({selectedItems.size})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
