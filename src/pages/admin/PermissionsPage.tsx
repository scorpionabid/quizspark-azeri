import { useState, useMemo } from "react";
import {
  Shield,
  Info,
  Lock,
  Search,
  BookOpen,
  Users,
  Bot,
  Settings,
  CheckSquare,
  XSquare,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  usePermissions,
  useRolePermissions,
  useToggleRolePermission,
  useBulkToggleRolePermissions,
} from "@/hooks/usePermissions";
import { usePermissionAuditLog } from "@/hooks/usePermissionAuditLog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ─── Sabitlər ────────────────────────────────────────────────────────────────
const roles = ["admin", "teacher", "student"] as const;
type AppRole = (typeof roles)[number];

const roleLabels: Record<AppRole, string> = {
  admin: "Admin",
  teacher: "Müəllim",
  student: "Tələbə",
};

const roleBadgeVariant: Record<
  AppRole,
  "destructive" | "secondary" | "default"
> = {
  admin: "destructive",
  teacher: "secondary",
  student: "default",
};

const categoryLabels: Record<string, string> = {
  Quiz: "Quiz",
  User: "İstifadəçi",
  AI: "AI",
  System: "Sistem",
};

const categoryIcons: Record<string, React.ElementType> = {
  Quiz: BookOpen,
  User: Users,
  AI: Bot,
  System: Settings,
};

const ALL_CATEGORIES = "Hamısı";

// ─── Komponent ────────────────────────────────────────────────────────────────
export default function PermissionsPage() {
  const { data: permissions, isLoading: permissionsLoading } = usePermissions();
  const { data: rolePermissions, isLoading: rolePermissionsLoading } =
    useRolePermissions();
  const togglePermission = useToggleRolePermission();
  const bulkToggle = useBulkToggleRolePermissions();
  const { log, addEntry, clearLog } = usePermissionAuditLog();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  // Hansı {role, permissionId} cütü pending-dədir
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const isLoading = permissionsLoading || rolePermissionsLoading;

  // ─── Köməkçi funksiyalar ───────────────────────────────────────────────────
  const hasPermission = (role: AppRole, permissionId: string) =>
    rolePermissions?.some(
      (rp) => rp.role === role && rp.permission_id === permissionId
    ) ?? false;

  const handleToggle = (role: AppRole, permissionId: string) => {
    if (role === "admin") return; // Admin kilid altındadır
    const curr = hasPermission(role, permissionId);
    const key = `${role}:${permissionId}`;
    setPendingKey(key);

    const perm = permissions?.find((p) => p.id === permissionId);
    togglePermission.mutate(
      { role, permissionId, hasPermission: curr },
      {
        onSettled: () => setPendingKey(null),
        onSuccess: () => {
          addEntry({
            role,
            permissionId,
            permissionName: perm?.name ?? permissionId,
            action: curr ? "revoked" : "granted",
          });
        },
      }
    );
  };

  const handleBulkToggle = (role: AppRole, grantAll: boolean) => {
    if (role === "admin") return;
    const filtered = filteredPermissions;
    const permissionIds = filtered.map((p) => p.id);
    bulkToggle.mutate(
      { role, permissionIds, grantAll },
      {
        onSuccess: () => {
          filtered.forEach((p) => {
            addEntry({
              role,
              permissionId: p.id,
              permissionName: p.name,
              action: grantAll ? "granted" : "revoked",
            });
          });
        },
      }
    );
  };

  // ─── Filter / Axtarış ──────────────────────────────────────────────────────
  const categories = useMemo(
    () =>
      permissions
        ? [ALL_CATEGORIES, ...new Set(permissions.map((p) => p.category))]
        : [ALL_CATEGORIES],
    [permissions]
  );

  const filteredPermissions = useMemo(() => {
    if (!permissions) return [];
    return permissions.filter((p) => {
      const matchCat =
        activeCategory === ALL_CATEGORIES || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [permissions, activeCategory, search]);

  const filteredCategories = useMemo(
    () =>
      activeCategory === ALL_CATEGORIES
        ? [...new Set(filteredPermissions.map((p) => p.category))]
        : [activeCategory],
    [filteredPermissions, activeCategory]
  );

  // ─── Statistika ────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    return roles.map((role) => ({
      role,
      count:
        rolePermissions?.filter((rp) => rp.role === role).length ?? 0,
      total: permissions?.length ?? 0,
    }));
  }, [rolePermissions, permissions]);

  // ─── Yükləmə vəziyyəti ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
          <div className="rounded-2xl bg-gradient-card border border-border/50 p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            İcazələr
          </h1>
          <p className="text-muted-foreground mt-1">
            Rol əsaslı icazələri idarə edin
          </p>
        </div>

        {/* ── Statistika kartları ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(({ role, count, total }) => (
            <div
              key={role}
              className="rounded-xl border border-border/50 bg-gradient-card p-4 flex items-center gap-3"
            >
              {role === "admin" && (
                <Lock className="h-5 w-5 text-destructive shrink-0" />
              )}
              {role === "teacher" && (
                <Users className="h-5 w-5 text-blue-500 shrink-0" />
              )}
              {role === "student" && (
                <BookOpen className="h-5 w-5 text-green-500 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  {roleLabels[role]}
                </p>
                <p className="font-semibold text-foreground text-sm">
                  {count} / {total} icazə
                </p>
              </div>
              {role === "admin" && (
                <Badge
                  variant="outline"
                  className="ml-auto text-[10px] border-destructive/50 text-destructive"
                >
                  Kilid
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* ── Axtarış + Kateqoriya Filterlər ─────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="İcazə axtar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 text-muted-foreground border-border/50 hover:bg-muted"
                )}
              >
                {cat === ALL_CATEGORIES ? "Hamısı" : (categoryLabels[cat] ?? cat)}
              </button>
            ))}
          </div>
        </div>

        {/* ── Cədvəl ─────────────────────────────────────────────────────── */}
        <div className="rounded-2xl bg-gradient-card border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            {filteredPermissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                <Shield className="h-10 w-10 opacity-30" />
                <p className="text-sm">Heç bir icazə tapılmadı</p>
                {search && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearch("")}
                  >
                    Axtarışı sıfırla
                  </Button>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      İcazə
                    </th>
                    {roles.map((role) => (
                      <th
                        key={role}
                        className="px-4 py-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground min-w-[130px]"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Badge variant={roleBadgeVariant[role]}>
                            {role === "admin" && (
                              <Lock className="h-3 w-3 mr-1" />
                            )}
                            {roleLabels[role]}
                          </Badge>
                          {/* Toplu əməliyyat düymələri */}
                          {role !== "admin" && (
                            <div className="flex gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                                    onClick={() =>
                                      handleBulkToggle(role, true)
                                    }
                                    disabled={bulkToggle.isPending}
                                  >
                                    <CheckSquare className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  <p>Hamısını aktivləşdir</p>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() =>
                                      handleBulkToggle(role, false)
                                    }
                                    disabled={bulkToggle.isPending}
                                  >
                                    <XSquare className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  <p>Hamısını deaktiv et</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <>
                      {/* Kateqoriya bölücü sıra */}
                      <tr key={`cat-${category}`} className="bg-muted/10">
                        <td colSpan={4} className="px-6 py-2.5">
                          <div className="flex items-center gap-2">
                            {(() => {
                              const Icon =
                                categoryIcons[category] ?? Shield;
                              return (
                                <Icon className="h-4 w-4 text-primary" />
                              );
                            })()}
                            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
                              {categoryLabels[category] ?? category}
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* İcazə sıraları */}
                      {filteredPermissions
                        .filter((p) => p.category === category)
                        .map((permission) => (
                          <tr
                            key={permission.id}
                            className="border-b border-border/20 transition-colors hover:bg-muted/10"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground text-sm">
                                  {permission.name}
                                </span>
                                {permission.description && (
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="h-4 w-4 text-muted-foreground shrink-0" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{permission.description}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                            </td>
                            {roles.map((role) => (
                              <td
                                key={role}
                                className="px-4 py-4 text-center"
                              >
                                {role === "admin" ? (
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="inline-flex items-center justify-center">
                                        <Switch
                                          checked={hasPermission(
                                            role,
                                            permission.id
                                          )}
                                          disabled
                                          className="opacity-50 cursor-not-allowed"
                                        />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="flex items-center gap-1">
                                        <Lock className="h-3 w-3" />
                                        Admin icazəsi kilid altındadır
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                ) : (
                                  <Switch
                                    checked={hasPermission(
                                      role,
                                      permission.id
                                    )}
                                    onCheckedChange={() =>
                                      handleToggle(role, permission.id)
                                    }
                                    disabled={
                                      pendingKey ===
                                      `${role}:${permission.id}` ||
                                      bulkToggle.isPending
                                    }
                                  />
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                    </>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── Legend ─────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-full bg-green-500" />
            <span>İcazə Verildi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-full bg-muted" />
            <span>İcazə Yoxdur</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-destructive" />
            <span>Admin — Kilid (redaktə edilmir)</span>
          </div>
        </div>

        {/* ── Audit Log ──────────────────────────────────────────────────── */}
        {log.length > 0 && (
          <div className="rounded-2xl bg-gradient-card border border-border/50 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
              <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Son Dəyişikliklər
              </h2>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive h-7 gap-1 text-xs"
                onClick={clearLog}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Jurnalı təmizlə
              </Button>
            </div>
            <div className="divide-y divide-border/20 max-h-64 overflow-y-auto">
              {log.slice(0, 20).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-muted/10 transition-colors"
                >
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full shrink-0",
                      entry.action === "granted"
                        ? "bg-green-500"
                        : "bg-destructive"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground">
                      {entry.permissionName}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      → {roleLabels[entry.role as AppRole] ?? entry.role}
                    </span>
                  </div>
                  <Badge
                    variant={
                      entry.action === "granted" ? "default" : "destructive"
                    }
                    className="text-[10px] shrink-0"
                  >
                    {entry.action === "granted" ? "Verildi" : "Alındı"}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {new Date(entry.timestamp).toLocaleTimeString("az-AZ", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
