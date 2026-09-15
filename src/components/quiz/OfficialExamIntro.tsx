import React from 'react';
import { Shield, Clock, HelpCircle, CheckCircle, User, Award, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { OFFICIAL_EXAMS } from '@/lib/constants/exams';
import { Quiz } from '@/hooks/useQuizzes';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface OfficialExamIntroProps {
  quiz: Quiz;
  user: SupabaseUser | null;
  onStart: () => void;
  isPending?: boolean;
}

export const OfficialExamIntro: React.FC<OfficialExamIntroProps> = ({
  quiz,
  user,
  onStart,
  isPending = false,
}) => {
  const { language, t } = useLanguage();

  const fullName = user?.user_metadata?.full_name || '';
  const fin = (user?.user_metadata?.fin || '').toUpperCase();

  const examMeta = OFFICIAL_EXAMS.find((e) => e.key === quiz.specialty_key);
  const displayTitle = language === 'ka' && examMeta?.title_ka ? examMeta.title_ka : quiz.title;

  const duration = quiz.duration || 90;
  const questionCount = quiz.question_count || 60;
  const passPercentage = quiz.pass_percentage || 60;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 flex flex-col justify-center items-center">
      {/* Top Header */}
      <div className="max-w-lg w-full mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              QS
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">QuizSpark Exam</span>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('official_exam_briefing')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {displayTitle}
          </p>
        </div>
      </div>

      {/* Main Card */}
      <Card className="max-w-lg w-full border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900">
        <CardHeader className="pb-3 pt-6 px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold">{t('candidate_info')}</span>
            </div>
            {fin && (
              <Badge variant="outline" className="font-mono text-xs font-bold text-blue-600 border-blue-200 dark:border-blue-800">
                FİN: {fin}
              </Badge>
            )}
          </div>
          {fullName && (
            <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {fullName}
            </p>
          )}
        </CardHeader>

        <CardContent className="px-6 py-5 space-y-5">
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{questionCount}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t('question_count')}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-xl font-bold text-slate-800 dark:text-slate-200">{duration}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t('quiz_intro_duration')}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">%{passPercentage}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t('pass_score')}</div>
            </div>
          </div>

          {/* Simple Rules */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t('exam_rules')}:
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>{t('rule_1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>{t('rule_2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>{t('rule_3')}</span>
              </li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="px-6 pb-6 pt-0">
          <Button
            size="lg"
            className="w-full h-12 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-600/20"
            onClick={onStart}
            disabled={isPending}
          >
            <span>{isPending ? t('checking_btn') : t('start_exam_btn')}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
