import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Crop as CropIcon,
  Sliders,
  Sparkles,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw as ResetIcon,
  Check,
  Loader2,
  Upload,
  Sun,
  Contrast,
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuestionImageUpload } from '@/hooks/useQuestionImageUpload';

interface ImageEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onSave: (newUrl: string) => Promise<void> | void;
  title?: string;
}

type AspectRatioPreset = 'free' | '1:1' | '4:3' | '16:9';

interface CropBox {
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  width: number; // percentage 0 - 100
  height: number; // percentage 0 - 100
}

const DEFAULT_CROP: CropBox = { x: 0, y: 0, width: 100, height: 100 };

export function ImageEditorDialog({
  open,
  onOpenChange,
  imageUrl,
  onSave,
  title = 'Sual Şəklini Redaktə Et',
}: ImageEditorDialogProps) {
  const { uploadImage, isUploading } = useQuestionImageUpload();

  // Working image source (may be replaced by user picking another file)
  const [currentSrc, setCurrentSrc] = useState<string>(imageUrl);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(true);

  // Edit controls
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [crop, setCrop] = useState<CropBox>(DEFAULT_CROP);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioPreset>('free');

  // Enhancements
  const [brightness, setBrightness] = useState<number>(0); // -50 to 50
  const [contrast, setContrast] = useState<number>(0); // -50 to 50
  const [scanClean, setScanClean] = useState<boolean>(false); // High-contrast B&W paper scan mode
  const [invert, setInvert] = useState<boolean>(false);

  // Zoom / View
  const [zoom, setZoom] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'crop' | 'adjust'>('crop');

  // DOM references
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{
    handle: string | null;
    startX: number;
    startY: number;
    initialCrop: CropBox;
  }>({
    handle: null,
    startX: 0,
    startY: 0,
    initialCrop: DEFAULT_CROP,
  });

  // Reset to initial state when dialog opens or imageUrl changes
  const resetAll = useCallback(() => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setCrop(DEFAULT_CROP);
    setAspectRatio('free');
    setBrightness(0);
    setContrast(0);
    setScanClean(false);
    setInvert(false);
    setZoom(1);
    setActiveTab('crop');
  }, []);

  useEffect(() => {
    if (open) {
      setCurrentSrc(imageUrl);
      resetAll();
    }
  }, [open, imageUrl, resetAll]);

  // Load image safely (fetch as blob or fallback with crossOrigin)
  useEffect(() => {
    if (!open || !currentSrc) return;

    let isMounted = true;
    setIsLoadingImage(true);

    const loadImage = async () => {
      try {
        let objectUrl = currentSrc;
        // If it's a remote URL, fetch blob to avoid tainted canvas
        if (currentSrc.startsWith('http://') || currentSrc.startsWith('https://')) {
          try {
            const res = await fetch(currentSrc, { mode: 'cors' });
            if (res.ok) {
              const blob = await res.blob();
              objectUrl = URL.createObjectURL(blob);
            }
          } catch {
            // fallback to direct load with anonymous crossorigin
            objectUrl = currentSrc;
          }
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          if (!isMounted) return;
          setLoadedImage(img);
          setIsLoadingImage(false);
        };
        img.onerror = () => {
          if (!isMounted) return;
          setIsLoadingImage(false);
          toast.error('Şəkil yüklənərkən xəta baş verdi');
        };
        img.src = objectUrl;
      } catch (err) {
        if (!isMounted) return;
        setIsLoadingImage(false);
        toast.error('Şəkil yüklənə bilmədi: ' + (err instanceof Error ? err.message : ''));
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [open, currentSrc]);

  // Rotate handlers
  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
    setCrop(DEFAULT_CROP);
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
    setCrop(DEFAULT_CROP);
  };

  const handleFlipH = () => setFlipH((prev) => !prev);
  const handleFlipV = () => setFlipV((prev) => !prev);

  // Aspect ratio presets
  const handleAspectRatioChange = (preset: AspectRatioPreset) => {
    setAspectRatio(preset);
    if (!loadedImage) return;

    if (preset === 'free') return;

    const isRotatedSideways = rotation % 180 !== 0;
    const transW = isRotatedSideways ? loadedImage.naturalHeight : loadedImage.naturalWidth;
    const transH = isRotatedSideways ? loadedImage.naturalWidth : loadedImage.naturalHeight;

    let targetRatio = 1;
    if (preset === '1:1') targetRatio = 1;
    else if (preset === '4:3') targetRatio = 4 / 3;
    else if (preset === '16:9') targetRatio = 16 / 9;

    const currentImgRatio = transW / transH;

    let newWidth = 90;
    let newHeight = 90;

    if (targetRatio > currentImgRatio) {
      // Wider than image
      newWidth = 90;
      newHeight = Math.min(90, (90 * currentImgRatio) / targetRatio);
    } else {
      // Taller than image
      newHeight = 90;
      newWidth = Math.min(90, (90 * targetRatio) / currentImgRatio);
    }

    setCrop({
      x: (100 - newWidth) / 2,
      y: (100 - newHeight) / 2,
      width: newWidth,
      height: newHeight,
    });
  };

  // Replace image file handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setCurrentSrc(localUrl);
      resetAll();
      toast.success('Yeni şəkil seçildi');
    }
  };

  // Crop Drag Handling
  const handlePointerDown = (e: React.PointerEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();

    dragRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initialCrop: { ...crop },
    };

    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.handle || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const deltaX = ((e.clientX - dragRef.current.startX) / rect.width) * 100;
    const deltaY = ((e.clientY - dragRef.current.startY) / rect.height) * 100;
    const { handle, initialCrop } = dragRef.current;

    let newX = initialCrop.x;
    let newY = initialCrop.y;
    let newW = initialCrop.width;
    let newH = initialCrop.height;

    const minSize = 5; // minimum 5%

    if (handle === 'move') {
      newX = Math.max(0, Math.min(100 - newW, initialCrop.x + deltaX));
      newY = Math.max(0, Math.min(100 - newH, initialCrop.y + deltaY));
    } else {
      if (handle.includes('e')) {
        newW = Math.max(minSize, Math.min(100 - newX, initialCrop.width + deltaX));
      }
      if (handle.includes('s')) {
        newH = Math.max(minSize, Math.min(100 - newY, initialCrop.height + deltaY));
      }
      if (handle.includes('w')) {
        const potentialW = initialCrop.width - deltaX;
        if (potentialW >= minSize && initialCrop.x + deltaX >= 0) {
          newX = initialCrop.x + deltaX;
          newW = potentialW;
        }
      }
      if (handle.includes('n')) {
        const potentialH = initialCrop.height - deltaY;
        if (potentialH >= minSize && initialCrop.y + deltaY >= 0) {
          newY = initialCrop.y + deltaY;
          newH = potentialH;
        }
      }
    }

    setCrop({
      x: Math.round(newX * 10) / 10,
      y: Math.round(newY * 10) / 10,
      width: Math.round(newW * 10) / 10,
      height: Math.round(newH * 10) / 10,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragRef.current.handle) {
      dragRef.current.handle = null;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  // Perform Final Canvas Render & Save
  const handleSave = async () => {
    if (!loadedImage) return;

    try {
      const natW = loadedImage.naturalWidth;
      const natH = loadedImage.naturalHeight;

      // 1. Calculate transformed dimensions
      const isRotatedSideways = rotation % 180 !== 0;
      const transW = isRotatedSideways ? natH : natW;
      const transH = isRotatedSideways ? natW : natH;

      // 2. Intermediate canvas for rotation & flip & filters
      const intermediateCanvas = document.createElement('canvas');
      intermediateCanvas.width = transW;
      intermediateCanvas.height = transH;
      const ctx = intermediateCanvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Canvas konteksti yaradıla bilmədi');

      // Filters
      const filterParts: string[] = [];
      if (brightness !== 0) filterParts.push(`brightness(${100 + brightness}%)`);
      if (contrast !== 0) filterParts.push(`contrast(${100 + contrast}%)`);
      if (invert) filterParts.push('invert(100%)');
      if (filterParts.length > 0) {
        ctx.filter = filterParts.join(' ');
      }

      ctx.save();
      ctx.translate(transW / 2, transH / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(loadedImage, -natW / 2, -natH / 2);
      ctx.restore();

      // Reset filter
      ctx.filter = 'none';

      // 3. Scan paper / B&W clean filter
      if (scanClean) {
        const imgData = ctx.getImageData(0, 0, transW, transH);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
          const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          // Paper whitening threshold:
          // Whiten grey/yellow paper background, darken text
          let val: number;
          if (gray >= 170) {
            val = 255;
          } else if (gray <= 100) {
            val = 10;
          } else {
            val = Math.round(((gray - 100) / 70) * 245 + 10);
          }
          d[i] = val;
          d[i + 1] = val;
          d[i + 2] = val;
        }
        ctx.putImageData(imgData, 0, 0);
      }

      // 4. Crop slice
      const normX = crop.x / 100;
      const normY = crop.y / 100;
      const normW = crop.width / 100;
      const normH = crop.height / 100;

      const srcX = Math.max(0, Math.round(normX * transW));
      const srcY = Math.max(0, Math.round(normY * transH));
      const srcW = Math.max(10, Math.min(transW - srcX, Math.round(normW * transW)));
      const srcH = Math.max(10, Math.min(transH - srcY, Math.round(normH * transH)));

      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = srcW;
      finalCanvas.height = srcH;
      const finalCtx = finalCanvas.getContext('2d');
      if (!finalCtx) throw new Error('Final canvas konteksti yaradıla bilmədi');

      finalCtx.drawImage(intermediateCanvas, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);

      // 5. Convert to Blob & Upload to Supabase Storage
      const blob = await new Promise<Blob | null>((resolve) => {
        finalCanvas.toBlob(resolve, 'image/webp', 0.92);
      });

      if (!blob) throw new Error('Şəkil faylı yaradıla bilmədi');

      const file = new File([blob], `q_img_${Date.now()}.webp`, { type: 'image/webp' });
      const publicUrl = await uploadImage(file);

      if (publicUrl) {
        await onSave(publicUrl);
        toast.success('Şəkil uğurla yadda saxlanıldı!');
        onOpenChange(false);
      }
    } catch (err) {
      toast.error('Şəkil saxlanılarkən xəta: ' + (err instanceof Error ? err.message : 'Naməlum'));
    }
  };

  const isRotatedSideways = rotation % 180 !== 0;
  const displayW = loadedImage
    ? isRotatedSideways
      ? loadedImage.naturalHeight
      : loadedImage.naturalWidth
    : 0;
  const displayH = loadedImage
    ? isRotatedSideways
      ? loadedImage.naturalWidth
      : loadedImage.naturalHeight
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden bg-background z-[60]">
        {/* Header */}
        <DialogHeader className="p-4 sm:px-6 border-b flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <CropIcon className="h-5 w-5 text-primary" />
            <DialogTitle className="text-base sm:text-lg font-semibold">{title}</DialogTitle>
          </div>
          {displayW > 0 && (
            <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
              {displayW} × {displayH} px
            </span>
          )}
        </DialogHeader>

        {/* Hidden file input for Replace */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Main Workspace Body */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Canvas / Image Preview Area */}
          <div
            className="flex-1 relative flex items-center justify-center p-4 bg-muted/40 dark:bg-muted/10 overflow-hidden select-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {isLoadingImage && (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm">Şəkil yüklənir...</span>
              </div>
            )}

            {!isLoadingImage && loadedImage && (
              <div
                className="relative max-w-full max-h-full flex items-center justify-center"
                style={{
                  transform: `scale(${zoom})`,
                  transition: 'transform 0.15s ease-out',
                }}
              >
                {/* Image Container with bounds */}
                <div
                  ref={containerRef}
                  className="relative shadow-md rounded border overflow-hidden bg-white/5"
                  style={{
                    maxHeight: '60vh',
                    maxWidth: '100%',
                    aspectRatio: `${displayW} / ${displayH}`,
                  }}
                >
                  {/* Visual Rendered Image */}
                  <img
                    src={currentSrc}
                    alt="Redaktə olunan şəkil"
                    className="max-h-[60vh] max-w-full object-contain pointer-events-none transition-all duration-150"
                    style={{
                      transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
                      filter: [
                        brightness !== 0 ? `brightness(${100 + brightness}%)` : '',
                        contrast !== 0 ? `contrast(${100 + contrast}%)` : '',
                        invert ? 'invert(100%)' : '',
                        scanClean ? 'grayscale(100%) contrast(150%)' : '',
                      ]
                        .filter(Boolean)
                        .join(' '),
                    }}
                  />

                  {/* Dark Backdrop outside Crop Box */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(transparent, transparent)`,
                    }}
                  >
                    {/* Top Scrim */}
                    <div
                      className="absolute left-0 right-0 top-0 bg-black/55 backdrop-blur-[0.5px]"
                      style={{ height: `${crop.y}%` }}
                    />
                    {/* Bottom Scrim */}
                    <div
                      className="absolute left-0 right-0 bottom-0 bg-black/55 backdrop-blur-[0.5px]"
                      style={{ height: `${100 - (crop.y + crop.height)}%` }}
                    />
                    {/* Left Scrim */}
                    <div
                      className="absolute left-0 bg-black/55 backdrop-blur-[0.5px]"
                      style={{
                        top: `${crop.y}%`,
                        height: `${crop.height}%`,
                        width: `${crop.x}%`,
                      }}
                    />
                    {/* Right Scrim */}
                    <div
                      className="absolute right-0 bg-black/55 backdrop-blur-[0.5px]"
                      style={{
                        top: `${crop.y}%`,
                        height: `${crop.height}%`,
                        width: `${100 - (crop.x + crop.width)}%`,
                      }}
                    />
                  </div>

                  {/* Interactive Crop Box */}
                  <div
                    className="absolute border-2 border-primary shadow-[0_0_0_1px_rgba(255,255,255,0.7)] cursor-move select-none"
                    style={{
                      left: `${crop.x}%`,
                      top: `${crop.y}%`,
                      width: `${crop.width}%`,
                      height: `${crop.height}%`,
                    }}
                    onPointerDown={(e) => handlePointerDown(e, 'move')}
                  >
                    {/* Grid Lines (Rule of thirds) */}
                    <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30">
                      <div className="border-r border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-b border-white" />
                      <div className="border-r border-white" />
                      <div className="border-r border-white" />
                      <div />
                    </div>

                    {/* Corner Handles */}
                    <div
                      className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-primary border-2 border-white rounded-full cursor-nwse-resize shadow"
                      onPointerDown={(e) => handlePointerDown(e, 'nw')}
                    />
                    <div
                      className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-primary border-2 border-white rounded-full cursor-nesw-resize shadow"
                      onPointerDown={(e) => handlePointerDown(e, 'ne')}
                    />
                    <div
                      className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-primary border-2 border-white rounded-full cursor-nesw-resize shadow"
                      onPointerDown={(e) => handlePointerDown(e, 'sw')}
                    />
                    <div
                      className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-primary border-2 border-white rounded-full cursor-nwse-resize shadow"
                      onPointerDown={(e) => handlePointerDown(e, 'se')}
                    />

                    {/* Edge Handles */}
                    <div
                      className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-4 bg-primary border border-white rounded-sm cursor-ew-resize shadow"
                      onPointerDown={(e) => handlePointerDown(e, 'w')}
                    />
                    <div
                      className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-4 bg-primary border border-white rounded-sm cursor-ew-resize shadow"
                      onPointerDown={(e) => handlePointerDown(e, 'e')}
                    />
                    <div
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-primary border border-white rounded-sm cursor-ns-resize shadow"
                      onPointerDown={(e) => handlePointerDown(e, 'n')}
                    />
                    <div
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-primary border border-white rounded-sm cursor-ns-resize shadow"
                      onPointerDown={(e) => handlePointerDown(e, 's')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Floating Zoom Bar */}
            <div className="absolute bottom-3 left-4 flex items-center gap-1 bg-background/80 backdrop-blur-md px-2 py-1 rounded-lg border shadow-sm text-xs">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
                    >
                      <ZoomOut className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Kiçilt</TooltipContent>
                </Tooltip>

                <span className="w-10 text-center font-mono text-[11px]">
                  {Math.round(zoom * 100)}%
                </span>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Böyüt</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-1"
                      onClick={() => setZoom(1)}
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Ekrana uyğunlaşdır</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Right Control Sidebar */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l p-4 flex flex-col gap-4 bg-card overflow-y-auto">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as 'crop' | 'adjust')}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="crop" className="text-xs gap-1.5">
                  <CropIcon className="h-3.5 w-3.5" /> Kəsim & Döndərmə
                </TabsTrigger>
                <TabsTrigger value="adjust" className="text-xs gap-1.5">
                  <Sliders className="h-3.5 w-3.5" /> Təmizləmə & Rəng
                </TabsTrigger>
              </TabsList>

              {/* ── TAB 1: Kəsim və Döndərmə ── */}
              <TabsContent value="crop" className="space-y-4 pt-3 mt-0">
                {/* Rotation & Flip */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Döndərmə və Çevirmə
                  </Label>
                  <div className="grid grid-cols-4 gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-col h-14 p-1 text-[11px]"
                      onClick={handleRotateLeft}
                    >
                      <RotateCcw className="h-4 w-4 mb-1" />
                      90° Sola
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-col h-14 p-1 text-[11px]"
                      onClick={handleRotateRight}
                    >
                      <RotateCw className="h-4 w-4 mb-1" />
                      90° Sağa
                    </Button>
                    <Button
                      type="button"
                      variant={flipH ? 'secondary' : 'outline'}
                      size="sm"
                      className="flex-col h-14 p-1 text-[11px]"
                      onClick={handleFlipH}
                    >
                      <FlipHorizontal className="h-4 w-4 mb-1" />
                      Güzgü (Üf)
                    </Button>
                    <Button
                      type="button"
                      variant={flipV ? 'secondary' : 'outline'}
                      size="sm"
                      className="flex-col h-14 p-1 text-[11px]"
                      onClick={handleFlipV}
                    >
                      <FlipVertical className="h-4 w-4 mb-1" />
                      Güzgü (Şaq)
                    </Button>
                  </div>
                </div>

                {/* Aspect Ratio Presets */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      Kəsim Ölçüsü (Proporsiya)
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[11px] px-1.5 text-primary"
                      onClick={() => setCrop(DEFAULT_CROP)}
                    >
                      Bütün Şəkil
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['free', '1:1', '4:3', '16:9'] as AspectRatioPreset[]).map((preset) => (
                      <Button
                        key={preset}
                        type="button"
                        variant={aspectRatio === preset ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 text-xs capitalize"
                        onClick={() => handleAspectRatioChange(preset)}
                      >
                        {preset === 'free' ? 'Sərbəst' : preset}
                      </Button>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Şəkildəki çərçivənin künclərindən tutaraq artıq kənarları kəsib çıxara
                    bilərsiniz.
                  </p>
                </div>

                {/* Replace Image Button */}
                <div className="pt-2 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-xs gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Başqa Şəkillə Əvəz Et
                  </Button>
                </div>
              </TabsContent>

              {/* ── TAB 2: Tənzimləmə & Təmizləmə ── */}
              <TabsContent value="adjust" className="space-y-4 pt-3 mt-0">
                {/* Paper Scanner B&W Mode */}
                <div className="p-3 rounded-lg border bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <Label htmlFor="scan-clean" className="text-xs font-semibold cursor-pointer">
                        Skaner Təmizliyi (Ağ-Qara)
                      </Label>
                    </div>
                    <Switch id="scan-clean" checked={scanClean} onCheckedChange={setScanClean} />
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Kağızdan çəkilmiş şəkillərdəki boz və sarı kölgələri silir, ağ fon və təmiz qara
                    mətn yaradır.
                  </p>
                </div>

                {/* Invert Colors */}
                <div className="flex items-center justify-between p-2.5 rounded-lg border">
                  <Label htmlFor="invert-toggle" className="text-xs font-medium cursor-pointer">
                    Rəngləri İnvert Et (Qara fon)
                  </Label>
                  <Switch id="invert-toggle" checked={invert} onCheckedChange={setInvert} />
                </div>

                {/* Brightness Slider */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                      <Sun className="h-3.5 w-3.5" /> Parlaqlıq
                    </span>
                    <span className="font-mono text-[11px]">{brightness > 0 ? `+${brightness}` : brightness}%</span>
                  </div>
                  <Slider
                    value={[brightness]}
                    min={-50}
                    max={50}
                    step={2}
                    onValueChange={([val]) => setBrightness(val)}
                  />
                </div>

                {/* Contrast Slider */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                      <Contrast className="h-3.5 w-3.5" /> Kontrast
                    </span>
                    <span className="font-mono text-[11px]">{contrast > 0 ? `+${contrast}` : contrast}%</span>
                  </div>
                  <Slider
                    value={[contrast]}
                    min={-50}
                    max={50}
                    step={2}
                    onValueChange={([val]) => setContrast(val)}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Reset All */}
            <div className="mt-auto pt-3 border-t">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full text-xs text-muted-foreground gap-1.5 hover:text-foreground"
                onClick={resetAll}
              >
                <ResetIcon className="h-3.5 w-3.5" />
                Bütün Düzəlişləri Sıfırla
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-3 sm:px-6 border-t bg-muted/20 flex-row items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Ləğv et
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={isUploading || isLoadingImage}
            className="gap-2 font-medium"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Yadda saxlanılır...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Yadda Saxla və Tətbiq Et
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
