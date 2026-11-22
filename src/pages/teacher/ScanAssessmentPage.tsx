import { useState, useRef, useEffect, useCallback } from 'react';
import jsQR from 'jsqr';
import {
  Camera,
  Upload,
  CheckCircle2,
  XCircle,
  Loader2,
  QrCode,
  Save,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useMyQuizzes } from '@/hooks/useQuizzes';
import {
  useTeacherClasses,
  useClassStudents,
  useSaveStudentResult,
  calculateHundredPointGrade,
} from '@/hooks/useClassRoster';

interface GradedItem {
  questionNumber: number;
  questionType?: string;
  subjectLabel?: string | null;
  markedOption: string | null;
  correctOption: string | null;
  isCorrect: boolean;
  maxPoints: number;
  earnedPoints: number;
}

interface GradeResponse {
  studentName: string;
  totalQuestions: number;
  correctCount: number;
  totalPoints: number;
  earnedTotalPoints: number;
  percentage: number;
  variant: string;
  results: GradedItem[];
}

function compressAndReadQr(
  source: HTMLImageElement | HTMLVideoElement,
  maxWidth = 1200
): {
  dataUrl: string;
  qrPayload: { quizId?: string; variant?: string; count?: number; classId?: string; studentId?: string } | null;
} {
  const srcWidth = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
  const srcHeight = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;
  const scale = srcWidth > maxWidth ? maxWidth / srcWidth : 1;
  const width = Math.round(srcWidth * scale);
  const height = Math.round(srcHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas konteksti yaradıla bilmədi');

  ctx.drawImage(source, 0, 0, width, height);
  const imgData = ctx.getImageData(0, 0, width, height);
  const qr = jsQR(imgData.data, width, height);

  let qrPayload: { quizId?: string; variant?: string; count?: number } | null = null;
  if (qr?.data) {
    try {
      qrPayload = JSON.parse(qr.data);
    } catch {
      qrPayload = null;
    }
  }

  return {
    dataUrl: canvas.toDataURL('image/jpeg', 0.85),
    qrPayload,
  };
}

export default function ScanAssessmentPage() {
  const { user } = useAuth();
  const { data: myQuizzes = [] } = useMyQuizzes();
  const { data: teacherClasses = [] } = useTeacherClasses();
  const saveStudentResult = useSaveStudentResult();

  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [variant, setVariant] = useState<'A' | 'B'>('A');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: classStudents = [] } = useClassStudents(selectedClassId || undefined);

  const [graded, setGraded] = useState<GradeResponse | null>(null);
  const [studentName, setStudentName] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch {
      toast.error('Kameraya icazə verilmədi. Şəkil yükləmə düyməsindən istifadə edə bilərsiniz.');
    }
  };

  const runVisionGrading = async (
    imageDataUrl: string,
    detectedQuizId?: string,
    detectedVariant?: string,
    detectedCount?: number,
    detectedClassId?: string,
    detectedStudentId?: string
  ) => {
    const targetQuizId = detectedQuizId || selectedQuizId;
    const targetVariant = detectedVariant === 'B' ? 'B' : variant;

    if (detectedClassId) setSelectedClassId(detectedClassId);
    if (detectedStudentId) setSelectedStudentId(detectedStudentId);

    if (!targetQuizId) {
      toast.error('Zəhmət olmasa yoxlanılacaq KSQ/BSQ/Sınaq testini seçin (və ya QR kodu kadra salın).');
      return;
    }

    setSelectedQuizId(targetQuizId);
    setVariant(targetVariant);
    setIsGrading(true);

    try {
      const { data, error } = await supabase.functions.invoke('grade-paper-sheet', {
        body: {
          imageBase64: imageDataUrl,
          quizId: targetQuizId,
          variant: targetVariant,
          questionCount: detectedCount || 20,
        },
      });

      if (error) throw error;
      const result = data as GradeResponse;
      // Ensure maxPoints/earnedPoints defaults if older backend response
      const normalizedResults = (result.results || []).map((r) => ({
        ...r,
        maxPoints: r.maxPoints ?? 1,
        earnedPoints: r.earnedPoints ?? (r.isCorrect ? (r.maxPoints ?? 1) : 0),
      }));
      const totalPoints = normalizedResults.reduce((s, r) => s + r.maxPoints, 0);
      const earnedTotalPoints = normalizedResults.reduce((s, r) => s + r.earnedPoints, 0);

      setGraded({
        ...result,
        totalPoints,
        earnedTotalPoints,
        results: normalizedResults,
      });
      setStudentName(result.studentName || '');
      const { score100, gradeMark } = calculateHundredPointGrade(earnedTotalPoints, totalPoints);
      toast.success(`Yoxlama tamamlandı: ${score100}/100 bal (Qiymət: ${gradeMark})`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Yoxlama xətası');
    } finally {
      setIsGrading(false);
    }
  };

  const handleCaptureFrame = () => {
    if (!videoRef.current) return;
    const { dataUrl, qrPayload } = compressAndReadQr(videoRef.current);
    setPreviewUrl(dataUrl);
    stopCamera();
    if (qrPayload?.quizId) {
      toast.success(`QR kod oxundu (${qrPayload.variant || 'A'} variantı)`);
    }
    void runVisionGrading(
      dataUrl,
      qrPayload?.quizId,
      qrPayload?.variant,
      qrPayload?.count,
      qrPayload?.classId,
      qrPayload?.studentId
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const { dataUrl, qrPayload } = compressAndReadQr(img);
        setPreviewUrl(dataUrl);
        if (qrPayload?.quizId) {
          toast.success(`QR kod oxundu (${qrPayload.variant || 'A'} variantı)`);
        }
        void runVisionGrading(
          dataUrl,
          qrPayload?.quizId,
          qrPayload?.variant,
          qrPayload?.count,
          qrPayload?.classId,
          qrPayload?.studentId
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const recalculateGraded = (updatedResults: GradedItem[]) => {
    if (!graded) return;
    const correctCount = updatedResults.filter((r) => r.isCorrect).length;
    const totalPoints = updatedResults.reduce((s, r) => s + r.maxPoints, 0);
    const earnedTotalPoints = updatedResults.reduce((s, r) => s + r.earnedPoints, 0);
    const percentage = totalPoints > 0 ? Math.round((earnedTotalPoints / totalPoints) * 100) : 0;

    setGraded({
      ...graded,
      results: updatedResults,
      correctCount,
      totalPoints,
      earnedTotalPoints,
      percentage,
    });
  };

  const handleOverrideOption = (qNum: number, newOpt: string) => {
    if (!graded) return;
    const updatedResults = graded.results.map((r) => {
      if (r.questionNumber !== qNum) return r;
      const isCorrect = Boolean(r.correctOption && newOpt === r.correctOption);
      return {
        ...r,
        markedOption: newOpt,
        isCorrect,
        earnedPoints: isCorrect ? r.maxPoints : 0,
      };
    });
    recalculateGraded(updatedResults);
  };

  const handleSetOpenEndedPoints = (qNum: number, rawPoints: number) => {
    if (!graded) return;
    const updatedResults = graded.results.map((r) => {
      if (r.questionNumber !== qNum) return r;
      const clamped = Math.max(0, Math.min(r.maxPoints, rawPoints));
      return {
        ...r,
        earnedPoints: clamped,
        isCorrect: clamped > 0,
        markedOption: `${clamped}/${r.maxPoints}`,
      };
    });
    recalculateGraded(updatedResults);
  };

  const handleSaveResult = async (openNextCamera = false) => {
    if (!graded || !selectedQuizId || !user) return;
    setIsSaving(true);
    try {
      if (selectedStudentId) {
        await saveStudentResult.mutateAsync({
          classId: selectedClassId || null,
          studentId: selectedStudentId,
          quizId: selectedQuizId,
          score: Math.round(graded.earnedTotalPoints),
          totalQuestions: Math.round(graded.totalPoints),
          variant: graded.variant,
          source: 'camera_omr',
        });
        toast.success('Nəticə şagird siyahısına (100 ballıq sistemlə) yazıldı!');
      } else {
        const { error } = await supabase.from('quiz_results').insert({
          quiz_id: selectedQuizId,
          user_id: user.id,
          score: graded.correctCount,
          total_questions: graded.totalQuestions,
          percentage: graded.percentage,
          time_spent: 0,
        });
        if (error) throw error;
        toast.success(`${studentName || 'Şagird'} üçün nəticə bazaya yazıldı!`);
      }
      setGraded(null);
      setPreviewUrl(null);
      setStudentName('');
      setSelectedStudentId('');
      if (openNextCamera) {
        void startCamera();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Nəticə yadda saxlanılmadı');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="w-full space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
            <QrCode className="h-7 w-7 text-primary" />
            Kağız Testi Telefonla Yoxla
          </h1>
          <p className="text-muted-foreground mt-1">
            Optik cavab kartının şəklini çəkin — QR kod və AI Vision cavabları avtomatik yoxlasın.
          </p>
        </div>

        {/* Quiz Fallback Selection + Capture Buttons */}
        <div className="rounded-2xl bg-gradient-card border border-border/50 p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <Label className="mb-2 block">Qiymətləndirmə (QR oxunarsa avtomatik seçilir)</Label>
              <Select value={selectedQuizId} onValueChange={setSelectedQuizId}>
                <SelectTrigger>
                  <SelectValue placeholder="KSQ / BSQ / Sınaq seçin..." />
                </SelectTrigger>
                <SelectContent>
                  {myQuizzes.map((q) => (
                    <SelectItem key={q.id} value={q.id}>
                      {q.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Variant</Label>
              <Select value={variant} onValueChange={(v) => setVariant(v as 'A' | 'B')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A Variantı</SelectItem>
                  <SelectItem value="B">B Variantı</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {!cameraActive ? (
              <Button variant="game" onClick={startCamera} className="gap-2">
                <Camera className="h-4 w-4" />
                Kameranı Aç
              </Button>
            ) : (
              <Button variant="game" onClick={handleCaptureFrame} className="gap-2">
                <Camera className="h-4 w-4" />
                Şəkil Çək və Yoxla
              </Button>
            )}

            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button type="button" variant="outline" asChild>
                <span className="gap-2">
                  <Upload className="h-4 w-4" />
                  Telefondan Şəkil Çək / Yüklə
                </span>
              </Button>
            </label>

            {cameraActive && (
              <Button variant="ghost" onClick={stopCamera}>
                Kameranı Bağla
              </Button>
            )}
          </div>

          {cameraActive && (
            <div className="overflow-hidden rounded-xl border border-primary/40 bg-black">
              <video ref={videoRef} playsInline muted className="w-full max-h-[420px] object-contain" />
            </div>
          )}

          {isGrading && (
            <div className="flex items-center justify-center gap-2 py-8 text-primary">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="font-medium">Optik cavab kartı oxunur və yoxlanılır...</span>
            </div>
          )}
        </div>

        {/* Graded Results */}
        {graded && !isGrading && (() => {
          const { score100, gradeMark } = calculateHundredPointGrade(
            graded.earnedTotalPoints,
            graded.totalPoints
          );
          const subjectStats = new Map<string, { earned: number; max: number }>();
          for (const item of graded.results) {
            if (item.subjectLabel) {
              const cur = subjectStats.get(item.subjectLabel) ?? { earned: 0, max: 0 };
              cur.max += item.maxPoints;
              cur.earned += item.earnedPoints;
              subjectStats.set(item.subjectLabel, cur);
            }
          }
          return (
          <div className="rounded-2xl bg-gradient-card border border-border/50 p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
              <div className="grid gap-3 sm:grid-cols-2 flex-1 min-w-[260px]">
                <div>
                  <Label className="text-xs">Sinif (Siyahıdan)</Label>
                  <Select
                    value={selectedClassId}
                    onValueChange={(v) => {
                      setSelectedClassId(v);
                      setSelectedStudentId('');
                    }}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Sinif seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      {teacherClasses.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} ({c.grade}-ci sinif)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Şagird (Avtomatik və ya Siyahıdan)</Label>
                  {classStudents.length > 0 ? (
                    <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Şagirdi seçin..." />
                      </SelectTrigger>
                      <SelectContent>
                        {classStudents.map((st) => (
                          <SelectItem key={st.id} value={st.id}>
                            {st.student_number}. {st.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      className="h-9"
                      placeholder="Şagirdin adını daxil edin..."
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  {subjectStats.size > 0 && (
              <div className="flex flex-wrap gap-2">
                {Array.from(subjectStats.entries()).map(([subj, st]) => {
                  const subScore = st.max > 0 ? Math.round((st.earned / st.max) * 100) : 0;
                  return (
                    <div
                      key={subj}
                      className="rounded-lg border border-border/50 bg-muted/30 px-3 py-1.5 text-xs"
                    >
                      <span className="font-semibold">{subj}:</span>{' '}
                      <span className="text-primary font-bold">{subScore} / 100</span>{' '}
                      <span className="text-muted-foreground">({st.earned}/{st.max} bal)</span>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
                    100 ballıq sistem ({graded.variant} var.)
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {score100} / 100 <span className="text-sm text-foreground">(Qiymət: {gradeMark})</span>
                  </p>
                  {subjectStats.size > 0 && (
              <div className="flex flex-wrap gap-2">
                {Array.from(subjectStats.entries()).map(([subj, st]) => {
                  const subScore = st.max > 0 ? Math.round((st.earned / st.max) * 100) : 0;
                  return (
                    <div
                      key={subj}
                      className="rounded-lg border border-border/50 bg-muted/30 px-3 py-1.5 text-xs"
                    >
                      <span className="font-semibold">{subj}:</span>{' '}
                      <span className="text-primary font-bold">{subScore} / 100</span>{' '}
                      <span className="text-muted-foreground">({st.earned}/{st.max} bal)</span>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
                    {graded.correctCount}/{graded.totalQuestions} düz
                  </p>
                </div>

                <Button variant="outline" onClick={() => void handleSaveResult(false)} disabled={isSaving} className="gap-2">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Yadda Saxla
                </Button>
                <Button variant="game" onClick={() => void handleSaveResult(true)} disabled={isSaving} className="gap-2">
                  <Camera className="h-4 w-4" />
                  Saxla və Növbəti
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setGraded(null);
                    setPreviewUrl(null);
                  }}
                  title="Sıfırla"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {previewUrl && (
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer hover:text-foreground">Çəkilmiş şəklə bax</summary>
                <img src={previewUrl} alt="Skan edilmiş vərəq" className="mt-2 max-h-64 rounded-lg border" />
              </details>
            )}

            {subjectStats.size > 0 && (
              <div className="flex flex-wrap gap-2">
                {Array.from(subjectStats.entries()).map(([subj, st]) => {
                  const subScore = st.max > 0 ? Math.round((st.earned / st.max) * 100) : 0;
                  return (
                    <div
                      key={subj}
                      className="rounded-lg border border-border/50 bg-muted/30 px-3 py-1.5 text-xs"
                    >
                      <span className="font-semibold">{subj}:</span>{' '}
                      <span className="text-primary font-bold">{subScore} / 100</span>{' '}
                      <span className="text-muted-foreground">({st.earned}/{st.max} bal)</span>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Hər hansı sualda oxuma xətası varsa, üzərinə klikləyərək düzgün variantı seçib düzəliş edə bilərsiniz:
            </p>

            <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-4">
              {graded.results.map((item) => {
                const isOpenEnded =
                  item.questionType &&
                  item.questionType !== 'multiple_choice' &&
                  item.questionType !== 'true_false';

                return (
                <div
                  key={item.questionNumber}
                  className={`rounded-xl border p-3 space-y-2 ${
                    item.isCorrect
                      ? 'border-emerald-500/40 bg-emerald-500/10'
                      : 'border-destructive/40 bg-destructive/10'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Sual {item.questionNumber}</span>
                    <span className="flex items-center gap-1">
                      {item.isCorrect ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-destructive" />
                      )}
                      {isOpenEnded ? 'Açıq sual' : `Açar: ${item.correctOption || '-'}`}
                    </span>
                  </div>

                  {isOpenEnded ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <Input
                          type="number"
                          min={0}
                          max={item.maxPoints}
                          step={0.5}
                          value={item.earnedPoints}
                          onChange={(e) =>
                            handleSetOpenEndedPoints(item.questionNumber, Number(e.target.value) || 0)
                          }
                          className="h-7 text-xs font-bold"
                        />
                        <span className="text-[11px] text-muted-foreground shrink-0">
                          / {item.maxPoints} bal
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleSetOpenEndedPoints(item.questionNumber, item.maxPoints)}
                          className={`flex-1 rounded py-0.5 text-[11px] font-medium border ${
                            item.earnedPoints === item.maxPoints
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-background/60 border-border/50 text-muted-foreground'
                          }`}
                        >
                          Tam ({item.maxPoints})
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetOpenEndedPoints(item.questionNumber, 0)}
                          className={`flex-1 rounded py-0.5 text-[11px] font-medium border ${
                            item.earnedPoints === 0
                              ? 'bg-destructive text-destructive-foreground border-destructive'
                              : 'bg-background/60 border-border/50 text-muted-foreground'
                          }`}
                        >
                          0 bal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      {['A', 'B', 'C', 'D'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleOverrideOption(item.questionNumber, opt)}
                          className={`flex-1 rounded py-1 text-xs font-medium border transition-colors ${
                            item.markedOption === opt
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background/60 border-border/50 text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>
          );
        })()}
      </div>
    </div>
  );
}
