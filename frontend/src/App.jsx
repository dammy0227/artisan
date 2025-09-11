// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/poppins/600.css"; // Example for weight 600
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


// Dashboards
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import StudentDashboard from "./pages/Student/StudentDashboard/StudentDashboard";
import ArtisanDashboard from "./pages/Artisan/ArtisanDashboard/ArtisanDashboard";
import StudentRegister from "./pages/Student/StudentRegister/StudentRegister";
import ArtisanRegister from "./pages/Artisan/ArtisanRegister/ArtisanRegister";
import LandingPage from "./pages/Student/LandingPage/LandindPage";


// Auth Pages
import StudentLogin from "./pages/Student/StudentLogin/StudentLogin";
import ArtisanLogin from "./pages/Artisan/ArtisanLogin/ArtisanLogin";
import AdminLogin from "./pages/Admin/AdminLogin/AdminLogin";

import './App.css'
import ArtisanLanding from "./pages/Artisan/ArtisanLanding/ArtisanLanding";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Pages */}
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/artisan" element={<ArtisanRegister />} />

        {/* Protected Dashboards */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artisan/dashboard"
          element={
            <ProtectedRoute role="artisan">
              <ArtisanDashboard />
            </ProtectedRoute>
          }
        />

          <Route
          path="/"
          element={
            <LandingPage />
          }
        
        />

        <Route
          path="/studentLogin"
          element={
            <StudentLogin />
          }
        />

      <Route
          path="/artisan/login"
          element={
            <ArtisanLogin />
          }
        />

        <Route
          path="/admin"
          element={
            <AdminLogin />
          }
        />

        <Route
          path="/artisan"
          element={
            <ArtisanLanding />
          }
        />
      </Routes>
      
    </Router>
  );
}

export default App; 
