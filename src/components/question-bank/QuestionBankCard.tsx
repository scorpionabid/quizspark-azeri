import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, LayoutPanelLeft } from 'lucide-react';
import { useState } from 'react';
import { QuestionBankItem } from '@/hooks/useQuestionBank';
import { QUESTION_TYPES } from '@/types/question';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionBankCardProps {
  question: QuestionBankItem;
  isSelected: boolean;
  onSelect: (question: QuestionBankItem) => void;
}

export function QuestionBankCard({ question, isSelected, onSelect }: QuestionBankCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  const typeInfo = QUESTION_TYPES.find((t) => t.value === question.question_type);

  const getDifficultyColor = (diff: string | null) => {
    switch (diff?.toLowerCase()) {
      case 'asan': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'orta': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'çətin': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group relative rounded-xl border p-4 transition-all duration-200 ${
        isSelected 
        ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10' 
        : 'border-border bg-gradient-card hover:border-primary/40 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Selection Checkbox */}
        <div className="mt-1 flex h-5 w-5 items-center justify-center">
          <Checkbox
            id={`q-${question.id}`}
            checked={isSelected}
            onCheckedChange={() => onSelect(question)}
            className="h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onSelect(question)}>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="px-1.5 py-0 h-5 text-[10px] font-medium gap-1">
              {typeInfo?.icon} {typeInfo?.label ?? question.question_type}
            </Badge>
            
            {question.difficulty && (
              <Badge 
                variant="outline" 
                className={`px-1.5 py-0 h-5 text-[10px] font-bold uppercase tracking-wider ${getDifficultyColor(question.difficulty)}`}
              >
                {question.difficulty}
              </Badge>
            )}

            {question.category && (
              <Badge variant="outline" className="px-1.5 py-0 h-5 text-[10px] text-muted-foreground border-dashed">
                <LayoutPanelLeft className="mr-1 h-2.5 w-2.5" />
                {question.category}
              </Badge>
            )}

            {question.weight && (
              <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                {question.weight} xal
              </span>
            )}
          </div>

          <Label 
            htmlFor={`q-${question.id}`}
            className="block text-sm font-medium leading-snug text-foreground line-clamp-2 mb-1 cursor-pointer"
          >
            {question.question_text}
          </Label>

          <div className="flex items-center gap-3">
             <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[10px] text-primary hover:text-primary hover:bg-primary/5 gap-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPreview(!showPreview);
                }}
             >
                {showPreview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {showPreview ? 'Gizlə' : 'Önizləmə'}
             </Button>
             
             {question.tags && question.tags.length > 0 && (
               <div className="flex gap-1">
                 {question.tags.slice(0, 2).map(tag => (
                   <span key={tag} className="text-[9px] text-muted-foreground bg-muted/30 px-1 rounded">#{tag}</span>
                 ))}
                 {question.tags.length > 2 && <span className="text-[9px] text-muted-foreground">+{question.tags.length - 2}</span>}
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
            <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground space-y-3">
               {/* Options if multiple choice */}
               {Array.isArray(question.options) && (
                 <div className="space-y-1.5">
                   <p className="font-semibold text-foreground/70 uppercase tracking-tighter text-[9px]">Variantlar:</p>
                   {question.options.map((opt, i) => (
                     <div 
                        key={i} 
                        className={`p-2 rounded-md border ${
                          opt === question.correct_answer 
                          ? 'border-green-500/30 bg-green-500/5 text-green-700 font-medium' 
                          : 'border-border/40 bg-muted/20'
                        }`}
                      >
                       {opt}
                     </div>
                   ))}
                 </div>
               )}

               {/* Correct Answer for other types */}
               {!Array.isArray(question.options) && question.correct_answer && (
                 <div>
                   <p className="font-semibold text-foreground/70 uppercase tracking-tighter text-[9px]">Düzgün Cavab:</p>
                   <p className="mt-1 text-foreground font-medium">{question.correct_answer}</p>
                 </div>
               )}

               {/* Explanation */}
               {question.explanation && (
                 <div className="bg-amber-500/5 border border-amber-500/10 rounded-md p-2">
                   <p className="font-semibold text-amber-700/70 uppercase tracking-tighter text-[9px]">İzahat:</p>
                   <p className="mt-1 italic leading-relaxed">{question.explanation}</p>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
