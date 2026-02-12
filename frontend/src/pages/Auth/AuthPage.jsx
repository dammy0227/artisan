// AuthPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Modal from "../Student/Modal/Modal";
import { loginStudent } from "../../features/student/studentThunks";
import { loginArtisan } from "../../features/artisan/artisanThunks";
import { loginAdmin } from "../../features/admin/adminThunks";
import { clearStudentMessages } from "../../features/student/studentSlice";
import { clearArtisanMessages } from "../../features/artisan/artisanSlice";
import { clearAdminMessages } from "../../features/admin/adminSlice";

import './Auth.css';

const UnifiedLogin = ({ onClose }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [selectedRole, setSelectedRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let result;
      
      // Dispatch the appropriate login thunk based on selected role
      if (selectedRole === "student") {
        dispatch(clearStudentMessages());
        result = await dispatch(loginStudent(formData));
        if (result.payload?.token) {
          navigate("/student/dashboard");
          onClose();
        }
      } else if (selectedRole === "artisan") {
        dispatch(clearArtisanMessages());
        result = await dispatch(loginArtisan(formData));
        if (result.payload?.token) {
          navigate("/artisan/dashboard");
          onClose();
        }
      } else if (selectedRole === "admin") {
        dispatch(clearAdminMessages());
        result = await dispatch(loginAdmin(formData));
        if (result.payload?.token) {
          navigate("/admin/dashboard");
          onClose();
        }
      }
      
      if (result?.error) {
        setError(result.payload || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="unified-login-modal">
      <div className="unified-login-header">
        <h2>Welcome Back! 👋</h2>
        <p>Select your role and login to continue</p>
      </div>
      
      {/* Role Selector */}
      <div className="role-selector">
        <button
          type="button"
          className={`role-btn ${selectedRole === "student" ? "active" : ""}`}
          onClick={() => setSelectedRole("student")}
        >
          <span className="role-icon">👤</span>
          <span className="role-name">Student</span>
        </button>
        <button
          type="button"
          className={`role-btn ${selectedRole === "artisan" ? "active" : ""}`}
          onClick={() => setSelectedRole("artisan")}
        >
          <span className="role-icon">🛠️</span>
          <span className="role-name">Artisan</span>
        </button>
        <button
          type="button"
          className={`role-btn ${selectedRole === "admin" ? "active" : ""}`}
          onClick={() => setSelectedRole("admin")}
        >
          <span className="role-icon">⚡</span>
          <span className="role-name">Admin</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="unified-login-form">
        <div className="unified-input-group">
          <label>Email Address</label>
          <div className="input-icon-wrapper">
            <span className="input-icon">📧</span>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="unified-input-group">
          <label>Password</label>
          <div className="input-icon-wrapper">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
        </div>

        {error && (
          <div className="unified-error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <button type="submit" className="unified-login-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Logging in as 
            </>
          ) : (
            <>
              Login as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
              <span className="btn-arrow">→</span>
            </>
          )}
        </button>

    
      </form>
    </div>
  );
};

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginClick = () => {
    // Clear all messages before opening login
    dispatch(clearStudentMessages());
    dispatch(clearArtisanMessages());
    dispatch(clearAdminMessages());
    setShowLogin(true);
  };

  return (
    <div className="auth-page">
      {/* Decorative Background */}
      <div className="auth-background">
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
        <div className="gradient-sphere sphere-3"></div>
      </div>

      <div className="auth-container">
        {/* Left Column - Content */}
        <div className="auth-left">
          <div className="brand-section">
            <div className="brand-logo">
              <span className="logo-icon">⚡</span>
              <span className="logo-text">SkillLink</span>
            </div>
            <div className="brand-badge">
              🚀 Connect • Work • Grow
            </div>
          </div>

          <div className="hero-content">
            <h1 className="hero-title">
              Your Gateway to
              <span className="gradient-text"> Skilled Professionals</span>
            </h1>
            
            <p className="hero-description">
              Choose your path and start your journey with thousands of trusted 
              artisans and satisfied clients.
            </p>
          </div>

          {/* Landing Page Switcher */}
          <div className="landing-switcher">
            <h3 className="switcher-label">Explore Our Platforms:</h3>
            <div className="switcher-buttons">
              <button 
                className="switcher-card"
                onClick={() => navigate("/LandingPage")}
              >
                <div className="card-icon">👥</div>
                <div className="card-content">
                  <span className="card-title">Student Platform</span>
                  <span className="card-desc">Find & hire skilled artisans near you</span>
                </div>
                <span className="card-arrow">→</span>
              </button>

              <button 
                className="switcher-card"
                onClick={() => navigate("/artisan")}
              >
                <div className="card-icon">🛠️</div>
                <div className="card-content">
                  <span className="card-title">Artisan Platform</span>
                  <span className="card-desc">Showcase skills & get more jobs</span>
                </div>
                <span className="card-arrow">→</span>
              </button>
            </div>
          </div>

          {/* Universal Login Button */}
          <div className="universal-login-section">
            <div className="divider">
              <span>Single Access Point</span>
            </div>
            
            <button 
              className="universal-login-btn"
              onClick={handleLoginClick}
            >
              <span className="btn-icon">🔐</span>
              <div className="btn-text">
                <strong>Unified Login Portal</strong>
                <small>One login for Students, Artisans & Administrators</small>
              </div>
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>

        {/* Right Column - Image Gallery */}
        <div className="auth-right">
          <div className="image-gallery">
            {/* Main Image */}
            <div className="main-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&auto=format&fit=crop" 
                alt="Team collaboration" 
                className="main-image"
              />
              <div className="image-overlay">
                <div className="stats-card">
                  <span className="stats-number">2,500+</span>
                  <span className="stats-label">Active Artisans</span>
                </div>
                <div className="stats-card">
                  <span className="stats-number">10k+</span>
                  <span className="stats-label">Jobs Completed</span>
                </div>
                <div className="stats-card">
                  <span className="stats-number">98%</span>
                  <span className="stats-label">Satisfaction</span>
                </div>
              </div>
            </div>

            {/* Floating Profile Cards */}
            <div className="floating-card card-1">
              <div className="card-avatar">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Artisan" />
              </div>
              <div className="card-info">
                <h4>Michael Chen</h4>
                <p>Electrician • 5 years</p>
                <div className="rating">★★★★★ 4.9</div>
              </div>
            </div>

            <div className="floating-card card-2">
              <div className="card-avatar">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Artisan" />
              </div>
              <div className="card-info">
                <h4>Sarah Johnson</h4>
                <p>Interior Designer • 8 years</p>
                <div className="rating">★★★★★ 5.0</div>
              </div>
            </div>

            <div className="floating-card card-3">
              <div className="card-avatar">
                <img src="https://randomuser.me/api/portraits/men/55.jpg" alt="Artisan" />
              </div>
              <div className="card-info">
                <h4>David Okonkwo</h4>
                <p>Web Developer • 4 years</p>
                <div className="rating">★★★★☆ 4.8</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Login Modal */}
      <Modal
        isOpen={showLogin}
        onClose={() => {
          setShowLogin(false);
          dispatch(clearStudentMessages());
          dispatch(clearArtisanMessages());
          dispatch(clearAdminMessages());
        }}
      >
        <UnifiedLogin onClose={() => setShowLogin(false)} />
      </Modal>
    </div>
  );
};

export default AuthPage;