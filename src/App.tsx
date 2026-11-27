import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FontProvider } from "@/contexts/FontContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OAuthRoleDialog } from "@/components/auth/OAuthRoleDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabaseHealth } from "@/hooks/useSupabaseHealth";
import { ThemeProvider } from "next-themes";
import { PageLoader } from "@/components/ui/loading-spinner";
import { loggerService } from "@/services/loggerService";

// Core Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy Loaded User/Auth Pages
const QuizPage = lazy(() => import("./pages/QuizPage"));
const QuizzesPage = lazy(() => import("./pages/QuizzesPage"));
const LeaderboardPage = lazy(() => import("./pages/LeaderboardPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));
const PendingApprovalPage = lazy(() => import("./pages/auth/PendingApprovalPage"));
const SupportChatPage = lazy(() => import("./pages/chat/SupportChatPage"));

// Student Progress Page — lazy
const StudentProgressPage = lazy(() => import("./pages/student/StudentProgressPage"));

// Career Guidance Pages — lazy
const CareerAssessmentPage = lazy(() => import("./pages/career/CareerAssessmentPage"));
const CareerResultsPage = lazy(() => import("./pages/career/CareerResultsPage"));

// Teacher Pages — lazy (dnd-kit ayrı chunk-da olsun, quiz path-ına qarışmasın)
const TeacherDashboard = lazy(() => import("./pages/teacher/TeacherDashboard"));
const CreateQuizPage = lazy(() => import("./pages/teacher/CreateQuizPage"));
const CreateAssessmentPage = lazy(() => import("./pages/teacher/CreateAssessmentPage"));
const ScanAssessmentPage = lazy(() => import("./pages/teacher/ScanAssessmentPage"));
const ClassRosterPage = lazy(() => import("./pages/teacher/ClassRosterPage"));
const MyQuizzesPage = lazy(() => import("./pages/teacher/MyQuizzesPage"));
const AIAssistantPage = lazy(() => import("./pages/teacher/AIAssistantPage"));
const QuestionBankPage = lazy(() => import("./pages/teacher/QuestionBankPage"));

// Admin Pages — lazy
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const PermissionsPage = lazy(() => import("./pages/admin/PermissionsPage"));
const AIConfigPage = lazy(() => import("./pages/admin/AIConfigPage"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage"));
const TextbooksPage = lazy(() => import("./pages/admin/TextbooksPage"));
const AdminChatPage = lazy(() => import("./pages/admin/AdminChatPage"));
const AuditLogsPage = lazy(() => import("./pages/admin/AuditLogsPage"));
const AdminExamsPage = lazy(() => import("./pages/admin/AdminExamsPage"));

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const errMsg = error instanceof Error ? error.message : String(error);
      if (errMsg.includes('AbortError')) return;
      const keyStr = Array.isArray(query.queryKey) ? query.queryKey.map(String).join('/') : 'query';
      void loggerService.logError({
        message: `Query failed [${keyStr}]: ${errMsg}`,
        error,
        errorType: 'api_error',
        severity: 'warning',
        componentName: 'QueryCache',
        extraInfo: { queryKey: keyStr },
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      const errMsg = error instanceof Error ? error.message : String(error);
      const mutationKey = mutation.options.mutationKey ? (Array.isArray(mutation.options.mutationKey) ? mutation.options.mutationKey.map(String).join('/') : String(mutation.options.mutationKey)) : 'anonymous_mutation';
      void loggerService.logError({
        message: `Mutation failed [${mutationKey}]: ${errMsg}`,
        error,
        errorType: 'api_error',
        severity: 'error',
        componentName: 'MutationCache',
        extraInfo: { mutationKey },
      });
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes fresh
      gcTime: 15 * 60 * 1000, // 15 minutes cache retention
      refetchOnWindowFocus: false, // Avoid redundant network calls on tab switch
      retry: 1,
    },
  },
});

// Clear all query cache on sign-out to prevent stale user data leaks
if (typeof window !== 'undefined') {
  window.addEventListener('auth:signout', () => {
    queryClient.clear();
  });
}

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
        <Route path="/auth" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <AuthPage />
          </Suspense>
        } />
        <Route path="/reset-password" element={<Navigate to="/auth" replace />} />
        <Route path="/pending-approval" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <PendingApprovalPage />
          </Suspense>
        } />

        {/* Profile Route */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <MainLayout><ProfilePage /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Routes with Layout */}
        <Route path="/" element={<MainLayout><Index /></MainLayout>} />
        <Route path="/quizzes" element={<MainLayout><QuizzesPage /></MainLayout>} />
        <Route path="/quiz/:id" element={<MainLayout><QuizPage /></MainLayout>} />
        <Route path="/leaderboard" element={<MainLayout><LeaderboardPage /></MainLayout>} />
        
        {/* Career Guidance Routes */}
        <Route path="/career" element={<Navigate to="/career/test" replace />} />
        <Route path="/career/test" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <MainLayout><CareerAssessmentPage /></MainLayout>
          </Suspense>
        } />
        <Route path="/career/results" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <MainLayout><CareerResultsPage /></MainLayout>
          </Suspense>
        } />
        <Route path="/progress" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <MainLayout><StudentProgressPage /></MainLayout>
          </Suspense>
        } />
        <Route path="/student/progress" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <MainLayout><StudentProgressPage /></MainLayout>
          </Suspense>
        } />
        <Route path="/support" element={<MainLayout><SupportChatPage /></MainLayout>} />
        <Route path="/settings" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute>
              <MainLayout><SettingsPage /></MainLayout>
            </ProtectedRoute>
          </Suspense>
        } />

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
        <Route path="/teacher/create-assessment" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
              <MainLayout><CreateAssessmentPage /></MainLayout>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/teacher/scan" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
              <MainLayout><ScanAssessmentPage /></MainLayout>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/teacher/classes" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
              <MainLayout><ClassRosterPage /></MainLayout>
            </ProtectedRoute>
          </Suspense>
        } />

        {/* Support Chat Routes - Accessible by all authenticated users */}
        <Route path="/support" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
              <MainLayout><SupportChatPage /></MainLayout>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/chat" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
              <MainLayout><SupportChatPage /></MainLayout>
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
        <Route path="/admin/textbooks" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout><TextbooksPage /></MainLayout>
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
        <Route path="/admin/audit-logs" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout><AuditLogsPage /></MainLayout>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/admin/exams" element={
          <Suspense fallback={<PageLoader text="Yüklənir..." />}>
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout><AdminExamsPage /></MainLayout>
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
      <FontProvider>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </FontProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
