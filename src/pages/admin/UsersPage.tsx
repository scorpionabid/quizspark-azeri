import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Phone,
  School,
  BookOpen,
  CheckCheck,
  Clock,
  MessageCircle,
  GraduationCap,
  Users as UsersIcon,
  Loader2,
  Download,
  Activity,
  Crown,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  FileText,
  Trophy,
  PlayCircle,
  Eye,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useUsers,
  useTeacherStats,
  UserItem,
  TeacherStatItem,
  TeacherQuizItem
} from "@/hooks/useUsers";
import { AppRole } from "@/types/auth";
import * as XLSX from "xlsx";

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  teacher: 'Müəllim',
  student: 'Tələbə',
};

const statusLabels: Record<string, string> = {
  active: 'Aktiv',
  inactive: 'Deaktiv',
  pending: 'Gözləyir',
};

const tierLabels: Record<string, string> = {
  vip: 'VIP',
  quest: 'Quest',
};

function formatRelativeActivity(dateString?: string | null) {
  if (!dateString) {
    return { relative: "Heç vaxt", isRecent: false, full: "Sistemə daxil olmayıb" };
  }
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    let relative = "";
    let isRecent = false;

    if (diffMins < 1) {
      relative = "indicə";
      isRecent = true;
    } else if (diffMins < 60) {
      relative = `${diffMins} dəq əvvəl`;
      isRecent = true;
    } else if (diffHours < 24) {
      relative = `${diffHours} saat əvvəl`;
      isRecent = true;
    } else if (diffDays === 1) {
      relative = "Dünən";
      isRecent = true;
    } else if (diffDays < 7) {
      relative = `${diffDays} gün əvvəl`;
    } else {
      relative = d.toLocaleDateString('az-AZ', { day: 'numeric', month: 'short' });
    }

    const full = d.toLocaleString('az-AZ', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return { relative, isRecent, full };
  } catch {
    return { relative: "Naməlum", isRecent: false, full: dateString };
  }
}

function formatApplicationTime(dateString: string) {
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    let relative = "";
    if (diffMins < 1) relative = "indicə";
    else if (diffMins < 60) relative = `${diffMins} dəqiqə əvvəl`;
    else if (diffHours < 24) relative = `${diffHours} saat əvvəl`;
    else {
      const diffDays = Math.floor(diffHours / 24);
      relative = `${diffDays} gün əvvəl`;
    }

    const formattedDate = d.toLocaleDateString('az-AZ', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const formattedTime = d.toLocaleTimeString('az-AZ', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return {
      relative,
      full: `${formattedDate}, ${formattedTime}`
    };
  } catch {
    return { relative: "", full: dateString };
  }
}

export default function UsersPage() {
  const {
    users,
    isLoading,
    createUser,
    updateUserProfile,
    updateStatus,
    updateRole,
    updateTier,
    deleteUser,
    approveTeacher,
    approveAllTeachers
  } = useUsers();

  const { teacherStats, isLoading: isTeacherStatsLoading } = useTeacherStats();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activityFilter, setActivityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("last_active_desc");

  // Role Tab
  const [roleTab, setRoleTab] = useState<string>("pending");

  // Teacher Stats Search & Sort
  const [teacherStatSearch, setTeacherStatSearch] = useState("");
  const [teacherStatSort, setTeacherStatSort] = useState("questions_desc");
  const [selectedTeacherForQuizzes, setSelectedTeacherForQuizzes] = useState<TeacherStatItem | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Modals state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);

  // Add User Form State
  const [addForm, setAddForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student" as AppRole,
    phone: "",
    school: "",
    specialty: "",
    fin: "",
  });

  // Edit User Form State
  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
    school: "",
    specialty: "",
    fin: "",
    role: "student" as AppRole,
    tier: "quest" as "vip" | "quest",
    status: "active",
  });

  // Pending teachers calculation
  const pendingTeachers = useMemo(() => {
    return (users || []).filter(
      (u) => (u.role === 'teacher' || u.status === 'pending') && u.status === 'pending'
    );
  }, [users]);

  const pendingTeachersCount = pendingTeachers.length;

  const activeTeachersCount = useMemo(() => {
    return (users || []).filter((u) => u.role === 'teacher' && u.status !== 'pending').length;
  }, [users]);

  const studentsCount = useMemo(() => {
    return (users || []).filter((u) => u.role === 'student' && u.status !== 'pending').length;
  }, [users]);

  const adminsCount = useMemo(() => {
    return (users || []).filter((u) => u.role === 'admin').length;
  }, [users]);

  // Active today calculation
  const activeTodayCount = useMemo(() => {
    if (!users) return 0;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return users.filter((u) => {
      if (!u.lastActiveAt) return false;
      const d = new Date(u.lastActiveAt);
      return d >= startOfDay;
    }).length;
  }, [users]);

  // VIP count
  const vipCount = useMemo(() => {
    return (users || []).filter((u) => u.subscriptionTier === 'vip').length;
  }, [users]);

  // Teacher Totals
  const teacherTotals = useMemo(() => {
    if (!teacherStats) return { totalQuizzes: 0, totalQuestions: 0, totalPlays: 0, topAuthor: null as TeacherStatItem | null };
    // Filter to only teachers (excluding pure admins)
    const teachersOnly = teacherStats.filter(t => t.email !== 'scorpionabid82@gmail.com');
    const totalQuizzes = teachersOnly.reduce((acc, t) => acc + (t.quizCount || 0), 0);
    const totalQuestions = teachersOnly.reduce((acc, t) => acc + (t.totalQuestions || 0), 0);
    const totalPlays = teachersOnly.reduce((acc, t) => acc + (t.totalPlays || 0), 0);
    const topAuthor = teachersOnly.length > 0 && teachersOnly[0].totalQuestions > 0 ? teachersOnly[0] : null;
    return { totalQuizzes, totalQuestions, totalPlays, topAuthor };
  }, [teacherStats]);

  // Filtered Teacher Stats
  const filteredTeacherStats = useMemo(() => {
    if (!teacherStats) return [];
    return teacherStats
      .filter((t) => {
        const q = teacherStatSearch.toLowerCase().trim();
        return (
          !q ||
          t.fullName.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          (t.school && t.school.toLowerCase().includes(q)) ||
          (t.specialty && t.specialty.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (teacherStatSort === 'questions_desc') return b.totalQuestions - a.totalQuestions;
        if (teacherStatSort === 'quizzes_desc') return b.quizCount - a.quizCount;
        if (teacherStatSort === 'plays_desc') return b.totalPlays - a.totalPlays;
        if (teacherStatSort === 'name_asc') return a.fullName.localeCompare(b.fullName, 'az');
        return 0;
      });
  }, [teacherStats, teacherStatSearch, teacherStatSort]);

  // Set default tab on load if there are pending teachers
  useEffect(() => {
    if (pendingTeachersCount === 0 && roleTab === 'pending') {
      setRoleTab('teacher');
    }
  }, [pendingTeachersCount]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, activityFilter, roleTab, sortBy]);

  // Filter & Sort Users
  const filteredUsers = useMemo(() => {
    const list = (users || []).filter((user) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        (user.phone && user.phone.includes(q)) ||
        (user.school && user.school.toLowerCase().includes(q)) ||
        (user.specialty && user.specialty.toLowerCase().includes(q)) ||
        (user.fin && user.fin.toLowerCase().includes(q)) ||
        (user.utisCode && user.utisCode.toLowerCase().includes(q));

      let matchesRole = false;
      if (roleTab === 'pending') {
        matchesRole = (user.role === 'teacher' || user.status === 'pending') && user.status === 'pending';
      } else if (roleTab === 'teacher') {
        matchesRole = user.role === 'teacher' && user.status !== 'pending';
      } else if (roleTab === 'student') {
        matchesRole = user.role === 'student' && user.status !== 'pending';
      } else if (roleTab === 'admin') {
        matchesRole = user.role === 'admin';
      }

      const matchesStatus = statusFilter === "all" || user.status === statusFilter;

      let matchesActivity = true;
      if (activityFilter === 'today') {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        matchesActivity = !!user.lastActiveAt && new Date(user.lastActiveAt) >= startOfDay;
      } else if (activityFilter === 'week') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        matchesActivity = !!user.lastActiveAt && new Date(user.lastActiveAt) >= sevenDaysAgo;
      } else if (activityFilter === 'never') {
        matchesActivity = !user.lastActiveAt;
      }

      return matchesSearch && matchesRole && matchesStatus && matchesActivity;
    });

    // Sorting
    return list.sort((a, b) => {
      if (sortBy === 'last_active_desc') {
        const timeA = a.lastActiveAt ? new Date(a.lastActiveAt).getTime() : 0;
        const timeB = b.lastActiveAt ? new Date(b.lastActiveAt).getTime() : 0;
        return timeB - timeA;
      }
      if (sortBy === 'created_desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'created_asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name, 'az');
      }
      return 0;
    });
  }, [users, searchQuery, roleTab, statusFilter, activityFilter, sortBy]);

  // Paginated users
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Handlers
  const handleStatusChange = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateStatus.mutate({ userId, status: newStatus });
  };

  const handleBulkApprove = () => {
    const pendingIds = pendingTeachers.map((u) => u.id);
    if (!pendingIds.length) {
      toast.info("Gözləmədə olan müraciət yoxdur.");
      return;
    }
    approveAllTeachers.mutate(pendingIds);
  };

  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    setEditForm({
      fullName: user.name || "",
      phone: user.phone || "",
      school: user.school || "",
      specialty: user.specialty || "",
      fin: user.fin || "",
      role: (user.role as AppRole) || "student",
      tier: user.subscriptionTier || "quest",
      status: user.status || "active",
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUserProfile.mutate(
      {
        userId: editingUser.id,
        fullName: editForm.fullName,
        phone: editForm.phone,
        school: editForm.school,
        specialty: editForm.specialty,
        fin: editForm.fin,
        role: editForm.role,
        tier: editForm.tier,
        status: editForm.status,
      },
      {
        onSuccess: () => {
          setEditingUser(null);
        },
      }
    );
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.email || !addForm.password || !addForm.fullName) {
      toast.error("Ad, e-poçt və şifrə sahələri məcburidir!");
      return;
    }
    if (addForm.password.length < 6) {
      toast.error("Şifrə ən az 6 simvoldan ibarət olmalıdır!");
      return;
    }

    createUser.mutate(
      {
        email: addForm.email,
        password: addForm.password,
        fullName: addForm.fullName,
        role: addForm.role,
        phone: addForm.phone,
        school: addForm.school,
        specialty: addForm.specialty,
        fin: addForm.fin,
      },
      {
        onSuccess: () => {
          setIsAddDialogOpen(false);
          setAddForm({
            fullName: "",
            email: "",
            password: "",
            role: "student",
            phone: "",
            school: "",
            specialty: "",
            fin: "",
          });
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;
    deleteUser.mutate(userToDelete.id, {
      onSuccess: () => {
        setUserToDelete(null);
      },
    });
  };

  const handleExportExcel = () => {
    if (!filteredUsers || filteredUsers.length === 0) {
      toast.info("İxrac etmək üçün istifadəçi tapılmadı");
      return;
    }

    const exportData = filteredUsers.map((u, idx) => ({
      "№": idx + 1,
      "Ad, Soyad": u.name,
      "E-poçt": u.email,
      "Telefon": u.phone || "—",
      "FİN Kod": u.fin || "—",
      "UTİS Kod": u.utisCode || "—",
      "Məktəb": u.school || "—",
      "İxtisas / Fənn": u.specialty || "—",
      "Rol": roleLabels[u.role] || u.role,
      "Status": statusLabels[u.status] || u.status,
      "Abunəlik (Tier)": u.subscriptionTier === 'vip' ? 'VIP' : 'Quest',
      "Quiz Sayı": u.quizCount || 0,
      "Sual Sayı": u.questionCount || 0,
      "Son Aktivlik": u.lastActiveAt ? new Date(u.lastActiveAt).toLocaleString('az-AZ') : 'Heç vaxt',
      "Qeydiyyat Tarixi": new Date(u.createdAt).toLocaleDateString('az-AZ'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "İstifadəçilər");

    const fileName = `QuizSpark_Istifadeciler_${roleTab}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success(`${filteredUsers.length} istifadəçi Excel faylı kimi endirildi`);
  };

  const handleExportTeacherStats = () => {
    if (!filteredTeacherStats || filteredTeacherStats.length === 0) {
      toast.info("İxrac etmək üçün müəllim statistikası tapılmadı");
      return;
    }

    const exportData = filteredTeacherStats.map((t, idx) => ({
      "№": idx + 1,
      "Müəllim": t.fullName,
      "E-poçt": t.email,
      "Telefon": t.phone || "—",
      "Məktəb": t.school || "—",
      "İxtisas / Fənn": t.specialty || "—",
      "Status": t.status === 'active' ? 'Aktiv' : 'Gözləyir',
      "Quiz Sayı": t.quizCount,
      "Dərc Edilmiş Quiz": t.publishedQuizCount,
      "Quiz Sualları": t.quizQuestionCount,
      "Sual Bankı Sualları": t.bankQuestionCount,
      "Cəmi Suallar": t.totalQuestions,
      "Tələbə İştirakı (Oynanılma)": t.totalPlays,
      "Son Fəaliyyət": t.lastCreatedDate ? new Date(t.lastCreatedDate).toLocaleDateString('az-AZ') : '—',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Müəllim Statistikası");

    const fileName = `QuizSpark_Muellim_Statistikasi_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success(`${filteredTeacherStats.length} müəllimin statistikası Excel kimi endirildi`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2.5">
              <UsersIcon className="h-8 w-8 text-primary" />
              <span>İstifadəçilər və Müəllim Fəaliyyəti</span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Sistem iştirakçılarını, müəllim müraciətlərini və yaradılmış sual/quiz statistikasını idarə edin
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              className="rounded-xl h-10 gap-1.5 bg-card hover:bg-muted/80 shadow-sm border-border/80"
              onClick={roleTab === 'teacher_stats' ? handleExportTeacherStats : handleExportExcel}
            >
              <Download className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-semibold">
                {roleTab === 'teacher_stats' ? 'Statistikanı İxrac Et' : 'Excel İxrac'}
              </span>
            </Button>

            {pendingTeachersCount > 0 && (
              <Button
                variant="default"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md gap-1.5 h-10 px-4"
                onClick={handleBulkApprove}
                disabled={approveAllTeachers.isPending}
              >
                {approveAllTeachers.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCheck className="h-4 w-4" />
                )}
                <span>Bütün Müraciətləri Təsdiqlə ({pendingTeachersCount})</span>
              </Button>
            )}

            <Button
              className="rounded-xl h-10 gap-1.5 shadow-md"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span className="text-xs font-semibold">Yeni İstifadəçi</span>
            </Button>
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-4 shadow-sm flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <UsersIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">{users?.length || 0}</div>
              <div className="text-xs text-muted-foreground font-medium">Ümumi İstifadəçi</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-4 shadow-sm flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-600">{activeTodayCount}</div>
              <div className="text-xs text-muted-foreground font-medium">Bu Gün Daxil Olanlar</div>
            </div>
          </div>

          <div
            onClick={() => setRoleTab('pending')}
            className={cn(
              "rounded-2xl border p-4 shadow-sm flex items-center gap-3.5 cursor-pointer transition-all",
              pendingTeachersCount > 0
                ? "bg-amber-500/15 border-amber-500/40 hover:bg-amber-500/20"
                : "bg-card/70 border-border/60"
            )}
          >
            <div className="h-11 w-11 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-amber-600">{pendingTeachersCount}</div>
              <div className="text-xs text-muted-foreground font-medium">Təsdiq Gözləyən</div>
            </div>
          </div>

          <div
            onClick={() => setRoleTab('teacher_stats')}
            className={cn(
              "rounded-2xl border p-4 shadow-sm flex items-center gap-3.5 cursor-pointer transition-all",
              roleTab === 'teacher_stats'
                ? "bg-primary/15 border-primary/40 ring-1 ring-primary/30"
                : "bg-card/70 border-border/60 hover:bg-card"
            )}
          >
            <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">
                {teacherTotals.totalQuestions}
              </div>
              <div className="text-xs text-muted-foreground font-medium">Müəllim Sualları</div>
            </div>
          </div>
        </div>

        {/* Highlight Banner if there are pending teachers */}
        {pendingTeachersCount > 0 && (
          <div className="mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold text-foreground text-base flex items-center gap-2">
                  <span>{pendingTeachersCount} müəllim müraciəti təsdiq gözləyir</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white animate-pulse">
                    Yeni
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Müəllim kimi qeydiyyatdan keçmiş namizədlər təsdiqləndikdən sonra dərhal şəxsi kabinetlərinə daxil ola bilərlər.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setRoleTab('pending')}
                className={cn(
                  "rounded-xl text-xs font-bold",
                  roleTab === 'pending' ? "border-amber-500 text-amber-700 dark:text-amber-300" : ""
                )}
              >
                Müraciətlərə Bax
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm gap-1.5"
                onClick={handleBulkApprove}
                disabled={approveAllTeachers.isPending}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Hamısını Təsdiqlə</span>
              </Button>
            </div>
          </div>
        )}

        {/* Search & Filter Bar (Only shown for user list tabs) */}
        {roleTab !== 'teacher_stats' && (
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Ad, email, tel, məktəb, FİN, UTİS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-card border-border/70 text-sm shadow-sm"
              />
            </div>

            <Select value={activityFilter} onValueChange={setActivityFilter}>
              <SelectTrigger className="h-11 rounded-xl bg-card border-border/70 text-sm">
                <SelectValue placeholder="Aktivlik filtr" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün İstifadəçilər</SelectItem>
                <SelectItem value="today">🟢 Bu gün daxil olanlar</SelectItem>
                <SelectItem value="week">📅 Son 7 gün aktiv</SelectItem>
                <SelectItem value="never">⚪ Heç daxil olmayanlar</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 rounded-xl bg-card border-border/70 text-sm">
                <SelectValue placeholder="Status seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün Statuslar</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="pending">Gözləyən</SelectItem>
                <SelectItem value="inactive">Deaktiv</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-11 rounded-xl bg-card border-border/70 text-sm">
                <SelectValue placeholder="Sıralama" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_active_desc">⚡ Ən son daxil olanlar</SelectItem>
                <SelectItem value="created_desc">🕒 Qeydiyyat (Ən yeni)</SelectItem>
                <SelectItem value="created_asc">🕒 Qeydiyyat (Ən köhnə)</SelectItem>
                <SelectItem value="name_asc">🔤 Ad üzrə (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={roleTab} onValueChange={setRoleTab} className="w-full">
          <TabsList className="mb-6 h-12 w-full max-w-3xl bg-muted/50 p-1 rounded-xl border border-border/40">
            <TabsTrigger
              value="pending"
              className={cn(
                "flex-1 rounded-lg font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-1.5",
                pendingTeachersCount > 0 ? "text-amber-700 dark:text-amber-400" : ""
              )}
            >
              <span>⏳ Müraciətlər</span>
              {pendingTeachersCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-black bg-amber-500 text-white rounded-full leading-none animate-pulse">
                  {pendingTeachersCount}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="teacher"
              className="flex-1 rounded-lg font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Müəllimlər</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
                {activeTeachersCount}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="teacher_stats"
              className="flex-1 rounded-lg font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-1.5 text-primary"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>📊 Statistika</span>
            </TabsTrigger>

            <TabsTrigger
              value="student"
              className="flex-1 rounded-lg font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Tələbələr</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
                {studentsCount}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="admin"
              className="flex-1 rounded-lg font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Adminlər</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
                {adminsCount}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: PENDING TEACHER REQUESTS */}
          <TabsContent value="pending" className="mt-0">
            <div className="rounded-2xl bg-gradient-card border border-border/60 overflow-hidden shadow-sm">
              {filteredUsers.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">Gözləmədə Olan Müraciət Yoxdur</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Bütün müəllim müraciətləri artıq təsdiqlənib və ya yeni müraciət daxil olmayıb.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/40">
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Müəllim
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Əlaqə Nömrəsi
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          E-poçt
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Məktəb / İxtisas
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Müraciət Vaxtı
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Əməliyyat
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {paginatedUsers.map((user) => {
                        const timeInfo = formatApplicationTime(user.createdAt);
                        const cleanPhone = user.phone ? user.phone.replace(/[^0-9]/g, '') : '';
                        const waLink = cleanPhone ? `https://wa.me/${cleanPhone.startsWith('994') ? cleanPhone : '994' + cleanPhone.replace(/^0/, '')}` : null;

                        return (
                          <tr key={user.id} className="transition-colors hover:bg-muted/30">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold text-base border border-amber-500/30">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                                    <span>{user.name}</span>
                                    {user.fin && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-mono">
                                        {user.fin}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <Clock className="w-3 h-3 text-amber-500" />
                                    <span>{timeInfo.relative}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              {user.phone ? (
                                <div className="flex items-center gap-2">
                                  <a
                                    href={`tel:${user.phone}`}
                                    className="font-mono text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                                  >
                                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>{user.phone}</span>
                                  </a>
                                  {waLink && (
                                    <a
                                      href={waLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[11px] p-1 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 transition-colors"
                                      title="WhatsApp ilə yaz"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground italic">Qeyd edilməyib</span>
                              )}
                            </td>

                            <td className="px-6 py-4">
                              <a
                                href={`mailto:${user.email}`}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                              >
                                <Mail className="w-3.5 h-3.5 text-blue-500" />
                                <span>{user.email}</span>
                              </a>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                {user.school ? (
                                  <span className="text-xs text-foreground font-medium flex items-center gap-1">
                                    <School className="w-3 h-3 text-muted-foreground" />
                                    <span className="truncate max-w-[180px]" title={user.school}>{user.school}</span>
                                  </span>
                                ) : null}
                                {user.specialty ? (
                                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" />
                                    <span>{user.specialty}</span>
                                  </span>
                                ) : null}
                                {!user.school && !user.specialty && (
                                  <span className="text-xs text-muted-foreground italic">—</span>
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="text-xs font-medium text-foreground">
                                {timeInfo.full}
                              </div>
                              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                                {timeInfo.relative}
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                <span>Gözləyir</span>
                              </span>
                            </td>

                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  className="h-8 px-3 rounded-xl text-xs font-bold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                                  onClick={() => approveTeacher.mutate(user.id)}
                                  disabled={approveTeacher.isPending}
                                >
                                  <UserCheck className="h-3.5 w-3.5" />
                                  <span>Təsdiqlə</span>
                                </Button>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleOpenEdit(user)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Redaktə Et
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>
                                      <UserX className="mr-2 h-4 w-4 text-destructive" />
                                      Deaktiv Et
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive"
                                      onClick={() => setUserToDelete(user)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Sil
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB: DEDICATED TEACHER CONTENT & QUIZ STATS */}
          <TabsContent value="teacher_stats" className="mt-0 space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-black text-foreground">
                    {teacherTotals.totalQuizzes}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">Müəllim Quizi</div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-600">
                    {teacherTotals.totalQuestions}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">Yaradılmış Suallar</div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <PlayCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-600">
                    {teacherTotals.totalPlays}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">Tələbə İştirakı</div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-base font-bold text-foreground truncate max-w-[140px]" title={teacherTotals.topAuthor?.fullName || "—"}>
                    {teacherTotals.topAuthor?.fullName || "—"}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Lider Müəllif ({teacherTotals.topAuthor?.totalQuestions || 0} sual)
                  </div>
                </div>
              </div>
            </div>

            {/* Filter and Search for Teachers Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Müəllim, fənn və ya məktəb axtar..."
                  value={teacherStatSearch}
                  onChange={(e) => setTeacherStatSearch(e.target.value)}
                  className="pl-10 h-10 rounded-xl bg-card border-border/70 text-sm shadow-sm"
                />
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Select value={teacherStatSort} onValueChange={setTeacherStatSort}>
                  <SelectTrigger className="h-10 w-full sm:w-56 rounded-xl bg-card border-border/70 text-xs font-semibold">
                    <SelectValue placeholder="Sıralama" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="questions_desc">⚡ Ən çox sual yaradanlar</SelectItem>
                    <SelectItem value="quizzes_desc">📝 Ən çox quiz yaradanlar</SelectItem>
                    <SelectItem value="plays_desc">👥 Ən çox tələbə iştirakı olanlar</SelectItem>
                    <SelectItem value="name_asc">🔤 Ad üzrə (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Teacher Stats Table */}
            <div className="rounded-2xl bg-gradient-card border border-border/60 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/40">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Müəllim
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Məktəb / Fənn
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
                        Yaratdığı Quizlər
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
                        Sual Bankı
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
                        Cəmi Suallar
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
                        Tələbə İştirakı
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Son Fəaliyyət
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Quizlər
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredTeacherStats.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-xs text-muted-foreground">
                          Axtarışa uyğun müəllim statistikası tapılmadı.
                        </td>
                      </tr>
                    ) : (
                      filteredTeacherStats.map((teacher) => {
                        const cleanPhone = teacher.phone ? teacher.phone.replace(/[^0-9]/g, '') : '';
                        const waLink = cleanPhone ? `https://wa.me/${cleanPhone.startsWith('994') ? cleanPhone : '994' + cleanPhone.replace(/^0/, '')}` : null;

                        return (
                          <tr key={teacher.userId} className="transition-colors hover:bg-muted/30">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold text-base border border-amber-500/30 shrink-0">
                                  {teacher.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                                    <span>{teacher.fullName}</span>
                                    {teacher.email === 'scorpionabid82@gmail.com' && (
                                      <Badge variant="destructive" className="text-[9px] px-1 py-0">Admin</Badge>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                    <span>{teacher.email}</span>
                                    {waLink && (
                                      <a
                                        href={waLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-600 hover:text-emerald-700"
                                        title="WhatsApp ilə yaz"
                                      >
                                        <MessageCircle className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-semibold text-foreground truncate max-w-[180px]" title={teacher.school || "—"}>
                                  {teacher.school || "—"}
                                </span>
                                <span className="text-[11px] text-muted-foreground truncate max-w-[180px]" title={teacher.specialty || "—"}>
                                  {teacher.specialty || "—"}
                                </span>
                              </div>
                            </td>

                            {/* Quiz Count */}
                            <td className="px-6 py-4 text-center">
                              <div className="inline-flex flex-col items-center">
                                <span className="text-sm font-bold text-foreground">
                                  {teacher.quizCount}
                                </span>
                                {teacher.quizCount > 0 && (
                                  <span className="text-[10px] text-muted-foreground">
                                    ({teacher.publishedQuizCount} dərc)
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Question Bank Count */}
                            <td className="px-6 py-4 text-center">
                              <span className="font-mono text-xs font-semibold text-muted-foreground">
                                {teacher.bankQuestionCount}
                              </span>
                            </td>

                            {/* Total Questions */}
                            <td className="px-6 py-4 text-center">
                              <Badge
                                variant={teacher.totalQuestions > 0 ? "default" : "muted"}
                                className={cn(
                                  "text-xs font-black px-2.5 py-0.5",
                                  teacher.totalQuestions > 50
                                    ? "bg-amber-500 text-white"
                                    : teacher.totalQuestions > 0
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : ""
                                )}
                              >
                                {teacher.totalQuestions}
                              </Badge>
                            </td>

                            {/* Total Plays */}
                            <td className="px-6 py-4 text-center">
                              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                {teacher.totalPlays}
                              </span>
                            </td>

                            {/* Last Activity */}
                            <td className="px-6 py-4 text-xs text-muted-foreground">
                              {teacher.lastCreatedDate
                                ? new Date(teacher.lastCreatedDate).toLocaleDateString('az-AZ')
                                : "—"}
                            </td>

                            {/* Action: View Quizzes */}
                            <td className="px-6 py-4 text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-2.5 rounded-xl text-xs font-bold gap-1.5 hover:bg-muted"
                                onClick={() => setSelectedTeacherForQuizzes(teacher)}
                              >
                                <Eye className="h-3.5 w-3.5 text-primary" />
                                <span>Quizlər ({teacher.quizCount})</span>
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2, 3, 4: TEACHERS, STUDENTS, ADMINS TABLE */}
          {['teacher', 'student', 'admin'].map((tabKey) => (
            <TabsContent key={tabKey} value={tabKey} className="mt-0">
              <div className="rounded-2xl bg-gradient-card border border-border/60 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/40">
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          İstifadəçi
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Əlaqə / Telefon
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Məktəb / Fənn
                        </th>
                        {tabKey === 'teacher' && (
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Məzmun (Quiz / Sual)
                          </th>
                        )}
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Son Aktivlik
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Tier
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Status
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Qeydiyyat
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Əməliyyatlar
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {paginatedUsers.length === 0 ? (
                        <tr>
                          <td colSpan={tabKey === 'teacher' ? 9 : 8} className="px-6 py-12 text-center text-xs text-muted-foreground">
                            Axtarışa və ya filtrə uyğun istifadəçi tapılmadı.
                          </td>
                        </tr>
                      ) : (
                        paginatedUsers.map((user) => {
                          const activity = formatRelativeActivity(user.lastActiveAt);
                          const cleanPhone = user.phone ? user.phone.replace(/[^0-9]/g, '') : '';
                          const waLink = cleanPhone ? `https://wa.me/${cleanPhone.startsWith('994') ? cleanPhone : '994' + cleanPhone.replace(/^0/, '')}` : null;

                          return (
                            <tr key={user.id} className="transition-colors hover:bg-muted/30">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={cn(
                                      "flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold shrink-0",
                                      user.role === 'admin'
                                        ? "bg-destructive/20 text-destructive border border-destructive/30"
                                        : user.role === 'teacher'
                                        ? "bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                                        : "bg-primary/20 text-primary border border-primary/30"
                                    )}
                                  >
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                                      <span>{user.name}</span>
                                      {user.fin && (
                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-mono">
                                          {user.fin}
                                        </span>
                                      )}
                                      {user.utisCode && (
                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 font-mono">
                                          UTİS: {user.utisCode}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                {user.phone ? (
                                  <div className="flex items-center gap-1.5">
                                    <a
                                      href={`tel:${user.phone}`}
                                      className="font-mono text-xs text-foreground font-semibold hover:text-primary transition-colors"
                                    >
                                      {user.phone}
                                    </a>
                                    {waLink && (
                                      <a
                                        href={waLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] p-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 transition-colors"
                                        title="WhatsApp ilə yaz"
                                      >
                                        <MessageCircle className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground italic">—</span>
                                )}
                              </td>

                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-0.5">
                                  {user.school ? (
                                    <span className="text-xs font-medium text-foreground truncate max-w-[180px]" title={user.school}>
                                      {user.school}
                                    </span>
                                  ) : null}
                                  {user.specialty ? (
                                    <span className="text-[11px] text-muted-foreground truncate max-w-[180px]" title={user.specialty}>
                                      {user.specialty}
                                    </span>
                                  ) : null}
                                  {!user.school && !user.specialty && (
                                    <span className="text-xs text-muted-foreground italic">—</span>
                                  )}
                                </div>
                              </td>

                              {/* Teacher Content Counts */}
                              {tabKey === 'teacher' && (
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-1.5">
                                    <Badge variant="outline" className="text-[10px] font-semibold gap-1 bg-primary/5 text-primary border-primary/20">
                                      <FileText className="w-3 h-3" />
                                      <span>{user.quizCount || 0} quiz</span>
                                    </Badge>
                                    <Badge variant="outline" className="text-[10px] font-semibold gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30">
                                      <Sparkles className="w-3 h-3" />
                                      <span>{user.questionCount || 0} sual</span>
                                    </Badge>
                                    {(user.quizCount || 0) > 0 && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                        title="Quizlərinə bax"
                                        onClick={() => {
                                          const match = (teacherStats || []).find(ts => ts.userId === user.id);
                                          if (match) setSelectedTeacherForQuizzes(match);
                                        }}
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              )}

                              {/* Last Active Column */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2" title={activity.full}>
                                  <span
                                    className={cn(
                                      "h-2 w-2 rounded-full shrink-0",
                                      activity.isRecent
                                        ? "bg-emerald-500 ring-2 ring-emerald-500/30 animate-pulse"
                                        : user.lastActiveAt
                                        ? "bg-muted-foreground/50"
                                        : "bg-muted"
                                    )}
                                  />
                                  <div>
                                    <div
                                      className={cn(
                                        "text-xs font-semibold",
                                        activity.isRecent
                                          ? "text-emerald-600 dark:text-emerald-400 font-bold"
                                          : user.lastActiveAt
                                          ? "text-foreground"
                                          : "text-muted-foreground italic"
                                      )}
                                    >
                                      {activity.relative}
                                    </div>
                                    {user.lastActiveAt && (
                                      <div className="text-[10px] text-muted-foreground">
                                        {new Date(user.lastActiveAt).toLocaleDateString('az-AZ')}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <Badge
                                  variant={user.subscriptionTier === 'vip' ? 'warning' : 'muted'}
                                  className={cn(
                                    "text-[10px] font-bold uppercase",
                                    user.subscriptionTier === 'vip' ? "bg-amber-500 text-white" : ""
                                  )}
                                >
                                  {tierLabels[user.subscriptionTier] ?? user.subscriptionTier}
                                </Badge>
                              </td>

                              <td className="px-6 py-4">
                                <Badge
                                  variant={
                                    user.status === 'active'
                                      ? 'success'
                                      : user.status === 'pending'
                                      ? 'warning'
                                      : 'muted'
                                  }
                                  className="text-[10px] font-semibold"
                                >
                                  {statusLabels[user.status] ?? user.status}
                                </Badge>
                              </td>

                              <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                                {new Date(user.createdAt).toLocaleDateString('az-AZ')}
                              </td>

                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg hover:bg-muted"
                                    onClick={() => handleOpenEdit(user)}
                                    title="Redaktə et"
                                  >
                                    <Edit className="h-4 w-4 text-muted-foreground" />
                                  </Button>

                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                      {/* Role Submenu */}
                                      <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                          <Shield className="mr-2 h-4 w-4 text-primary" />
                                          Rolu Dəyiş
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                          <DropdownMenuItem
                                            disabled={user.role === 'student'}
                                            onClick={() => updateRole.mutate({ userId: user.id, role: 'student' as AppRole })}
                                          >
                                            Tələbə
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            disabled={user.role === 'teacher'}
                                            onClick={() => updateRole.mutate({ userId: user.id, role: 'teacher' as AppRole })}
                                          >
                                            Müəllim
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            disabled={user.role === 'admin'}
                                            onClick={() => updateRole.mutate({ userId: user.id, role: 'admin' as AppRole })}
                                          >
                                            Admin
                                          </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                      </DropdownMenuSub>

                                      {/* Tier Toggle */}
                                      <DropdownMenuItem
                                        onClick={() => {
                                          const newTier = user.subscriptionTier === 'vip' ? 'quest' : 'vip';
                                          updateTier.mutate({ userId: user.id, tier: newTier });
                                        }}
                                      >
                                        <Crown className="mr-2 h-4 w-4 text-amber-500" />
                                        {user.subscriptionTier === 'vip' ? 'Quest Et' : 'VIP Et'}
                                      </DropdownMenuItem>

                                      <DropdownMenuSeparator />

                                      {/* Status toggle */}
                                      {user.status === 'active' ? (
                                        <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>
                                          <UserX className="mr-2 h-4 w-4 text-amber-600" />
                                          Deaktiv Et
                                        </DropdownMenuItem>
                                      ) : (
                                        <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'inactive')}>
                                          <UserCheck className="mr-2 h-4 w-4 text-emerald-600" />
                                          Aktiv Et
                                        </DropdownMenuItem>
                                      )}

                                      <DropdownMenuSeparator />

                                      {/* Delete User */}
                                      <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => setUserToDelete(user)}
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        İstifadəçini Sil
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Pagination & Summary Bar (Only for User List Tabs) */}
        {roleTab !== 'teacher_stats' && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>
                Göstərilir: <strong className="text-foreground">{filteredUsers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredUsers.length)}</strong> / cəmi {filteredUsers.length} istifadəçi
              </span>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <span>Hər səhifədə:</span>
                <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                  <SelectTrigger className="h-8 w-20 text-xs rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1 px-2 text-xs font-semibold">
                  Səhifə {currentPage} / {totalPages}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* DIALOG 1: ADD NEW USER */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                <span>Yeni İstifadəçi Əlavə Et</span>
              </DialogTitle>
              <DialogDescription>
                Sistemdə yeni istifadəçi və ya müəllim hesabı açın.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateUser} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="add_fullName" className="text-xs font-semibold">
                  Ad və Soyad *
                </Label>
                <Input
                  id="add_fullName"
                  placeholder="Məs: Əli Məmmədov"
                  value={addForm.fullName}
                  onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="add_email" className="text-xs font-semibold">
                    E-poçt *
                  </Label>
                  <Input
                    id="add_email"
                    type="email"
                    placeholder="example@mail.com"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="add_password" className="text-xs font-semibold">
                    İlkin Şifrə *
                  </Label>
                  <Input
                    id="add_password"
                    type="password"
                    placeholder="Minimum 6 simvol"
                    value={addForm.password}
                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Rol *</Label>
                  <Select
                    value={addForm.role}
                    onValueChange={(val) => setAddForm({ ...addForm, role: val as AppRole })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Tələbə</SelectItem>
                      <SelectItem value="teacher">Müəllim</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="add_phone" className="text-xs font-semibold">
                    Telefon
                  </Label>
                  <Input
                    id="add_phone"
                    placeholder="+994501234567"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="add_school" className="text-xs font-semibold">
                    Məktəb / Rayon
                  </Label>
                  <Input
                    id="add_school"
                    placeholder="Məs: Şəki şəhər 1 saylı"
                    value={addForm.school}
                    onChange={(e) => setAddForm({ ...addForm, school: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="add_specialty" className="text-xs font-semibold">
                    İxtisas / Fənn
                  </Label>
                  <Input
                    id="add_specialty"
                    placeholder="Məs: Riyaziyyat"
                    value={addForm.specialty}
                    onChange={(e) => setAddForm({ ...addForm, specialty: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="add_fin" className="text-xs font-semibold">
                  FİN Kod
                </Label>
                <Input
                  id="add_fin"
                  placeholder="7 simvollu FİN"
                  maxLength={7}
                  value={addForm.fin}
                  onChange={(e) => setAddForm({ ...addForm, fin: e.target.value.toUpperCase() })}
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Ləğv et
                </Button>
                <Button type="submit" disabled={createUser.isPending}>
                  {createUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Yarat
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* DIALOG 2: EDIT USER */}
        <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                <span>İstifadəçi Məlumatlarını Redaktə Et</span>
              </DialogTitle>
              <DialogDescription>
                {editingUser?.email} hesabı üçün məlumatları yeniləyin.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveEdit} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit_fullName" className="text-xs font-semibold">
                  Ad və Soyad
                </Label>
                <Input
                  id="edit_fullName"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit_phone" className="text-xs font-semibold">
                    Telefon
                  </Label>
                  <Input
                    id="edit_phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit_fin" className="text-xs font-semibold">
                    FİN Kod
                  </Label>
                  <Input
                    id="edit_fin"
                    value={editForm.fin}
                    maxLength={7}
                    onChange={(e) => setEditForm({ ...editForm, fin: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit_school" className="text-xs font-semibold">
                    Məktəb
                  </Label>
                  <Input
                    id="edit_school"
                    value={editForm.school}
                    onChange={(e) => setEditForm({ ...editForm, school: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit_specialty" className="text-xs font-semibold">
                    İxtisas / Fənn
                  </Label>
                  <Input
                    id="edit_specialty"
                    value={editForm.specialty}
                    onChange={(e) => setEditForm({ ...editForm, specialty: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Rol</Label>
                  <Select
                    value={editForm.role}
                    onValueChange={(val) => setEditForm({ ...editForm, role: val as AppRole })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Tələbə</SelectItem>
                      <SelectItem value="teacher">Müəllim</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Abunəlik (Tier)</Label>
                  <Select
                    value={editForm.tier}
                    onValueChange={(val) => setEditForm({ ...editForm, tier: val as 'vip' | 'quest' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quest">Quest</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Status</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(val) => setEditForm({ ...editForm, status: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktiv</SelectItem>
                      <SelectItem value="pending">Gözləyir</SelectItem>
                      <SelectItem value="inactive">Deaktiv</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                >
                  Ləğv et
                </Button>
                <Button type="submit" disabled={updateUserProfile.isPending}>
                  {updateUserProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Yadda saxla
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* DIALOG 3: TEACHER QUIZZES LIST MODAL */}
        <Dialog open={!!selectedTeacherForQuizzes} onOpenChange={(open) => !open && setSelectedTeacherForQuizzes(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>{selectedTeacherForQuizzes?.fullName} — Yaratdığı Quizlər</span>
              </DialogTitle>
              <DialogDescription>
                {selectedTeacherForQuizzes?.school && <span>{selectedTeacherForQuizzes.school} • </span>}
                {selectedTeacherForQuizzes?.specialty && <span>{selectedTeacherForQuizzes.specialty} • </span>}
                <span>Cəmi {selectedTeacherForQuizzes?.quizCount} quiz, {selectedTeacherForQuizzes?.totalQuestions} sual</span>
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto py-2">
              {!selectedTeacherForQuizzes?.quizzes || selectedTeacherForQuizzes.quizzes.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">Hələ Quiz Yaradılmayıb</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Bu müəllim hələ birbaşa quiz tərtib etməyib.
                    {selectedTeacherForQuizzes && selectedTeacherForQuizzes.bankQuestionCount > 0 && (
                      <span className="block mt-1 font-semibold text-primary">
                        (Lakin Sual Bankına {selectedTeacherForQuizzes.bankQuestionCount} sual əlavə edib)
                      </span>
                    )}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedTeacherForQuizzes.quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="rounded-xl border border-border/70 bg-card p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-primary/40 transition-colors"
                    >
                      <div>
                        <div className="font-bold text-sm text-foreground flex items-center gap-2">
                          <span>{quiz.title}</span>
                          <Badge
                            variant={quiz.isPublished ? "success" : "muted"}
                            className="text-[9px] px-1.5 py-0"
                          >
                            {quiz.isPublished ? "Dərc Edilib" : "Qaralama"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          {quiz.subject && <span>Fənn: <strong>{quiz.subject}</strong></span>}
                          {quiz.grade && <span>• Sinif: <strong>{quiz.grade}</strong></span>}
                          <span>• {new Date(quiz.createdAt).toLocaleDateString('az-AZ')}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-center px-2 py-1 rounded-lg bg-muted/60">
                          <div className="text-xs font-bold text-foreground">{quiz.questionCount}</div>
                          <div className="text-[10px] text-muted-foreground">sual</div>
                        </div>

                        <div className="text-center px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600">
                          <div className="text-xs font-bold">{quiz.playCount}</div>
                          <div className="text-[10px]">iştirak</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="pt-2 border-t border-border/40">
              <Button variant="outline" onClick={() => setSelectedTeacherForQuizzes(null)}>
                Bağla
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ALERT DIALOG: CONFIRM DELETE */}
        <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                <span>İstifadəçini Silmək İstədiyinizə Əminsiniz?</span>
              </AlertDialogTitle>
              <AlertDialogDescription>
                <strong>{userToDelete?.name}</strong> ({userToDelete?.email}) hesabı və onunla bağlı bütün profillər və nəticələr həmişəlik silinəcək. Bu əməliyyat geri qaytarıla bilməz!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Ləğv et</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 text-white font-bold"
                onClick={handleDeleteConfirm}
                disabled={deleteUser.isPending}
              >
                {deleteUser.isPending ? "Silinir..." : "Bəli, Sil"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
