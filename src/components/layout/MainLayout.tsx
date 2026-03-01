import { ReactNode } from "react";
import { Clock } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { useAuth } from "@/contexts/AuthContext";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { role, profile } = useAuth();
  const isPendingTeacher = role === 'teacher' && profile?.status === 'pending';

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col">
          <Header />
          {isPendingTeacher && (
            <Alert className="rounded-none border-x-0 border-t-0 border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="text-amber-800 dark:text-amber-200">Hesabınız təsdiq gözləyir</AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-300">
                Admin tərəfindən təsdiqləndikdən sonra müəllim funksiyalarına tam daxil ola bilərsiniz.
              </AlertDescription>
            </Alert>
          )}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
