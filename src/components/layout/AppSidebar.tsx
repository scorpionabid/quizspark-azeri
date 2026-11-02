import React, { useMemo } from "react";
import {
  Home,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Trophy,
  LayoutDashboard,
  FileText,
  Shield,
  Key,
  Cpu,
  GraduationCap,
  Sparkles,
  User,
  LogIn,
  Database,
  MessageCircle,
  ShieldAlert,
  Award,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth, AppRole } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavRole = AppRole | 'guest';

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: NavRole[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export function AppSidebar() {
  const { user, role, profile, signOut, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const currentRole: NavRole = role || 'guest';

  const navigationGroups: NavGroup[] = useMemo(() => [
    {
      label: t('nav_group_main', 'Əsas'),
      items: [
        { title: t('nav_home', 'Ana Səhifə'), url: "/", icon: Home, roles: ['admin', 'teacher', 'student', 'guest'] },
        { title: t('nav_quizzes', 'Quizlər və Kurslar'), url: "/quizzes", icon: BookOpen, roles: ['admin', 'teacher', 'student', 'guest'] },
        { title: t('nav_olimpiada', 'Zəfər Olimpiadası'), url: "/olimpiada", icon: Trophy, roles: ['admin', 'teacher', 'student', 'guest'] },
        { title: t('nav_official_exam', 'Rəsmi İmtahan Portalı'), url: "/imtahan", icon: Award, roles: ['admin', 'teacher', 'student', 'guest'] },
        { title: t('nav_leaderboard', 'Liderlik Lövhəsi'), url: "/leaderboard", icon: Trophy, roles: ['admin', 'teacher', 'student'] },
        { title: t('nav_support', 'Dəstək'), url: "/support", icon: MessageCircle, roles: ['admin', 'teacher', 'student'] },
      ],
    },
    {
      label: t('nav_group_teacher', 'Müəllim'),
      items: [
        { title: t('nav_teacher_dashboard', 'İdarə Paneli'), url: "/teacher/dashboard", icon: LayoutDashboard, roles: ['admin', 'teacher'] },
        { title: t('nav_my_quizzes', 'Quizlərim'), url: "/teacher/my-quizzes", icon: FileText, roles: ['admin', 'teacher'] },
        { title: t('nav_question_bank', 'Sual Bankı'), url: "/teacher/question-bank", icon: Database, roles: ['admin', 'teacher'] },
        { title: t('nav_ai_assistant', 'AI Köməkçi'), url: "/teacher/ai-assistant", icon: Sparkles, roles: ['admin', 'teacher'] },
      ],
    },
    {
      label: t('nav_group_admin', 'Admin'),
      items: [
        { title: t('nav_admin_dashboard', 'Admin Panel'), url: "/admin/dashboard", icon: Shield, roles: ['admin'] },
        { title: t('nav_admin_exams', 'Rəsmi İmtahanlar & İxrac'), url: "/admin/exams", icon: Award, roles: ['admin'] },
        { title: t('nav_users', 'İstifadəçilər'), url: "/admin/users", icon: Users, roles: ['admin'] },
        { title: t('nav_messages', 'Mesajlar'), url: "/admin/chat", icon: MessageCircle, roles: ['admin'] },
        { title: t('nav_permissions', 'İcazələr'), url: "/admin/permissions", icon: Key, roles: ['admin'] },
        { title: t('nav_ai_config', 'AI Konfiqurasiya'), url: "/admin/ai-config", icon: Cpu, roles: ['admin'] },
        { title: t('nav_audit_logs', 'Audit və Loglar'), url: "/admin/audit-logs", icon: ShieldAlert, roles: ['admin'] },
        { title: t('nav_system_settings', 'Sistem Ayarları'), url: "/admin/settings", icon: Settings, roles: ['admin'] },
      ],
    },
  ], [t]);

  const filteredGroups = useMemo(() => {
    return navigationGroups
      .map(group => ({
        ...group,
        items: group.items.filter(item => item.roles.includes(currentRole)),
      }))
      .filter(group => group.items.length > 0);
  }, [navigationGroups, currentRole]);

  const getRoleIcon = (r: NavRole) => {
    switch (r) {
      case 'admin': return Shield;
      case 'teacher': return GraduationCap;
      case 'student': return User;
      default: return User;
    }
  };

  const getRoleColor = (r: NavRole) => {
    switch (r) {
      case 'admin': return 'text-destructive';
      case 'teacher': return 'text-secondary';
      case 'student': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getRoleLabel = (r: NavRole) => {
    switch (r) {
      case 'admin': return t('nav_group_admin', 'Administrator');
      case 'teacher': return t('nav_group_teacher', 'Müəllim');
      case 'student': return 'Tələbə';
      default: return 'Qonaq';
    }
  };

  const RoleIcon = getRoleIcon(currentRole);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'İstifadəçi';

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold text-foreground">Sınaq</span>
              <span className="text-xs text-muted-foreground">Öyrən və Qazan</span>
            </div>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {filteredGroups.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && (
              <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        tooltip={collapsed ? item.title : undefined}
                      >
                        <NavLink
                          to={item.url}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                            isActive
                              ? "bg-primary/10 text-primary shadow-sm"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full bg-muted",
              getRoleColor(currentRole)
            )}>
              <RoleIcon className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium text-foreground">{displayName}</span>
                <span className="text-xs text-muted-foreground">
                  {getRoleLabel(currentRole)}
                </span>
              </div>
            )}
            {!collapsed && (
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          !collapsed && (
            <Button variant="default" className="w-full" onClick={() => navigate('/auth')}>
              <LogIn className="mr-2 h-4 w-4" />
              {t('login', 'Daxil Ol')}
            </Button>
          )
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
