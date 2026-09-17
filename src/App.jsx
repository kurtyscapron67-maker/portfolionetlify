import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import Portfolio from '@/pages/Portfolio';
import ManageServers from '@/pages/ManageServers';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import ProtectedRoute from '@/components/ProtectedRoute';

const AuthenticatedApp = () => {
  // Check browser storage to see if password access was already granted
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("site_access_granted") === "true";
  });

  // Function to grant access (you will pass this to your custom password check)
  const handleAccessGranted = () => {
    localStorage.setItem("site_access_granted", "true");
    setIsAuthenticated(true);
  };

  return (
    <Routes>
      {/* If not authenticated, redirect the homepage root strictly to /login */}
      <Route 
        path="/" 
        element={isAuthenticated ? <Portfolio /> : <Navigate to="/login" replace />} 
      />
      
      {/* Route for your login page. Pass handleAccessGranted to it if you use a custom form */}
      <Route path="/login" element={<Login onLoginSuccess={handleAccessGranted} />} />
      
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/admin/servers" element={<ManageServers />} />
      </Route>
      
      <Route path="/*/*" element={<PageNotFound />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <AuthenticatedApp />
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
