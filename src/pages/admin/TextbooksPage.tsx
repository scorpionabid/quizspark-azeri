import { useState } from 'react';
import { BookOpen, RefreshCw, Upload, CheckCircle2, Clock, AlertCircle, Download, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { ALL_SCHOOL_SUBJECTS, CORE_SUBJECTS, SCHOOL_GRADES } from '@/lib/constants/subjects';
import {
  useTextbooks,
  useSyncTrims,
  useUploadTextbookPdf,
  useAddCurriculumTopic,
} from '@/hooks/useTextbooks';

export default function TextbooksPage() {
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  const { data: textbooks = [], isLoading } = useTextbooks(
    gradeFilter !== 'all' ? Number(gradeFilter) : undefined,
    subjectFilter !== 'all' ? subjectFilter : undefined
  );
  const syncTrims = useSyncTrims();
  const uploadPdf = useUploadTextbookPdf();
  const addTopic = useAddCurriculumTopic();

  // Manual upload state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [upGrade, setUpGrade] = useState('5');
  const [upSubject, setUpSubject] = useState<string>(CORE_SUBJECTS[0]);
  const [upTitle, setUpTitle] = useState('');
  const [upFile, setUpFile] = useState<File | null>(null);

  // Quick topic add state
  const [topicOpen, setTopicOpen] = useState(false);
  const [topicGrade, setTopicGrade] = useState('5');
  const [topicSubject, setTopicSubject] = useState<string>(CORE_SUBJECTS[0]);
  const [topicUnit, setTopicUnit] = useState('');
  const [topicName, setTopicName] = useState('');
  const [topicSemester, setTopicSemester] = useState('1');

  const handleCatalogSync = async () => {
    try {
      const res = await syncTrims.mutateAsync({ mode: 'catalog_core', maxPages: 4 });
      toast.success(`TRİMS kataloqu yoxlanıldı: ${res.queued ?? 0} dərslik növbəyə əlavə olundu.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'TRİMS sinxronizasiya xətası');
    }
  };

  const handleSyncSingle = async (id: string) => {
    try {
      await syncTrims.mutateAsync({ mode: 'sync_single', textbookId: id });
      toast.success('Dərslik öz bazamıza endirildi və hazır vəziyyətə gətirildi.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Endirmə xətası');
    }
  };

  const handleManualUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upFile || !upTitle.trim()) {
      toast.error('Dərslik adı və PDF faylı seçilməlidir');
      return;
    }
    try {
      await uploadPdf.mutateAsync({
        file: upFile,
        grade: Number(upGrade),
        subject: upSubject,
        title: upTitle,
        sourceType: 'admin_upload',
      });
      toast.success('Dərslik öz bazamıza yükləndi');
      setUploadOpen(false);
      setUpTitle('');
      setUpFile(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Yükləmə xətası');
    }
  };

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) {
      toast.error('Mövzu adını daxil edin');
      return;
    }
    try {
      await addTopic.mutateAsync({
        grade: Number(topicGrade),
        subject: topicSubject,
        unit_name: topicUnit.trim() || 'Ümumi bölmə',
        topic_name: topicName.trim(),
        semester: Number(topicSemester) || 1,
      });
      toast.success('Mövzu əlavə edildi');
      setTopicName('');
      setTopicOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Xəta baş verdi');
    }
  };

  const readyCount = textbooks.filter((b) => b.status === 'ready').length;
  const pendingCount = textbooks.filter((b) => b.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="w-full space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-primary" />
              Dərslik Kitabxanası (TRİMS & Lokal Baza)
            </h1>
            <p className="text-muted-foreground mt-1">
              10 əsas fənn üzrə dərsliklər öz bazamızda saxlanılır — TRİMS işləməsə belə KSQ/BSQ sistemi tam işlək qalır.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleCatalogSync}
              disabled={syncTrims.isPending}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${syncTrims.isPending ? 'animate-spin' : ''}`} />
              10 Əsas Fənni TRİMS-dən Yenilə
            </Button>

            <Dialog open={topicOpen} onOpenChange={setTopicOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Mövzu Əlavə Et
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Kurikulum Mövzusu Əlavə Et</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddTopic} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Sinif</Label>
                      <Select value={topicGrade} onValueChange={setTopicGrade}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {SCHOOL_GRADES.map((g) => (
                            <SelectItem key={g} value={String(g)}>{g}-ci sinif</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Fənn</Label>
                      <Select value={topicSubject} onValueChange={setTopicSubject}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ALL_SCHOOL_SUBJECTS.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Bölmə adı</Label>
                      <Input
                        placeholder="Məs: Mexaniki hərəkət"
                        value={topicUnit}
                        onChange={(e) => setTopicUnit(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Yarımil</Label>
                      <Select value={topicSemester} onValueChange={setTopicSemester}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1-ci yarımil</SelectItem>
                          <SelectItem value="2">2-ci yarımil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Mövzu adı *</Label>
                    <Input
                      placeholder="Məs: Düzxətli bərabərsürətli hərəkət"
                      value={topicName}
                      onChange={(e) => setTopicName(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={addTopic.isPending}>
                    Yadda Saxla
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
              <DialogTrigger asChild>
                <Button variant="game" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Manual PDF Yüklə
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dərslik PDF Yüklə</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleManualUpload} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Sinif</Label>
                      <Select value={upGrade} onValueChange={setUpGrade}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {SCHOOL_GRADES.map((g) => (
                            <SelectItem key={g} value={String(g)}>{g}-ci sinif</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Fənn</Label>
                      <Select value={upSubject} onValueChange={setUpSubject}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ALL_SCHOOL_SUBJECTS.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Dərslik Başlığı *</Label>
                    <Input
                      placeholder="Məs: Riyaziyyat 5-ci sinif"
                      value={upTitle}
                      onChange={(e) => setUpTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>PDF Faylı *</Label>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setUpFile(e.target.files?.[0] ?? null)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={uploadPdf.isPending}>
                    {uploadPdf.isPending ? 'Yüklənir...' : 'Bazamıza Yüklə'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-gradient-card border border-border/50 p-4">
            <p className="text-xs text-muted-foreground">Cəmi Dərslik</p>
            <p className="text-2xl font-bold mt-1">{textbooks.length}</p>
          </div>
          <div className="rounded-xl bg-gradient-card border border-border/50 p-4">
            <p className="text-xs text-muted-foreground">Bazamızda Hazır (Offline-safe)</p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">{readyCount}</p>
          </div>
          <div className="rounded-xl bg-gradient-card border border-border/50 p-4">
            <p className="text-xs text-muted-foreground">Endirilmə Gözləyən (TRİMS)</p>
            <p className="text-2xl font-bold text-amber-500 mt-1">{pendingCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Sinif" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün siniflər</SelectItem>
              {SCHOOL_GRADES.map((g) => (
                <SelectItem key={g} value={String(g)}>{g}-ci sinif</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Fənn" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün fənlər</SelectItem>
              {ALL_SCHOOL_SUBJECTS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Textbooks Table */}
        <div className="rounded-2xl bg-gradient-card border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sinif</TableHead>
                <TableHead>Fənn</TableHead>
                <TableHead>Başlıq</TableHead>
                <TableHead>Mənbə</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Əməliyyat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Yüklənir...
                  </TableCell>
                </TableRow>
              ) : textbooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Hələ dərslik əlavə edilməyib. Yuxarıdakı &quot;TRİMS-dən Yenilə&quot; və ya &quot;Manual PDF Yüklə&quot; düyməsindən istifadə edin.
                  </TableCell>
                </TableRow>
              ) : (
                textbooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.grade}-ci sinif</TableCell>
                    <TableCell>
                      <span>{book.subject}</span>
                      {book.is_core_subject && (
                        <Badge variant="secondary" className="ml-2 text-[10px]">Əsas</Badge>
                      )}
                    </TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{book.source_type}</TableCell>
                    <TableCell>
                      {book.status === 'ready' && (
                        <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Hazır
                        </Badge>
                      )}
                      {book.status === 'pending' && (
                        <Badge variant="outline" className="text-amber-500 border-amber-500/30 gap-1">
                          <Clock className="h-3 w-3" /> Gözləyir
                        </Badge>
                      )}
                      {book.status === 'processing' && (
                        <Badge variant="outline" className="text-blue-500 border-blue-500/30 gap-1">
                          <RefreshCw className="h-3 w-3 animate-spin" /> Emal olunur
                        </Badge>
                      )}
                      {book.status === 'failed' && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" /> Xəta
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {book.status !== 'ready' && book.source_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSyncSingle(book.id)}
                          disabled={syncTrims.isPending}
                          className="gap-1"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Bazamıza Çək
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
