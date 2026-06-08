import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './store/appStore';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AnalysisPage from './pages/AnalysisPage';
import GPSPage from './pages/GPSPage';
import RegistryPage from './pages/RegistryPage';
import MBookPage from './pages/MBookPage';
import AuditPage from './pages/AuditPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected dashboard routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/gps" element={<GPSPage />} />
        <Route path="/registry" element={<RegistryPage />} />
        <Route path="/mbook" element={<MBookPage />} />
        <Route path="/audit" element={<AuditPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
