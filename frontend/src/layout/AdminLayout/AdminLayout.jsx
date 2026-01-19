import React, { useState } from "react";
import {
  FaHome,
  FaCheckCircle,
  FaUserGraduate,
  FaSignOutAlt,
  FaQuestionCircle,
  FaCog,
  FaTimes,
  FaBars
} from "react-icons/fa";
import "./AdminLayout.css";

const AdminLayout = ({ activeTab, setActiveTab, handleLogout, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-container">
      {/* MOBILE HEADER */}
      <header className="mobile-header">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
          <FaBars size={24} />
        </button>
      </header>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-titles">
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            <FaTimes size={20} />
          </button>
        </div>

       <nav className="admin-nav">
  <button
    className={`admin-button ${activeTab === "admin" ? "active" : ""}`}
    onClick={() => {
      setActiveTab("admin");
      setSidebarOpen(false); // close sidebar on mobile
    }}
  >
    <FaHome /> Dashboard
  </button>

  <button
    className={`admin-button ${activeTab === "approve" ? "active" : ""}`}
    onClick={() => {
      setActiveTab("approve");
      setSidebarOpen(false); // close sidebar on mobile
    }}
  >
    <FaCheckCircle /> Approve Artisan
  </button>

  <button
    className={`admin-button ${activeTab === "students" ? "active" : ""}`}
    onClick={() => {
      setActiveTab("students");
      setSidebarOpen(false); // close sidebar on mobile
    }}
  >
    <FaUserGraduate /> View Students
  </button>

  <button
    className={`admin-button ${activeTab === "settings" ? "active" : ""}`}
    onClick={() => {
      setActiveTab("settings");
      setSidebarOpen(false); // close sidebar on mobile
    }}
  >
    <FaCog /> Settings
  </button>
</nav>

<div className="admin-bottom-buttons">
  <button
    className={`admin-button ${activeTab === "help" ? "active" : ""}`}
    onClick={() => {
      setActiveTab("help");
      setSidebarOpen(false); 
    }}
  >
    <FaQuestionCircle /> Help
  </button>

  <button
    className="admin-button admin-logout-button"
    onClick={() => {
      handleLogout();
      setSidebarOpen(false); 
    }}
  >
    <FaSignOutAlt /> Logout
  </button>
</div>


       
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">{children}</main>
    </div>
  );
};

export default AdminLayout;
