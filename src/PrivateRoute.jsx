import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated, requiredRoles, children }) => {
  const storedRoles = JSON.parse(sessionStorage.getItem('roles') || '[]');

  const hasRequiredRole = Array.isArray(storedRoles) && requiredRoles 
    ? requiredRoles.some(role => storedRoles.includes(role)) 
    : true;

  return isAuthenticated && hasRequiredRole ? children : <Navigate to="/" />;
};

export default PrivateRoute;
