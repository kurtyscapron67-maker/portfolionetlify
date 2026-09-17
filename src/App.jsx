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

const AuthenticatedApp = () => {
  // On vérifie si l'admin s'est déjà connecté au panel
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("admin_access_granted") === "true";
  });

  const handleAdminGranted = () => {
    localStorage.setItem("admin_access_granted", "true");
    setIsAdmin(true);
  };

  return (
    <Routes>
      {/* Le portfolio est 100% public pour tout le monde */}
      <Route path="/" element={<Portfolio />} />
      
      {/* La page login sert uniquement à déverrouiller le panel admin */}
      <Route path="/login" element={<Login onLoginSuccess={handleAdminGranted} />} />
      
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Si l'utilisateur va sur /admin/servers sans être connecté, il est envoyé sur /login */}
      <Route 
        path="/admin/servers" 
        element={isAdmin ? <ManageServers /> : <Navigate to="/login" replace />} 
      />
      
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
