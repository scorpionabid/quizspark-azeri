import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2, Download, ExternalLink } from 'lucide-react';

interface ImageViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  title?: string;
}

export function ImageViewerDialog({
  open,
  onOpenChange,
  imageUrl,
  title = 'Sual Şəklinə Tam Baxış',
}: ImageViewerDialogProps) {
  const [zoom, setZoom] = useState(1);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `sual_sekli_${Date.now()}`;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden bg-background z-[60]">
        <DialogHeader className="p-4 sm:px-6 border-b flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1"
              onClick={handleDownload}
            >
              <Download className="h-3.5 w-3.5" />
              Yüklə
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1"
              asChild
            >
              <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                Ayrı tabda aç
              </a>
            </Button>
          </div>
        </DialogHeader>

        {/* Image Display */}
        <div className="flex-1 relative flex items-center justify-center p-4 bg-muted/40 min-h-[400px] max-h-[70vh] overflow-auto select-none">
          <img
            src={imageUrl}
            alt="Sual şəkli tam baxış"
            className="max-w-full max-h-[65vh] object-contain transition-transform duration-150 rounded shadow-sm border bg-card"
            style={{ transform: `scale(${zoom})` }}
          />

          {/* Quick Floating Zoom Bar */}
          <div className="absolute bottom-4 left-6 flex items-center gap-1 bg-background/90 backdrop-blur-md px-2 py-1 rounded-lg border shadow text-xs">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="w-12 text-center font-mono text-xs">{Math.round(zoom * 100)}%</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 ml-1"
              onClick={() => setZoom(1)}
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
