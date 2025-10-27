import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const ProtectedAdminRoute = ({ children }) => {
  const { isAdmin } = useAdminAuth();
  const location = useLocation();
  
  // Check localStorage on mount as well
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    if (!adminStatus || adminStatus !== 'true') {
      // Force redirect if not admin
      window.location.href = '/admin/login';
    }
  }, []);

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedAdminRoute;