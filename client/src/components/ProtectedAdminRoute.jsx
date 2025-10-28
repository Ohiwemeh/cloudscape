import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// 1. Import the new 'useAuth' hook, not 'useAdminAuth'
import { useAuth } from '../context/AuthContext';

const ProtectedAdminRoute = ({ children }) => {
  // 2. Call 'useAuth()' to get the user and loading state
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // 3. Show a loading state while auth is checking
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  // 4. Check if the user exists AND if they are an admin
  if (!user || !user.isAdmin) {
    // Redirect them to the main login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 5. If they are an admin, show the admin content
  return children;
};

export default ProtectedAdminRoute;

