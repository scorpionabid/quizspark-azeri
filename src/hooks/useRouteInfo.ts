import { useLocation } from "react-router-dom";
import { useMemo } from "react";

interface RouteInfo {
  title: string;
  breadcrumbs: { label: string; path: string }[];
}

const routeConfig: Record<string, { title: string; parent?: string }> = {
  "/": { title: "Ana Səhifə" },
  "/quizzes": { title: "Quizlər", parent: "/" },
  "/quiz": { title: "Quiz", parent: "/quizzes" },
  "/leaderboard": { title: "Liderlik Cədvəli", parent: "/" },
  "/auth": { title: "Giriş" },
  "/teacher": { title: "Müəllim Paneli", parent: "/" },
  "/teacher/dashboard": { title: "İdarə Paneli", parent: "/" },
  "/teacher/my-quizzes": { title: "Quizlərim", parent: "/" },
  "/teacher/create-quiz": { title: "Quiz Yarat", parent: "/teacher/my-quizzes" },
  "/teacher/ai-assistant": { title: "AI Köməkçi", parent: "/" },
  "/teacher/question-bank": { title: "Sual Bankı", parent: "/" },
  "/admin": { title: "Admin Paneli", parent: "/" },
  "/admin/dashboard": { title: "İdarə Paneli", parent: "/" },
  "/admin/users": { title: "İstifadəçilər", parent: "/" },
  "/admin/permissions": { title: "İcazələr", parent: "/" },
  "/admin/ai-config": { title: "AI Konfiqurasiya", parent: "/" },
  "/admin/settings": { title: "Ayarlar", parent: "/" },
};

export function useRouteInfo(): RouteInfo {
  const location = useLocation();
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
      config = { title: "Səhifə" };
    }

    // Build breadcrumbs
    const breadcrumbs: { label: string; path: string }[] = [];
    let currentPath: string | undefined = matchedPath;

    while (currentPath) {
      const currentConfig = routeConfig[currentPath];
      if (currentConfig) {
        breadcrumbs.unshift({
          label: currentConfig.title,
          path: currentPath,
        });
        currentPath = currentConfig.parent;
      } else {
        break;
      }
    }

    return {
      title: config.title,
      breadcrumbs,
    };
  }, [pathname]);
}
