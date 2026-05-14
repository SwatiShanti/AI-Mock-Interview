/**
 * App.jsx — Root routing component
 * Defines all application routes with protected/public route logic
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Pages
import LandingPage    from './pages/LandingPage'
import LoginPage      from './pages/LoginPage'
import SignupPage     from './pages/SignupPage'
import DashboardPage  from './pages/DashboardPage'
import SetupPage      from './pages/SetupPage'
import InterviewPage  from './pages/InterviewPage'
import ReportPage     from './pages/ReportPage'
import HistoryPage    from './pages/HistoryPage'

// Components
import ProtectedRoute from './components/common/ProtectedRoute'
import LoadingSpinner from './components/common/LoadingSpinner'

export default function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/"        element={<LandingPage />} />
      <Route path="/login"   element={<LoginPage />} />
      <Route path="/signup"  element={<SignupPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard"           element={<DashboardPage />} />
        <Route path="/interview/setup"     element={<SetupPage />} />
        <Route path="/interview/:id"       element={<InterviewPage />} />
        <Route path="/interview/:id/report" element={<ReportPage />} />
        <Route path="/history"             element={<HistoryPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
