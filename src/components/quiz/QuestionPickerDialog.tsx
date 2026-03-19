import { useState, useEffect, useMemo, useRef } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Search, 
    Loader2, 
    FilterX, 
    Layers, 
    CheckSquare, 
    RefreshCw, 
    Sparkles, 
    ShoppingBasket,
    History,
    X,
    MessageSquareQuote
} from 'lucide-react';
import { 
    QuestionBankItem, 
    useQuestionBankList, 
    useQuestionBankCategories,
    useQuestionBankSearch,
    useCreateQuestionBank
} from '@/hooks/useQuestionBank';
import { QUESTION_TYPES } from '@/types/question';
import { QuestionBankCard } from '@/components/question-bank/QuestionBankCard';
import { useDebounce } from '@/hooks/useDebounce';
import { useEnhanceQuestion } from '@/hooks/useEnhanceQuestion';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

interface QuestionPickerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (items: QuestionBankItem[]) => void;
}

const PAGE_SIZE = 15;

export function QuestionPickerDialog({
    open,
    onOpenChange,
    onConfirm,
}: QuestionPickerDialogProps) {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    
    const [typeFilter, setTypeFilter] = useState('all');
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [page, setPage] = useState(0);
    const [activeTab, setActiveTab] = useState("browse");
    const [useAI, setUseAI] = useState(true);
    
    const [selectedItems, setSelectedItems] = useState<Map<string, QuestionBankItem>>(new Map());
    const [allQuestions, setAllQuestions] = useState<QuestionBankItem[]>([]);

    const { enhanceQuestion, isEnhancing } = useEnhanceQuestion();
    const createQuestion = useCreateQuestionBank();

    const handleSimilar = async (sourceQuestion: QuestionBankItem) => {
        toast.info('Süni intellekt bənzər sual hazırlayır...');
        
        try {
            const result = await enhanceQuestion(
                sourceQuestion.question_text, 
                'similar',
                Array.isArray(sourceQuestion.options) ? sourceQuestion.options : undefined
            );

            if (!result || !result.question) {
                throw new Error('AI sual yarada bilmədi');
            }

            const newQuestionData: Omit<QuestionBankItem, 'id' | 'created_at' | 'updated_at'> = {
                ...sourceQuestion,
                question_text: result.question,
                options: result.options || sourceQuestion.options,
                correct_answer: result.correct_answer || sourceQuestion.correct_answer,
                explanation: result.explanation || sourceQuestion.explanation,
                title: result.question.substring(0, 50),
                user_id: null,
                usage_count: 0
            };

            createQuestion.mutate(newQuestionData, {
                onSuccess: () => {
                    toast.success('Bənzər sual yaradıldı və banka əlavə edildi!');
                }
            });
        } catch (error) {
            console.error('Error generating similar question:', error);
            toast.error('Bənzər sual yaradılarkən xəta baş verdi');
        }
    };

    const loaderRef = useRef<HTMLDivElement>(null);
    const { data: categories = [] } = useQuestionBankCategories();

    // Standard list with pagination
    const { data, isLoading, isFetching } = useQuestionBankList(
        { page, pageSize: PAGE_SIZE },
        {
            search: (!useAI && debouncedSearch) ? debouncedSearch : undefined,
            question_type: typeFilter !== 'all' ? typeFilter : undefined,
            difficulty: difficultyFilter !== 'all' ? difficultyFilter : undefined,
            category: categoryFilter !== 'all' ? categoryFilter : undefined,
        }
    );

    // AI/Vector search
    const { data: searchResults, isFetching: isSearching } = useQuestionBankSearch(
        debouncedSearch,
        useAI && !!debouncedSearch && debouncedSearch.length > 2
    );

    // Intersection Observer for Infinite Scroll
    useEffect(() => {
        if (!loaderRef.current || !hasMore || isFetching || (useAI && !!debouncedSearch)) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prev) => prev + 1);
            }
        }, { threshold: 1.0 });

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [loaderRef.current, page, isFetching, data?.totalPages, useAI, debouncedSearch]);

    // Reset list and page when filters change
    useEffect(() => {
        setPage(0);
        setAllQuestions([]);
    }, [debouncedSearch, typeFilter, difficultyFilter, categoryFilter, useAI]);

    // Append new questions when data arrives
    useEffect(() => {
        if (useAI && debouncedSearch && searchResults) {
            setAllQuestions(searchResults);
        } else if (data?.questions) {
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
    }, [data, page, searchResults, useAI, debouncedSearch]);

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
        setActiveTab("browse");
    };

    const isAllSelected = allQuestions.length > 0 && allQuestions.every(q => selectedItems.has(q.id));

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl bg-background/95 backdrop-blur-xl">
                <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/5 p-6 border-b">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <DialogTitle className="text-3xl font-display font-black text-primary flex items-center gap-3 tracking-tight">
                                    <div className="p-2 bg-primary/10 rounded-xl">
                                        <Layers className="h-7 w-7 text-primary" />
                                    </div>
                                    Sual Bankı
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground font-medium flex items-center gap-2">
                                    <History className="h-4 w-4" />
                                    Bazadakı minlərlə sual arasından seçin
                                </DialogDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                {selectedItems.size > 0 && (
                                    <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20 animate-in fade-in zoom-in slide-in-from-right-4 duration-300 font-bold">
                                        {selectedItems.size} sual seçilib
                                    </Badge>
                                )}
                                <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Tabs / Filters Section */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6 w-full">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <TabsList className="bg-muted/50 p-1 rounded-xl w-fit">
                                <TabsTrigger value="browse" className="rounded-lg px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2">
                                    <Layers className="h-4 w-4" />
                                    Hamısı
                                </TabsTrigger>
                                <TabsTrigger value="selected" className="rounded-lg px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2 relative">
                                    <ShoppingBasket className="h-4 w-4" />
                                    Seçilmişlər
                                    {selectedItems.size > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                                            {selectedItems.size}
                                        </span>
                                    )}
                                </TabsTrigger>
                            </TabsList>

                            {activeTab === "browse" && (
                                <div className="flex-1 max-w-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1 group">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                placeholder={useAI ? "Ağıllı axtarış (məs: 'Azərbaycan tarixi')" : "Mətnə görə axtarış..."}
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="pl-10 h-11 bg-background border-primary/10 focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm text-base rounded-xl"
                                            />
                                            {(isSearching || isFetching) && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <Loader2 className="h-4 w-4 animate-spin text-primary/40" />
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            variant={useAI ? "default" : "outline"}
                                            onClick={() => setUseAI(!useAI)}
                                            className={`h-11 rounded-xl px-4 flex gap-2 font-semibold transition-all ${useAI ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95' : 'hover:bg-primary/5'}`}
                                            title={useAI ? "Aİ axtarışı aktivdir" : "Normal axtarış"}
                                        >
                                            <Sparkles className={`h-4 w-4 ${useAI ? 'animate-pulse' : ''}`} />
                                            AI
                                        </Button>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                                            <SelectTrigger className="w-[140px] h-9 bg-background/50 border-primary/5 rounded-lg text-xs font-medium">
                                                <SelectValue placeholder="Tip" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Bütün tiplər</SelectItem>
                                                {QUESTION_TYPES.map((t) => (
                                                    <SelectItem key={t.value} value={t.value}>
                                                        <span className="flex items-center gap-2">
                                                            <span className="opacity-70">{t.icon}</span>
                                                            <span>{t.label}</span>
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                                            <SelectTrigger className="w-[120px] h-9 bg-background/50 border-primary/5 rounded-lg text-xs font-medium">
                                                <SelectValue placeholder="Çətinlik" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Bütün çətinliklər</SelectItem>
                                                <SelectItem value="asan">Asan</SelectItem>
                                                <SelectItem value="orta">Orta</SelectItem>
                                                <SelectItem value="çətin">Çətin</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                            <SelectTrigger className="w-[160px] h-9 bg-background/50 border-primary/5 rounded-lg text-xs font-medium">
                                                <SelectValue placeholder="Kateqoriya" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Bütün kateqoriyalar</SelectItem>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <div className="ml-auto flex items-center gap-2">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={toggleSelectAll}
                                                className="text-xs h-8 text-muted-foreground hover:text-primary gap-2 transition-colors rounded-lg px-3"
                                                disabled={allQuestions.length === 0}
                                            >
                                                <CheckSquare className={`h-4 w-4 ${isAllSelected ? 'text-primary' : ''}`} />
                                                {isAllSelected ? 'Heç birini seçmə' : 'Hamısını seç'}
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
                                                className="text-xs h-8 text-muted-foreground hover:text-destructive gap-2 rounded-lg px-3"
                                            >
                                                <FilterX className="h-4 w-4" />
                                                Sıfırla
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Tabs>
                </div>

                <div className="flex-1 overflow-hidden">
                    <Tabs value={activeTab} className="h-full flex flex-col">
                        {/* Browse Content */}
                        <TabsContent value="browse" className="flex-1 overflow-hidden m-0 p-0">
                            <ScrollArea className="h-full px-6">
                                <div className="py-6 space-y-4">
                                    {useAI && debouncedSearch && (
                                        <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 border border-primary/10 rounded-xl text-primary text-sm font-semibold animate-pulse-subtle">
                                            <Sparkles className="h-4 w-4" />
                                            <span>Süni İntellekt '{debouncedSearch}' üçün ən uyğun sualları tapdı:</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-4">
                                        <AnimatePresence mode="popLayout" initial={false}>
                                            {allQuestions.map((question) => (
                                                <QuestionBankCard
                                                    key={question.id}
                                                    question={question}
                                                    isSelected={selectedItems.has(question.id)}
                                                    onSelect={toggleSelect}
                                                    onSimilar={handleSimilar}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    {(isLoading || isSearching) && allQuestions.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-32 space-y-6">
                                            <div className="relative">
                                                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                                <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-primary animate-bounce opacity-50" />
                                            </div>
                                            <div className="text-center space-y-2">
                                                <p className="text-lg font-bold text-foreground tracking-tight">Suallar hazırlanır...</p>
                                                <p className="text-sm text-muted-foreground max-w-[200px] leading-relaxed">Məlumat bazasından ən yaxşı variantlar toplanır</p>
                                            </div>
                                        </div>
                                    )}

                                    {!isLoading && !isSearching && allQuestions.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                                            <div className="h-24 w-24 bg-muted/30 rounded-[2rem] flex items-center justify-center rotate-12 transition-transform hover:rotate-0">
                                                <Search className="h-12 w-12 text-muted-foreground/30 -rotate-12" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-xl font-bold text-foreground">Sual tapılmadı</p>
                                                <p className="text-sm text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                                                    Axtarış sözünü və ya filtrləri dəyişdirərək bazaya yenidən baxın
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Infinite Scroll Trigger */}
                                    {hasMore && !isSearching && (
                                        <div ref={loaderRef} className="h-20 flex items-center justify-center py-10">
                                            <div className="flex items-center gap-3 text-primary/40 text-sm font-medium tracking-widest uppercase">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                <span>Yüklənir</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        {/* Selected Content */}
                        <TabsContent value="selected" className="flex-1 overflow-hidden m-0 p-0">
                            <ScrollArea className="h-full px-6">
                                <div className="py-6 space-y-4">
                                    {selectedItems.size > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            <AnimatePresence mode="popLayout">
                                                {Array.from(selectedItems.values()).map((question) => (
                                                    <QuestionBankCard
                                                        key={question.id}
                                                        question={question}
                                                        isSelected={true}
                                                        onSelect={toggleSelect}
                                                    />
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                                            <div className="h-24 w-24 bg-primary/5 rounded-[2rem] flex items-center justify-center animate-pulse">
                                                <ShoppingBasket className="h-12 w-12 text-primary/20" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-xl font-bold text-foreground">Səbət boşdur</p>
                                                <p className="text-sm text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                                                    Hələ heç bir sual seçməmisiniz. Bazadan sualları bura əlavə edə bilərsiniz.
                                                </p>
                                                <Button 
                                                    variant="link" 
                                                    className="text-primary font-bold gap-2"
                                                    onClick={() => setActiveTab("browse")}
                                                >
                                                    <Layers className="h-4 w-4" />
                                                    Suallara Bax
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Footer */}
                <DialogFooter className="p-8 bg-muted/20 border-t flex flex-row items-center justify-between sm:justify-between gap-6">
                    <div className="hidden sm:flex flex-col">
                        <p className="text-sm font-bold text-foreground flex items-center gap-2">
                            <MessageSquareQuote className="h-4 w-4 text-primary" />
                            {selectedItems.size} sual seçildi
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">
                            Bazadan {data?.totalCount || 0} sualdan {allQuestions.length}-i yüklənib
                        </p>
                    </div>
                    <div className="flex gap-4 ml-auto w-full sm:w-auto">
                        <Button 
                            variant="outline" 
                            onClick={handleClose} 
                            className="flex-1 sm:flex-none h-12 px-8 border-primary/10 hover:bg-muted font-bold rounded-xl transition-all active:scale-95"
                        >
                            Ləğv Et
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={selectedItems.size === 0}
                            className={`flex-1 sm:flex-none h-12 px-12 font-black rounded-xl transition-all active:scale-95 shadow-xl shadow-primary/20 relative overflow-hidden group ${selectedItems.size > 0 ? 'bg-primary hover:bg-primary/90' : ''}`}
                        >
                            <span className="relative z-10">Təsdiqlə və Əlavə Et</span>
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 slant" />
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
