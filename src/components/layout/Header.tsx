import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DynamicBreadcrumb } from "./DynamicBreadcrumb";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { useRouteInfo } from "@/hooks/useRouteInfo";
import { useAuth } from "@/contexts/AuthContext";
import { StudentGamificationHeader } from "../student/gamification/StudentGamificationHeader";

export function Header() {
  const { title } = useRouteInfo();
  const { isAuthenticated, role } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-sm">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <Separator orientation="vertical" className="h-6" />
        <div className="hidden md:flex md:items-center md:gap-2">
          <DynamicBreadcrumb />
        </div>
        <h1 className="text-sm sm:text-lg font-semibold md:hidden truncate max-w-[120px]">{title}</h1>
      </div>

      {/* Right Section */}
      <div className="ml-auto flex items-center gap-2 md:gap-4">
        {isAuthenticated && role === 'student' && (
          <div className="hidden sm:block">
            <StudentGamificationHeader />
          </div>
        )}
        <div className="hidden xs:flex">
          <GlobalSearch />
        </div>
        {isAuthenticated && <NotificationsDropdown />}
        <div className="hidden sm:flex">
          <ThemeToggle />
        </div>
        <UserMenu />
      </div>
    </header>
  );
}
