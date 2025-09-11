// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, role }) => {
  const { admin, token: adminToken } = useSelector((state) => state.admin || {});
  const { student, token: studentToken } = useSelector((state) => state.student || {});
  const { artisan, token: artisanToken } = useSelector((state) => state.artisan || {});

  let isAuthenticated = false;
  let userRole = null;

  // ✅ Check if logged in and set role
  if (adminToken && admin) {
    isAuthenticated = true;
    userRole = "admin";
  } else if (studentToken && student) {
    isAuthenticated = true;
    userRole = "student";
  } else if (artisanToken && artisan) {
    isAuthenticated = true;
    userRole = "artisan";
  }

  // ✅ Not authenticated → go to role-specific login/landing
  if (!isAuthenticated) {
    switch (role) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "artisan":
        return <Navigate to="/artisan" replace />;
      case "student":
        return <Navigate to="/" replace />; // LandingPage for students
      default:
        return <Navigate to="/" replace />;
    }
  }

  // ✅ Authenticated but wrong role → send to their dashboard
  if (role && userRole !== role) {
    switch (userRole) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "student":
        return <Navigate to="/student/dashboard" replace />;
      case "artisan":
        return <Navigate to="/artisan/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
