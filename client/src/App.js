import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import Layout from './components/Layout';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#1a1d2e' }}>
        <span className="spinner" />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/home" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <PublicRoute><LoginPage /></PublicRoute>
      } />
      <Route path="/home" element={
        <PrivateRoute>
          <Layout><HomePage /></Layout>
        </PrivateRoute>
      } />
      <Route path="/products" element={
        <PrivateRoute>
          <Layout><ProductsPage /></Layout>
        </PrivateRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
