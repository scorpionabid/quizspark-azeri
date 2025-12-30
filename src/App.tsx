import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";

// Pages
import Index from "./pages/Index";
import QuizPage from "./pages/QuizPage";
import QuizzesPage from "./pages/QuizzesPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import NotFound from "./pages/NotFound";

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
          <MainLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/quiz/:id" element={<QuizPage />} />
              <Route path="/quizzes" element={<QuizzesPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />

              {/* Teacher Routes */}
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/teacher/create" element={<CreateQuizPage />} />
              <Route path="/teacher/my-quizzes" element={<MyQuizzesPage />} />
              <Route path="/teacher/ai-assistant" element={<AIAssistantPage />} />
              <Route path="/teacher/edit/:id" element={<CreateQuizPage />} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/permissions" element={<PermissionsPage />} />
              <Route path="/admin/ai-config" element={<AIConfigPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
