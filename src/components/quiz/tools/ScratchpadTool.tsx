import React, { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import {
  Pencil,
  Eraser,
  Undo2,
  Trash2,
  MousePointer,
  FileText,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StrokePoint {
  x: number;
  y: number;
}

interface Stroke {
  mode: 'pen' | 'eraser';
  color: string;
  size: number;
  points: StrokePoint[];
}

const PEN_COLORS = [
  { id: 'blue', value: '#2563eb', label: 'Göy' },
  { id: 'red', value: '#dc2626', label: 'Qırmızı' },
  { id: 'slate', value: '#0f172a', label: 'Qara' },
  { id: 'green', value: '#16a34a', label: 'Yaşıl' },
];

const PEN_SIZES = [
  { id: 'thin', value: 2.5, label: 'İncə' },
  { id: 'medium', value: 4.5, label: 'Orta' },
  { id: 'thick', value: 8, label: 'Qalın' },
];

interface ScratchpadToolProps {
  onClose?: () => void;
  currentPage?: number;
}

export const ScratchpadTool: React.FC<ScratchpadToolProps> = ({
  onClose,
  currentPage,
}) => {
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<'pen' | 'eraser' | 'cursor'>('pen');
  const [color, setColor] = useState<string>(PEN_COLORS[0].value);
  const [size, setSize] = useState<number>(PEN_SIZES[1].value);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [whiteboardBg, setWhiteboardBg] = useState<boolean>(false);

  const isDrawingRef = useRef<boolean>(false);
  const currentStrokeRef = useRef<Stroke | null>(null);

  const redrawCanvas = useCallback((strokeList: Stroke[]) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const s of strokeList) {
      if (s.points.length === 0) continue;
      ctx.beginPath();
      ctx.globalCompositeOperation =
        s.mode === 'eraser' ? 'destination-out' : 'source-over';
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.mode === 'eraser' ? s.size * 5 : s.size;

      const [first, ...rest] = s.points;
      ctx.moveTo(first.x, first.y);
      if (rest.length === 0) {
        ctx.lineTo(first.x + 0.1, first.y + 0.1);
      } else {
        for (const pt of rest) {
          ctx.lineTo(pt.x, pt.y);
        }
      }
      ctx.stroke();
    }
    ctx.restore();
  }, []);

  // Size full-viewport overlay canvas and handle window resize
  useEffect(() => {
    const updateSize = () => {
      const canvas = overlayCanvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      redrawCanvas(strokes);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [redrawCanvas, strokes]);

  // Clear drawings when page changes so old question annotations don't cover new question
  useEffect(() => {
    setStrokes([]);
    const canvas = overlayCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [currentPage]);

  // Auto-reset completely when component unmounts ("Qələmi söndürəndə yazılar da silinsin")
  useEffect(() => {
    return () => {
      setStrokes([]);
      currentStrokeRef.current = null;
      isDrawingRef.current = false;
    };
  }, []);

  const getPointerCoords = (
    e: React.PointerEvent<HTMLCanvasElement>,
  ): StrokePoint => {
    const canvas = overlayCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (mode === 'cursor') return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    const pt = getPointerCoords(e);
    const newStroke: Stroke = {
      mode: mode === 'eraser' ? 'eraser' : 'pen',
      color,
      size,
      points: [pt],
    };
    currentStrokeRef.current = newStroke;
    redrawCanvas([...strokes, newStroke]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    e.preventDefault();
    const pt = getPointerCoords(e);
    currentStrokeRef.current.points.push(pt);
    redrawCanvas([...strokes, currentStrokeRef.current]);
  };

  const finishDrawing = () => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    isDrawingRef.current = false;
    const finished = currentStrokeRef.current;
    currentStrokeRef.current = null;
    setStrokes(prev => [...prev, finished]);
  };

  const handleUndo = () => {
    setStrokes(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setStrokes([]);
    const canvas = overlayCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const screenOverlay =
    typeof document !== 'undefined'
      ? createPortal(
          <>
            {/* Full-screen transparent (or whiteboard) drawing canvas over the questions */}
            <div
              className={cn(
                'fixed inset-0 z-[35] transition-colors',
                mode === 'cursor' ? 'pointer-events-none' : 'pointer-events-auto',
                whiteboardBg && 'bg-white/95 dark:bg-slate-950/95',
              )}
              style={
                whiteboardBg
                  ? {
                      backgroundImage:
                        'radial-gradient(#cbd5e1 1px, transparent 1px)',
                      backgroundSize: '18px 18px',
                    }
                  : undefined
              }
            >
              <canvas
                ref={overlayCanvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={finishDrawing}
                onPointerCancel={finishDrawing}
                className={cn(
                  'w-full h-full block touch-none',
                  mode === 'cursor'
                    ? 'pointer-events-none'
                    : mode === 'eraser'
                      ? 'cursor-cell'
                      : 'cursor-crosshair',
                )}
              />
            </div>

            {/* Floating Quick Toolbar at top-center of screen for effortless control while writing on questions */}
            <div
              data-exam-tools="true"
              className="fixed top-3 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-card/95 backdrop-blur-md border-2 border-primary/30 shadow-xl select-none max-w-[96vw] overflow-x-auto pointer-events-auto"
            >
              <span className="text-[11px] font-bold text-primary px-1.5 hidden sm:inline">
                ✏️ Ekran Qələmi
              </span>

              <Button
                type="button"
                variant={mode === 'pen' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('pen')}
                className="h-7 px-2 text-xs rounded-lg"
                title="Sualın üzərində yaz (Qələm)"
              >
                <Pencil className="w-3.5 h-3.5 mr-1" />
                Qələm
              </Button>

              <Button
                type="button"
                variant={mode === 'eraser' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('eraser')}
                className="h-7 px-2 text-xs rounded-lg"
                title="Pozan"
              >
                <Eraser className="w-3.5 h-3.5 mr-1" />
                Pozan
              </Button>

              <Button
                type="button"
                variant={mode === 'cursor' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setMode('cursor')}
                className={cn(
                  'h-7 px-2 text-xs rounded-lg',
                  mode === 'cursor' &&
                    'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40 font-bold',
                )}
                title="Yazıları silmədən cavab variantını seçmək və ya yazmaq üçün kursor rejimi"
              >
                <MousePointer className="w-3.5 h-3.5 mr-1" />
                Cavab seç
              </Button>

              <div className="h-4 w-px bg-border mx-0.5 shrink-0" />

              {/* Color Dots */}
              <div className="flex items-center gap-1 shrink-0">
                {PEN_COLORS.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setColor(c.value);
                      setMode('pen');
                    }}
                    title={c.label}
                    className={cn(
                      'w-5 h-5 rounded-full border transition-transform',
                      color === c.value && mode === 'pen'
                        ? 'scale-110 ring-2 ring-primary ring-offset-1'
                        : 'opacity-75 hover:opacity-100',
                    )}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>

              <div className="h-4 w-px bg-border mx-0.5 shrink-0" />

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleUndo}
                disabled={strokes.length === 0}
                className="h-7 w-7 rounded-lg shrink-0"
                title="Son xətti geri qaytar"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleClear}
                disabled={strokes.length === 0}
                className="h-7 w-7 rounded-lg text-destructive hover:text-destructive shrink-0"
                title="Yazıları təmizlə"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>

              {onClose && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="h-7 px-2.5 text-xs font-bold rounded-lg ml-1 shrink-0 cursor-pointer pointer-events-auto"
                  title="Qələmi söndür və bütün yazıları sil"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Söndür
                </Button>
              )}
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <div data-exam-tools="true" className="space-y-2.5 select-none">
      {screenOverlay}

      <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/25 text-xs space-y-1">
        <div className="font-bold text-primary flex items-center gap-1.5">
          <Pencil className="w-3.5 h-3.5" />
          <span>Ekran Qələmi Aktivdir!</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug">
          Birbaşa <strong>sualın, şəkillərin və variantların üzərində</strong> yaza və hesablamalar apara bilərsiniz.
        </p>
      </div>

      {/* Mode Buttons in Sidebar */}
      <div className="grid grid-cols-3 gap-1">
        <Button
          type="button"
          variant={mode === 'pen' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('pen')}
          className="h-8 px-2 text-xs rounded-lg"
        >
          <Pencil className="w-3.5 h-3.5 mr-1" />
          Qələm
        </Button>
        <Button
          type="button"
          variant={mode === 'eraser' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('eraser')}
          className="h-8 px-2 text-xs rounded-lg"
        >
          <Eraser className="w-3.5 h-3.5 mr-1" />
          Pozan
        </Button>
        <Button
          type="button"
          variant={mode === 'cursor' ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => setMode('cursor')}
          className={cn(
            'h-8 px-2 text-xs rounded-lg',
            mode === 'cursor' &&
              'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40 font-bold',
          )}
          title="Cavab variantını klikləmək üçün Kursor rejimi"
        >
          <MousePointer className="w-3.5 h-3.5 mr-1" />
          Kursor
        </Button>
      </div>

      {/* Colors & Stroke Widths */}
      <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg bg-muted/40 border border-border/50">
        <div className="flex items-center gap-1.5">
          {PEN_COLORS.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setColor(c.value);
                setMode('pen');
              }}
              title={c.label}
              className={cn(
                'w-5 h-5 rounded-full border transition-transform',
                color === c.value && mode === 'pen'
                  ? 'scale-110 ring-2 ring-primary ring-offset-1'
                  : 'opacity-75 hover:opacity-100',
              )}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          {PEN_SIZES.map(sz => (
            <button
              key={sz.id}
              type="button"
              onClick={() => setSize(sz.value)}
              className={cn(
                'px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors',
                size === sz.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border/60 hover:text-foreground',
              )}
            >
              {sz.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions Row: Undo, Clear, Toggle White Sheet */}
      <div className="flex items-center justify-between gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUndo}
          disabled={strokes.length === 0}
          className="h-7 px-2 text-[11px] rounded-lg flex-1"
        >
          <Undo2 className="w-3 h-3 mr-1" />
          Geri
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClear}
          disabled={strokes.length === 0}
          className="h-7 px-2 text-[11px] rounded-lg flex-1 text-destructive hover:text-destructive"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Təmizlə
        </Button>
        <Button
          type="button"
          variant={whiteboardBg ? 'default' : 'outline'}
          size="sm"
          onClick={() => setWhiteboardBg(v => !v)}
          className="h-7 px-2 text-[11px] rounded-lg flex-1"
          title="Şəffaf ekran və ya ağ vərəq fonu"
        >
          <FileText className="w-3 h-3 mr-1" />
          {whiteboardBg ? 'Şəffaf' : 'Ağ fon'}
        </Button>
      </div>

      {onClose && (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-full h-8 text-xs font-bold rounded-xl cursor-pointer pointer-events-auto"
        >
          <X className="w-3.5 h-3.5 mr-1.5" />
          Qələmi Söndür (Yazıları Sil)
        </Button>
      )}
    </div>
  );
};
