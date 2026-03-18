import { useState, useEffect, useMemo } from 'react';
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
import { Search, Loader2, FilterX, Layers, CheckSquare, RefreshCw } from 'lucide-react';
import { QuestionBankItem, useQuestionBankList, useQuestionBankCategories } from '@/hooks/useQuestionBank';
import { QUESTION_TYPES } from '@/types/question';
import { QuestionBankCard } from '@/components/question-bank/QuestionBankCard';
import { useDebounce } from '@/hooks/useDebounce';
import { AnimatePresence, motion } from 'framer-motion';

interface QuestionPickerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (items: QuestionBankItem[]) => void;
}

const PAGE_SIZE = 20;

export function QuestionPickerDialog({
    open,
    onOpenChange,
    onConfirm,
}: QuestionPickerDialogProps) {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 400);
    
    const [typeFilter, setTypeFilter] = useState('all');
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [page, setPage] = useState(0);
    
    const [selectedItems, setSelectedItems] = useState<Map<string, QuestionBankItem>>(new Map());
    const [allQuestions, setAllQuestions] = useState<QuestionBankItem[]>([]);

    const { data: categories = [] } = useQuestionBankCategories();

    const { data, isLoading, isFetching } = useQuestionBankList(
        { page, pageSize: PAGE_SIZE },
        {
            search: debouncedSearch || undefined,
            question_type: typeFilter !== 'all' ? typeFilter : undefined,
            difficulty: difficultyFilter !== 'all' ? difficultyFilter : undefined,
            category: categoryFilter !== 'all' ? categoryFilter : undefined,
        }
    );

    // Reset list and page when filters change
    useEffect(() => {
        setPage(0);
        setAllQuestions([]);
    }, [debouncedSearch, typeFilter, difficultyFilter, categoryFilter]);

    // Append new questions when data arrives
    useEffect(() => {
        if (data?.questions) {
            if (page === 0) {
                setAllQuestions(data.questions);
            } else {
                setAllQuestions(prev => {
                    const existingIds = new Set(prev.map(q => q.id));
                    const uniqueNew = data.questions.filter(q => !existingIds.has(q.id));
                    return [...prev, ...uniqueNew];
                });
            }
        }
    }, [data, page]);

    const hasMore = data ? page < data.totalPages - 1 : false;

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

    const toggleSelectAll = () => {
        if (selectedItems.size === allQuestions.length && allQuestions.length > 0) {
            setSelectedItems(new Map());
        } else {
            const next = new Map(selectedItems);
            allQuestions.forEach(q => next.set(q.id, q));
            setSelectedItems(next);
        }
    };

    const handleConfirm = () => {
        onConfirm(Array.from(selectedItems.values()));
        onOpenChange(false);
        resetState();
    };

    const handleClose = () => {
        onOpenChange(false);
        resetState();
    };

    const resetState = () => {
        setSelectedItems(new Map());
        setSearch('');
        setTypeFilter('all');
        setDifficultyFilter('all');
        setCategoryFilter('all');
        setPage(0);
        setAllQuestions([]);
    };

    const isAllSelected = allQuestions.length > 0 && selectedItems.size >= allQuestions.length;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 border-b">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-2xl font-display font-bold text-primary flex items-center gap-2">
                                    <Layers className="h-6 w-6" />
                                    Sual Bankından Seç
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground mt-1">
                                    Testinizə uyğun ən yaxşı sualları tapın və əlavə edin
                                </DialogDescription>
                            </div>
                            {selectedItems.size > 0 && (
                                <Badge variant="accent" className="animate-bounce-subtle">
                                    {selectedItems.size} sual seçilib
                                </Badge>
                            )}
                        </div>
                    </DialogHeader>

                    {/* Filters Section */}
                    <div className="mt-6 flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Mətnə görə axtarış..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 h-10 bg-background/50 border-primary/10 focus:border-primary/40 focus:ring-primary/20 transition-all shadow-sm"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-[140px] h-10 bg-background/50 border-primary/10">
                                        <SelectValue placeholder="Tip" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Bütün tiplər</SelectItem>
                                        {QUESTION_TYPES.map((t) => (
                                            <SelectItem key={t.value} value={t.value}>
                                                <span className="flex items-center gap-2">
                                                    <span>{t.icon}</span>
                                                    <span>{t.label}</span>
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                                    <SelectTrigger className="w-[120px] h-10 bg-background/50 border-primary/10">
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
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-full sm:w-[200px] h-9 text-xs bg-background/50 border-primary/10">
                                    <SelectValue placeholder="Kateqoriya" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Bütün kateqoriyalar</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-4">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={toggleSelectAll}
                                    className="text-xs h-8 text-muted-foreground hover:text-primary gap-2"
                                    disabled={allQuestions.length === 0}
                                >
                                    <CheckSquare className={`h-4 w-4 ${isAllSelected ? 'text-primary' : ''}`} />
                                    {isAllSelected ? 'Heç birini seçmə' : 'Bu səhifədəkiləri seç'}
                                </Button>
                                
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => {
                                        setSearch('');
                                        setTypeFilter('all');
                                        setDifficultyFilter('all');
                                        setCategoryFilter('all');
                                    }}
                                    className="text-xs h-8 text-muted-foreground hover:text-destructive gap-2"
                                >
                                    <FilterX className="h-4 w-4" />
                                    Sıfırla
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question List Area */}
                <div className="relative flex-1 min-h-[400px]">
                    <ScrollArea className="h-full max-h-[50vh] px-6">
                        <div className="py-6 space-y-3">
                            <AnimatePresence mode="popLayout" initial={false}>
                                {allQuestions.map((question) => (
                                    <QuestionBankCard
                                        key={question.id}
                                        question={question}
                                        isSelected={selectedItems.has(question.id)}
                                        onSelect={toggleSelect}
                                    />
                                ))}
                            </AnimatePresence>

                            {isLoading && allQuestions.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                                    <Loader2 className="h-10 w-10 animate-spin text-primary/40 mb-4" />
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Yüklənir...</p>
                                </div>
                            )}

                            {!isLoading && allQuestions.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                    <div className="h-20 w-20 bg-muted/30 rounded-full flex items-center justify-center">
                                        <Search className="h-10 w-10 text-muted-foreground/30" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">Sual tapılmadı</p>
                                        <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">Filtrləri və ya axtarış sözünü dəyişdirərək yenidən cəhd edin</p>
                                    </div>
                                </div>
                            )}

                            {hasMore && (
                                <div className="pt-4 flex justify-center pb-8">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(page + 1)}
                                        disabled={isFetching}
                                        className="gap-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all rounded-full px-6 group"
                                    >
                                        {isFetching ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        ) : (
                                            <RefreshCw className="h-4 w-4 text-primary group-hover:rotate-180 transition-transform duration-500" />
                                        )}
                                        Daha çox yüklə
                                    </Button>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Footer */}
                <DialogFooter className="p-6 bg-muted/20 border-t flex flex-row items-center justify-between sm:justify-between">
                    <div className="hidden sm:block">
                        {data?.totalCount && (
                            <p className="text-xs text-muted-foreground font-medium">
                                Ümumi <span className="text-foreground">{data.totalCount}</span> sualdan <span className="text-foreground">{allQuestions.length}</span>-i göstərilir
                            </p>
                        )}
                    </div>
                    <div className="flex gap-3 ml-auto w-full sm:w-auto">
                        <Button variant="outline" onClick={handleClose} className="flex-1 sm:flex-none h-11 border-primary/10 hover:bg-muted font-medium">
                            Ləğv Et
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={selectedItems.size === 0}
                            className="flex-1 sm:flex-none h-11 px-8 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 bg-primary hover:bg-primary/90"
                        >
                            Əlavə Et ({selectedItems.size})
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
