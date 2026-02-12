import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, role }) => {
  const { admin, token: adminToken } = useSelector((state) => state.admin || {});
  const { student, token: studentToken } = useSelector((state) => state.student || {});
  const { artisan, token: artisanToken } = useSelector((state) => state.artisan || {});

  let isAuthenticated = false;
  let userRole = null;


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


  if (!isAuthenticated) {
    switch (role) {
      case "admin":
        return <Navigate to="/" replace />;
      case "artisan":
        return <Navigate to="/" replace />;
      case "student":
        return <Navigate to="/" replace />; 
      default:
        return <Navigate to="/" replace />;
    }
  }

 
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
