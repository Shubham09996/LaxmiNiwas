import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Shell from './components/layout/Shell.jsx';

import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ApiCatalogPage from './pages/ApiCatalogPage.jsx';
import LiveTesterPage from './pages/LiveTesterPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Dedicated Next-Level Login Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Unified Live Verification Command Center */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Shell>
                    <LiveTesterPage />
                  </Shell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/apis"
              element={
                <ProtectedRoute>
                  <Shell>
                    <LiveTesterPage />
                  </Shell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/test"
              element={
                <ProtectedRoute>
                  <Shell>
                    <LiveTesterPage />
                  </Shell>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
