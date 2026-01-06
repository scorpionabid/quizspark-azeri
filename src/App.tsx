import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import QuizPage from "./pages/QuizPage";
import QuizzesPage from "./pages/QuizzesPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/auth/AuthPage";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import CreateQuizPage from "./pages/teacher/CreateQuizPage";
import MyQuizzesPage from "./pages/teacher/MyQuizzesPage";
import AIAssistantPage from "./pages/teacher/AIAssistantPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";
import PermissionsPage from "./pages/admin/PermissionsPage";
import AIConfigPage from "./pages/admin/AIConfigPage";
import SettingsPage from "./pages/admin/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Route - No Layout */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Routes with Layout */}
            <Route element={<MainLayout><Index /></MainLayout>} path="/" />
            <Route path="/quiz/:id" element={<MainLayout><QuizPage /></MainLayout>} />
            <Route path="/quizzes" element={<MainLayout><QuizzesPage /></MainLayout>} />
            <Route path="/leaderboard" element={<MainLayout><LeaderboardPage /></MainLayout>} />

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

            {/* Catch-all */}
            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
