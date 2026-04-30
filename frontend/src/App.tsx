// src/App.tsx
import { Routes, Route, Navigate } from 'react-router';
import { useAuth } from './context/AuthContext';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Protected pages
import Dashboard from './pages/Dashboard';
import UnitsList from './pages/units/UnitList';
import UnitDetail from './pages/units/UnitDetail';
import BillDetail from './pages/bills/BillDetail';
import RateSettings from './pages/settings/RateSettings';
import DashboardLayout from './components/shared/DashboardLayout';

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return isAuthenticated ? (
    <Navigate to="/dashboard" /> // ← already logged in → go to dashboard
  ) : (
    <>{children}</>
  ); // ← not logged in → show auth page
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return isAuthenticated ? <DashboardLayout>{children}</DashboardLayout> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/units"
        element={
          <ProtectedRoute>
            <UnitsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/units/:id"
        element={
          <ProtectedRoute>
            <UnitDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/units/:id/bills/:billId"
        element={
          <ProtectedRoute>
            <BillDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/rates"
        element={
          <ProtectedRoute>
            <RateSettings />
          </ProtectedRoute>
        }
      />

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
