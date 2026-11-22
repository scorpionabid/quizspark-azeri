import { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Upload,
  FileSpreadsheet,
  GraduationCap,
  Link2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SCHOOL_GRADES } from '@/lib/constants/subjects';
import { useMyQuizzes } from '@/hooks/useQuizzes';
import {
  useTeacherClasses,
  useCreateClass,
  useDeleteClass,
  useClassStudents,
  useBulkAddStudents,
  useDeleteStudent,
  useClassAssessmentResults,
} from '@/hooks/useClassRoster';

function gradeBadgeClass(mark: number): string {
  if (mark === 5) return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
  if (mark === 4) return 'bg-blue-500/15 text-blue-500 border-blue-500/30';
  if (mark === 3) return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
  return 'bg-destructive/15 text-destructive border-destructive/30';
}

export default function ClassRosterPage() {
  const { data: classes = [], isLoading: classesLoading } = useTeacherClasses();
  const { data: myQuizzes = [] } = useMyQuizzes();
  const createClass = useCreateClass();
  const deleteClass = useDeleteClass();
  const bulkAddStudents = useBulkAddStudents();
  const deleteStudent = useDeleteStudent();

  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const activeClassId = selectedClassId || classes[0]?.id || '';

  const [selectedQuizId, setSelectedQuizId] = useState<string>('all');

  const { data: students = [], isLoading: studentsLoading } = useClassStudents(activeClassId);
  const { data: results = [] } = useClassAssessmentResults(activeClassId, selectedQuizId);

  // Create class dialog
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('6');

  // Bulk add students dialog
  const [studentsDialogOpen, setStudentsDialogOpen] = useState(false);
  const [bulkNamesText, setBulkNamesText] = useState('');

  const resultsByStudent = useMemo(() => {
    const map = new Map<string, (typeof results)[number]>();
    for (const r of results) {
      if (!map.has(r.student_id)) {
        map.set(r.student_id, r);
      }
    }
    return map;
  }, [results]);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      toast.error('Sinif adını daxil edin (məs: 6A)');
      return;
    }
    try {
      const created = await createClass.mutateAsync({
        name: newClassName.trim(),
        grade: Number(newClassGrade),
      });
      setSelectedClassId(created.id);
      setNewClassName('');
      setClassDialogOpen(false);
      toast.success(`${created.name} sinfi yaradıldı`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Sinif yaradılarkən xəta');
    }
  };

  const handleBulkAddStudents = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClassId) return;
    const names = bulkNamesText
      .split(/\r?\n/)
      .map((line) => line.replace(/^\d+[.)\s-]+/, '').trim())
      .filter(Boolean);

    if (names.length === 0) {
      toast.error('Ən azı 1 şagird adı daxil edin');
      return;
    }

    try {
      const startNumber = students.length + 1;
      await bulkAddStudents.mutateAsync({
        classId: activeClassId,
        names,
        startNumber,
      });
      setBulkNamesText('');
      setStudentsDialogOpen(false);
      toast.success(`${names.length} şagird siyahıya əlavə olundu`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Əlavə etmə xətası');
    }
  };

  const handleExportCsv = () => {
    const headers = ['No', 'Ad Soyad', 'Duz/Cemi', 'Bal (100 balliq)', 'Qiymet (2-5)'];
    const rows = students.map((st) => {
      const res = resultsByStudent.get(st.id);
      return [
        st.student_number,
        `"${st.full_name.replace(/"/g, '""')}"`,
        res ? `${res.score}/${res.total_questions}` : '-',
        res ? `${res.percentage}` : '-',
        res ? `${res.grade_mark}` : '-',
      ].join(',');
    });
    const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sinif-neticeleri-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="w-full space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-primary" />
              Siniflərim və Şagird Nəticələri
            </h1>
            <p className="text-muted-foreground mt-1">
              Sinif siyahılarını yükləyin — hər şagirdin qarşısında 100 ballıq balı və qiyməti avtomatik görünsün.
            </p>
          </div>

          <Dialog open={classDialogOpen} onOpenChange={setClassDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="game" className="gap-2">
                <Plus className="h-4 w-4" />
                Yeni Sinif Yarat
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Sinif Yarat</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateClass} className="space-y-4">
                <div>
                  <Label>Sinif səviyyəsi</Label>
                  <Select value={newClassGrade} onValueChange={setNewClassGrade}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SCHOOL_GRADES.map((g) => (
                        <SelectItem key={g} value={String(g)}>{g}-ci sinif</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Sinif adı *</Label>
                  <Input
                    placeholder="Məs: 6A"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createClass.isPending}>
                  Yarat
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Class Tabs */}
        {classesLoading ? (
          <p className="text-sm text-muted-foreground">Siniflər yüklənir...</p>
        ) : classes.length === 0 ? (
          <div className="rounded-2xl bg-gradient-card border border-border/50 p-8 text-center space-y-3">
            <Users className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="font-medium">Hələ sinif yaratmamısınız</p>
            <p className="text-sm text-muted-foreground">
              &quot;Yeni Sinif Yarat&quot; düyməsi ilə siniflərinizi əlavə edib şagird siyahısını yükləyə bilərsiniz.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {classes.map((cls) => (
                  <div key={cls.id} className="flex items-center">
                    <Button
                      variant={activeClassId === cls.id ? 'default' : 'outline'}
                      onClick={() => setSelectedClassId(cls.id)}
                      className="gap-2"
                    >
                      {cls.name} ({cls.grade}-ci sinif)
                    </Button>
                  </div>
                ))}
              </div>

              {activeClassId && (
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={selectedQuizId} onValueChange={setSelectedQuizId}>
                    <SelectTrigger className="w-[240px]">
                      <SelectValue placeholder="Qiymətləndirmə seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Son nəticələr (Hamısı)</SelectItem>
                      {myQuizzes.map((q) => (
                        <SelectItem key={q.id} value={q.id}>
                          {q.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedQuizId !== 'all' && (
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => {
                        const link = `${window.location.origin}/quiz/${selectedQuizId}?classId=${activeClassId}`;
                        void navigator.clipboard.writeText(link);
                        toast.success('Bütün sinif üçün ümumi onlayn link kopyalandı!');
                      }}
                    >
                      <Link2 className="h-4 w-4" />
                      Sinif Linkini Kopyala
                    </Button>
                  )}

                  <Dialog open={studentsDialogOpen} onOpenChange={setStudentsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Şagird Siyahısı Yüklə
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Şagirdləri Toplu Əlavə Et</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleBulkAddStudents} className="space-y-4">
                        <div className="space-y-1.5">
                          <Label>Hər sətirə 1 şagirdin Adı, Soyadı (Excel-dən kopyala-yapışdır edə bilərsiniz)</Label>
                          <Textarea
                            rows={8}
                            placeholder={'Əliyev Murad\nMəmmədova Aysel\nHəsənov Nicat'}
                            value={bulkNamesText}
                            onChange={(e) => setBulkNamesText(e.target.value)}
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={bulkAddStudents.isPending}>
                          Siyahıya Əlavə Et
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    onClick={handleExportCsv}
                    disabled={students.length === 0}
                    className="gap-2"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Excel / CSV
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      deleteClass.mutate(activeClassId);
                      setSelectedClassId('');
                      toast.success('Sinif silindi');
                    }}
                    title="Sinfi sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Students + 10-Point Score & Grade Table */}
            <div className="rounded-2xl bg-gradient-card border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">№</TableHead>
                    <TableHead>Şagirdin Adı, Soyadı</TableHead>
                    <TableHead>Düz / Cəmi</TableHead>
                    <TableHead>Bal (100 ballıq)</TableHead>
                    <TableHead>Qiymət</TableHead>
                    <TableHead className="text-right">Əməliyyat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Yüklənir...
                      </TableCell>
                    </TableRow>
                  ) : students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Bu sinifdə hələ şagird yoxdur. &quot;Şagird Siyahısı Yüklə&quot; düyməsi ilə əlavə edin.
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((st) => {
                      const res = resultsByStudent.get(st.id);
                      return (
                        <TableRow key={st.id}>
                          <TableCell className="font-mono text-xs">{st.student_number}</TableCell>
                          <TableCell className="font-medium">{st.full_name}</TableCell>
                          <TableCell className="text-sm">
                            {res ? `${res.score} / ${res.total_questions}` : '—'}
                          </TableCell>
                          <TableCell>
                            {res ? (
                              <span className="font-bold text-primary">{Math.round(res.percentage)} / 100</span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {res ? (
                              <Badge className={gradeBadgeClass(res.grade_mark)}>
                                {res.grade_mark}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-xs">Yoxlanılmayıb</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {selectedQuizId !== 'all' && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-muted-foreground hover:text-primary"
                                  title="Şagird üçün onlayn test linkini kopyala"
                                  onClick={() => {
                                    const link = `${window.location.origin}/quiz/${selectedQuizId}?classId=${activeClassId}&studentId=${st.id}`;
                                    void navigator.clipboard.writeText(link);
                                    toast.success(`${st.full_name} üçün onlayn link kopyalandı`);
                                  }}
                                >
                                  <Link2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() =>
                                  deleteStudent.mutate({ studentId: st.id, classId: activeClassId })
                                }
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
