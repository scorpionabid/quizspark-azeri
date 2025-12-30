import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  Upload, 
  Sparkles,
  GripVertical,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Question {
  id: string;
  type: 'mcq' | 'true-false' | 'short-answer';
  question: string;
  options: string[];
  correctAnswer: number | string;
  explanation?: string;
}

export default function CreateQuizPage() {
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [duration, setDuration] = useState("20");
  const [isPublic, setIsPublic] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      type: 'mcq',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    }
  ]);

  const addQuestion = (type: Question['type'] = 'mcq') => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      question: '',
      options: type === 'mcq' ? ['', '', '', ''] : type === 'true-false' ? ['Doğru', 'Yanlış'] : [],
      correctAnswer: 0,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length === 1) {
      toast.error("Ən azı bir sual olmalıdır");
      return;
    }
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleSave = (publish: boolean = false) => {
    if (!quizTitle.trim()) {
      toast.error("Quiz başlığı daxil edin");
      return;
    }
    if (!subject) {
      toast.error("Fənn seçin");
      return;
    }
    
    const emptyQuestions = questions.filter(q => !q.question.trim());
    if (emptyQuestions.length > 0) {
      toast.error("Bütün sualları doldurun");
      return;
    }

    toast.success(publish ? "Quiz uğurla dərc edildi!" : "Quiz qaralama olaraq saxlanıldı");
    navigate('/teacher/my-quizzes');
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/teacher/dashboard')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSave(false)}>
              <Save className="mr-2 h-4 w-4" />
              Qaralama
            </Button>
            <Button variant="game" onClick={() => handleSave(true)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Dərc Et
            </Button>
          </div>
        </div>

        {/* Quiz Details */}
        <div className="mb-8 rounded-2xl bg-gradient-card border border-border/50 p-6">
          <h2 className="mb-6 font-display text-xl font-bold text-foreground">Quiz Məlumatları</h2>
          
          <div className="grid gap-6">
            <div>
              <Label htmlFor="title">Quiz Başlığı *</Label>
              <Input
                id="title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Məs: Cəbr Əsasları"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Təsvir</Label>
              <Textarea
                id="description"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                placeholder="Quiz haqqında qısa məlumat..."
                className="mt-2"
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label>Fənn *</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Riyaziyyat</SelectItem>
                    <SelectItem value="physics">Fizika</SelectItem>
                    <SelectItem value="chemistry">Kimya</SelectItem>
                    <SelectItem value="biology">Biologiya</SelectItem>
                    <SelectItem value="history">Tarix</SelectItem>
                    <SelectItem value="geography">Coğrafiya</SelectItem>
                    <SelectItem value="literature">Ədəbiyyat</SelectItem>
                    <SelectItem value="english">İngilis dili</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Sinif</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 6, 7, 8, 9, 10, 11].map(g => (
                      <SelectItem key={g} value={g.toString()}>{g}-ci sinif</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Çətinlik</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Asan</SelectItem>
                    <SelectItem value="medium">Orta</SelectItem>
                    <SelectItem value="hard">Çətin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Müddət (dəq)</Label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min="5"
                  max="120"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Switch
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <div>
                <Label>İctimai Quiz</Label>
                <p className="text-xs text-muted-foreground">Bütün tələbələr bu quizə daxil ola bilər</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => addQuestion('mcq')}>
            <Plus className="mr-2 h-4 w-4" />
            Çoxseçimli
          </Button>
          <Button variant="outline" onClick={() => addQuestion('true-false')}>
            <Plus className="mr-2 h-4 w-4" />
            Doğru/Yanlış
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            İdxal Et
          </Button>
          <Button variant="outline" onClick={() => navigate('/teacher/ai-assistant')}>
            <Sparkles className="mr-2 h-4 w-4" />
            AI ilə Yarat
          </Button>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="rounded-2xl bg-gradient-card border border-border/50 p-6 animate-scale-in"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <Badge variant={question.type === 'mcq' ? 'default' : question.type === 'true-false' ? 'secondary' : 'accent'}>
                    {question.type === 'mcq' ? 'Çoxseçimli' : question.type === 'true-false' ? 'Doğru/Yanlış' : 'Qısa Cavab'}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestion(question.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Sual *</Label>
                  <Textarea
                    value={question.question}
                    onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                    placeholder="Sualınızı daxil edin..."
                    className="mt-2"
                    rows={2}
                  />
                </div>

                {question.type !== 'short-answer' && (
                  <div>
                    <Label>Seçimlər</Label>
                    <div className="mt-2 space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuestion(question.id, 'correctAnswer', optIndex)}
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-bold transition-colors",
                              question.correctAnswer === optIndex
                                ? "border-success bg-success/20 text-success"
                                : "border-border bg-muted text-muted-foreground hover:border-primary"
                            )}
                          >
                            {String.fromCharCode(65 + optIndex)}
                          </button>
                          <Input
                            value={option}
                            onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                            placeholder={`Seçim ${String.fromCharCode(65 + optIndex)}`}
                            disabled={question.type === 'true-false'}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Düzgün cavabı seçmək üçün hərfə klikləyin
                    </p>
                  </div>
                )}

                <div>
                  <Label>İzahı (ixtiyari)</Label>
                  <Textarea
                    value={question.explanation || ''}
                    onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                    placeholder="Cavabın izahını yazın..."
                    className="mt-2"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Question Button */}
        <div className="mt-6 flex justify-center">
          <Button variant="outline" size="lg" onClick={() => addQuestion('mcq')}>
            <Plus className="mr-2 h-5 w-5" />
            Sual Əlavə Et
          </Button>
        </div>
      </div>
    </div>
  );
}
