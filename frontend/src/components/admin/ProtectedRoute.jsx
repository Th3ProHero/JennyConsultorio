import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';
  const hasToken = !!sessionStorage.getItem('jwtToken');

  if (!isAuthenticated || !hasToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
