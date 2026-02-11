 import { useState } from "react";
 import { 
   Sparkles, 
   TrendingDown, 
   TrendingUp, 
   ListChecks, 
   FileText, 
   Copy,
   Loader2
 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
   DropdownMenuSeparator,
   DropdownMenuLabel,
 } from "@/components/ui/dropdown-menu";
 import { toast } from "sonner";
 import { supabase } from "@/integrations/supabase/client";
 import { GeneratedQuestion } from "@/components/quiz/EditableQuestionCard";
 
 export type EnhanceAction = 
   | "simplify" 
   | "harder" 
   | "improve_options" 
   | "expand_explanation" 
   | "similar";
 
 interface QuestionEnhancerProps {
   question: GeneratedQuestion;
   onEnhanced: (enhanced: GeneratedQuestion) => void;
   onSimilarCreated?: (newQuestion: GeneratedQuestion) => void;
 }
 
 const enhanceActions: { 
   action: EnhanceAction; 
   label: string; 
   icon: typeof Sparkles;
   description: string;
 }[] = [
   { 
     action: "simplify", 
     label: "Sadələşdir", 
     icon: TrendingDown,
     description: "Sualı daha asan formaya çevir"
   },
   { 
     action: "harder", 
     label: "Çətinləşdir", 
     icon: TrendingUp,
     description: "Sualı daha mürəkkəb et"
   },
   { 
     action: "improve_options", 
     label: "Variantları yaxşılaşdır", 
     icon: ListChecks,
     description: "Distraktorları gücləndir"
   },
   { 
     action: "expand_explanation", 
     label: "İzahı genişləndir", 
     icon: FileText,
     description: "Daha ətraflı izah yaz"
   },
   { 
     action: "similar", 
     label: "Oxşar sual yarat", 
     icon: Copy,
     description: "Eyni mövzuda yeni sual"
   },
 ];
 
 export function QuestionEnhancer({ 
   question, 
   onEnhanced,
   onSimilarCreated
 }: QuestionEnhancerProps) {
   const [isLoading, setIsLoading] = useState(false);
   const [loadingAction, setLoadingAction] = useState<EnhanceAction | null>(null);
 
   const handleEnhance = async (action: EnhanceAction) => {
     setIsLoading(true);
     setLoadingAction(action);
 
     try {
       const { data, error } = await supabase.functions.invoke('enhance-question', {
         body: { question, action }
       });
 
       if (error) throw error;
 
       if (data.error) {
         throw new Error(data.error);
       }
 
       if (data.enhancedQuestion) {
         if (action === "similar" && onSimilarCreated) {
           onSimilarCreated({
             ...data.enhancedQuestion,
             id: `enhanced-${Date.now()}`
           });
           toast.success("Oxşar sual yaradıldı!");
         } else {
           onEnhanced({
             ...question,
             ...data.enhancedQuestion,
           });
           const actionLabels: Record<EnhanceAction, string> = {
             simplify: "Sual sadələşdirildi",
             harder: "Sual çətinləşdirildi",
             improve_options: "Variantlar yaxşılaşdırıldı",
             expand_explanation: "İzah genişləndirildi",
             similar: "Oxşar sual yaradıldı",
           };
           toast.success(actionLabels[action]);
         }
       }
     } catch (err) {
       console.error('Enhance error:', err);
       toast.error(err instanceof Error ? err.message : 'Xəta baş verdi');
     } finally {
       setIsLoading(false);
       setLoadingAction(null);
     }
   };
 
   return (
     <DropdownMenu>
       <DropdownMenuTrigger asChild>
         <Button
           variant="ghost"
           size="sm"
           disabled={isLoading}
           className="gap-1"
         >
           {isLoading ? (
             <Loader2 className="h-4 w-4 animate-spin" />
           ) : (
             <Sparkles className="h-4 w-4 text-primary" />
           )}
           <span className="hidden sm:inline">AI</span>
         </Button>
       </DropdownMenuTrigger>
       <DropdownMenuContent align="end" className="w-56">
         <DropdownMenuLabel className="flex items-center gap-2">
           <Sparkles className="h-4 w-4 text-primary" />
           AI Təklifləri
         </DropdownMenuLabel>
         <DropdownMenuSeparator />
         {enhanceActions.map(({ action, label, icon: Icon, description }) => (
           <DropdownMenuItem
             key={action}
             onClick={() => handleEnhance(action)}
             disabled={isLoading}
             className="flex items-start gap-3 py-2"
           >
             {loadingAction === action ? (
               <Loader2 className="h-4 w-4 mt-0.5 animate-spin" />
             ) : (
               <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
             )}
             <div className="flex flex-col">
               <span className="font-medium">{label}</span>
               <span className="text-xs text-muted-foreground">{description}</span>
             </div>
           </DropdownMenuItem>
         ))}
       </DropdownMenuContent>
     </DropdownMenu>
   );
 }