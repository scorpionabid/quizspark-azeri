import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  School,
  User,
  ArrowRight,
  BookOpen,
  Edit2,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  cleanUtisCode,
  isValidUtisCode,
  lookupStudentByUtis,
  loginOrRegisterStudentByUtis,
  fetchSchoolsList,
  SchoolItem,
} from '@/lib/auth/studentUtisAuth';

export interface UtisStudentAuthCardProps {
  onSuccess?: (userId: string) => void;
  onSwitchToAccountLogin?: () => void;
  variant?: 'card' | 'embedded';
  title?: string;
  subtitle?: string;
  buttonText?: string;
  className?: string;
}

const CLASS_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'Digər'];
const GRADE_LEVELS = Array.from({ length: 11 }, (_, i) => i + 1);

export const UtisStudentAuthCard: React.FC<UtisStudentAuthCardProps> = ({
  onSuccess,
  onSwitchToAccountLogin,
  variant = 'card',
  title = 'Məktəbli Girişi (UTİS)',
  subtitle = '7 rəqəmli UTİS kodunuz ilə asanlıqla daxil olun.',
  buttonText = 'İmtahana Başla',
  className,
}) => {
  const { refreshProfile } = useAuth();
  const [utisCode, setUtisCode] = useState(() => {
    return localStorage.getItem('student_saved_utis') || '';
  });
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');
  const [gradeLevel, setGradeLevel] = useState<number>(5);
  const [classLetter, setClassLetter] = useState<string>('A');

  const [schoolsList, setSchoolsList] = useState<SchoolItem[]>([]);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);

  const [isSearching, setIsSearching] = useState(false);
  const [isExisting, setIsExisting] = useState<boolean | null>(null);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const lastCheckedUtisRef = useRef('');

  // Load regional schools list once on mount
  useEffect(() => {
    fetchSchoolsList().then((list) => {
      if (list && list.length > 0) {
        setSchoolsList(list);
      }
    });
  }, []);

  // Filtered schools for searchable dropdown
  const filteredSchools = useMemo(() => {
    const q = schoolSearchQuery.trim().toLowerCase();
    if (!q) return schoolsList.slice(0, 30);
    return schoolsList
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q)
      )
      .slice(0, 30);
  }, [schoolsList, schoolSearchQuery]);

  // Auto-lookup when exactly 7 digits are entered
  useEffect(() => {
    const clean = cleanUtisCode(utisCode);
    if (clean.length === 7 && clean !== lastCheckedUtisRef.current) {
      lastCheckedUtisRef.current = clean;
      let isMounted = true;
      setIsSearching(true);
      setErrorMsg(null);

      lookupStudentByUtis(clean)
        .then((res) => {
          if (!isMounted) return;
          if (res.found && res.fullName) {
            setFullName(res.fullName);
            if (res.school) setSchool(res.school);
            if (res.gradeLevel) setGradeLevel(res.gradeLevel);
            if (res.classLetter) setClassLetter(res.classLetter);
            setIsExisting(true);
            setIsEditingDetails(false);
          } else {
            setIsExisting(false);
            setIsEditingDetails(true); // New student: open form
          }
        })
        .catch(() => {
          if (isMounted) {
            setIsExisting(false);
            setIsEditingDetails(true);
          }
        })
        .finally(() => {
          if (isMounted) setIsSearching(false);
        });

      return () => {
        isMounted = false;
      };
    } else if (clean.length < 7) {
      setIsExisting(null);
      lastCheckedUtisRef.current = '';
    }
  }, [utisCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = cleanUtisCode(utisCode);

    if (!isValidUtisCode(clean)) {
      setErrorMsg('UTİS kodu dəqiq 7 rəqəmdən ibarət olmalıdır.');
      return;
    }

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMsg('Zəhmət olmasa ad və soyadınızı daxil edin.');
      return;
    }

    if (!school.trim()) {
      setErrorMsg('Zəhmət olmasa məktəbinizi seçin və ya daxil edin.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const result = await loginOrRegisterStudentByUtis({
        utis: clean,
        fullName: fullName.trim(),
        school: school.trim(),
        gradeLevel,
        classLetter,
        isExternal: isExisting === false,
      });

      // Save UTIS locally so next time student doesn't need to re-type
      localStorage.setItem('student_saved_utis', clean);

      await refreshProfile();
      toast.success(`Xoş gəldin, ${fullName.trim()}!`);
      if (onSuccess) {
        onSuccess(result.userId);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Daxil olarkən xəta baş verdi.';
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCard = variant === 'card';

  return (
    <div
      className={cn(
        'w-full text-left transition-all',
        isCard &&
          'rounded-3xl border border-primary/20 bg-card/95 p-5 sm:p-7 shadow-xl backdrop-blur-md',
        className
      )}
    >
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
              {title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Badge variant="outline" className="shrink-0 bg-primary/5 text-primary border-primary/20">
          Məktəbli
        </Badge>
      </div>

      {errorMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs sm:text-sm font-medium text-destructive animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* UTIS Code Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="student-utis-code"
              className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              UTİS Kodu (7 rəqəmli)
            </label>
            {isSearching && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin text-primary" /> Yoxlanılır...
              </span>
            )}
            {!isSearching && isExisting === true && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Şagird Reyestrindədir
              </span>
            )}
            {!isSearching && isExisting === false && utisCode.length === 7 && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                <Sparkles className="h-3.5 w-3.5" /> Yeni şagird qeydiyyatı
              </span>
            )}
          </div>

          <Input
            id="student-utis-code"
            type="text"
            inputMode="numeric"
            maxLength={7}
            placeholder="Məs: 1012411"
            value={utisCode}
            onChange={(e) => {
              const cleaned = cleanUtisCode(e.target.value);
              setUtisCode(cleaned);
              if (errorMsg) setErrorMsg(null);
            }}
            className="h-12 text-base sm:text-lg font-mono tracking-wider font-bold text-foreground rounded-xl"
            autoFocus
            disabled={isSubmitting}
            required
          />
        </div>

        {/* CASE A: Known student from registry */}
        {isExisting === true && fullName && (
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs sm:text-sm text-foreground space-y-3 animate-in fade-in">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5 min-w-0">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">
                    Xoş gəldin, {fullName}!
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {school}
                  </p>
                  <p className="text-xs font-semibold text-foreground/80 mt-1">
                    Cari Sinif: <span className="text-primary font-bold">{gradeLevel}-ci sinif</span> {classLetter ? `(${classLetter})` : ''}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingDetails(!isEditingDetails)}
                className="text-xs text-muted-foreground hover:text-primary gap-1 h-8 shrink-0"
              >
                <Edit2 className="h-3 w-3" />
                {isEditingDetails ? 'Bağla' : 'Dəyiş'}
              </Button>
            </div>

            {/* Quick class letter selection */}
            {!isEditingDetails && (
              <div className="pt-2 border-t border-emerald-500/15">
                <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                  Sinif bölmənizi (hərfi) seçin:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CLASS_LETTERS.map((letter) => (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => setClassLetter(letter)}
                      className={cn(
                        'h-7 px-2.5 rounded-lg text-xs font-bold transition-all border',
                        classLetter === letter
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-background hover:bg-muted text-muted-foreground border-border'
                      )}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CASE B or EDIT MODE: Full details editing */}
        {(isEditingDetails || isExisting === false) && (utisCode.length === 7 || fullName.length > 0) && (
          <div className="space-y-3.5 pt-2 border-t border-border/50 animate-in fade-in duration-200">
            {isExisting === false && (
              <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 text-xs text-blue-700 dark:text-blue-300">
                UTİS kodunuz bazada tapılmadı (yeni şagird və ya kənardan gələn). Zəhmət olmasa məlumatlarınızı tamamlayın:
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1">
              <label
                htmlFor="student-full-name"
                className="text-xs font-semibold text-muted-foreground flex items-center gap-1"
              >
                <User className="h-3 w-3" /> Ad, Soyad və Ata adı
              </label>
              <Input
                id="student-full-name"
                type="text"
                placeholder="Məs: Əliyev Əli Vüqar oğlu"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-10 rounded-xl text-sm"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* School Selector with instant search */}
            <div className="space-y-1 relative">
              <label
                htmlFor="student-school"
                className="text-xs font-semibold text-muted-foreground flex items-center gap-1"
              >
                <School className="h-3 w-3" /> Məktəb (Region üzrə 357 məktəb)
              </label>
              <div className="relative">
                <Input
                  id="student-school"
                  type="text"
                  placeholder="Məktəb adını yazaraq axtarın..."
                  value={schoolSearchQuery || school}
                  onChange={(e) => {
                    setSchoolSearchQuery(e.target.value);
                    setSchool(e.target.value);
                    setIsSchoolDropdownOpen(true);
                  }}
                  onFocus={() => setIsSchoolDropdownOpen(true)}
                  className="h-10 rounded-xl text-sm pr-8"
                  disabled={isSubmitting}
                  required
                />
                <Search className="h-4 w-4 text-muted-foreground absolute right-2.5 top-3 pointer-events-none" />
              </div>

              {/* School Search Dropdown */}
              {isSchoolDropdownOpen && filteredSchools.length > 0 && (
                <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-xl border border-border bg-popover p-1 shadow-lg backdrop-blur-md">
                  {filteredSchools.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSchool(s.name);
                        setSchoolSearchQuery('');
                        setIsSchoolDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-muted transition-colors flex items-center justify-between gap-2"
                    >
                      <span className="truncate font-medium text-foreground">{s.name}</span>
                      <Badge variant="secondary" className="text-[10px] shrink-0 font-normal">
                        {s.district}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Grade Level (1-11) and Class Letter (A, B, C...) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <BookOpen className="h-3 w-3" /> Sinif Səviyyəsi
                </label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(parseInt(e.target.value, 10))}
                  className="w-full h-10 px-3 rounded-xl text-sm font-semibold border border-input bg-background text-foreground"
                  disabled={isSubmitting}
                >
                  {GRADE_LEVELS.map((g) => (
                    <option key={g} value={g}>
                      {g}-ci sinif
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  Sinif Hərfi / Bölməsi
                </label>
                <select
                  value={classLetter}
                  onChange={(e) => setClassLetter(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl text-sm font-semibold border border-input bg-background text-foreground"
                  disabled={isSubmitting}
                >
                  {CLASS_LETTERS.map((l) => (
                    <option key={l} value={l}>
                      {l} sinfi
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 rounded-xl text-base font-bold shadow-md hover:shadow-primary/20 gap-2 transition-all active:scale-[0.99]"
          disabled={isSubmitting || cleanUtisCode(utisCode).length !== 7}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sessiya açılır...
            </>
          ) : (
            <>
              {isExisting === false ? 'Qeydiyyatdan Keç və İmtahana Başla' : buttonText}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Switch to Teacher / Candidate Login */}
      {onSwitchToAccountLogin && (
        <div className="mt-4 pt-3 border-t border-border/40 text-center">
          <button
            type="button"
            onClick={onSwitchToAccountLogin}
            className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            Tələbə (Dövlət Qulluğu / Magistr) və ya Müəllimsiniz?{' '}
            <span className="font-bold underline text-primary">Gmail ilə daxil olun</span>
          </button>
        </div>
      )}
    </div>
  );
};
