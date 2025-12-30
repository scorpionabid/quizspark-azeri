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
  Mail
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

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin: string;
}

const users: User[] = [
  { id: '1', name: 'Admin İstifadəçi', email: 'admin@quiz.az', role: 'admin', status: 'active', createdAt: '2024-01-01', lastLogin: '2024-01-22' },
  { id: '2', name: 'Müəllim Əliyev', email: 'teacher@quiz.az', role: 'teacher', status: 'active', createdAt: '2024-01-05', lastLogin: '2024-01-21' },
  { id: '3', name: 'Tələbə Həsənov', email: 'student@quiz.az', role: 'student', status: 'active', createdAt: '2024-01-10', lastLogin: '2024-01-22' },
  { id: '4', name: 'Leyla Məmmədova', email: 'leyla@quiz.az', role: 'student', status: 'active', createdAt: '2024-01-12', lastLogin: '2024-01-20' },
  { id: '5', name: 'Tural Quliyev', email: 'tural@quiz.az', role: 'student', status: 'inactive', createdAt: '2024-01-08', lastLogin: '2024-01-15' },
  { id: '6', name: 'Yeni Müəllim', email: 'new.teacher@quiz.az', role: 'teacher', status: 'pending', createdAt: '2024-01-20', lastLogin: '-' },
];

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

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    toast.success("İstifadəçi əlavə edildi!");
    setIsAddDialogOpen(false);
  };

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
                  Yeni istifadəçi yaratmaq üçün məlumatları doldurun.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="name">Ad</Label>
                  <Input id="name" placeholder="İstifadəçi adı" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="email">E-poçt</Label>
                  <Input id="email" type="email" placeholder="email@example.com" className="mt-2" />
                </div>
                <div>
                  <Label>Rol</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Rol seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Tələbə</SelectItem>
                      <SelectItem value="teacher">Müəllim</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Ləğv Et
                </Button>
                <Button variant="game" onClick={handleAddUser}>
                  Əlavə Et
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
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün Rollar</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="teacher">Müəllim</SelectItem>
              <SelectItem value="student">Tələbə</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün</SelectItem>
              <SelectItem value="active">Aktiv</SelectItem>
              <SelectItem value="inactive">Deaktiv</SelectItem>
              <SelectItem value="pending">Gözləyir</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
                    Rol
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Son Giriş
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
                        user.role === 'admin' ? 'destructive' :
                        user.role === 'teacher' ? 'secondary' : 'default'
                      }>
                        {roleLabels[user.role]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        user.status === 'active' ? 'success' :
                        user.status === 'pending' ? 'warning' : 'muted'
                      }>
                        {statusLabels[user.status]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Redaktə Et
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" />
                            Rol Dəyiş
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            E-poçt Göndər
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === 'active' ? (
                            <DropdownMenuItem>
                              <UserX className="mr-2 h-4 w-4" />
                              Deaktiv Et
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
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

        {/* Stats */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>Ümumi: {users.length}</span>
          <span>•</span>
          <span>Aktiv: {users.filter(u => u.status === 'active').length}</span>
          <span>•</span>
          <span>Gözləyən: {users.filter(u => u.status === 'pending').length}</span>
        </div>
      </div>
    </div>
  );
}
