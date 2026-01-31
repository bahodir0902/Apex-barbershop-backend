import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { Layout } from '@/components/layout';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { BarbershopsPage } from '@/pages/barbershops/BarbershopsPage';
import { BarbershopDetailPage } from '@/pages/barbershops/BarbershopDetailPage';
import { BookingPage } from '@/pages/booking/BookingPage';
import { DashboardLayout } from '@/pages/dashboard/DashboardLayout';
import { DashboardOverview } from '@/pages/dashboard/DashboardOverview';
import { AppointmentsPage } from '@/pages/dashboard/AppointmentsPage';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { fetchCurrentUser } = useAuthStore();
  const { resolvedTheme } = useThemeStore();

  // Initialize auth on app load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchCurrentUser();
    }
  }, [fetchCurrentUser]);

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="barbershops" element={<BarbershopsPage />} />
            <Route path="barbershops/:id" element={<BarbershopDetailPage />} />
            <Route path="book" element={<BookingPage />} />
          </Route>

          {/* Auth Routes (no layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="reviews" element={<div className="p-8 text-center text-dark-500">Reviews page coming soon...</div>} />
              <Route path="settings" element={<div className="p-8 text-center text-dark-500">Settings page coming soon...</div>} />
            </Route>
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: resolvedTheme === 'dark' ? '#1a1b1f' : '#ffffff',
              color: resolvedTheme === 'dark' ? '#ffffff' : '#111113',
              border: `1px solid ${resolvedTheme === 'dark' ? '#35373e' : '#e1e2e5'}`,
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#d4a02c',
                secondary: resolvedTheme === 'dark' ? '#1a1b1f' : '#ffffff',
              },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
