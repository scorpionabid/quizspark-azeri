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

// Pages
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

// Teacher Pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import CreateQuizPage from "./pages/teacher/CreateQuizPage";
import MyQuizzesPage from "./pages/teacher/MyQuizzesPage";
import AIAssistantPage from "./pages/teacher/AIAssistantPage";
import QuestionBankPage from "./pages/teacher/QuestionBankPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";
import PermissionsPage from "./pages/admin/PermissionsPage";
import AIConfigPage from "./pages/admin/AIConfigPage";
import SettingsPage from "./pages/admin/SettingsPage";
import AdminChatPage from "./pages/admin/AdminChatPage";

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

        {/* Teacher Routes - Protected */}
        <Route path="/teacher/dashboard" element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <MainLayout><TeacherDashboard /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/teacher/create" element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <MainLayout><CreateQuizPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/teacher/my-quizzes" element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <MainLayout><MyQuizzesPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/teacher/ai-assistant" element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <MainLayout><AIAssistantPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/teacher/question-bank" element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <MainLayout><QuestionBankPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/teacher/edit/:id" element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <MainLayout><CreateQuizPage /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Admin Routes - Protected */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout><AdminDashboard /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout><UsersPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/permissions" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout><PermissionsPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/ai-config" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout><AIConfigPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout><SettingsPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/chat" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout><AdminChatPage /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
