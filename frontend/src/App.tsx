import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Pages
import LandingPage from '@/pages/LandingPage'
import Dashboard from '@/pages/Dashboard'
import ThreatAnalytics from '@/pages/ThreatAnalytics'
import FinancialIntelligence from '@/pages/FinancialIntelligence'
import IdentityProtection from '@/pages/IdentityProtection'
import SimulationLab from '@/pages/SimulationLab'
import AIExplainability from '@/pages/AIExplainability'
import Settings from '@/pages/Settings'
import Login from '@/pages/Login'

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout'

// Styles
import '@/styles/globals.css'

/**
 * Main App Component
 * Handles routing, authentication, and global state management
 */
function App() {
  const { user, initializeAuth } = useAuthStore()

  // Initialize authentication on app load
  useEffect(() => {
    initializeAuth()
  }, [])

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        {user ? (
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/threat-analytics" element={<ThreatAnalytics />} />
            <Route path="/financial-intelligence" element={<FinancialIntelligence />} />
            <Route path="/identity-protection" element={<IdentityProtection />} />
            <Route path="/simulation-lab" element={<SimulationLab />} />
            <Route path="/ai-explainability" element={<AIExplainability />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        ) : null}

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
