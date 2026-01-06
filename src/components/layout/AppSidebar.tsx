import { 
  Home, 
  BookOpen, 
  Users, 
  Settings, 
  LogOut, 
  Trophy, 
  PlusCircle,
  LayoutDashboard,
  FileText,
  Shield,
  Key,
  Cpu,
  GraduationCap,
  Sparkles,
  User,
  LogIn
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth, AppRole } from "@/contexts/AuthContext";
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

const navigationGroups: NavGroup[] = [
  {
    label: "Əsas",
    items: [
      { title: "Ana Səhifə", url: "/", icon: Home, roles: ['admin', 'teacher', 'student', 'guest'] },
      { title: "Quizlər", url: "/quizzes", icon: BookOpen, roles: ['admin', 'teacher', 'student', 'guest'] },
      { title: "Liderlik Lövhəsi", url: "/leaderboard", icon: Trophy, roles: ['admin', 'teacher', 'student'] },
    ],
  },
  {
    label: "Müəllim",
    items: [
      { title: "İdarə Paneli", url: "/teacher/dashboard", icon: LayoutDashboard, roles: ['teacher'] },
      { title: "Quiz Yarat", url: "/teacher/create", icon: PlusCircle, roles: ['teacher'] },
      { title: "Quizlərim", url: "/teacher/my-quizzes", icon: FileText, roles: ['teacher'] },
      { title: "AI Köməkçi", url: "/teacher/ai-assistant", icon: Sparkles, roles: ['teacher'] },
    ],
  },
  {
    label: "Admin",
    items: [
      { title: "Admin Panel", url: "/admin/dashboard", icon: Shield, roles: ['admin'] },
      { title: "İstifadəçilər", url: "/admin/users", icon: Users, roles: ['admin'] },
      { title: "İcazələr", url: "/admin/permissions", icon: Key, roles: ['admin'] },
      { title: "AI Konfiqurasiya", url: "/admin/ai-config", icon: Cpu, roles: ['admin'] },
      { title: "Sistem Ayarları", url: "/admin/settings", icon: Settings, roles: ['admin'] },
    ],
  },
];

export function AppSidebar() {
  const { user, role, profile, signOut, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const currentRole: NavRole = role || 'guest';

  const filteredGroups = navigationGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.roles.includes(currentRole)),
    }))
    .filter(group => group.items.length > 0);

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
      case 'admin': return 'Administrator';
      case 'teacher': return 'Müəllim';
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
              <span className="font-display text-lg font-bold text-foreground">QuizMaster</span>
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
                    <SidebarMenuItem key={item.title}>
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
              Daxil Ol
            </Button>
          )
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
