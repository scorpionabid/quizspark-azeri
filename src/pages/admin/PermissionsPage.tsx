import { Shield, Info, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePermissions, useRolePermissions, useToggleRolePermission } from "@/hooks/usePermissions";
import { Skeleton } from "@/components/ui/skeleton";

const roles = ["admin", "teacher", "student"] as const;
const roleLabels: Record<string, string> = {
  admin: "Admin",
  teacher: "Müəllim",
  student: "Tələbə",
};

const categoryLabels: Record<string, string> = {
  Quiz: "Quiz",
  User: "İstifadəçi",
  AI: "AI",
  System: "Sistem",
};

export default function PermissionsPage() {
  const { data: permissions, isLoading: permissionsLoading } = usePermissions();
  const { data: rolePermissions, isLoading: rolePermissionsLoading } = useRolePermissions();
  const togglePermission = useToggleRolePermission();

  const isLoading = permissionsLoading || rolePermissionsLoading;

  const hasPermission = (role: string, permissionId: string) => {
    return rolePermissions?.some(
      (rp) => rp.role === role && rp.permission_id === permissionId
    ) ?? false;
  };

  const handleToggle = (role: "admin" | "teacher" | "student", permissionId: string) => {
    const currentHasPermission = hasPermission(role, permissionId);
    togglePermission.mutate({ role, permissionId, hasPermission: currentHasPermission });
  };

  const categories = permissions
    ? [...new Set(permissions.map((p) => p.category))]
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-72" />
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
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">İcazələr</h1>
          <p className="text-muted-foreground">Rol əsaslı icazələri idarə edin</p>
        </div>

        {/* Permissions Table */}
        <div className="rounded-2xl bg-gradient-card border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    İcazə
                  </th>
                  {roles.map((role) => (
                    <th key={role} className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <Badge variant={
                        role === "admin" ? "destructive" :
                        role === "teacher" ? "secondary" : "default"
                      }>
                        {roleLabels[role]}
                      </Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tbody key={category}>
                    <tr className="bg-muted/10">
                      <td colSpan={4} className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-foreground">
                            {categoryLabels[category] || category}
                          </span>
                        </div>
                      </td>
                    </tr>
                    {permissions
                      ?.filter((p) => p.category === category)
                      .map((permission) => (
                        <tr key={permission.id} className="border-b border-border/20 transition-colors hover:bg-muted/10">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{permission.name}</span>
                              {permission.description && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{permission.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </td>
                          {roles.map((role) => (
                            <td key={role} className="px-6 py-4 text-center">
                              <Switch
                                checked={hasPermission(role, permission.id)}
                                onCheckedChange={() => handleToggle(role, permission.id)}
                                disabled={togglePermission.isPending}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-success" />
            <span>İcazə Verildi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-muted" />
            <span>İcazə Rədd Edildi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
