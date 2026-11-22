import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorNotebookItem } from "@/hooks/useStudentProgress";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Search,
  Zap,
  Filter,
  XCircle,
  HelpCircle,
  Sparkles,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ErrorNotebookProps {
  errors: ErrorNotebookItem[];
  onStartRemedial: () => void;
  onAskAIWithQuestion: (errorItem: ErrorNotebookItem) => void;
  onMarkResolved: (questionId: string) => void;
}

export function ErrorNotebook({
  errors,
  onStartRemedial,
  onAskAIWithQuestion,
  onMarkResolved
}: ErrorNotebookProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [filterResolved, setFilterResolved] = useState<'all' | 'unresolved' | 'resolved'>('unresolved');

  // Extract unique subjects
  const subjects = Array.from(new Set(errors.map(e => e.subject).filter(Boolean)));

  // Filtered items
  const filteredErrors = errors.filter(item => {
    const matchesSearch = item.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.quizTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || item.subject === selectedSubject;
    const matchesResolved =
      filterResolved === 'all'
        ? true
        : filterResolved === 'resolved'
        ? item.isResolved
        : !item.isResolved;

    return matchesSearch && matchesSubject && matchesResolved;
  });

  const unresolvedCount = errors.filter(e => !e.isResolved).length;
  const resolvedCount = errors.filter(e => e.isResolved).length;

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-card to-secondary/10 border border-border/50 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Ağıllı Səhvlər Dəftəri
            </h3>
            <Badge variant="secondary" className="font-semibold text-xs">
              {unresolvedCount} Aktiv Səhv
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Sınaqlarda səhv etdiyiniz bütün suallar avtomatik burada toplanır. Sokratik AI ilə təhlil edib təkrar sınaqda düzəldin.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {unresolvedCount > 0 && (
            <Button
              className="gap-2 shadow-lg shadow-primary/25 w-full md:w-auto"
              onClick={onStartRemedial}
            >
              <Zap className="h-4 w-4" />
              Səhvlərdən Sınaq Başlat ({unresolvedCount})
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sual mətni, mövzu və ya sınaq adı ilə axtar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card/60 border-border/60"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full sm:w-[160px] bg-card/60 border-border/60">
              <SelectValue placeholder="Bütün fənlər" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün fənlər</SelectItem>
              {subjects.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterResolved} onValueChange={(v) => setFilterResolved(v as 'all' | 'unresolved' | 'resolved')}>
            <SelectTrigger className="w-full sm:w-[150px] bg-card/60 border-border/60">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unresolved">Aktiv ({unresolvedCount})</SelectItem>
              <SelectItem value="resolved">Bərpa olunan ({resolvedCount})</SelectItem>
              <SelectItem value="all">Hamısı ({errors.length})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error Items List */}
      {filteredErrors.length === 0 ? (
        <Card className="bg-card/40 border-border/50 border-dashed p-12 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto opacity-70" />
            <h4 className="text-lg font-bold text-foreground">Səhvlər Dəftəri Təmizdir!</h4>
            <p className="text-sm text-muted-foreground">
              {filterResolved === 'unresolved'
                ? "Hal-hazırda həll edilməmiş səhviniz yoxdur. Əla nəticədir!"
                : "Axtarış filterinə uyğun səhv tapılmadı."}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredErrors.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
              >
                <Card className={`overflow-hidden transition-all bg-card/60 backdrop-blur-sm border ${
                  item.isResolved
                    ? 'border-emerald-500/30 bg-emerald-500/[0.02]'
                    : 'border-border/60 hover:border-primary/40 shadow-sm'
                }`}>
                  <CardHeader className="p-5 pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                          {item.subject}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {item.topic}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          • {item.quizTitle}
                        </span>
                      </div>

                      {item.isResolved ? (
                        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Bərpa edildi (+50 XP)
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                          Həll gözləyir
                        </Badge>
                      )}
                    </div>

                    <CardTitle className="text-base font-semibold pt-2 text-foreground leading-relaxed">
                      {item.questionText}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 space-y-4">
                    {/* Answer Comparison Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Sizin Seçiminiz:</span>
                        </div>
                        <p className="text-sm font-medium text-foreground pl-5">
                          {item.studentAnswer}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Düzgün Cavab:</span>
                        </div>
                        <p className="text-sm font-medium text-foreground pl-5">
                          {item.correctAnswer}
                        </p>
                      </div>
                    </div>

                    {/* Explanation Box */}
                    {item.explanation && (
                      <div className="p-3 rounded-xl bg-muted/40 border border-border/40 text-xs text-muted-foreground space-y-1">
                        <span className="font-semibold text-foreground flex items-center gap-1">
                          <HelpCircle className="h-3.5 w-3.5 text-primary" />
                          İzah:
                        </span>
                        <p className="leading-relaxed pl-4">{item.explanation}</p>
                      </div>
                    )}

                    {/* Actions Footer */}
                    <div className="pt-3 border-t border-border/30 flex flex-wrap items-center justify-between gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/10"
                        onClick={() => onAskAIWithQuestion(item)}
                      >
                        <Brain className="h-3.5 w-3.5" />
                        <span>AI Tyutor ilə Müzakirə Et</span>
                        <Sparkles className="h-3 w-3 text-amber-500" />
                      </Button>

                      {!item.isResolved && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                          onClick={() => onMarkResolved(item.questionId)}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Səhvi Başa Düşdüm (+50 XP)
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
