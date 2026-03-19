import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, LayoutPanelLeft, Sparkles, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { QuestionBankItem } from '@/hooks/useQuestionBank';
import { QUESTION_TYPES } from '@/types/question';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionBankCardProps {
  question: QuestionBankItem;
  isSelected: boolean;
  onSelect: (question: QuestionBankItem) => void;
  onSimilar?: (question: QuestionBankItem) => void;
}

export function QuestionBankCard({ question, isSelected, onSelect, onSimilar }: QuestionBankCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  const typeInfo = QUESTION_TYPES.find((t) => t.value === question.question_type);

  const getDifficultyColor = (diff: string | null) => {
    switch (diff?.toLowerCase()) {
      case 'asan': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'orta': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'çətin': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -2 }}
      className={`group relative rounded-2xl border p-5 transition-all duration-300 ${
        isSelected 
        ? 'border-primary/50 bg-primary/5 shadow-lg shadow-primary/5' 
        : 'border-border/50 bg-gradient-to-br from-card to-background hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Selection Checkbox */}
        <div className="mt-1 flex h-6 w-6 items-center justify-center">
          <Checkbox
            id={`q-${question.id}`}
            checked={isSelected}
            onCheckedChange={() => onSelect(question)}
            className="h-6 w-6 rounded-lg data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-300 transform group-hover:scale-110"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onSelect(question)}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="px-2 py-0.5 h-6 text-[10px] font-bold gap-1.5 bg-muted/50 border-transparent hover:bg-muted transition-colors">
              {typeInfo?.icon} {typeInfo?.label ?? question.question_type}
            </Badge>
            
            {question.difficulty && (
              <Badge 
                variant="outline" 
                className={`px-2 py-0.5 h-6 text-[10px] font-black uppercase tracking-widest ${getDifficultyColor(question.difficulty)}`}
              >
                {question.difficulty}
              </Badge>
            )}

            {question.category && (
              <Badge variant="outline" className="px-2 py-0.5 h-6 text-[10px] font-semibold text-muted-foreground border-dashed bg-background/50">
                <LayoutPanelLeft className="mr-1.5 h-3 w-3" />
                {question.category}
              </Badge>
            )}

            {question.quality_score && question.quality_score > 0.8 && (
                <Badge className="px-2 py-0.5 h-6 text-[10px] font-bold bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1">
                    <Sparkles className="h-3 w-3" />
                    Premium
                </Badge>
            )}
          </div>

          <Label 
            htmlFor={`q-${question.id}`}
            className="block text-base font-bold leading-tight text-foreground line-clamp-2 mb-3 cursor-pointer group-hover:text-primary transition-colors"
          >
            {question.question_text}
          </Label>

          <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-[11px] font-bold text-primary hover:text-primary hover:bg-primary/5 gap-2 rounded-full border border-transparent hover:border-primary/20 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPreview(!showPreview);
                    }}
                 >
                    {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {showPreview ? 'Gizlə' : 'Nəzər yetir'}
                    <ChevronRight className={`h-3 w-3 transition-transform duration-300 ${showPreview ? 'rotate-90' : ''}`} />
                 </Button>

                 {onSimilar && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-[11px] font-bold text-amber-600 hover:text-amber-700 hover:bg-amber-500/5 gap-2 rounded-full border border-transparent hover:border-amber-500/20 transition-all shadow-sm shadow-amber-500/5"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSimilar(question);
                      }}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Bənzərini Yarat
                    </Button>
                 )}
                 
                 {question.tags && question.tags.length > 0 && (
                   <div className="flex gap-1.5">
                     {question.tags.slice(0, 3).map(tag => (
                       <span key={tag} className="text-[10px] font-medium text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full border border-border/50">#{tag}</span>
                     ))}
                   </div>
                 )}
              </div>

              {question.weight && (
                <div className="text-[11px] font-black text-primary/60 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                    {question.weight} xal
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-5 pt-5 border-t border-border/50 space-y-4 animate-in fade-in duration-500">
               {/* Options if multiple choice */}
               {Array.isArray(question.options) && (
                 <div className="space-y-2">
                   <p className="font-black text-muted-foreground uppercase tracking-widest text-[9px] px-1">Seçimlər</p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {question.options.map((opt, i) => (
                        <div 
                            key={i} 
                            className={`p-3 rounded-xl border text-sm transition-all duration-300 ${
                            opt === question.correct_answer 
                            ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700 font-bold shadow-sm' 
                            : 'border-border/30 bg-muted/30 text-muted-foreground'
                            }`}
                        >
                           <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-background border border-border/50 mr-3 text-[10px] font-black">{String.fromCharCode(65 + i)}</span>
                           {opt}
                        </div>
                        ))}
                   </div>
                 </div>
               )}

               {/* Correct Answer for other types */}
               {!Array.isArray(question.options) && question.correct_answer && (
                 <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                    <p className="font-black text-emerald-700/70 uppercase tracking-widest text-[9px] mb-1">Düzgün Cavab</p>
                    <p className="text-emerald-700 font-bold text-sm">{question.correct_answer}</p>
                 </div>
               )}

               {/* Explanation */}
               {question.explanation && (
                 <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-3.5 w-3.5 text-primary opacity-50" />
                        <p className="font-black text-primary/70 uppercase tracking-widest text-[9px]">İzahat</p>
                    </div>
                    <p className="text-foreground/80 text-sm italic leading-relaxed">{question.explanation}</p>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
