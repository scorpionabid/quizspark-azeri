import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Trophy,
  User,
  LogIn,
  Database,
  FileText,
  Sparkles,
  Shield,
  Users,
  Settings,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const { role, isAuthenticated } = useAuth();
  const location = useLocation();

  // Hide BottomNav on active test taking screen (e.g. /quiz/123)
  const isTakingQuiz = location.pathname.startsWith('/quiz/') && location.pathname !== '/quizzes';
  if (isTakingQuiz) {
    return null;
  }

  // Navigation items based on role
  const getNavItems = () => {
    if (role === 'admin') {
      return [
        { label: 'Admin', path: '/admin/dashboard', icon: Shield },
        { label: 'İstifadəçilər', path: '/admin/users', icon: Users },
        { label: 'Mesajlar', path: '/admin/chat', icon: MessageCircle },
        { label: 'Ayarlar', path: '/admin/settings', icon: Settings },
        { label: 'Profil', path: '/profile', icon: User },
      ];
    }

    if (role === 'teacher') {
      return [
        { label: 'Əsas', path: '/', icon: Home },
        { label: 'Sual Bankı', path: '/teacher/question-bank', icon: Database },
        { label: 'Quizlərim', path: '/teacher/my-quizzes', icon: FileText },
        { label: 'AI Köməkçi', path: '/teacher/ai-assistant', icon: Sparkles },
        { label: 'Profil', path: '/profile', icon: User },
      ];
    }

    // Student & Guest
    return [
      { label: 'Əsas', path: '/', icon: Home },
      { label: 'Quizlər', path: '/quizzes', icon: BookOpen },
      { label: 'Liderlik', path: '/leaderboard', icon: Trophy },
      { label: 'Dəstək', path: '/support', icon: MessageCircle },
      {
        label: isAuthenticated ? 'Profil' : 'Giriş',
        path: isAuthenticated ? '/profile' : '/auth',
        icon: isAuthenticated ? User : LogIn,
      },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 block md:hidden border-t border-border/80 bg-background/90 backdrop-blur-md pb-safe"
      aria-label="Mobil Naviqasiya"
    >
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'relative flex flex-1 flex-col items-center justify-center py-1.5 transition-all active:scale-95',
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <Icon className={cn('h-5 w-5 transition-transform duration-200', isActive && 'scale-110')} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </div>
              <span className="mt-1 text-[11px] leading-tight truncate max-w-[64px]">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
