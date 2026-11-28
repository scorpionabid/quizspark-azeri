import React from 'react';
import MathRenderer from '@/components/common/MathRenderer';
import { Question } from '@/hooks/useQuestions';

export interface QuizPrintConfig {
  mode: 'student' | 'teacher' | 'answer_key_only' | 'bubble_sheet_only';
  columns: 1 | 2;
  fontSize: 'sm' | 'base' | 'lg';
  includeHeader: boolean;
  includeInstructions: boolean;
  includeAnswerKey: boolean;
  includeBubbleSheet: boolean;
  organizationName?: string;
  customInstructions?: string;
}

export interface QuizPrintLayoutProps {
  quiz: {
    id: string;
    title: string;
    subject?: string | null;
    grade?: string | null;
    description?: string | null;
    time_limit?: number | null;
  };
  questions: Question[];
  config: QuizPrintConfig;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const QuizPrintLayout: React.FC<QuizPrintLayoutProps> = ({
  quiz,
  questions,
  config,
}) => {
  const isTeacher = config.mode === 'teacher';
  const isAnswerKeyOnly = config.mode === 'answer_key_only';
  const isBubbleSheetOnly = config.mode === 'bubble_sheet_only';

  // Helper to determine if an option is the correct answer
  const isCorrectOption = (question: Question, opt: string, idx: number): boolean => {
    if (!isTeacher) return false;
    const cleanCorrect = (question.correct_answer || '').trim();
    const cleanOpt = (opt || '').trim();
    if (cleanCorrect === cleanOpt) return true;
    if (cleanCorrect.toLowerCase() === OPTION_LETTERS[idx]?.toLowerCase()) return true;
    if (cleanCorrect === String(idx)) return true;
    return false;
  };

  const getOptionLetter = (idx: number) => OPTION_LETTERS[idx] || `${idx + 1}`;

  // Helper to remove redundant leading question numbering (e.g. "1. ", "01. ", "1) ")
  const formatQuestionText = (rawText: string, idx: number): string => {
    if (!rawText) return '';
    const prefixRegex = new RegExp(`^0*${idx + 1}[\\.\\)]\\s*`);
    return rawText.replace(prefixRegex, '');
  };

  // Font size mapping
  const fontSizeClass = {
    sm: 'text-[11px] leading-[1.35]',
    base: 'text-[12.5px] leading-[1.45]',
    lg: 'text-[14px] leading-[1.55]',
  }[config.fontSize];

  return (
    <div
      id="quiz-printable-area"
      className={`print-document bg-white text-black p-4 sm:p-8 font-sans ${fontSizeClass}`}
      style={{ minHeight: '100%' }}
    >
      {/* ─── 1. BUBBLE SHEET ONLY MODE ─── */}
      {isBubbleSheetOnly && (
        <BubbleSheetSection quiz={quiz} questions={questions} />
      )}

      {/* ─── 2. ANSWER KEY ONLY MODE ─── */}
      {isAnswerKeyOnly && (
        <AnswerKeySection quiz={quiz} questions={questions} />
      )}

      {/* ─── 3. STANDARD QUESTION BOOKLET (STUDENT OR TEACHER) ─── */}
      {!isAnswerKeyOnly && !isBubbleSheetOnly && (
        <>
          {/* Official Header */}
          {config.includeHeader && (
            <header className="border-b-[3px] border-double border-black pb-3 mb-4 break-inside-avoid">
              <div className="text-center mb-2">
                <p className="text-[11px] font-bold tracking-wider uppercase text-gray-700">
                  {config.organizationName || 'AZƏRBAYCAN RESPUBLİKASI ELM VƏ TƏHSİL NAZİRLİYİ'}
                </p>
                <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight mt-0.5">
                  {quiz.title}
                </h1>
                <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-gray-800 font-semibold mt-1 tabular-nums">
                  {quiz.subject && <span>Fənn: <strong>{quiz.subject}</strong></span>}
                  {quiz.grade && <span>Sinif: <strong>{quiz.grade}</strong></span>}
                  <span>Sual sayı: <strong>{questions.length}</strong></span>
                  {quiz.time_limit && <span>Müddət: <strong>{quiz.time_limit} dəqiqə</strong></span>}
                  {isTeacher && (
                    <span className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-bold">
                      MÜƏLLİM NÜSXƏSİ (DÜZGÜN CAVABLARLA)
                    </span>
                  )}
                </div>
              </div>

              {/* Student Candidate Identification Box */}
              {!isTeacher && (
                <div className="border border-black rounded-lg p-2.5 mt-3 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                  <div className="sm:col-span-2 border-b sm:border-b-0 sm:border-r border-gray-400 pb-1 sm:pb-0 sm:pr-2">
                    <span className="text-[10px] text-gray-600 block uppercase font-bold">Şagirdin S.A.A:</span>
                    <div className="h-5 border-b border-dotted border-gray-500 mt-1" />
                  </div>
                  <div className="border-b sm:border-b-0 sm:border-r border-gray-400 pb-1 sm:pb-0 sm:px-2">
                    <span className="text-[10px] text-gray-600 block uppercase font-bold">Məktəb / UTİS:</span>
                    <div className="h-5 border-b border-dotted border-gray-500 mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:pl-2">
                    <div>
                      <span className="text-[10px] text-gray-600 block uppercase font-bold">Sinif:</span>
                      <div className="h-5 border-b border-dotted border-gray-500 mt-1" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-600 block uppercase font-bold">Tarix:</span>
                      <div className="h-5 border-b border-dotted border-gray-500 mt-1" />
                    </div>
                  </div>
                </div>
              )}

              {/* Instructions */}
              {config.includeInstructions && (
                <div className="bg-gray-50 border-l-4 border-black p-2 mt-2 text-[10.5px] text-gray-700">
                  <p className="font-bold">İmtahan Qaydaları:</p>
                  <p>
                    {config.customInstructions ||
                      'Hər sual üçün yalnız bir düzgün cavab variantını qeyd edin. Kitabça üzərində qaralama edə bilərsiniz. Cavablarınızı optik cavab vərəqində dəqiq qaralayın.'}
                  </p>
                </div>
              )}
            </header>
          )}

          {/* Questions Grid (1 or 2 Columns) */}
          <main
            className={
              config.columns === 2
                ? 'grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4'
                : 'space-y-4'
            }
          >
            {questions.map((question, index) => {
              const options = Array.isArray(question.options)
                ? question.options
                : [];

              return (
                <article
                  key={question.id || index}
                  className="question-block border border-gray-200 rounded-lg p-3 bg-white shadow-none break-inside-avoid"
                  style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
                >
                  {/* Question Number & Text */}
                  <div className="flex items-start gap-2 mb-2">
                    <span className="inline-flex items-center justify-center font-black bg-black text-white text-xs px-2 py-0.5 rounded shrink-0 tabular-nums">
                      № {index + 1}
                    </span>
                    <div className="flex-1 font-semibold text-gray-950 question-text break-words">
                      <MathRenderer text={formatQuestionText(question.question_text || '', index)} />
                    </div>
                  </div>

                  {/* Optional Image */}
                  {(question.question_image_url || question.media_url) && (
                    <div className="my-2 text-center">
                      <img
                        src={question.question_image_url || question.media_url || ''}
                        alt={`Sual ${index + 1}`}
                        className="max-h-48 mx-auto rounded border border-gray-300 object-contain"
                      />
                    </div>
                  )}

                  {/* Options */}
                  {options.length > 0 && (
                    <div className="mt-2.5 space-y-1.5 pl-1">
                      {options.map((opt, optIdx) => {
                        const correct = isCorrectOption(question, opt, optIdx);
                        const letter = getOptionLetter(optIdx);

                        return (
                          <div
                            key={optIdx}
                            className={`flex items-start gap-2 p-1 rounded ${
                              correct
                                ? 'bg-gray-100 font-bold border-l-4 border-black pl-2'
                                : ''
                            }`}
                          >
                            <span
                              className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold shrink-0 border ${
                                correct
                                  ? 'bg-black text-white border-black'
                                  : 'border-gray-500 text-gray-800'
                              }`}
                            >
                              {letter}
                            </span>
                            <div className="flex-1 pt-0.5 text-gray-900">
                              <MathRenderer text={opt} />
                              {correct && isTeacher && (
                                <span className="ml-2 text-[10px] text-green-700 font-bold">
                                  ✓ (Düzgün cavab)
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Short Answer / Fill in Blank line if no options */}
                  {options.length === 0 && (
                    <div className="mt-3 border-b-2 border-dotted border-gray-400 pb-1 text-gray-400 text-xs italic">
                      {isTeacher && question.correct_answer ? (
                        <span className="text-black font-bold not-italic">
                          Düzgün cavab: {question.correct_answer}
                        </span>
                      ) : (
                        'Cavabınız: ____________________________________________________'
                      )}
                    </div>
                  )}

                  {/* Teacher Explanation */}
                  {isTeacher && question.explanation && (
                    <div className="mt-2.5 bg-gray-50 border border-gray-300 rounded p-1.5 text-[11px] text-gray-700">
                      <strong>İzah:</strong> {question.explanation}
                    </div>
                  )}
                </article>
              );
            })}
          </main>

          {/* Answer Key Grid (Attached at the end if enabled) */}
          {config.includeAnswerKey && (
            <div
              className="mt-8 pt-6 border-t-2 border-black page-break-before"
              style={{ pageBreakBefore: 'always', breakBefore: 'page' }}
            >
              <AnswerKeySection quiz={quiz} questions={questions} />
            </div>
          )}

          {/* Bubble Sheet Section (Attached at the end if enabled) */}
          {config.includeBubbleSheet && (
            <div
              className="mt-8 pt-6 border-t-2 border-black page-break-before"
              style={{ pageBreakBefore: 'always', breakBefore: 'page' }}
            >
              <BubbleSheetSection quiz={quiz} questions={questions} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

/**
 * Kompakt Cavab Açarları Cədvəli
 */
const AnswerKeySection: React.FC<{
  quiz: QuizPrintLayoutProps['quiz'];
  questions: Question[];
}> = ({ quiz, questions }) => {
  // Extract clean letter or string
  const getAnswerLetter = (q: Question) => {
    const raw = (q.correct_answer || '').trim();
    if (Array.isArray(q.options) && q.options.length > 0) {
      const matchIdx = q.options.findIndex(
        (opt) => (opt || '').trim() === raw
      );
      if (matchIdx !== -1) {
        return OPTION_LETTERS[matchIdx] || raw;
      }
    }
    return raw || '-';
  };

  // Chunk questions into rows of 15 or columns of 25 for compact table
  const colCount = Math.min(5, Math.max(1, Math.ceil(questions.length / 20)));
  const itemsPerCol = Math.ceil(questions.length / colCount);

  const columns: { num: number; ans: string }[][] = [];
  for (let c = 0; c < colCount; c++) {
    const start = c * itemsPerCol;
    const end = Math.min(questions.length, start + itemsPerCol);
    const colItems = [];
    for (let i = start; i < end; i++) {
      colItems.push({
        num: i + 1,
        ans: getAnswerLetter(questions[i]),
      });
    }
    columns.push(colItems);
  }

  return (
    <div className="answer-key-box break-inside-avoid">
      <div className="border-b-2 border-black pb-2 mb-3">
        <h2 className="text-base font-black uppercase text-center">
          Cavab Açarları Cədvəli (Answer Key)
        </h2>
        <p className="text-xs text-center text-gray-700">
          {quiz.title} • Cəmi {questions.length} sual
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 tabular-nums">
        {columns.map((col, colIdx) => (
          <table
            key={colIdx}
            className="w-full text-xs border-collapse border border-gray-400"
          >
            <thead>
              <tr className="bg-gray-100 border-b border-gray-400">
                <th className="py-1 px-2 border-r border-gray-400 text-center w-12 font-bold">
                  №
                </th>
                <th className="py-1 px-2 text-center font-bold">Cavab</th>
              </tr>
            </thead>
            <tbody>
              {col.map((item) => (
                <tr
                  key={item.num}
                  className="border-b border-gray-200 even:bg-gray-50"
                >
                  <td className="py-0.5 px-2 border-r border-gray-400 text-center font-bold text-gray-700">
                    {item.num}
                  </td>
                  <td className="py-0.5 px-2 text-center font-black text-black">
                    {item.ans}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
};

/**
 * Optik Cavab Kartı (Standart Bubble Sheet)
 */
const BubbleSheetSection: React.FC<{
  quiz: QuizPrintLayoutProps['quiz'];
  questions: Question[];
}> = ({ quiz, questions }) => {
  const letters = ['A', 'B', 'C', 'D', 'E'];

  // Split questions into 3 or 4 columns
  const colSize = 25;
  const colCount = Math.ceil(questions.length / colSize);
  const questionCols = Array.from({ length: colCount }, (_, cIdx) => {
    return questions.slice(cIdx * colSize, (cIdx + 1) * colSize);
  });

  return (
    <div className="bubble-sheet-box break-inside-avoid">
      {/* Header */}
      <div className="border-2 border-black rounded-lg p-3 mb-4">
        <div className="flex justify-between items-center border-b border-black pb-2 mb-2">
          <div>
            <h2 className="text-base font-black uppercase">
              Rəsmi Cavab Kartı (Bubble Sheet)
            </h2>
            <p className="text-xs text-gray-700">
              {quiz.title} • {questions.length} Sual
            </p>
          </div>
          <div className="text-right text-[11px] font-mono">
            <span>KOD: {quiz.id.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="border-b border-dotted border-gray-500 pb-1">
            <span className="text-[10px] text-gray-500 block uppercase font-bold">Şagirdin S.A.A:</span>
          </div>
          <div className="border-b border-dotted border-gray-500 pb-1">
            <span className="text-[10px] text-gray-500 block uppercase font-bold">Məktəb:</span>
          </div>
          <div className="border-b border-dotted border-gray-500 pb-1">
            <span className="text-[10px] text-gray-500 block uppercase font-bold">UTİS Kod:</span>
          </div>
          <div className="border-b border-dotted border-gray-500 pb-1">
            <span className="text-[10px] text-gray-500 block uppercase font-bold">Sinif / Tarix:</span>
          </div>
        </div>

        <div className="mt-2 text-[10px] text-gray-600 bg-gray-100 p-1.5 rounded flex items-center justify-between">
          <span>Qeyd: Dairəcikləri göy və ya qara qələmlə tam doldurun:</span>
          <span className="font-bold flex items-center gap-1">
            Düzgün: <span className="inline-block w-3.5 h-3.5 rounded-full bg-black text-white text-[8px] leading-[14px] text-center">A</span>
            Səhv: <span className="inline-block w-3.5 h-3.5 rounded-full border border-black text-center text-[8px] leading-[14px]">✕</span>
          </span>
        </div>
      </div>

      {/* Bubbles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 tabular-nums">
        {questionCols.map((colQuestions, cIdx) => (
          <div
            key={cIdx}
            className="border border-gray-300 rounded p-2 bg-gray-50/50 space-y-1"
          >
            {colQuestions.map((_, qIdx) => {
              const qNum = cIdx * colSize + qIdx + 1;
              return (
                <div
                  key={qNum}
                  className="flex items-center justify-between py-0.5 border-b border-gray-200 text-xs"
                >
                  <span className="w-6 font-bold text-gray-800 text-[11px]">
                    {qNum < 10 ? `0${qNum}` : qNum}.
                  </span>
                  <div className="flex gap-1.5">
                    {letters.map((letter) => (
                      <span
                        key={letter}
                        className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-bold text-black"
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
