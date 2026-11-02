import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface RouteInfo {
  title: string;
  breadcrumbs: { label: string; path: string }[];
}

interface RouteConfigItem {
  key: string;
  defaultTitle: string;
  parent?: string;
}

const routeConfig: Record<string, RouteConfigItem> = {
  "/": { key: "nav_home", defaultTitle: "Ana Səhifə" },
  "/quizzes": { key: "nav_quizzes", defaultTitle: "Quizlər", parent: "/" },
  "/quiz": { key: "nav_quizzes", defaultTitle: "Quiz", parent: "/quizzes" },
  "/leaderboard": { key: "nav_leaderboard", defaultTitle: "Liderlik Cədvəli", parent: "/" },
  "/imtahan": { key: "exam_portal", defaultTitle: "Rəsmi İmtahan Portalı", parent: "/" },
  "/auth": { key: "login", defaultTitle: "Giriş" },
  "/teacher": { key: "nav_teacher_dashboard", defaultTitle: "Müəllim Paneli", parent: "/" },
  "/teacher/dashboard": { key: "nav_teacher_dashboard", defaultTitle: "İdarə Paneli", parent: "/" },
  "/teacher/my-quizzes": { key: "nav_my_quizzes", defaultTitle: "Quizlərim", parent: "/" },
  "/teacher/create-quiz": { key: "nav_create_quiz", defaultTitle: "Quiz Yarat", parent: "/teacher/my-quizzes" },
  "/teacher/ai-assistant": { key: "nav_ai_assistant", defaultTitle: "AI Köməkçi", parent: "/" },
  "/teacher/question-bank": { key: "nav_question_bank", defaultTitle: "Sual Bankı", parent: "/" },
  "/admin": { key: "nav_admin_dashboard", defaultTitle: "Admin Paneli", parent: "/" },
  "/admin/dashboard": { key: "nav_admin_dashboard", defaultTitle: "İdarə Paneli", parent: "/" },
  "/admin/users": { key: "nav_users", defaultTitle: "İstifadəçilər", parent: "/" },
  "/admin/permissions": { key: "nav_permissions", defaultTitle: "İcazələr", parent: "/" },
  "/admin/ai-config": { key: "nav_ai_config", defaultTitle: "AI Konfiqurasiya", parent: "/" },
  "/admin/audit-logs": { key: "nav_audit_logs", defaultTitle: "Audit və Loglar", parent: "/" },
  "/admin/settings": { key: "nav_system_settings", defaultTitle: "Ayarlar", parent: "/" },
};

export function useRouteInfo(): RouteInfo {
  const location = useLocation();
  const { t } = useLanguage();
  const pathname = location.pathname;

  return useMemo(() => {
    // Find the matching route config
    let matchedPath = pathname;
    let config = routeConfig[pathname];

    // If exact match not found, try to find a partial match
    if (!config) {
      const pathParts = pathname.split("/").filter(Boolean);
      for (let i = pathParts.length; i > 0; i--) {
        const testPath = "/" + pathParts.slice(0, i).join("/");
        if (routeConfig[testPath]) {
          matchedPath = testPath;
          config = routeConfig[testPath];
          break;
        }
      }
    }

    // Default if no match found
    if (!config) {
      config = { key: "page_title_default", defaultTitle: "Səhifə" };
    }

    // Build breadcrumbs
    const breadcrumbs: { label: string; path: string }[] = [];
    let currentPath: string | undefined = matchedPath;

    while (currentPath) {
      const currentConfig = routeConfig[currentPath];
      if (currentConfig) {
        breadcrumbs.unshift({
          label: t(currentConfig.key, currentConfig.defaultTitle),
          path: currentPath,
        });
        currentPath = currentConfig.parent;
      } else {
        break;
      }
    }

    return {
      title: t(config.key, config.defaultTitle),
      breadcrumbs,
    };
  }, [pathname, t]);
}
