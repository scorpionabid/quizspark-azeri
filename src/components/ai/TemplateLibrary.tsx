import { useState } from "react";
import { Plus, Save, Trash2, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  subject?: string;
  createdAt: Date;
}

const defaultTemplates: PromptTemplate[] = [
  {
    id: "1",
    name: "Standart Çoxseçimli",
    description: "Klassik 4 variantlı test sualları",
    prompt: `{topic} mövzusu üzrə {count} ədəd çoxseçimli sual yarat.
Hər sualda 4 variant olsun. Düzgün cavabı və qısa izahı göstər.
Çətinlik: {difficulty}`,
    subject: "Ümumi",
    createdAt: new Date()
  },
  {
    id: "2",
    name: "Bloom Taksonomiyası",
    description: "6 səviyyəli öyrənmə sualları",
    prompt: `{topic} mövzusu üzrə Bloom taksonomiyasının hər səviyyəsi üçün 1 sual yarat:
1. Yadda saxlama - faktları xatırlama
2. Anlama - mənanı izah etmə
3. Tətbiqetmə - bilikləri istifadə etmə
4. Analiz - hissələrə ayırma
5. Sintez - yeni ideyalar yaratma
6. Qiymətləndirmə - mühakimə etmə`,
    subject: "Ümumi",
    createdAt: new Date()
  },
  {
    id: "3",
    name: "Praktik Məsələlər",
    description: "Həyatdan nümunələrlə məsələlər",
    prompt: `{topic} mövzusu üzrə real həyatdan nümunələrlə {count} məsələ yarat.
Hər məsələdə:
- Şərt (real situasiya)
- Sual
- Həll yolu
- Cavab
Çətinlik: {difficulty}`,
    subject: "Riyaziyyat",
    createdAt: new Date()
  }
];

interface TemplateLibraryProps {
  onSelectTemplate: (template: PromptTemplate) => void;
}

export function TemplateLibrary({ onSelectTemplate }: TemplateLibraryProps) {
  const [templates, setTemplates] = useState<PromptTemplate[]>(defaultTemplates);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    prompt: "",
    subject: ""
  });

  const handleSelectTemplate = (template: PromptTemplate) => {
    setSelectedId(template.id);
    onSelectTemplate(template);
    toast.success(`"${template.name}" şablonu seçildi`);
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim() || !newTemplate.prompt.trim()) {
      toast.error("Ad və prompt tələb olunur");
      return;
    }

    const template: PromptTemplate = {
      id: crypto.randomUUID(),
      name: newTemplate.name,
      description: newTemplate.description,
      prompt: newTemplate.prompt,
      subject: newTemplate.subject || "Ümumi",
      createdAt: new Date()
    };

    setTemplates(prev => [...prev, template]);
    setNewTemplate({ name: "", description: "", prompt: "", subject: "" });
    setIsDialogOpen(false);
    toast.success("Şablon yaradıldı!");
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    if (selectedId === id) setSelectedId(null);
    toast.success("Şablon silindi");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">
            Şablon Kitabxanası
          </h3>
          <p className="text-sm text-muted-foreground">
            Hazır şablonları istifadə edin və ya özünüz yaradın
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Şablon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Yeni Şablon Yarat</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Şablon Adı *</Label>
                <Input
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Məs: Riyaziyyat Test Sualları"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Təsvir</Label>
                <Input
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Qısa təsvir"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Fənn</Label>
                <Input
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Məs: Riyaziyyat"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Prompt Şablonu *</Label>
                <Textarea
                  value={newTemplate.prompt}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="{topic}, {count}, {difficulty} dəyişənlərini istifadə edə bilərsiniz"
                  className="mt-1.5 min-h-[120px]"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Dəyişənlər: {"{topic}"}, {"{count}"}, {"{difficulty}"}, {"{subject}"}
                </p>
              </div>
              <Button onClick={handleCreateTemplate} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Şablonu Saxla
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className={cn(
              "group relative rounded-xl border-2 p-4 transition-all cursor-pointer",
              "hover:shadow-md",
              selectedId === template.id
                ? "border-primary bg-primary/5"
                : "border-border/50 hover:border-primary/50"
            )}
            onClick={() => handleSelectTemplate(template)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {template.subject}
                </span>
              </div>
              {selectedId === template.id && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
            <h4 className="mt-2 font-medium text-foreground">{template.name}</h4>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {template.description}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTemplate(template.id);
              }}
              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
