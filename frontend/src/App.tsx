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

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

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
