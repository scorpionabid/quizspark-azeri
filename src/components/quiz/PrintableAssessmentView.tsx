import { useMemo, useState } from 'react';
import { Printer, X, Shuffle, KeyRound, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MathRenderer } from '@/components/question-bank/MathRenderer';
import { useTeacherClasses, useClassStudents } from '@/hooks/useClassRoster';

export interface PrintableQuestion {
  id?: string;
  question_text: string;
  question_type: string;
  options?: string[] | null;
  correct_answer: string;
  explanation?: string | null;
  fill_blank_template?: string | null;
  matching_pairs?: Array<{ left: string; right: string }> | Record<string, string> | null;
  subjectLabel?: string;
  weight?: number | null;
  question_image_url?: string | null;
}

interface PrintableAssessmentViewProps {
  quizId?: string | null;
  title: string;
  assessmentType: 'ksq' | 'bsq' | 'sinaq' | 'quiz';
  grade: number | string;
  subject: string;
  questions: PrintableQuestion[];
  onClose: () => void;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function PrintableAssessmentView({
  quizId,
  title,
  assessmentType,
  grade,
  subject,
  questions,
  onClose,
}: PrintableAssessmentViewProps) {
  const [schoolName, setSchoolName] = useState('Tam Orta Məktəb');
  const [variant, setVariant] = useState<'A' | 'B'>('A');
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);
  const [includeBubbleSheet, setIncludeBubbleSheet] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState<string>('none');
  const [twoColumns, setTwoColumns] = useState(false);

  const { data: teacherClasses = [] } = useTeacherClasses();
  const { data: classStudents = [] } = useClassStudents(
    selectedClassId !== 'none' ? selectedClassId : undefined
  );

  const buildQrPayload = (studentId?: string) =>
    JSON.stringify({
      quizId: quizId || '',
      variant,
      count: questions.length,
      ...(selectedClassId !== 'none' ? { classId: selectedClassId } : {}),
      ...(studentId ? { studentId } : {}),
    });

  const displayedQuestions = useMemo(() => {
    if (variant === 'A') return questions;
    // In multi-subject sinaq, keep questions grouped by subject if subjectLabel is present
    const hasSubjects = questions.some((q) => Boolean(q.subjectLabel));
    const ordered = hasSubjects ? questions : seededShuffle(questions, 42);
    return ordered.map((q, idx) => {
      if (q.question_type === 'multiple_choice' && Array.isArray(q.options) && q.options.length > 1) {
        return {
          ...q,
          options: seededShuffle(q.options, 100 + idx),
        };
      }
      return q;
    });
  }, [questions, variant]);

  const typeLabel =
    assessmentType === 'ksq'
      ? 'Kiçik Summativ Qiymətləndirmə (KSQ)'
      : assessmentType === 'bsq'
        ? 'Böyük Summativ Qiymətləndirmə (BSQ)'
        : assessmentType === 'sinaq'
          ? 'Ümumi Sınaq İmtahanı'
          : 'Qiymətləndirmə Testi';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      {/* Control bar (hidden on print) */}
      <div className="no-print sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur px-6 py-4">
        <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <Label className="text-xs">Məktəb adı</Label>
              <Input
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="h-8 w-56 text-sm"
              />
            </div>

            <div className="flex items-center gap-2 pt-4">
              <Button
                size="sm"
                variant={variant === 'A' ? 'default' : 'outline'}
                onClick={() => setVariant('A')}
              >
                A Variantı
              </Button>
              <Button
                size="sm"
                variant={variant === 'B' ? 'default' : 'outline'}
                onClick={() => setVariant('B')}
                className="gap-1"
              >
                <Shuffle className="h-3.5 w-3.5" /> B Variantı
              </Button>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <Switch
                id="answer-key"
                checked={includeAnswerKey}
                onCheckedChange={setIncludeAnswerKey}
              />
              <Label htmlFor="answer-key" className="text-xs flex items-center gap-1 cursor-pointer">
                <KeyRound className="h-3.5 w-3.5" /> Cavab açarı
              </Label>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <Switch
                id="bubble-sheet"
                checked={includeBubbleSheet}
                onCheckedChange={setIncludeBubbleSheet}
              />
              <Label htmlFor="bubble-sheet" className="text-xs flex items-center gap-1 cursor-pointer">
                <QrCode className="h-3.5 w-3.5" /> Optik Kart
              </Label>
            </div>

            {includeBubbleSheet && teacherClasses.length > 0 && (
              <div>
                <Label className="text-xs">Sinif (Fərdi QR Kart)</Label>
                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                  <SelectTrigger className="h-8 w-44 text-xs">
                    <SelectValue placeholder="Ümumi kart" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ümumi (Ad boş)</SelectItem>
                    {teacherClasses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} ({c.grade}-ci sinif)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center gap-2 pt-4">
              <Switch
                id="two-cols"
                checked={twoColumns}
                onCheckedChange={setTwoColumns}
              />
              <Label htmlFor="two-cols" className="text-xs cursor-pointer">
                2 sütun
              </Label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="game" onClick={() => window.print()} className="gap-2">
              <Printer className="h-4 w-4" />
              Çap Et / PDF Saxla
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Printable A4 Sheet */}
      <div className="mx-auto my-6 max-w-[210mm] bg-white text-black p-8 sm:p-10 shadow-lg print:my-0 print:p-0 print:shadow-none">
        {/* Header Block */}
        <div className="border-b-2 border-black pb-4 mb-6">
          <div className="text-center mb-3">
            <p className="text-sm font-semibold uppercase tracking-wide">{schoolName}</p>
            <h1 className="text-xl font-bold mt-1">{typeLabel}</h1>
            <p className="text-base font-medium mt-0.5">{title}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mt-4 pt-3 border-t border-gray-300">
            <div>
              <span className="font-semibold">Sinif:</span> {grade}-ci sinif
            </div>
            <div>
              <span className="font-semibold">Fənn:</span> {subject}
            </div>
            <div>
              <span className="font-semibold">Variant:</span> {variant}
            </div>
            <div>
              <span className="font-semibold">Sual sayı:</span> {displayedQuestions.length}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm mt-3">
            <div className="col-span-2 border-b border-dotted border-gray-500 pb-1">
              <span className="font-semibold">Şagirdin Adı, Soyadı:</span>
            </div>
            <div className="border-b border-dotted border-gray-500 pb-1">
              <span className="font-semibold">Tarix / Bal:</span>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className={twoColumns ? 'grid grid-cols-2 gap-x-6 gap-y-5' : 'space-y-5'}>
          {displayedQuestions.map((q, index) => {
            const prevSubject = index > 0 ? displayedQuestions[index - 1].subjectLabel : undefined;
            const showSubjectHeader = q.subjectLabel && q.subjectLabel !== prevSubject;
            return (
            <div key={index} className="break-inside-avoid text-sm leading-relaxed">
              {showSubjectHeader && (
                <div className="mb-2 mt-3 border-b border-gray-400 pb-1 text-xs font-bold uppercase tracking-wider text-gray-800">
                  {q.subjectLabel}
                </div>
              )}
              <div className="font-semibold mb-1.5 flex gap-1.5">
                <span>{index + 1}.</span>
                {q.weight ? (
                  <span className="text-xs font-normal text-gray-600 shrink-0 mt-0.5">
                    ({q.weight} bal)
                  </span>
                ) : null}
                <div className="flex-1">
                  <MathRenderer text={q.fill_blank_template || q.question_text} />
                </div>
              </div>

              {q.question_image_url && (
                <div className="pl-5 my-2">
                  <img
                    src={q.question_image_url}
                    alt={`Sual ${index + 1} şəkli`}
                    className="max-h-40 rounded border border-gray-300 object-contain"
                  />
                </div>
              )}

              {q.question_type === 'multiple_choice' && Array.isArray(q.options) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-5">
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex gap-1.5">
                      <span className="font-medium">{LETTERS[optIdx] ?? optIdx + 1})</span>
                      <MathRenderer text={opt} />
                    </div>
                  ))}
                </div>
              )}

              {q.question_type === 'true_false' && (
                <div className="flex gap-6 pl-5 text-xs">
                  <span>A) Doğru</span>
                  <span>B) Yanlış</span>
                </div>
              )}

              {(q.question_type === 'short_answer' ||
                q.question_type === 'fill_blank' ||
                q.question_type === 'numerical') && (
                <div className="pl-5 mt-2 space-y-3">
                  <div className="border-b border-dashed border-gray-400 h-5 w-11/12" />
                  <div className="border-b border-dashed border-gray-400 h-5 w-11/12" />
                  <div className="border-b border-dashed border-gray-400 h-5 w-3/4" />
                </div>
              )}
            </div>
            );
          })}
        </div>

        {/* Optical Bubble Sheet(s) for Phone Camera Grading */}
        {includeBubbleSheet &&
          (selectedClassId !== 'none' && classStudents.length > 0
            ? classStudents.map((st) => ({ id: st.id, name: st.full_name, number: st.student_number }))
            : [{ id: undefined, name: '', number: undefined }]
          ).map((studentEntry, sheetIdx) => (
            <div key={studentEntry.id ?? sheetIdx} className="print-page-break mt-10 relative border-2 border-black p-6">
              {/* 4 Corner Alignment Markers */}
              <div className="absolute top-2 left-2 h-4 w-4 bg-black" />
              <div className="absolute top-2 right-2 h-4 w-4 bg-black" />
              <div className="absolute bottom-2 left-2 h-4 w-4 bg-black" />
              <div className="absolute bottom-2 right-2 h-4 w-4 bg-black" />

              <div className="flex items-start justify-between gap-4 border-b-2 border-black pb-4 mb-5 px-4">
                <div className="space-y-2 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider">{schoolName}</p>
                  <h2 className="text-lg font-bold">OPTİK CAVAB KARTI — {variant} Variantı</h2>
                  <p className="text-xs text-gray-700">{title} ({grade}-ci sinif • {subject})</p>
                  <div className="pt-2 grid grid-cols-3 gap-3 text-xs">
                    <div className="col-span-2 border-b border-black pb-1">
                      <span className="font-semibold">Şagirdin Adı, Soyadı:</span>{' '}
                      {studentEntry.name ? (
                        <span className="font-bold">
                          {studentEntry.number ? `${studentEntry.number}. ` : ''}
                          {studentEntry.name}
                        </span>
                      ) : null}
                    </div>
                    <div className="border-b border-black pb-1">
                      <span className="font-semibold">Sinif:</span> {grade}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center shrink-0">
                  <QRCodeSVG value={buildQrPayload(studentEntry.id)} size={76} level="M" />
                  <span className="text-[10px] font-mono mt-1">Var: {variant} • {displayedQuestions.length} sual</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-700 mb-4 px-4">
                Qeyd: Düzgün hesab etdiyiniz variantın dairəsini qara və ya tünd göy qələmlə tam qaralayın.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2.5 px-4">
                {displayedQuestions.map((q, idx) => {
                  const isOpen =
                    q.question_type !== 'multiple_choice' && q.question_type !== 'true_false';
                  return (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <span className="w-6 font-bold text-right">{idx + 1}.</span>
                      {isOpen ? (
                        <span className="text-[10px] border-b border-black px-1 py-0.5 min-w-[96px]">
                          Açıq (Bal: ___ / {q.weight ?? 10})
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          {['A', 'B', 'C', 'D'].map((letter) => (
                            <div
                              key={letter}
                              className="h-5 w-5 rounded-full border border-black flex items-center justify-center text-[10px] font-semibold"
                            >
                              {letter}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

        {/* Answer Key on Separate Page */}
        {includeAnswerKey && (
          <div className="print-page-break mt-10 pt-6 border-t-2 border-black">
            <h2 className="text-lg font-bold text-center mb-4">
              Müəllim üçün Cavab Açarı — {title} ({variant} Variantı)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              {displayedQuestions.map((q, index) => {
                let answerDisplay = q.correct_answer;
                if (q.question_type === 'multiple_choice' && Array.isArray(q.options)) {
                  const idx = q.options.indexOf(q.correct_answer);
                  if (idx !== -1) {
                    answerDisplay = `${LETTERS[idx]}) ${q.correct_answer}`;
                  }
                }
                return (
                  <div key={index} className="border border-gray-300 rounded px-2.5 py-1.5">
                    <span className="font-bold">{index + 1}.</span> {answerDisplay}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
