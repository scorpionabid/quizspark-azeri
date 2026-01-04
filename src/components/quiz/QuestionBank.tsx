import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Database, Filter, Trash2, Copy, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CreateQuizFromBank } from "./CreateQuizFromBank";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: unknown;
  correct_answer: string;
  explanation: string | null;
  category: string | null;
  difficulty: string | null;
  bloom_level: string | null;
  tags: string[] | null;
  similarity?: number;
  created_at: string;
}

interface QuestionBankProps {
  onSelectQuestions?: (questions: Question[]) => void;
}

export function QuestionBank({ onSelectQuestions }: QuestionBankProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    difficulty: "",
    type: "",
  });

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("question_bank")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error("Error loading questions:", error);
      toast.error("Sualları yükləmək mümkün olmadı");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadQuestions();
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("question-bank", {
        body: { action: "search", searchQuery },
      });

      if (error) throw error;
      setQuestions(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Axtarış zamanı xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "")
    );

    if (Object.keys(activeFilters).length === 0) {
      loadQuestions();
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("question-bank", {
        body: { action: "filter", filters: activeFilters },
      });

      if (error) throw error;
      setQuestions(data.results || []);
    } catch (error) {
      console.error("Filter error:", error);
      toast.error("Filtrasiya zamanı xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from("question_bank")
        .delete()
        .eq("id", questionId);

      if (error) throw error;
      
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      setSelectedQuestions(prev => {
        const next = new Set(prev);
        next.delete(questionId);
        return next;
      });
      toast.success("Sual silindi");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Sualı silmək mümkün olmadı");
    }
  };

  const toggleSelect = (questionId: string) => {
    setSelectedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedQuestions.size === questions.length) {
      setSelectedQuestions(new Set());
    } else {
      setSelectedQuestions(new Set(questions.map(q => q.id)));
    }
  };

  const handleUseSelected = () => {
    const selected = questions.filter(q => selectedQuestions.has(q.id));
    if (onSelectQuestions) {
      onSelectQuestions(selected);
    }
    toast.success(`${selected.length} sual seçildi`);
  };

  const handleCreateQuizClick = () => {
    if (selectedQuestions.size === 0) {
      toast.error("Ən azı 1 sual seçin");
      return;
    }
    setShowCreateQuiz(true);
  };

  const handleRemoveFromQuiz = (questionId: string) => {
    setSelectedQuestions(prev => {
      const next = new Set(prev);
      next.delete(questionId);
      return next;
    });
  };

  const handleQuizCreated = () => {
    setSelectedQuestions(new Set());
  };

  const getSelectedQuestionsList = () => {
    return questions.filter(q => selectedQuestions.has(q.id));
  };

  const parseOptions = (options: unknown): string[] => {
    if (!options) return [];
    if (Array.isArray(options)) return options.map(String);
    if (typeof options === 'string') {
      try {
        const parsed = JSON.parse(options);
        return Array.isArray(parsed) ? parsed.map(String) : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case "asan": return "bg-green-500/20 text-green-400";
      case "orta": return "bg-yellow-500/20 text-yellow-400";
      case "çətin": return "bg-red-500/20 text-red-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const categories = [...new Set(questions.map(q => q.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Database className="h-5 w-5 text-primary" />
            Sual Bankı
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Vektor axtarışı ilə sual tap..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 bg-background/50"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Axtar"}
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <Select
              value={filters.category}
              onValueChange={(v) => setFilters(prev => ({ ...prev, category: v }))}
            >
              <SelectTrigger className="w-[150px] bg-background/50">
                <SelectValue placeholder="Kateqoriya" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Hamısı</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat!}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.difficulty}
              onValueChange={(v) => setFilters(prev => ({ ...prev, difficulty: v }))}
            >
              <SelectTrigger className="w-[120px] bg-background/50">
                <SelectValue placeholder="Çətinlik" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Hamısı</SelectItem>
                <SelectItem value="asan">Asan</SelectItem>
                <SelectItem value="orta">Orta</SelectItem>
                <SelectItem value="çətin">Çətin</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.type}
              onValueChange={(v) => setFilters(prev => ({ ...prev, type: v }))}
            >
              <SelectTrigger className="w-[150px] bg-background/50">
                <SelectValue placeholder="Sual növü" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Hamısı</SelectItem>
                <SelectItem value="multiple_choice">Çoxseçimli</SelectItem>
                <SelectItem value="true_false">Doğru/Yanlış</SelectItem>
                <SelectItem value="open">Açıq sual</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handleFilter} className="gap-2">
              <Filter className="h-4 w-4" />
              Filtr
            </Button>
          </div>

          {/* Selection Actions */}
          {questions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/30">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSelectAll}
                className="text-xs"
              >
                {selectedQuestions.size === questions.length ? "Hamısını Sil" : "Hamısını Seç"}
              </Button>

              {selectedQuestions.size > 0 && (
                <>
                  <span className="text-sm text-muted-foreground">
                    {selectedQuestions.size} sual seçilib
                  </span>
                  <div className="flex gap-2 ml-auto">
                    {onSelectQuestions && (
                      <Button onClick={handleUseSelected} size="sm" variant="outline" className="gap-2">
                        <Copy className="h-4 w-4" />
                        İstifadə et
                      </Button>
                    )}
                    <Button onClick={handleCreateQuizClick} size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Quiz Yarat ({selectedQuestions.size})
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questions list */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : questions.length === 0 ? (
          <Card className="border-border/50 bg-card/50">
            <CardContent className="py-12 text-center text-muted-foreground">
              Sual bankında heç bir sual yoxdur
            </CardContent>
          </Card>
        ) : (
          questions.map((question) => (
            <Card 
              key={question.id} 
              className={`border-border/50 bg-card/50 backdrop-blur-sm transition-all ${
                selectedQuestions.has(question.id) ? "ring-2 ring-primary" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Checkbox
                    checked={selectedQuestions.has(question.id)}
                    onCheckedChange={() => toggleSelect(question.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <p className="text-foreground font-medium">{question.question_text}</p>
                    
                    {question.options && (
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        {parseOptions(question.options).map((opt, i) => (
                          <div 
                            key={i}
                            className={`px-2 py-1 rounded ${
                              opt === question.correct_answer 
                                ? "bg-green-500/20 text-green-400" 
                                : "bg-muted/50 text-muted-foreground"
                            }`}
                          >
                            {String.fromCharCode(65 + i)}) {opt}
                          </div>
                        ))}
                      </div>
                    )}

                    {question.explanation && (
                      <p className="text-sm text-muted-foreground italic">
                        İzah: {question.explanation}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 pt-2">
                      {question.category && (
                        <Badge variant="outline">{question.category}</Badge>
                      )}
                      {question.difficulty && (
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                      )}
                      {question.bloom_level && (
                        <Badge variant="secondary">{question.bloom_level}</Badge>
                      )}
                      {question.similarity && (
                        <Badge variant="outline" className="text-primary">
                          {Math.round(question.similarity * 100)}% uyğunluq
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(question.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Quiz Dialog */}
      <CreateQuizFromBank
        open={showCreateQuiz}
        onOpenChange={setShowCreateQuiz}
        selectedQuestions={getSelectedQuestionsList()}
        onRemoveQuestion={handleRemoveFromQuiz}
        onQuizCreated={handleQuizCreated}
      />
    </div>
  );
}
