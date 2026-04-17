import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OAuthRoleDialog } from "@/components/auth/OAuthRoleDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabaseHealth } from "@/hooks/useSupabaseHealth";
import { ThemeProvider } from "next-themes";
import { PageLoader } from "@/components/ui/loading-spinner";

// Core Pages (statik — tez yüklənməlidir)
import Index from "./pages/Index";
import QuizPage from "./pages/QuizPage";
import QuizzesPage from "./pages/QuizzesPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/auth/AuthPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import PendingApprovalPage from "./pages/auth/PendingApprovalPage";
import SupportChatPage from "./pages/chat/SupportChatPage";

// Teacher Pages — lazy (dnd-kit ayrı chunk-da olsun, quiz path-ına qarışmasın)
const TeacherDashboard = lazy(() => import("./pages/teacher/TeacherDashboard"));
const CreateQuizPage = lazy(() => import("./pages/teacher/CreateQuizPage"));
const MyQuizzesPage = lazy(() => import("./pages/teacher/MyQuizzesPage"));
const AIAssistantPage = lazy(() => import("./pages/teacher/AIAssistantPage"));
const QuestionBankPage = lazy(() => import("./pages/teacher/QuestionBankPage"));

// Admin Pages — lazy
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const PermissionsPage = lazy(() => import("./pages/admin/PermissionsPage"));
const AIConfigPage = lazy(() => import("./pages/admin/AIConfigPage"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage"));
const AdminChatPage = lazy(() => import("./pages/admin/AdminChatPage"));

const queryClient = new QueryClient();

// Inner component so it can use useAuth (must be inside AuthProvider)
function AppRoutes() {
  const { user, isProfileComplete, isLoading } = useAuth();
  useSupabaseHealth();
  const showOAuthDialog = !isLoading && !!user && !isProfileComplete;

  return (
    <>
      {showOAuthDialog && <OAuthRoleDialog />}
      <Routes>
        {/* Auth Routes - No Layout */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/pending-approval" element={<PendingApprovalPage />} />

        {/* Profile Route */}
        <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />

        {/* Routes with Layout */}
        <Route path="/" element={<MainLayout><Index /></MainLayout>} />
        <Route path="/quizzes" element={<MainLayout><QuizzesPage /></MainLayout>} />
        <Route path="/quiz/:id" element={<MainLayout><QuizPage /></MainLayout>} />
        <Route path="/leaderboard" element={<MainLayout><LeaderboardPage /></MainLayout>} />
        <Route path="/support" element={<MainLayout><SupportChatPage /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />

        {/* Teacher Routes - Protected + lazy */}
        <Route path="/teacher/dashboard" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
              <MainLayout><TeacherDashboard /></MainLayout>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/teacher/create" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
              <MainLayout><CreateQuizPage /></MainLayout>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/teacher/my-quizzes" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
              <MainLayout><MyQuizzesPage /></MainLayout>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/teacher/ai-assistant" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
              <MainLayout><AIAssistantPage /></MainLayout>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/teacher/question-bank" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
              <MainLayout><QuestionBankPage /></MainLayout>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/teacher/edit/:id" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
              <MainLayout><CreateQuizPage /></MainLayout>
            </ProtectedRoute>
          </Suspense>
        } />

        {/* Admin Routes - Protected + lazy */}
        <Route path="/admin/dashboard" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout><AdminDashboard /></MainLayout>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/admin/users" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout><UsersPage /></MainLayout>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/admin/permissions" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout><PermissionsPage /></MainLayout>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/admin/ai-config" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout><AIConfigPage /></MainLayout>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/admin/settings" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout><SettingsPage /></MainLayout>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/admin/chat" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout><AdminChatPage /></MainLayout>
            </ProtectedRoute>
          </Suspense>
        } />

        {/* Catch-all */}
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
