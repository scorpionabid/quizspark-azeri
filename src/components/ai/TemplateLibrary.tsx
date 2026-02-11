import { useState } from "react";
import { Plus, Save, Trash2, FileText, Check, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  subject?: string;
  category?: string;
  createdAt: Date;
}

const templateCategories = [
  { value: "all", label: "Hamısı" },
  { value: "general", label: "Ümumi" },
  { value: "bloom", label: "Bloom Taksonomiyası" },
  { value: "practical", label: "Praktik" },
  { value: "analytical", label: "Analitik" },
  { value: "creative", label: "Yaradıcı" },
];

const defaultTemplates: PromptTemplate[] = [
  {
    id: "1",
    name: "Standart Çoxseçimli",
    description: "Klassik 4 variantlı test sualları",
    prompt: `{topic} mövzusu üzrə {count} ədəd çoxseçimli sual yarat.
Hər sualda 4 variant olsun. Düzgün cavabı və qısa izahı göstər.
Çətinlik: {difficulty}`,
    subject: "Ümumi",
    category: "general",
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
    category: "bloom",
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
    category: "practical",
    createdAt: new Date()
  },
  {
    id: "4",
    name: "Analitik Suallar",
    description: "Müqayisə, təhlil və qiymətləndirmə sualları",
    prompt: `{topic} mövzusu üzrə {count} analitik sual yarat.
Suallar müqayisə, səbəb-nəticə, təhlil və qiymətləndirmə tələb etməlidir.
Hər sualda 4 variant, düzgün cavab və ətraflı izah olsun.
Çətinlik: {difficulty}`,
    subject: "Ümumi",
    category: "analytical",
    createdAt: new Date()
  },
  {
    id: "5",
    name: "Yaradıcı Düşüncə",
    description: "Yaradıcı və tənqidi düşüncə sualları",
    prompt: `{topic} mövzusu üzrə {count} yaradıcı düşüncə sualı yarat.
Suallar alternativ həllər tapmağı, hipotez qurmağı və ya yeni ideyalar yaratmağı tələb etməlidir.
Hər sualda 4 variant olsun.
Çətinlik: {difficulty}`,
    subject: "Ümumi",
    category: "creative",
    createdAt: new Date()
  },
  {
    id: "6",
    name: "Doğru/Yanlış + İzah",
    description: "Doğru/Yanlış sualları ətraflı izahla",
    prompt: `{topic} mövzusu üzrə {count} Doğru/Yanlış sualı yarat.
Hər sual üçün ətraflı izah yaz ki, şagird niyə doğru və ya yanlış olduğunu başa düşsün.
Çətinlik: {difficulty}`,
    subject: "Ümumi",
    category: "general",
    createdAt: new Date()
  },
];

interface TemplateLibraryProps {
  onSelectTemplate: (template: PromptTemplate) => void;
}

export function TemplateLibrary({ onSelectTemplate }: TemplateLibraryProps) {
  const [templates, setTemplates] = useState<PromptTemplate[]>(defaultTemplates);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    prompt: "",
    subject: "",
    category: "general",
  });

  const filteredTemplates = templates.filter((t) => {
    const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
      category: newTemplate.category || "general",
      createdAt: new Date()
    };

    setTemplates(prev => [...prev, template]);
    setNewTemplate({ name: "", description: "", prompt: "", subject: "", category: "general" });
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
      <div className="flex items-center justify-between flex-wrap gap-3">
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
              <div className="grid grid-cols-2 gap-3">
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
                  <Label>Kateqoriya</Label>
                  <Select
                    value={newTemplate.category}
                    onValueChange={(v) => setNewTemplate(prev => ({ ...prev, category: v }))}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templateCategories.filter(c => c.value !== "all").map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1 flex-wrap">
            {templateCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  categoryFilter === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Şablon axtar..."
          className="max-w-xs h-8 text-sm"
        />
      </div>

      {/* Template Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Bu kateqoriyada şablon tapılmadı
          </div>
        )}
        {filteredTemplates.map((template) => (
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
              <div className="flex items-center gap-1">
                {template.category && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {templateCategories.find(c => c.value === template.category)?.label || template.category}
                  </Badge>
                )}
                {selectedId === template.id && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
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
