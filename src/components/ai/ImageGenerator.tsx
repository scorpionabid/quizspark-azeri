import { useState } from "react";
import { Image, Loader2, Sparkles, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ImageGeneratorProps {
  questionText?: string;
  subject?: string;
  onImageGenerated: (imageUrl: string) => void;
  trigger?: React.ReactNode;
}

export function ImageGenerator({
  questionText,
  subject,
  onImageGenerated,
  trigger,
}: ImageGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() && !questionText) {
      toast.error("Prompt və ya sual mətni lazımdır");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-question-image', {
        body: {
          prompt: prompt.trim() || undefined,
          questionText,
          subject,
          saveToStorage: true,
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast.success("Şəkil uğurla yaradıldı!");
      }
    } catch (err) {
      console.error('Image generation error:', err);
      const message = err instanceof Error ? err.message : 'Şəkil yaradıla bilmədi';
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseImage = () => {
    if (generatedImage) {
      onImageGenerated(generatedImage);
      setIsOpen(false);
      setGeneratedImage(null);
      setPrompt("");
      toast.success("Şəkil suala əlavə edildi");
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `question-image-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Image className="h-4 w-4" />
            AI Şəkil Yarat
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI ilə Şəkil Yaradın
          </DialogTitle>
          <DialogDescription>
            Sual üçün izahedici diaqram və ya şəkil yaradın
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {questionText && (
            <div className="rounded-lg bg-muted/50 p-3">
              <Label className="text-xs text-muted-foreground">Sual mətni:</Label>
              <p className="text-sm mt-1 line-clamp-2">{questionText}</p>
            </div>
          )}

          <div>
            <Label htmlFor="prompt">Şəkil təsviri (ixtiyari)</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Məs: Üçbucağın sahəsini göstərən rəngli diaqram"
              className="mt-1.5 resize-none"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Boş buraxsanız, AI sual mətnindən avtomatik şəkil yaradacaq
            </p>
          </div>

          {generatedImage && (
            <div className="space-y-3">
              <Label>Yaradılmış şəkil:</Label>
              <div className="relative rounded-lg overflow-hidden border bg-muted/30">
                <img
                  src={generatedImage}
                  alt="Generated question illustration"
                  className="w-full h-auto max-h-64 object-contain"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Yüklə
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Yenidən yarat
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Ləğv et
            </Button>
            {generatedImage ? (
              <Button onClick={handleUseImage}>
                <Image className="h-4 w-4 mr-1" />
                Şəkli İstifadə Et
              </Button>
            ) : (
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Yaradılır...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1" />
                    Şəkil Yarat
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
