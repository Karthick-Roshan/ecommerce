import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect admin/seller to their respective dashboards if they try to access wrong areas
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user?.role === 'seller') {
      return <Navigate to="/seller/dashboard" replace />;
    } else {
      // Regular users trying to access admin/seller areas go to home
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute;