import { useState } from "react";
import { Shield, Check, X, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface RolePermissions {
  [key: string]: boolean;
}

const permissions: Permission[] = [
  // Quiz permissions
  { id: 'quiz.view', name: 'Quizləri Görüntülə', description: 'Bütün quizləri görə bilər', category: 'Quiz' },
  { id: 'quiz.create', name: 'Quiz Yarat', description: 'Yeni quiz yarada bilər', category: 'Quiz' },
  { id: 'quiz.edit', name: 'Quiz Redaktə Et', description: 'Mövcud quizləri redaktə edə bilər', category: 'Quiz' },
  { id: 'quiz.delete', name: 'Quiz Sil', description: 'Quizləri silə bilər', category: 'Quiz' },
  { id: 'quiz.publish', name: 'Quiz Dərc Et', description: 'Quizləri dərc edə bilər', category: 'Quiz' },
  
  // User permissions
  { id: 'user.view', name: 'İstifadəçiləri Gör', description: 'İstifadəçi siyahısını görə bilər', category: 'İstifadəçi' },
  { id: 'user.create', name: 'İstifadəçi Yarat', description: 'Yeni istifadəçi yarada bilər', category: 'İstifadəçi' },
  { id: 'user.edit', name: 'İstifadəçi Redaktə Et', description: 'İstifadəçi məlumatlarını redaktə edə bilər', category: 'İstifadəçi' },
  { id: 'user.delete', name: 'İstifadəçi Sil', description: 'İstifadəçiləri silə bilər', category: 'İstifadəçi' },
  
  // AI permissions
  { id: 'ai.use', name: 'AI İstifadə Et', description: 'AI köməkçisindən istifadə edə bilər', category: 'AI' },
  { id: 'ai.config', name: 'AI Konfiqurasiya', description: 'AI parametrlərini dəyişə bilər', category: 'AI' },
  
  // System permissions
  { id: 'system.settings', name: 'Sistem Ayarları', description: 'Sistem parametrlərini idarə edə bilər', category: 'Sistem' },
  { id: 'system.logs', name: 'Logları Gör', description: 'Sistem loglarına baxa bilər', category: 'Sistem' },
];

const roles = ['admin', 'teacher', 'student'];
const roleLabels: Record<string, string> = {
  admin: 'Admin',
  teacher: 'Müəllim',
  student: 'Tələbə',
};

const initialPermissions: Record<string, RolePermissions> = {
  admin: {
    'quiz.view': true, 'quiz.create': true, 'quiz.edit': true, 'quiz.delete': true, 'quiz.publish': true,
    'user.view': true, 'user.create': true, 'user.edit': true, 'user.delete': true,
    'ai.use': true, 'ai.config': true,
    'system.settings': true, 'system.logs': true,
  },
  teacher: {
    'quiz.view': true, 'quiz.create': true, 'quiz.edit': true, 'quiz.delete': false, 'quiz.publish': true,
    'user.view': false, 'user.create': false, 'user.edit': false, 'user.delete': false,
    'ai.use': true, 'ai.config': false,
    'system.settings': false, 'system.logs': false,
  },
  student: {
    'quiz.view': true, 'quiz.create': false, 'quiz.edit': false, 'quiz.delete': false, 'quiz.publish': false,
    'user.view': false, 'user.create': false, 'user.edit': false, 'user.delete': false,
    'ai.use': false, 'ai.config': false,
    'system.settings': false, 'system.logs': false,
  },
};

export default function PermissionsPage() {
  const [rolePermissions, setRolePermissions] = useState(initialPermissions);
  const [hasChanges, setHasChanges] = useState(false);

  const togglePermission = (role: string, permissionId: string) => {
    setRolePermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permissionId]: !prev[role][permissionId],
      },
    }));
    setHasChanges(true);
  };

  const saveChanges = () => {
    toast.success("İcazələr yeniləndi!");
    setHasChanges(false);
  };

  const categories = [...new Set(permissions.map(p => p.category))];

  return (
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">İcazələr</h1>
            <p className="text-muted-foreground">Rol əsaslı icazələri idarə edin</p>
          </div>
          {hasChanges && (
            <Button variant="game" onClick={saveChanges}>
              Dəyişiklikləri Saxla
            </Button>
          )}
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
                  {roles.map(role => (
                    <th key={role} className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <Badge variant={
                        role === 'admin' ? 'destructive' :
                        role === 'teacher' ? 'secondary' : 'default'
                      }>
                        {roleLabels[role]}
                      </Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <>
                    <tr key={category} className="bg-muted/10">
                      <td colSpan={4} className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-foreground">{category}</span>
                        </div>
                      </td>
                    </tr>
                    {permissions
                      .filter(p => p.category === category)
                      .map(permission => (
                        <tr key={permission.id} className="border-b border-border/20 transition-colors hover:bg-muted/10">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{permission.name}</span>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{permission.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </td>
                          {roles.map(role => (
                            <td key={role} className="px-6 py-4 text-center">
                              <Switch
                                checked={rolePermissions[role][permission.id]}
                                onCheckedChange={() => togglePermission(role, permission.id)}
                                disabled={role === 'admin' && permission.id.startsWith('system')}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                  </>
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
