import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizId: string | null;
  quizTitle: string;
}

export function ShareQuizDialog({ open, onOpenChange, quizId, quizTitle }: ShareQuizDialogProps) {
  const [copied, setCopied] = useState(false);
  
  if (!quizId) return null;

  const shareUrl = `${window.location.origin}/quiz/${quizId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tələbələrlə Paylaş</DialogTitle>
          <DialogDescription>
            Tələbələrin quizi həll etməsi üçün aşağıdakı linki kopyalayıb onlara göndərin.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <p className="font-medium text-sm mb-2 truncate">{quizTitle}</p>
          <div className="flex items-center space-x-2">
            <Input readOnly value={shareUrl} className="flex-1" />
            <Button size="icon" variant="outline" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
