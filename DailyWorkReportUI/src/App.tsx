import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ReportList } from "./pages/reports/ReportList";
import { ReportForm } from "./pages/reports/ReportForm";
import { ReportView } from "./pages/reports/ReportView";
import { ProjectsPage } from "./pages/ProjectsPage";
import { StatusPage } from "./pages/StatusPage";
import EmailConfigPage from "./pages/EmailConfigPage";
import { Dashboard } from "./pages/Dashboard";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/reports" element={<ReportList />} />
              <Route path="/reports/create" element={<ReportForm />} />
              <Route path="/reports/edit/:id" element={<ReportForm />} />
              <Route path="/reports/view/:id" element={<ReportView />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/statuses" element={<StatusPage />} />
              <Route path="/emails" element={<EmailConfigPage />} />
            </Route>
          </Route>

          {/* Redirects */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
