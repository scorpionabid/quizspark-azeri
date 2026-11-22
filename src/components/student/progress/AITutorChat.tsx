import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Brain,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  Zap,
  CheckCircle2,
  HelpCircle,
  Lightbulb
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  questionContext?: {
    questionText: string;
    studentAnswer?: string;
    correctAnswer?: string;
  };
}

interface AITutorChatProps {
  initialPrompt?: string;
  weakTopics?: string[];
  onClearInitialPrompt?: () => void;
}

export function AITutorChat({
  initialPrompt,
  weakTopics = [],
  onClearInitialPrompt
}: AITutorChatProps) {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Salam, ${profile?.full_name || 'Dəyərli Şagird'}! 👋 Mən sənin şəxsi **AI Təhsil Mentorunam**. 

Mən sənə birbaşa hazır cavab vermək əvəzinə, sualları addım-addım düşünərək **özünün kəşf etməyinə** kömək edəcəyəm (Sokratik metod). 

Aşağıdakı mövzulardan birini seçə və ya səhv etdiyin sualı birbaşa mənə göndərə bilərsən!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = useCallback(async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      // Build conversation payload
      const socraticSystemPrompt = `Sən şagirdlər üçün Azərbaycan dilində fəaliyyət göstərən interaktiv, mehriban və həvəsləndirici Sokratik AI Tyutorsan (Mentor).
Qaydaların:
1. Şagirdə heç vaxt birbaşa hazır cavabı əzbərlətmə. Onu düşündürən, addım-addım düzgün məntiqə aparan istiqamətverici suallar və ipucları ver.
2. Əgər şagird səhv cavab veribsə, səhvin kökünü (nəzəriyyə, diqqətsizlik və ya düstur çaşqınlığı) araşdır və dostcasına izah et.
3. Cavabların qısa, aydın, bəndlər və emojilərlə zəngin olsun. Şagirdi yormadan öyrət.
4. Şagird mini-sınaq istədikdə, sualı təqdim et və şagirdin cavab verməsini gözlə.
5. Azərbaycan dilinin qrammatika və orfoqrafiya qaydalarına dəqiq riayət et.`;

      const apiMessages = [
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: text },
      ];

      // Invoke Supabase edge function 'ai-chat'
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: apiMessages,
          systemPrompt: socraticSystemPrompt,
          agentId: 'student-socratic-tutor',
        },
      });

      let responseText = '';
      if (error || !data) {
        // Fallback friendly AI mentor response if edge function/gateway is unavailable
        responseText = `Mən sənin sualını nəzərdən keçirdim! 🌟 

Gəl bu məsələyə addım-addım yanaşaq:
1. **Əsas qayda:** Bu mövzuda ən çox diqqət edilməli olan məqam şərtdə verilən əsas amilləri düzgün müəyyən etməkdir.
2. **Düşünmək üçün sual:** Səncə şərtdə ən həlledici detal hansıdır? 

Cavabını yaz, birlikdə təhlil edək!`;
      } else if (typeof data === 'string') {
        responseText = data;
      } else if (data.reply || data.content || data.message) {
        responseText = data.reply || data.content || data.message;
      } else if (data.choices && data.choices[0]?.message?.content) {
        responseText = data.choices[0].message.content;
      } else {
        responseText = JSON.stringify(data);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: unknown) {
      console.error("AI Tutor error:", err);
      toast.error("AI Tyutor ilə əlaqə zamanı xəta baş verdi. Yenidən cəhd edin.");
    } finally {
      setIsLoading(false);
    }
  }, [inputPrompt, isLoading, messages]);

  // Handle incoming initial prompt from Error Notebook or Radar
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() !== '') {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt, handleSendMessage, onClearInitialPrompt]);

  const quickPrompts = [
    {
      label: '🎯 Zəif Mövzularımı Analiz Et',
      prompt: weakTopics.length > 0
        ? `Mənim ən çox çətinlik çəkdiyim mövzular bunlardır: ${weakTopics.join(', ')}. Bu mövzularda nəticəmi necə artıra bilərəm?`
        : 'Sınaqlardakı nəticələrimə baxaraq hansı sahələrdə zəif olduğumu və inkişaf yollarını mənə izah et.',
    },
    {
      label: '📝 3 Suallıq Mini-Sınaq Hazırla',
      prompt: weakTopics.length > 0
        ? `Mənim üçün "${weakTopics[0]}" mövzusundan 3 ədəd maraqlı və öyrədici test sualı tərtib et. Hər sualdan sonra cavabımı gözlə və izah ver.`
        : 'Mənim üçün öyrədici 3 ədəd test sualı ver. Hər sualı tək-tək soruş.',
    },
    {
      label: '💡 Səhvləri necə aradan qaldırım?',
      prompt: 'Sınaqlarda diqqətsizlikdən və ya vaxt çatışmazlığından yaranan səhvləri minimuma endirmək üçün hansı taktikalardan istifadə etməliyəm?',
    },
    {
      label: '📅 Fərdi Tədris Planı Qur',
      prompt: 'Zəif olduğum fənlər üzrə gündəlik 20 dəqiqəlik, 5 günlük addım-addım bərpa planı tərtib et.',
    },
  ];

  // Text to Speech
  const toggleSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_`]/g, ''));
        utterance.lang = 'az-AZ';
        utterance.rate = 1.0;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      toast.error("Brauzeriniz səsli oxumanı dəstəkləmir.");
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Salam! Söhbət yeniləndi. Zəif mövzularını və ya anlamaqda çətinlik çəkdiyin sualları mənimlə bölüş, birlikdə həll edək! 🎯`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <Card className="flex flex-col h-[700px] bg-card/60 backdrop-blur-md border-border/60 shadow-lg overflow-hidden">
      {/* Chat Header */}
      <CardHeader className="p-4 border-b border-border/50 bg-muted/20 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-foreground shadow-md shadow-primary/25">
              <Brain className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-foreground">
                  Sokratik AI Tyutor
                </CardTitle>
                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                  Aktiv Mentor
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Səhvlərin kökünü araşdırır və suallarla düzgün həllə yönləndirir
              </CardDescription>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground gap-1"
            onClick={handleResetChat}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Söhbəti Yenilə
          </Button>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <Avatar className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
                <AvatarFallback className="text-primary font-bold text-xs">AI</AvatarFallback>
              </Avatar>
            )}

            <div className={`space-y-1 max-w-[85%] sm:max-w-[75%]`}>
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none shadow-md shadow-primary/20'
                    : 'bg-muted/60 text-foreground border border-border/50 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.content}
              </div>

              <div className="flex items-center gap-2 px-1 text-[10px] text-muted-foreground">
                <span>{msg.timestamp}</span>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => toggleSpeech(msg.content)}
                    className="hover:text-primary transition-colors flex items-center gap-1"
                    title="Səsləndir"
                  >
                    {isSpeaking ? <VolumeX className="h-3 w-3 text-primary" /> : <Volume2 className="h-3 w-3" />}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <Avatar className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
              <AvatarFallback className="text-primary font-bold text-xs">AI</AvatarFallback>
            </Avatar>
            <div className="p-3.5 rounded-2xl bg-muted/60 border border-border/50 rounded-bl-none text-xs text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary animate-spin" />
              <span>AI Mentor düşünür və izah hazırlayır...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="p-3 pt-0 border-t border-border/30 bg-card/40 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[11px] font-semibold text-muted-foreground shrink-0 flex items-center gap-1">
          <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
          Tövsiyə:
        </span>
        {quickPrompts.map((qp, i) => (
          <Button
            key={i}
            variant="outline"
            size="sm"
            className="text-xs h-7 rounded-full bg-background/50 hover:bg-primary/10 hover:text-primary border-border/60 shrink-0"
            onClick={() => handleSendMessage(qp.prompt)}
          >
            {qp.label}
          </Button>
        ))}
      </div>

      {/* Input Box Footer */}
      <div className="p-3 bg-card border-t border-border/50 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <Input
            placeholder="Sualını və ya anlamaqda çətinlik çəkdiyin mövzunu yaz..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isLoading}
            className="bg-muted/40 border-border/60 focus-visible:ring-primary"
          />
          <Button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="shadow-md shadow-primary/20 px-4 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
