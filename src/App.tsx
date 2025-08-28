import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';

// Layouts
import AuthLayout from './components/layouts/AuthLayout';
import DashboardLayout from './components/layouts/DashboardLayout';

// Pages
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import RedirectPage from '@/pages/RedirectPage';

// Route Protection Components
const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />;
};

const GuestRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? <AuthLayout /> : <Navigate to="/dashboard" replace />;
};

const NotFoundPage = () => (
    <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl">404 - Not Found</h1>
    </div>
)


function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Guest routes (Login, SignUp) */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>

        {/* Protected routes (Dashboard) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Add other dashboard routes here */}
        </Route>
        
        {/* Redirect root to the dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* --- ADD THE NEW DYNAMIC REDIRECT ROUTE HERE --- */}
        {/* This will catch any path that hasn't been matched yet */}
        <Route path="/:shortCode" element={<RedirectPage />} />

        {/* 404 Handler */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;