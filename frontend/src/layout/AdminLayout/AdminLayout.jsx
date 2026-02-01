import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaCheckCircle,
  FaUserGraduate,
  FaSignOutAlt,
  FaQuestionCircle,
  FaCog,
  FaTimes,
  FaBars,
  FaShieldAlt
} from "react-icons/fa";
import "./AdminLayout.css";

const AdminLayout = ({ activeTab, setActiveTab, handleLogout, children, adminName }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const mainNavItems = [
    { id: "admin", label: "Dashboard", icon: <FaHome /> },
    { id: "approve", label: "Approve Artisan", icon: <FaCheckCircle /> },
    { id: "students", label: "View Students", icon: <FaUserGraduate /> },
    { id: "settings", label: "Settings", icon: <FaCog /> }
  ];

  const bottomNavItems = [
    { id: "help", label: "Help", icon: <FaQuestionCircle /> }
  ];

  return (
    <div className="admin-container">
      {/* MOBILE HEADER */}
      <header className="mobile-header">
        <button
          className="hamburger-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <FaBars size={22} />
        </button>
        <div className="mobile-title">
          <FaShieldAlt style={{ marginRight: 8, verticalAlign: "middle" }} />
          Admin Panel
        </div>
        <div style={{ width: 44 }} /> {/* Spacer */}
      </header>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && isMobile && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <button
            className="close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes size={18} />
          </button>
          <h2 className="admin-sidebar-title">Admin Panel</h2>
          {adminName && (
            <div className="admin-sidebar-subtitle">
              Welcome, {adminName}
            </div>
          )}
        </div>

        {/* MAIN NAV */}
        <nav className="admin-nav" aria-label="Main navigation">
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              className={`admin-button ${activeTab === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
                if (isMobile) setSidebarOpen(false);
              }}
              aria-current={activeTab === item.id ? "page" : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* BOTTOM NAV */}
        <div className="admin-bottom-buttons">
          {bottomNavItems.map((item) => (
            <button
              key={item.id}
              className={`admin-button ${activeTab === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
                if (isMobile) setSidebarOpen(false);
              }}
              aria-current={activeTab === item.id ? "page" : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          {/* LOGOUT */}
          <button
            className="admin-button admin-logout-button"
            onClick={() => {
              handleLogout();
              if (isMobile) setSidebarOpen(false);
            }}
            aria-label="Logout"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
          {children}
      </main>
    </div>
  );
};

export default AdminLayout;
