import { useState } from "react";
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
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useUsers } from "@/hooks/useUsers";
import { AppRole } from "@/contexts/AuthContext";

const roleLabels = {
  admin: 'Admin',
  teacher: 'Müəllim',
  student: 'Tələbə',
};

const statusLabels = {
  active: 'Aktiv',
  inactive: 'Deaktiv',
  pending: 'Gözləyir',
};

const tierLabels = {
  vip: 'VIP',
  quest: 'Quest',
};

export default function UsersPage() {
  const { users, isLoading, updateStatus, updateRole, updateTier } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleTab, setRoleTab] = useState<string>("student");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredUsers = (users || []).filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = user.role === roleTab;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    toast.info("Yeni istifadəçi yaratmaq üçün qeydiyyat formundan istifadə edin və ya Supabase dashboard-dan əlavə edin.");
    setIsAddDialogOpen(false);
  };

  const handleStatusChange = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateStatus.mutate({ userId, status: newStatus });
  };

  const handleApproveTeacher = (userId: string) => {
    updateStatus.mutate({ userId, status: 'active' });
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
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">İstifadəçilər</h1>
            <p className="text-muted-foreground">Sistem istifadəçilərini idarə edin</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="game">
                <Plus className="mr-2 h-4 w-4" />
                İstifadəçi Əlavə Et
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni İstifadəçi</DialogTitle>
                <DialogDescription>
                  Məlumatları doldurun.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-sm text-muted-foreground">İstifadəçiləri manual olaraq qeydiyyat səhifəsindən və ya birbaşa bazadan əlavə etmək tövsiyə olunur.</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Bağla
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="İstifadəçi axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-11 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün Statuslar</SelectItem>
              <SelectItem value="active">Aktiv</SelectItem>
              <SelectItem value="inactive">Deaktiv</SelectItem>
              <SelectItem value="pending">Gözləyir</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={roleTab} onValueChange={setRoleTab} className="w-full">
          <TabsList className="mb-6 h-12 w-full max-w-md bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="student" className="flex-1 rounded-lg font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Tələbələr
            </TabsTrigger>
            <TabsTrigger value="teacher" className="flex-1 rounded-lg font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Müəllimlər
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex-1 rounded-lg font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Adminlər
            </TabsTrigger>
          </TabsList>

          <TabsContent value={roleTab} className="mt-0">

            {/* Users Table */}
            <div className="rounded-2xl bg-gradient-card border border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        İstifadəçi
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Tier
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Rol
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Yaradılma
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Əməliyyatlar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="transition-colors hover:bg-muted/20">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold",
                              user.role === 'admin' ? "bg-destructive/20 text-destructive" :
                                user.role === 'teacher' ? "bg-secondary/20 text-secondary" :
                                  "bg-primary/20 text-primary"
                            )}>
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={
                            user.subscriptionTier === 'vip' ? 'warning' : 'muted'
                          }>
                            {tierLabels[user.subscriptionTier as keyof typeof tierLabels] ?? user.subscriptionTier}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={
                            user.role === 'admin' ? 'destructive' :
                              user.role === 'teacher' ? 'secondary' : 'default'
                          }>
                            {roleLabels[user.role as keyof typeof roleLabels]}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={
                            user.status === 'active' ? 'success' :
                              user.status === 'pending' ? 'warning' : 'muted'
                          }>
                            {statusLabels[user.status as keyof typeof statusLabels]}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString('az-AZ')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {user.status === 'pending' && (
                                <DropdownMenuItem onClick={() => handleApproveTeacher(user.id)}>
                                  <UserCheck className="mr-2 h-4 w-4 text-success" />
                                  Təsdiqlə
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Redaktə Et
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                const newRole = user.role === 'student' ? 'teacher' : 'student';
                                updateRole.mutate({ userId: user.id, role: newRole as AppRole });
                              }}>
                                <Shield className="mr-2 h-4 w-4" />
                                Rolu Dəyiş
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                const newTier = user.subscriptionTier === 'vip' ? 'quest' : 'vip';
                                updateTier.mutate({ userId: user.id, tier: newTier });
                              }}>
                                <Shield className="mr-2 h-4 w-4 text-yellow-500" />
                                {user.subscriptionTier === 'vip' ? 'Quest Et' : 'VIP Et'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === 'active' ? (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Deaktiv Et
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'inactive')}>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Aktiv Et
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Sil
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Stats */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>Ümumi: {filteredUsers.length}</span>
          <span>•</span>
          <span>Aktiv: {filteredUsers.filter(u => u.status === 'active').length}</span>
          <span>•</span>
          <span>Gözləyən: {filteredUsers.filter(u => u.status === 'pending').length}</span>
        </div>
      </div>
    </div>
  );
}
